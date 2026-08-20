import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import { WebView } from "react-native-webview";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Config from "react-native-config";
import { useSelector } from "react-redux";
import ProfileSettingsHeader from "../../common/ProfileSettingsHeader";
import NotificationAlert from "../../common/customui/NotificationAlert";
import PrimaryButton from "../../common/customui/PrimaryButton";
import SmallLoader from "../../common/customui/SmallLoader";
import { Color } from "../../../../GlobalStyles";
import { confirmBankToken, confirmPaymentToken, updateFundingAccount } from "../../../network/apis/account/paymentMethods.service";
import { getPrimaryEmail } from "../../utility/constant";
import { formatCurrency } from "./paymentsShared";
import { announceA11y } from "../../../utils/a11y";
import { useFeatureFlag } from "../../../contexts/Featureflagscontext";
import FeatureFlags from "../../../config/Featureflags";

const ORBIPAY_HOSTS = ["billerpayments.com"];

const isAllowedPaymentUrl = (url) => {
  const match = /^https:\/\/([^/?#:]+)/i.exec(String(url));
  if (!match) return false;
  const hostname = match[1].toLowerCase();
  return ORBIPAY_HOSTS.some((host) => hostname === host || hostname.endsWith(`.${host}`));
};
const WIDGET_TIMEOUT_MS = 20000;

const WIDGET_SETTLE_MS = 2400;

const HOST_CONTRACT_VERSION = 1;

const initialFormHeight = (width) => (width < 400 ? 500 : 680);

const esc = (value) =>
  String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const buildWidgetHtml = ({ scriptUrl, clientKey, apiEvent, accountNumber, amount, firstName, lastName, email, address, fundingAccountId, idCustomer, paymentOption, paymentOptionReadOnly, formHeight, bottomPad }) => {
  const savedIdAttr = apiEvent === "update_funding_account" || paymentOptionReadOnly === "true";
  const attr = (name, value) => (value ? `data-${name}="${esc(value)}"` : "");
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" /><title>Secure Payment</title>
<style>
html{height:100%;background:#FFFFFF}body{margin:0;min-height:100%;background:#FFFFFF;display:flex;flex-direction:column;box-sizing:border-box;-webkit-font-smoothing:antialiased}
body{padding-bottom:${bottomPad-10}px}
#checkout-loading{position:static !important;inset:auto !important;top:auto !important;left:auto !important;height:auto !important;min-height:0 !important;max-height:none !important;overflow:visible !important;background:#FFFFFF !important;padding:12px 0 !important;display:flex !important;flex-direction:column !important;flex:1 0 auto !important}
#orbipay-checkout-iframe{display:block !important;position:static !important;max-width:680px !important;width:100% !important;min-height:${formHeight}px !important;flex:1 0 auto !important;margin:0 auto !important;border-radius:16px !important;box-shadow:none !important;border:1px solid #E4E7EC !important;background:#FFFFFF !important}
</style></head>
<body>
<form id="orbipay-checkout-form"></form>
<button id="orbipay-checkout-button" style="display:none"></button>
<a id="orbipay-checkout-cancel" style="display:none"></a>
<script id="orbipay-checkout-script"
  src="${esc(scriptUrl)}"
  ${attr("client_key", clientKey)}
  ${attr("api_event", apiEvent)}
  ${attr("amount", amount)}
  ${fundingAccountId && savedIdAttr ? attr("id_account", fundingAccountId) : ""}
  ${fundingAccountId && apiEvent === "create_payment" && !savedIdAttr ? attr("id_funding_account", fundingAccountId) : ""}
  ${attr("id_customer", idCustomer)}
  ${attr("payment_option", paymentOption)}
  ${attr("payment_option_readonly", paymentOptionReadOnly)}
  ${attr("customer_reference", accountNumber)}
  ${attr("customer_account_reference", accountNumber)}
  ${attr("customer_first_name", firstName)}
  ${attr("customer_last_name", lastName)}
  ${attr("customer_email", email)}
  ${attr("customer_address_line1", address.line1)}
  ${attr("customer_address_line2", address.line2)}
  ${attr("customer_city", address.city)}
  ${attr("customer_state", address.state)}
  ${attr("customer_zip_code1", address.zip)}
  data-form_width="100%"
  data-form_height="${formHeight}px"
  data-prevent_posting="true"
  data-dispatch_custom_event_to_parent="true"></script>
<script>
(function () {
  var send = function (type, payload) {
    window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({ type: type, payload: payload || null }));
  };
  ["checkout-event", "orbipay-checkout-event", "checkoutEvent"].forEach(function (name) {
    var handler = function (e) { send("checkout_event", e.detail || null); };
    window.addEventListener(name, handler);
    document.addEventListener(name, handler);
  });
  window.addEventListener("hwf_form_closing_event", function (e) { send("form_closed", e.detail || null); });
  window.addEventListener("message", function (e) {
    var host = "";
    try { host = new URL(e.origin).hostname; } catch (err) { return; }
    if (host !== "billerpayments.com" && host.slice(-19) !== ".billerpayments.com") return;
    send("orbipay_message", typeof e.data === "string" ? e.data : JSON.stringify(e.data));
  });
  var readySent = false;
  var signalReady = function () {
    if (readySent) return;
    var frame = document.getElementById("orbipay-checkout-iframe") || document.querySelector("iframe");
    if (frame && frame.offsetHeight > 0) { readySent = true; send("widget_ready"); }
  };
  new MutationObserver(signalReady).observe(document.documentElement, { childList: true, subtree: true, attributes: true });
  window.addEventListener("load", function () {
    var sdk = window.OrbipayCheckoutSimple;
    if (!sdk) { send("widget_failed", "sdk_missing"); return; }
    try {
      sdk.setPreventPosting && sdk.setPreventPosting("true");
      sdk.checkoutInit();
      var btn = document.getElementById("orbipay-checkout-button");
      if (btn) { btn.click(); } else { sdk.initializeIframe(); }
      send("widget_opened");
      signalReady();
    } catch (err) { send("widget_failed", String(err)); }
  });
})();
</script>
</body>
</html>`;
};

const parseCheckoutPayload = (raw) => {
  let data = raw;
  if (typeof data === "string") {
    try { data = JSON.parse(data); } catch (error) { return null; }
  }
  if (!data || typeof data !== "object") return null;
  const token = data.token || data.orbipayToken || data.fundingAccountToken || data.payment_token || "";
  const digiSign = data.digiSign || data.digi_sign || data.signature || "";
  const status = (data.status || data.eventType || data.event || "").toString().toLowerCase();
  if (status.includes("cancel") || status.includes("close")) return { cancelled: true };
  if (!token) return null;
  return { token, digiSign, raw: data };
};

const OrbipayWidgetScreen = ({ navigation, route }) => {
  const mode = ["pay", "edit"].includes(route.params?.mode) ? route.params.mode : "add";
  const headerTitle = route.params?.headerTitle || "Billing Details";
  const amount = Number(route.params?.amount) || 0;
  const fundingAccountId = route.params?.fundingAccountId || "";
  const idCustomer = route.params?.idCustomer || "";
  const paymentOption = route.params?.paymentOption || "";
  const paymentOptionReadOnly = route.params?.paymentOptionReadOnly || "";
  const returnTo = route.params?.returnTo || "";
  const emailParam = route.params?.email || "";
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const formHeight = initialFormHeight(width);
  const accountDetails = useSelector((state) => state.profile?.accountDetails) || {};
  const userInfo = useSelector((state) => state.user?.userData?.userInfo) || {};
  const [busy, setBusy] = useState(false);
  const [widgetReady, setWidgetReady] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const [errorAlert, setErrorAlert] = useState("");
  const webRef = useRef(null);
  const htmlRef = useRef(null);
  const handledRef = useRef(false);
  const initialLoadRef = useRef(false);
  const settleTimerRef = useRef(null);
  const hostModeRef = useRef(null);
  const portalUrlRef = useRef(null);
  const widgetParamsRef = useRef(null);

  const hostFlag = useFeatureFlag(FeatureFlags.BILLING_ORBIPAY_HOST, Config.ORBIPAY_DEFAULT_HOST || "app");
  const portalPathFlag = useFeatureFlag(FeatureFlags.BILLING_ORBIPAY_PORTAL_PATH, Config.ORBIPAY_PORTAL_WIDGET_PATH || "/orbipayhost.html");
  if (hostModeRef.current === null) {
    hostModeRef.current = hostFlag === "portal" ? "portal" : "app";
    portalUrlRef.current = `${String(Config.PORTAL_BASE_URL || "").replace(/\/+$/, "")}${portalPathFlag || Config.ORBIPAY_PORTAL_WIDGET_PATH || "/orbipayhost.html"}`;
  }
  const portalHosted = hostModeRef.current === "portal";

  if (widgetParamsRef.current === null) {
    const billing = accountDetails.bill_to_address || {};
    widgetParamsRef.current = {
      apiEvent: mode === "pay" ? "create_payment" : mode === "edit" ? "update_funding_account" : "create_funding_account",
      accountNumber: userInfo.accountNumber || accountDetails.account_number || "",
      amount: mode === "pay" ? amount.toFixed(2) : "",
      firstName: userInfo.firstName || "",
      lastName: userInfo.lastName || "",
      email: emailParam || getPrimaryEmail(accountDetails) || "",
      address: {
        line1: billing.address_line_1 || billing.addressLine1 || billing.line1 || billing.address1 || "",
        line2: billing.address_line_2 || billing.addressLine2 || billing.line2 || billing.address2 || "",
        city: billing.city || "",
        state: billing.state || "",
        zip: billing.zip || billing.postal_code || billing.zip_code || "",
      },
      fundingAccountId,
      idCustomer,
      paymentOption,
      paymentOptionReadOnly,
      formHeight,
      bottomPad: insets.bottom + 65,
    };
  }
  if (htmlRef.current === null && !portalHosted) {
    htmlRef.current = buildWidgetHtml({
      scriptUrl: Config.ORBIPAY_SCRIPT_URL || "",
      clientKey: Config.ORBIPAY_CLIENT_KEY || "",
      ...widgetParamsRef.current,
    });
  }
  const html = htmlRef.current;

  useEffect(() => {
    if (widgetReady) return undefined;
    const timer = setTimeout(() => setLoadFailed(true), WIDGET_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [widgetReady, retryKey]);

  useEffect(() => () => clearTimeout(settleTimerRef.current), []);

  const onCheckoutToken = useCallback(
    async ({ token, digiSign }) => {
      if (handledRef.current) return;
      handledRef.current = true;
      setBusy(true);
      try {
        if (mode === "pay") {
          const result = await confirmPaymentToken(token, digiSign, amount, emailParam);
          if (!navigation.isFocused()) return;
          navigation.replace("PaymentConfirmation", {
            headerTitle,
            kind: "payment-submitted",
            message: `Your payment for ${formatCurrency(amount)} has been received. It may take up to 24 hours to be reflected on your account.`,
            confirmationNumber: result?.confirmationNumber || "",
            email: emailParam || getPrimaryEmail(accountDetails) || "",
          });
        } else if (mode === "edit") {
          await updateFundingAccount(fundingAccountId, { token, digiSign });
          if (!navigation.isFocused()) return;
          announceA11y("Payment method updated.");

          if (returnTo) navigation.navigate(returnTo, { paymentFlash: { type: "success", message: "Your payment method has been updated." } });
          else navigation.goBack();
        } else {
          await confirmBankToken(token, digiSign);
          if (!navigation.isFocused()) return;
          announceA11y("Payment method added.");
          if (returnTo) navigation.navigate(returnTo, { paymentFlash: { type: "success", message: "Your payment method has been added." } });
          else navigation.goBack();
        }
      } catch (error) {
        handledRef.current = false;
        setBusy(false);
        if (!navigation.isFocused()) return;
        const raw = String(error?.message || "");
        const message = /timeout|network/i.test(raw)
          ? "Please check your internet connection and try again."
          : raw && !raw.includes("<")
          ? raw
          : "We could not complete this request. Please try again.";
        const flash = { type: "error", title: "Something went wrong", message };
        const state = navigation.getState();
        const prev = state?.routes?.[state.index - 1];
        if (returnTo) navigation.navigate(returnTo, { paymentFlash: flash });
        else if (prev?.name) navigation.navigate(prev.name, { paymentFlash: flash });
        else navigation.goBack();
      }
    },
    [mode, amount, fundingAccountId, navigation, returnTo]
  );

  const onMessage = useCallback(
    ({ nativeEvent }) => {
      let msg = null;
      try { msg = JSON.parse(nativeEvent.data); } catch (error) { return; }
      if (!msg) return;
      if (msg.type === "checkout_event" || msg.type === "orbipay_message") {
        const parsed = parseCheckoutPayload(msg.payload);
        if (parsed?.cancelled) { navigation.goBack(); return; }
        if (parsed?.token) onCheckoutToken(parsed);
      } else if (msg.type === "host_ready") {
        const payload = JSON.stringify({ ...widgetParamsRef.current, contract: HOST_CONTRACT_VERSION });
        webRef.current?.injectJavaScript(`window.__orbipayHostInit && window.__orbipayHostInit(${payload}); true;`);
      } else if (msg.type === "widget_ready") {
        if (!settleTimerRef.current) settleTimerRef.current = setTimeout(() => setWidgetReady(true), WIDGET_SETTLE_MS);
      } else if (msg.type === "form_closed") {
        if (!handledRef.current) navigation.goBack();
      } else if (msg.type === "widget_failed") {
        setErrorAlert("The secure payment form could not be loaded. Please try again later.");
      }
    },
    [navigation, onCheckoutToken]
  );

  const onShouldStartLoadWithRequest = useCallback(
    (request) => {
      const url = request.url || "";
      if (url.startsWith("about:") || url.startsWith("data:")) return true;
      if (isAllowedPaymentUrl(url)) return true;
      if (portalHosted && portalUrlRef.current && url.startsWith(portalUrlRef.current)) {

        initialLoadRef.current = true;
        return true;
      }
      if (!initialLoadRef.current) {
        initialLoadRef.current = true;
        return true;
      }
      try {
        const params = {};
        (url.split("?")[1] || "").split("&").forEach((pair) => {
          const [key, value] = pair.split("=");
          if (key) params[decodeURIComponent(key)] = decodeURIComponent(value || "");
        });
        const parsed = parseCheckoutPayload(params);
        if (parsed?.token) onCheckoutToken(parsed);
      } catch (error) {

      }
      return false;
    },
    [onCheckoutToken, portalHosted]
  );

  const onRetry = () => {
    clearTimeout(settleTimerRef.current);
    settleTimerRef.current = null;
    setLoadFailed(false);
    setWidgetReady(false);
    initialLoadRef.current = false;
    setRetryKey((k) => k + 1);
  };

  return (
    <View style={styles.container}>
      <ProfileSettingsHeader title={headerTitle} onPressBack={() => navigation.goBack()} />
      <View style={styles.body}>
      {!!errorAlert && (
        <NotificationAlert
          type="error"
          title="Something went wrong"
          message={errorAlert}
          onClose={() => setErrorAlert("")}
          autoFocusTitle
        />
      )}
      {loadFailed ? (
        <View style={styles.loadingWrap}>
          <Text style={styles.loadingText}>The secure payment form is taking too long to load.</Text>
          <PrimaryButton title="Try Again" buttonType="submit" accessibilityLabel="Try Again" onPress={onRetry} />
        </View>
      ) : (
        <WebView
          key={retryKey}
          ref={webRef}
          source={
            portalHosted
              ? { uri: `${portalUrlRef.current}?contract=${HOST_CONTRACT_VERSION}` }
              : { html, baseUrl: Config.ORBIPAY_WIDGET_BASE_URL || "https://customer.uat.sparklight.com" }
          }
          onMessage={onMessage}
          onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
          originWhitelist={["https://*"]}
          javaScriptEnabled
          domStorageEnabled
          sharedCookiesEnabled={false}
          cacheEnabled
          setSupportMultipleWindows={false}
          nestedScrollEnabled
          keyboardDisplayRequiresUserAction={false}
          pointerEvents={busy ? "none" : "auto"}
          style={[styles.webview, busy && styles.hiddenWhileBusy]}
        />
      )}
      {!widgetReady && !loadFailed && (
        <View style={styles.loadingWrap} pointerEvents="none">
          <SmallLoader width={110} height={82} />
          <Text style={styles.loadingText} accessibilityLiveRegion="polite">
            {mode === "pay" && fundingAccountId ? "Processing your secure payment…" : "Opening secure payment form…"}
          </Text>
        </View>
      )}
      {busy && (
        <View style={styles.busyOverlay} accessibilityLiveRegion="polite">
          <SmallLoader width={110} height={82} />
          <Text style={styles.loadingText}>{mode === "pay" ? "Processing your payment…" : "Saving your payment method…"}</Text>
        </View>
      )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },

  body: { flex: 1 },
  webview: { flex: 1, backgroundColor: "transparent" },
  loadingWrap: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  loadingText: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 14,
    color: Color.sparklightGray1,
    textAlign: "center",
  },

  busyOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },

  hiddenWhileBusy: { opacity: 0 },
});

export default OrbipayWidgetScreen;
