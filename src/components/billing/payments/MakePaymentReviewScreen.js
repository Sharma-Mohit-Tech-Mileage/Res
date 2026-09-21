import React, { useCallback, useRef, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Modal } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import moment from "moment";
import ProfileSettingsHeader from "../../common/ProfileSettingsHeader";
import PrimaryButton from "../../common/customui/PrimaryButton";
import NotificationAlert from "../../common/customui/NotificationAlert";
import AgreeTermsRow from "./AgreeTermsRow";
import TermsModal from "./TermsModal";
import SparkLightInput from "../../common/customui/SparkLightInput";
import SmallLoader from "../../common/customui/SmallLoader";
import { Color, FontFamily, FontSize } from "../../../../GlobalStyles";
import { SectionTitle } from "../../common/customui/Typography";
import ReviewField from "./ReviewField";
import { card } from "../../../styles/utilities";
import {
  fetchPaymentMethods,
  fetchAutoPayDetails,
  submitPayment,
  paymentErrorMessage,
} from "../../../network/apis/account/paymentMethods.service";
import {
  contentMaxWidth,
  describePaymentMethod,
  paymentMethodA11yLabel,
  formatCurrency,
  openOrbipayPaymentExecution,
  isCreditCard,
  useSurchargeRate,
  surchargeTitle,
  surchargeMessage,
} from "./paymentsShared";
import { announceA11y } from "../../../utils/a11y";
import {
  usePaymentStep,
  trackPaymentSubmitted,
  trackPaymentSuccess,
  trackPaymentFailed,
  trackValidationError,
  trackApiError,
  errorStatus,
} from "./paymentAnalytics";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MakePaymentReviewScreen = ({ navigation, route }) => {
  const surchargeRate = useSurchargeRate();
  const amount = Number(route.params?.amount) || 0;
  const paymentType = route.params?.paymentType || "";
  const fromOffer = !!route.params?.fromOffer;
  const headerTitle = route.params?.headerTitle || "Make a Payment";
  const [method, setMethod] = useState(route.params?.method || null);
  // Supplied by the Orbipay Fee Calculator; informational only and never recalculated here.
  const surcharge = route.params?.surcharge != null ? Number(route.params.surcharge) : null;
  const showSurcharge = isCreditCard(method) && surcharge != null;
  // The customer is charged amount + surcharge, so confirmation must report the total.
  const totalAmount = showSurcharge ? amount + surcharge : amount;
  const [autoPay, setAutoPay] = useState(null);
  const [loading, setLoading] = useState(true);
  const [agreed, setAgreed] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const emailRef = useRef(null);
  const scrollRef = useRef(null);
  const inFlightRef = useRef(false);
  const [errorAlert, setErrorAlert] = useState("");
  const [surchargeInfoVisible, setSurchargeInfoVisible] = useState(true);
  const abortRef = useRef(null);
  const paymentDate = moment().format("M/D/YYYY");

  usePaymentStep("payment_review");

  useFocusEffect(
    useCallback(() => {
      const flash = route.params?.paymentFlash;
      if (flash?.message) {
        setErrorAlert(flash.message);
        navigation.setParams({ paymentFlash: undefined });
      }
      abortRef.current = new AbortController();
      const signal = abortRef.current.signal;
      setLoading(true);
      Promise.all([fetchPaymentMethods(signal), fetchAutoPayDetails(signal)])
        .then(([list, details]) => {
          setAutoPay(details);
          setEmail((prev) => prev || details.email || "");
          const paramMethodId = route.params?.methodId || route.params?.method?.id;
          setMethod(list.find((m) => m.id === paramMethodId) || route.params?.method || null);
        })
        .catch((error) => {
          setAutoPay({ enrolled: true });
          trackApiError("payment-review-load", errorStatus(error), "payment_review");
        })
        .finally(() => setLoading(false));
      return () => abortRef.current?.abort();
    }, [route.params?.methodId, route.params?.method, route.params?.paymentFlash, navigation])
  );

  const onSubmit = async () => {
    if (inFlightRef.current || !agreed) return;

    if (!EMAIL_PATTERN.test(email.trim())) {
      setEmailError("Please enter a valid email address.");
      emailRef.current?.focus();
      trackValidationError("email", "invalid_format");
      return;
    }
    if (!method?.id) {
      // Widget-hosted payment: payment_submitted fires in OrbipayWidgetScreen at token receipt.
      openOrbipayPaymentExecution(navigation, { amount, headerTitle, email: email.trim(), paymentType });
      return;
    }
    inFlightRef.current = true;
    setSubmitting(true);
    trackPaymentSubmitted(amount, method, paymentType);
    try {
      const result = await submitPayment(amount, method, email.trim());
      trackPaymentSuccess(method);
      navigation.replace("PaymentConfirmation", {
        headerTitle,
        kind: "payment-submitted",
        message: `Your payment for ${formatCurrency(
          totalAmount
        )} has been received. It may take up to 24 hours to be reflected on your account.`,
        confirmationNumber: result?.confirmationNumber || "",
        email: email.trim(),
        nextAction:
          !autoPay?.enrolled && !fromOffer && method?.id
            ? { type: "setupAutoPay", methodId: method.id }
            : null,
      });
    } catch (error) {
      trackPaymentFailed(method, error?.code || "submit_error");
      trackApiError("submit-payment", errorStatus(error), "payment_review");
      // 55255: decline / duplicate / unconfirmed carry portal copy; transport errors fall back to the portal's request-failed copy.
      setErrorAlert(paymentErrorMessage(error));
      announceA11y("Error, your payment was not submitted.");
      // The error banner renders at the top of the scroll view, so bring it into view.
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    } finally {
      inFlightRef.current = false;
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <ProfileSettingsHeader title={headerTitle} onPressBack={() => navigation.goBack()} />
      <ScrollView ref={scrollRef} contentContainerStyle={[styles.content, contentMaxWidth]} showsVerticalScrollIndicator={false}>
        {!!errorAlert && (
          <NotificationAlert
            type="error"
            title="Something went wrong"
            message={errorAlert}
            splitKey={
              errorAlert.includes("1-877-692-2253")
                ? [{ text: "1-877-692-2253", action: "call", value: "1-877-692-2253" }]
                : ""
            }
            onClose={() => setErrorAlert("")}
            autoFocusTitle
          />
        )}

        <SectionTitle style={styles.heading} accessibilityRole="header" accessibilityLevel={2}>
          Review payment
        </SectionTitle>

        <View style={[card.elevated, styles.summaryCard]}>
          <ReviewField label="Payment Method" value={describePaymentMethod(method)} a11yValue={paymentMethodA11yLabel(method)} loading={loading} />
          <ReviewField label="Payment Amount" value={formatCurrency(amount)} loading={loading} />
          {showSurcharge && (
            <>
              <ReviewField
                label="Credit Card Surcharge"
                value={formatCurrency(surcharge)}
                loading={loading}
                showLabelIcon
                onLabelIconPress={() => setSurchargeInfoVisible((visible) => !visible)}
                labelIconExpanded={surchargeInfoVisible}
              />
              {surchargeInfoVisible && (
                <View style={styles.inCardAlert}>
                  <NotificationAlert
                    type="warning"
                    title={surchargeTitle(surchargeRate)}
                    message={surchargeMessage(surchargeRate)}
                    showCloseIcon={false}
                  />
                </View>
              )}
              <ReviewField label="Total Amount" value={formatCurrency(totalAmount)} loading={loading} />
            </>
          )}
          <ReviewField label="Payment Date" value={paymentDate} a11yValue={moment().format("MMMM D, YYYY")} last loading={loading} />
        </View>

        {(
          <View style={[card.elevated, styles.emailCard]}>
            {loading ? (
              <SkeletonPlaceholder>
                <View style={styles.valueSkeleton} />
              </SkeletonPlaceholder>
            ) : (
              <SparkLightInput
                ref={emailRef}
                name="email"
                label="Email Address (required)"
                accessibilityLabel="Email Address"
                placeholder="Email Address"
                value={email}
                required
                error={emailError}
                onChangeText={(text) => {
                  setEmail(text);
                  if (emailError) setEmailError("");
                }}
                accessibilityHint="A confirmation email will be sent to this address."
              />
            )}
          </View>
        )}

        {/* {!method?.id && (
          <Text style={styles.helperText}>
            You will complete this payment on our secure payment page. Your card or bank details never leave that
            page.
          </Text>
        )}*/}

        <AgreeTermsRow value={agreed} onValueChange={setAgreed} onViewTerms={() => setShowTerms(true)} />
        {!method?.id && (
          <Text style={styles.secureNote}>
            For your security, you'll finish this payment on our secure checkout — we never see or store your card or bank details.
          </Text>
        )}

        <PrimaryButton
          title={submitting ? "Submitting..." : "Submit Payment"}
          buttonType="submit"
          disabled={submitting || !agreed || loading}
          accessibilityLabel={`Submit payment of ${formatCurrency(totalAmount)}`}
          onPress={onSubmit}
        />
        <PrimaryButton title="Back" buttonType="cancel" accessibilityLabel="Back" onPress={() => navigation.goBack()} />
      </ScrollView>

      <TermsModal visible={showTerms} onClose={() => setShowTerms(false)} />

      <Modal visible={submitting} transparent animationType="fade" onRequestClose={() => {}}>
        <View style={styles.processingOverlay}>
          <View style={styles.processingCard}>
            <SmallLoader width={64} height={48} />
            <Text style={styles.processingTxt}>Processing your payment…</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F7F7" },
  processingOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  processingCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 16,
  },
  processingTxt: {
    fontSize: FontSize.size_sm,
    fontFamily: FontFamily.RadioCanadaRegular,
    color: Color.sparklightGray1,
    marginLeft: 10,
  },
  content: { padding: 20, paddingBottom: 140 },
  heading: {
    marginBottom: 12,
  },
  valueSkeleton: { height: 18, borderRadius: 4, width: "60%" },
  inCardAlert: { marginTop: -8, marginBottom: 8 },
  summaryCard: { padding: 16 },
  emailCard: { padding: 16, marginTop: 16 },
  secureNote: { fontSize: 13, lineHeight: 18, color: Color.colorGray_200 || "#6B6B6B", marginTop: 12, marginBottom: 4 },
  helperText: {
    fontSize: FontSize.size_smi,
    fontFamily: FontFamily.openSansRegular,
    color: Color.sparklightGray1,
    lineHeight: 18,
    marginTop: 8,
    textAlign: "center",
  },
});

export default MakePaymentReviewScreen;
