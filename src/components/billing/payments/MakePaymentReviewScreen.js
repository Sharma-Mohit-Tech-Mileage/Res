import React, { useCallback, useRef, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import moment from "moment";
import ProfileSettingsHeader from "../../common/ProfileSettingsHeader";
import PrimaryButton from "../../common/customui/PrimaryButton";
import NotificationAlert from "../../common/customui/NotificationAlert";
import AgreeTermsRow from "./AgreeTermsRow";
import TermsModal from "./TermsModal";
import SparkLightInput from "../../common/customui/SparkLightInput";
import { Color, FontFamily, FontSize } from "../../../../GlobalStyles";
import { SectionTitle, FieldTitle, FieldContent } from "../../common/customui/Typography";
import { card } from "../../../styles/utilities";
import {
  fetchPaymentMethods,
  fetchAutoPayDetails,
  submitPayment,
} from "../../../network/apis/account/paymentMethods.service";
import {
  contentMaxWidth,
  describePaymentMethod,
  paymentMethodA11yLabel,
  formatCurrency,
  openOrbipayPaymentExecution,
} from "./paymentsShared";
import { announceA11y } from "../../../utils/a11y";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MakePaymentReviewScreen = ({ navigation, route }) => {
  const amount = Number(route.params?.amount) || 0;
  const fromOffer = !!route.params?.fromOffer;
  const headerTitle = route.params?.headerTitle || "Make a Payment";
  const [method, setMethod] = useState(route.params?.method || null);
  const [autoPay, setAutoPay] = useState(null);
  const [loading, setLoading] = useState(true);
  const [agreed, setAgreed] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const emailRef = useRef(null);
  const inFlightRef = useRef(false);
  const [errorAlert, setErrorAlert] = useState("");
  const abortRef = useRef(null);
  const paymentDate = moment().format("M/D/YYYY");

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
        .catch(() => setAutoPay({ enrolled: true }))
        .finally(() => setLoading(false));
      return () => abortRef.current?.abort();
    }, [route.params?.methodId, route.params?.method, route.params?.paymentFlash, navigation])
  );

  const onSubmit = async () => {
    if (inFlightRef.current || !agreed) return;

    if (!EMAIL_PATTERN.test(email.trim())) {
      setEmailError("Please enter a valid email address.");
      emailRef.current?.focus();
      return;
    }
    if (!method?.id) {
      openOrbipayPaymentExecution(navigation, {
        amount,
        method,
        headerTitle,
        email: email.trim(),
        onSuccessRoute: {
          name: "PaymentConfirmation",
          params: {
            kind: "payment-submitted",
            message: `Your payment for ${formatCurrency(
              amount
            )} has been received. It may take up to 24 hours to be reflected on your account.`,
          },
        },
      });
      return;
    }
    inFlightRef.current = true;
    setSubmitting(true);
    try {
      const result = await submitPayment(amount, method, email.trim());
      navigation.replace("PaymentConfirmation", {
        headerTitle,
        kind: "payment-submitted",
        message: `Your payment for ${formatCurrency(
          amount
        )} has been received. It may take up to 24 hours to be reflected on your account.`,
        confirmationNumber: result?.confirmationNumber || "",
        email: email.trim(),
        nextAction:
          !autoPay?.enrolled && !fromOffer && method?.id
            ? { type: "setupAutoPay", methodId: method.id }
            : null,
      });
    } catch (error) {
      setErrorAlert("We could not submit your payment right now. Please try again.");
      announceA11y("Error, your payment was not submitted.");
    } finally {
      inFlightRef.current = false;
      setSubmitting(false);
    }
  };

  const renderField = (label, value, a11yValue, last, valueLoading) => (
    <View
      style={[styles.fieldGroup, last && styles.fieldGroupLast]}
      accessible={!valueLoading}
      accessibilityLabel={valueLoading ? undefined : `${label}, ${a11yValue || value}`}
    >
      <FieldTitle style={styles.fieldLabel}>{label}</FieldTitle>
      {valueLoading ? (
        <SkeletonPlaceholder>
          <View style={styles.valueSkeleton} />
        </SkeletonPlaceholder>
      ) : (
        <View style={styles.fieldValueBox}>
          <FieldContent style={styles.fieldValue}>{value}</FieldContent>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <ProfileSettingsHeader title={headerTitle} onPressBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={[styles.content, contentMaxWidth]} showsVerticalScrollIndicator={false}>
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
          Review payment
        </SectionTitle>

        <View style={[card.elevated, styles.summaryCard]}>
          {renderField("Payment Method", describePaymentMethod(method), paymentMethodA11yLabel(method), false, loading)}
          {renderField("Payment Amount", formatCurrency(amount), null, false, loading)}
          {renderField("Payment Date", paymentDate, moment().format("MMMM D, YYYY"), true, loading)}
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

        {!method?.id && (
          <Text style={styles.helperText}>
            You will complete this payment on our secure payment page. Your card or bank details never leave that
            page.
          </Text>
        )}

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
          accessibilityLabel={`Submit payment of ${formatCurrency(amount)}`}
          onPress={onSubmit}
        />
        <PrimaryButton title="Back" buttonType="cancel" accessibilityLabel="Back" onPress={() => navigation.goBack()} />
      </ScrollView>

      <TermsModal visible={showTerms} onClose={() => setShowTerms(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F7F7" },
  content: { padding: 20, paddingBottom: 140 },
  heading: {
    marginBottom: 12,
  },
  valueSkeleton: { height: 18, borderRadius: 4, width: "60%" },
  summaryCard: { padding: 16 },
  emailCard: { padding: 16, marginTop: 16 },
  fieldGroup: { marginBottom: 16 },
  fieldGroupLast: { marginBottom: 0 },
  fieldLabel: { marginBottom: 8 },
  fieldValue: {},
  fieldValueBox: { backgroundColor: "#F3F4F8", borderRadius: 8, paddingVertical: 12, paddingHorizontal: 12 },
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
