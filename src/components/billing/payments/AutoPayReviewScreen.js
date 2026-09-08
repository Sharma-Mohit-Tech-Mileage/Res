import React, { useCallback, useRef, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import ProfileSettingsHeader from "../../common/ProfileSettingsHeader";
import PrimaryButton from "../../common/customui/PrimaryButton";
import NotificationAlert from "../../common/customui/NotificationAlert";
import SparkLightInput from "../../common/customui/SparkLightInput";
import LinkText from "../../common/customui/LinkText";
import AgreeTermsRow from "./AgreeTermsRow";
import TermsModal from "./TermsModal";
import { FontFamily,Color,FontSize } from "../../../../GlobalStyles";
import { SectionTitle, HintText, SectionContent, FieldTitle, FieldContent } from "../../common/customui/Typography";
import { card } from "../../../styles/utilities";
import {
  fetchPaymentMethods,
  fetchAutoPayDetails,
  enrollAutoPay,
  updateAutoPayPaymentMethod,
} from "../../../network/apis/account/paymentMethods.service";
import {
  contentMaxWidth,
  ordinal,
  describePaymentMethod,
  paymentMethodA11yLabel,
  formatCurrency,
  isCreditCard,
  surchargeBreakdownLabel,
  surchargeTitle,
  surchargeMessage,
  useSurchargeRate,
  useSurchargeFee,
} from "./paymentsShared";
import { announceA11y } from "../../../utils/a11y";
import {
  usePaymentStep,
  trackAutoPayEnabled,
  trackAutoPayFailed,
  trackValidationError,
  trackApiError,
  errorStatus,
} from "./paymentAnalytics";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const AutoPayReviewScreen = ({ navigation, route }) => {
  const mode = route.params?.mode === "update" ? "update" : "enroll";
  const methodId = route.params?.methodId || "";
  const entryPoint = route.params?.entryPoint || "";
  const fromOffer = !!route.params?.fromOffer;
  const headerTitle = route.params?.headerTitle || (mode === "enroll" ? "Set Up Auto Pay" : "Manage Auto Pay");
  const [method, setMethod] = useState(null);
  const [details, setDetails] = useState(null);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const inFlightRef = useRef(false);
  const [errorAlert, setErrorAlert] = useState("");
  const emailRef = useRef(null);
  const abortRef = useRef(null);

  usePaymentStep("autopay_review");

  useFocusEffect(
    useCallback(() => {
      abortRef.current = new AbortController();
      const signal = abortRef.current.signal;
      Promise.all([fetchPaymentMethods(signal), fetchAutoPayDetails(signal)])
        .then(([list, autoPay]) => {
          setMethod(list.find((m) => m.id === methodId) || null);
          setDetails(autoPay);
          setEmail((prev) => prev || autoPay.email || "");
        })
        .catch((error) => {
          setDetails({});
          setErrorAlert("We could not load your payment information. Please try again.");
          trackApiError("autopay-details", errorStatus(error), "autopay_review");
        });
      return () => abortRef.current?.abort();
    }, [methodId])
  );

  const loading = details === null;
  const dueDayLabel = ordinal(details?.dueDay || 22);

  const amountDue = Number(details?.pastDueAmount) || 0;
  const surchargeRate = useSurchargeRate();
  const showBalanceAlert = !loading && amountDue > 0;
  const showSurchargeNotice = !loading && isCreditCard(method) && !showBalanceAlert;

  const onFeeError = () =>
    setErrorAlert("We could not calculate the credit card surcharge. Please try again.");
  const balanceSurcharge = useSurchargeFee(amountDue, method, { onError: onFeeError });
  const showBalanceSurcharge = balanceSurcharge != null;
  const totalBalance = showBalanceSurcharge ? amountDue + balanceSurcharge : amountDue;

  const onSubmit = async () => {
    if (inFlightRef.current || !agreed) return;
    if (!EMAIL_PATTERN.test(email.trim())) {
      setEmailError("Please enter a valid email address.");
      emailRef.current?.focus();
      trackValidationError("email", "invalid_format");
      return;
    }
    inFlightRef.current = true;
    setSubmitting(true);
    try {
      const submit = mode === "update" ? updateAutoPayPaymentMethod : enrollAutoPay;
      const result = await submit(methodId, email.trim());
      if (mode === "enroll") trackAutoPayEnabled(method, entryPoint);
      navigation.replace("PaymentConfirmation", {
        headerTitle,
        kind: mode === "update" ? "autopay-updated" : "autopay-activated",
        confirmationNumber: result?.confirmationNumber || "",
        email: email.trim(),
        nextAction:
          amountDue > 0 && !fromOffer
            ? { type: "payBalance", amount: amountDue, methodId }
            : null,
      });
    } catch (error) {
      trackAutoPayFailed(mode === "update" ? "update_failed" : "enroll_failed");
      trackApiError(mode === "update" ? "update-autopay" : "enroll-autopay", errorStatus(error), "autopay_review");
      setErrorAlert(
        mode === "update"
          ? "We could not update your Auto Pay payment method. Please try again."
          : "We could not complete your Auto Pay enrollment. Please try again."
      );
      announceA11y("Error, your Auto Pay changes were not saved.");
    } finally {
      inFlightRef.current = false;
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <ProfileSettingsHeader title={headerTitle} onPressBack={() => navigation.goBack()} />
      <ScrollView
        contentContainerStyle={[styles.content, contentMaxWidth]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {!!errorAlert && (
          <NotificationAlert
            type="error"
            title="Something went wrong"
            message={errorAlert}
            onClose={() => setErrorAlert("")}
            autoFocusTitle
          />
        )}

        <SectionTitle style={styles.heading} accessibilityRole="header" accessibilityLevel={2}>
          Review Auto Pay
        </SectionTitle>
        <SectionContent style={styles.instructions}>
          {mode === "update"
            ? "You have signed up for Sparklight Auto Pay."
            : "You are enrolling in Sparklight Auto Pay."}
        </SectionContent>
        <SectionContent style={styles.instructions}>
          Your payment will be automatically charged on the <Text style={styles.introBold}>{dueDayLabel}</Text> of each month using your selected payment method.
        </SectionContent>

        <>
            <View style={[card.elevated, styles.summaryCard]}>
              <View
                style={styles.fieldGroup}
                accessible={!loading}
                accessibilityLabel={loading ? undefined : `Payment Method, ${paymentMethodA11yLabel(method)}`}
              >
                <FieldTitle style={styles.fieldLabel}>Payment Method</FieldTitle>
                {loading ? (
                  <SkeletonPlaceholder>
                    <View style={styles.valueSkeleton} />
                  </SkeletonPlaceholder>
                ) : (
                  <View style={styles.fieldValueBox}>
                    <FieldContent style={styles.fieldValue}>{describePaymentMethod(method)}</FieldContent>
                  </View>
                )}
              </View>
              <View
                style={[styles.fieldGroup, !showBalanceAlert && !showSurchargeNotice && styles.fieldGroupLast]}
                accessible={!loading}
                accessibilityLabel={loading ? undefined : `Payment Date, on the ${dueDayLabel} of each month`}
              >
                <FieldTitle style={styles.fieldLabel}>Payment Date</FieldTitle>
                {loading ? (
                  <SkeletonPlaceholder>
                    <View style={styles.valueSkeleton} />
                  </SkeletonPlaceholder>
                ) : (
                  <View style={styles.fieldValueBox}>
                    <FieldContent style={styles.fieldValue}>On the {dueDayLabel} of each month</FieldContent>
                  </View>
                )}
              </View>

              {showBalanceAlert && (
                <View style={styles.inCardAlert}>
                  <NotificationAlert
                    type="warning"
                    title="Your Balance Needs Attention"
                    message={`Your balance of ${formatCurrency(
                      amountDue
                    )} won't be processed by Auto Pay before the due date. You can pay it after finishing this setup.`}
                    showCloseIcon={false}
                  >
                    {showBalanceSurcharge && (
                      <View style={styles.breakdown}>
                        <View style={styles.breakdownDivider} />
                        <View
                          style={styles.breakdownRow}
                          accessible
                          accessibilityLabel={`Current unpaid balance, ${formatCurrency(amountDue)}`}
                        >
                          <Text style={styles.breakdownText}>Current unpaid balance:</Text>
                          <Text style={styles.breakdownText}>{formatCurrency(amountDue)}</Text>
                        </View>
                        <View
                          style={styles.breakdownRow}
                          accessible
                          accessibilityLabel={`Credit card surcharge, ${formatCurrency(balanceSurcharge)}`}
                        >
                          <Text style={styles.breakdownText}>{surchargeBreakdownLabel(surchargeRate)}</Text>
                          <Text style={styles.breakdownText}>{formatCurrency(balanceSurcharge)}</Text>
                        </View>
                        <View style={styles.breakdownDivider} />
                        <View
                          style={styles.breakdownRow}
                          accessible
                          accessibilityLabel={`Total balance, ${formatCurrency(totalBalance)}`}
                        >
                          <Text style={styles.breakdownText}>Total balance:</Text>
                          <Text style={styles.breakdownText}>{formatCurrency(totalBalance)}</Text>
                        </View>
                      </View>
                    )}
                  </NotificationAlert>
                </View>
              )}

              {showSurchargeNotice && (
                <View style={styles.inCardAlert}>
                  <NotificationAlert
                    type="warning"
                    title={surchargeTitle(surchargeRate)}
                    message={surchargeMessage(surchargeRate)}
                    showCloseIcon={false}
                  />
                </View>
              )}
            </View>

            <View style={[card.elevated, styles.emailCard]}>
              {loading ? (
                <SkeletonPlaceholder>
                  <View style={styles.labelSkeleton} />
                  <View style={styles.inputSkeleton} />
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

            <AgreeTermsRow value={agreed} onValueChange={setAgreed} onViewTerms={() => setShowTerms(true)} />

            <PrimaryButton
              title={submitting ? "Saving..." : mode === "update" ? "Update Auto Pay" : "Set Up Auto Pay"}
              buttonType="submit"
              disabled={submitting || !agreed || loading}
              accessibilityLabel={mode === "update" ? "Update Auto Pay" : "Set Up Auto Pay"}
              onPress={onSubmit}
            />
            <PrimaryButton title="Back" buttonType="cancel" accessibilityLabel="Back" onPress={() => navigation.goBack()} />
        </>
      </ScrollView>

      <TermsModal visible={showTerms} onClose={() => setShowTerms(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F7F7" },
  content: { padding: 20, paddingBottom: 140 },
  heading: {
    marginBottom: 8,
    lineHeight: 50,
  },
  introText: { lineHeight: 20, marginBottom: 16 },
  instructions: { marginBottom: 0 },
  introBold: { fontFamily: FontFamily.openSansSemiBold, fontWeight: "700" },
  cardSkeleton: { height: 92, borderRadius: 8, marginBottom: 12 },
  valueSkeleton: { height: 18, borderRadius: 4, width: "60%" },
  labelSkeleton: { height: 14, borderRadius: 4, width: "45%", marginBottom: 10 },
  inputSkeleton: { height: 44, borderRadius: 6, width: "100%" },
  summaryCard: { padding: 16, marginTop: 10, },
  fieldGroup: { marginBottom: 16 },
  fieldGroupLast: { paddingBottom: 4 },
  fieldLabel: {
     textAlign: "left",
     lineHeight: 28, },
  fieldValue: {
    fontSize: FontSize.size_base,
    textAlign: "left",
    fontWeight: "400",
    color: Color.sparklightGray1,
    fontFamily: FontFamily.RadioCanadaRegular,
  },
  fieldValueBox: {   },
  emailCard: { padding: 16 ,marginTop: 16, marginBottom: 16 },
  // Cancels the alert's own marginVertical so it sits on the card's 16pt rhythm.
  inCardAlert: { marginTop: -8, marginBottom: -8 },
  breakdown: { marginTop: 4 },
  breakdownDivider: { height: 1, backgroundColor: "rgba(0, 0, 0, 0.12)", marginVertical: 8 },
  breakdownRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 2 },
  breakdownText: {
    fontSize: FontSize.size_sm,
    fontFamily: FontFamily.RadioCanadaSemiBold,
    fontWeight: "700",
    color: "#000000",
  },
});

export default AutoPayReviewScreen;
