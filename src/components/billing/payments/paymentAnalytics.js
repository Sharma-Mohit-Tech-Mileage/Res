import { useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { getAnalytics, logEvent } from "@react-native-firebase/analytics";

// Firebase payment analytics (53472). payment_attempt_id groups one attempt; random, discarded when it ends.

let attemptId = null;

const uuid = () =>
  "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });

// Never let analytics affect the payment flow: no throw, no rejection, never awaited.
const log = (name, params = {}) => {
  try {
    const payload = attemptId ? { payment_attempt_id: attemptId, ...params } : { ...params };
    Promise.resolve(logEvent(getAnalytics(), name, payload)).catch(() => {});
  } catch (_) {
    // ignored
  }
};

export const startPaymentAttempt = () => {
  attemptId = uuid();
  return attemptId;
};

export const ensurePaymentAttempt = () => attemptId || startPaymentAttempt();

export const currentPaymentAttempt = () => attemptId;

export const endPaymentAttempt = () => {
  attemptId = null;
};

export const methodType = (method) =>
  method?.type === "card" ? "card" : method?.type ? "bank" : "unknown";

// The status lives at error.status (retry-exhausted), error.response.status (raw axios), or error.code (declines).
export const errorStatus = (error) => error?.status ?? error?.response?.status ?? error?.code;

export const amountBucket = (amount) => {
  const value = Number(amount) || 0;
  if (value < 50) return "0-50";
  if (value < 100) return "50-100";
  if (value < 250) return "100-250";
  return "250+";
};

// ── Make a Payment ──────────────────────────────────────────────────────────

export const trackPaymentTypeSelected = (paymentType) =>
  log("payment_type_selected", { payment_type: paymentType });

export const trackPaymentMethodSelected = (method) =>
  log("payment_method_selected", {
    payment_method_type: methodType(method),
    card_type: method?.cardType || "",
  });

export const trackPaymentSubmitted = (amount, method, paymentType) =>
  log("payment_submitted", {
    payment_type: paymentType || "",
    payment_method_type: methodType(method),
    amount_bucket: amountBucket(amount),
  });

export const trackPaymentSuccess = (method) =>
  log("payment_success", { payment_method_type: methodType(method) });

export const trackPaymentFailed = (method, failureReason) =>
  log("payment_failed", {
    payment_method_type: methodType(method),
    failure_reason: failureReason || "unknown",
  });

// ── Manage Payment Methods ──────────────────────────────────────────────────

export const trackPaymentMethodAdded = (method) =>
  log("payment_method_added", { payment_method_type: methodType(method) });

export const trackPaymentMethodDeleted = (method) =>
  log("payment_method_deleted", { payment_method_type: methodType(method) });

export const trackPaymentMethodFailed = (method, failureReason) =>
  log("payment_method_failed", {
    payment_method_type: methodType(method),
    failure_reason: failureReason || "unknown",
  });

// ── Manage AutoPay ──────────────────────────────────────────────────────────

export const trackAutoPayEnabled = (method, entryPoint) =>
  log("autopay_enabled", {
    payment_method_type: methodType(method),
    entry_point: entryPoint || "billing",
  });

export const trackAutoPayDisabled = (method) =>
  log("autopay_disabled", { payment_method_type: methodType(method) });

export const trackAutoPayFailed = (failureReason) =>
  log("autopay_failed", { failure_reason: failureReason || "unknown" });

// ── Health ──────────────────────────────────────────────────────────────────

export const trackApiError = (endpoint, status, step) =>
  log("payment_api_error", {
    endpoint: endpoint || "unknown",
    status: String(status ?? "no-response"),
    step: step || "",
  });

export const trackValidationError = (field, reason) =>
  log("payment_validation_error", { field: field || "", reason: reason || "" });

// attemptIdOverride keeps the id on events logged after the attempt has ended (confirmation dwell).
export const trackStepDuration = (step, startedAt, attemptIdOverride) => {
  if (!startedAt) return;
  log("payment_step_duration", {
    step: step || "",
    seconds: Math.round((Date.now() - startedAt) / 1000),
    ...(attemptIdOverride ? { payment_attempt_id: attemptIdOverride } : {}),
  });
};

// Per-screen wiring: guarantees an attempt id while in a flow and times the step on blur.
// The id is captured on focus because Back/Cancel end the attempt before this cleanup runs.
export const usePaymentStep = (step) => {
  useFocusEffect(
    useCallback(() => {
      const attempt = ensurePaymentAttempt();
      const startedAt = Date.now();
      return () => trackStepDuration(step, startedAt, attempt);
    }, [step])
  );
};
