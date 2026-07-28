import React, { useCallback, useRef, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import moment from "moment";
import ProfileSettingsHeader from "../../common/ProfileSettingsHeader";
import PrimaryButton from "../../common/customui/PrimaryButton";
import NotificationAlert from "../../common/customui/NotificationAlert";
import AgreeTermsRow from "./AgreeTermsRow";
import TermsModal from "./TermsModal";
import { Color, FontFamily, FontSize } from "../../../../GlobalStyles";
import { card } from "../../../styles/utilities";
import {
  fetchPaymentMethods,
  fetchAutoPayDetails,
  submitDemoPayment,
  isDemoPaymentData,
} from "../../../network/apis/account/paymentMethods.service";
import {
  contentMaxWidth,
  describePaymentMethod,
  paymentMethodA11yLabel,
  formatCurrency,
  openOrbipayPaymentExecution,
} from "./paymentsShared";
import { announceA11y } from "../../../utils/a11y";

// Figma: Make a Payment step 3 — review, agree to terms, submit
const MakePaymentReviewScreen = ({ navigation, route }) => {
  const amount = Number(route.params?.amount) || 0;
  const fromOffer = !!route.params?.fromOffer;
  const [method, setMethod] = useState(route.params?.method || null);
  const [autoPay, setAutoPay] = useState(null);
  const [agreed, setAgreed] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorAlert, setErrorAlert] = useState("");
  const abortRef = useRef(null);
  const paymentDate = moment().format("M/D/YYYY");

  useFocusEffect(
    useCallback(() => {
      abortRef.current = new AbortController();
      const signal = abortRef.current.signal;
      Promise.all([fetchPaymentMethods(signal), fetchAutoPayDetails(signal)])
        .then(([list, details]) => {
          setAutoPay(details);
          const paramMethodId = route.params?.methodId || route.params?.method?.id;
          setMethod(list.find((m) => m.id === paramMethodId) || route.params?.method || null);
        })
        .catch(() => setAutoPay({ enrolled: true }));
      return () => abortRef.current?.abort();
    }, [route.params?.methodId, route.params?.method])
  );

  const onSubmit = async () => {
    if (submitting || !agreed) return;
    if (!isDemoPaymentData) {
      openOrbipayPaymentExecution(navigation, {
        amount,
        paymentMethodId: method?.id,
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
    setSubmitting(true);
    try {
      const result = await submitDemoPayment(amount);
      navigation.replace("PaymentConfirmation", {
        kind: "payment-submitted",
        message: `Your payment for ${formatCurrency(
          amount
        )} has been received. It may take up to 24 hours to be reflected on your account.`,
        confirmationNumber: result?.confirmationNumber || "",
        email: autoPay?.email || "",
        nextAction:
          !autoPay?.enrolled && !fromOffer && method?.id
            ? { type: "setupAutoPay", methodId: method.id }
            : null,
      });
    } catch (error) {
      setErrorAlert("We could not submit your payment right now. Please try again.");
      announceA11y("Error, your payment was not submitted.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (label, value, a11yValue, last) => (
    <View
      style={[styles.fieldGroup, last && styles.fieldGroupLast]}
      accessible
      accessibilityLabel={`${label}, ${a11yValue || value}`}
    >
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{value}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ProfileSettingsHeader title="Billing Details" onPressBack={() => navigation.goBack()} />
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

        <Text style={styles.heading} accessibilityRole="header" accessibilityLevel={2}>
          Review payment
        </Text>

        <View style={[card.elevated, styles.summaryCard]}>
          {renderField("Payment Method", describePaymentMethod(method), paymentMethodA11yLabel(method))}
          {renderField("Payment Amount", formatCurrency(amount))}
          {renderField("Payment Date", paymentDate, moment().format("MMMM D, YYYY"), true)}
        </View>

        {!isDemoPaymentData && (
          <Text style={styles.helperText}>
            You will complete this payment on our secure payment page. Your card or bank details never leave that
            page.
          </Text>
        )}

        <AgreeTermsRow value={agreed} onValueChange={setAgreed} onViewTerms={() => setShowTerms(true)} />

        <PrimaryButton
          title={submitting ? "Submitting..." : "Submit Payment"}
          buttonType="submit"
          disabled={!agreed}
          accessibilityLabel={`Submit payment of ${formatCurrency(amount)}`}
          onPress={onSubmit}
        />
        <PrimaryButton title="Back" buttonType="outline" accessibilityLabel="Back" onPress={() => navigation.goBack()} />
      </ScrollView>

      <TermsModal visible={showTerms} onClose={() => setShowTerms(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F7F7" },
  content: { padding: 20, paddingBottom: 80 },
  heading: {
    fontSize: FontSize.size_20,
    fontFamily: FontFamily.RadioCanadaSemiBold,
    fontWeight: "700",
    color: Color.sparklightGray1,
    marginBottom: 12,
  },
  summaryCard: { padding: 16 },
  fieldGroup: { paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: "#EAECF0", marginBottom: 12 },
  fieldGroupLast: { paddingBottom: 0, borderBottomWidth: 0, marginBottom: 0 },
  fieldLabel: {
    fontSize: FontSize.size_sm,
    fontFamily: FontFamily.RadioCanadaRegular,
    color: Color.sparklightGray1,
    marginBottom: 2,
  },
  fieldValue: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.RadioCanadaSemiBold,
    fontWeight: "700",
    color: Color.colorGray_200,
  },
  helperText: {
    fontSize: FontSize.size_smi,
    fontFamily: FontFamily.RadioCanadaRegular,
    color: Color.sparklightGray1,
    lineHeight: 18,
    marginTop: 8,
    textAlign: "center",
  },
});

export default MakePaymentReviewScreen;
