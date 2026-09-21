import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import ProfileSettingsHeader from "../../common/ProfileSettingsHeader";
import NextActionCard from "./NextActionCard";
import NotificationAlert from "../../common/customui/NotificationAlert";
import AnimatedSuccessIcon from "./AnimatedSuccessIcon";
import { Color, FontFamily, FontSize } from "../../../../GlobalStyles";
import { FieldTitle, FieldContent,HeadingH2 } from "../../common/customui/Typography";
import { card } from "../../../styles/utilities";
import { contentMaxWidth, formatCurrency } from "./paymentsShared";
import { setFocusToRef, announceA11y } from "../../../utils/a11y";
import { currentPaymentAttempt, endPaymentAttempt, trackStepDuration } from "./paymentAnalytics";

const KIND_COPY = {
  "autopay-activated": {
    message: "Sparklight Auto Pay has been successfully activated. It may take up to 24 hours to be reflected on your account.",
    numberLabel: "Auto Pay Confirmation Number",
  },
  "autopay-updated": {
    message: "Your Sparklight Auto Pay payment method has been successfully updated. It may take up to 24 hours to be reflected on your account.",
    numberLabel: "Auto Pay Confirmation Number",
  },
  "autopay-deactivated": {
    message: "You have deactivated Sparklight Auto Pay. It may take up to 24 hours to be reflected on your account.",
    numberLabel: "Auto Pay Confirmation Number",
  },
  "payment-submitted": {
    title: "Payment Successful!",
    message: "Your payment has been received. It may take up to 24 hours to be reflected on your account.",
    numberLabel: "Payment Confirmation Number",
  },
};

const PaymentConfirmationScreen = ({ navigation, route }) => {
  const kind = route.params?.kind || "";
  const headerTitle = route.params?.headerTitle || "Billing Details";
  const copy = KIND_COPY[kind] || null;
  const successTitle = copy?.title || "Success!";
  const message = route.params?.message || copy?.message || "";
  const confirmationNumber = route.params?.confirmationNumber || "";
  const email = route.params?.email || "";
  const [nextAction, setNextAction] = useState(route.params?.nextAction || null);
  const titleRef = useRef(null);

  useEffect(() => {
    announceA11y(`Success. ${message}`);
    setFocusToRef(titleRef, { delay: 600 });
  }, [message]);

  // Journey complete: close out the attempt so a follow-up flow gets a fresh id,
  // but keep this attempt's id on the confirmation dwell so the journey stays whole.
  useFocusEffect(
    useCallback(() => {
      const attemptId = currentPaymentAttempt();
      endPaymentAttempt();
      const startedAt = Date.now();
      return () => trackStepDuration("confirmation", startedAt, attemptId);
    }, [])
  );

  const messageParts = message.split(/(\$[\d,]+\.?\d*)/g);

  const followUp =
    nextAction?.type === "payBalance"
      ? {
          title: "Your balance is still due",
          message: `Auto Pay starts next cycle and won't cover your current balance of ${formatCurrency(
            nextAction.amount
          )}. Pay it now to avoid late fees.`,
          ctaLabel: "Pay Balance Now",
          onPress: () =>
            navigation.navigate("MakePaymentReview", {
              amount: nextAction.amount,
              methodId: nextAction.methodId,
              fromOffer: true,
              headerTitle: "Make a Payment",
              paymentType: "due",
            }),
        }
      : nextAction?.type === "setupAutoPay"
      ? {
          title: "Put your payments on autopilot",
          message: "Use this same payment method for Auto Pay and never miss a due date.",
          ctaLabel: "Set Up Auto Pay",
          onPress: () =>
            navigation.navigate("AutoPayReview", {
              mode: "enroll",
              methodId: nextAction.methodId,
              fromOffer: true,
              headerTitle: "Set Up Auto Pay",
              entryPoint: "payment_confirmation",
            }),
        }
      : null;

  return (
    <View style={styles.container}>
      <ProfileSettingsHeader title={headerTitle} onPressBack={() => navigation.popToTop()} />
      <ScrollView contentContainerStyle={[styles.content, contentMaxWidth]} showsVerticalScrollIndicator={false}>
        <View style={[card.elevated, styles.successCard]}>
          <View style={styles.iconWrap} accessible={false} importantForAccessibility="no-hide-descendants">
            <AnimatedSuccessIcon size={64} />
          </View>
          <HeadingH2 ref={titleRef} style={styles.title} accessibilityRole="header" accessibilityLevel={1}>
            {successTitle}
          </HeadingH2>
          {!!message && (
            <Text style={styles.message}>
              {messageParts.map((part, index) =>
                /^\$[\d,]/.test(part) ? (
                  <Text key={index} style={styles.messageAmount}>
                    {part}
                  </Text>
                ) : (
                  part
                )
              )}
            </Text>
          )}
          {!!confirmationNumber && (
            <View
              style={styles.detailBlock}
              accessible
              accessibilityLabel={`${copy?.numberLabel || "Confirmation Number"}, ${confirmationNumber.split("").join(" ")}`}
            >
              <FieldTitle style={styles.detailLabel}>{copy?.numberLabel || "Confirmation Number"}</FieldTitle>
              <FieldContent style={styles.detailValue}>{confirmationNumber}</FieldContent>
            </View>
          )}
          {!!email && (
            <View style={styles.detailBlock} accessible accessibilityLabel={`Email confirmation sent to ${email}`}>
              <FieldTitle style={styles.detailLabel}>Email Confirmation Sent to</FieldTitle>
              <FieldContent style={styles.detailValue}>{email}</FieldContent>
            </View>
          )}
        </View>


        {!!followUp && (
          <NextActionCard
            title={followUp.title}
            message={followUp.message}
            ctaLabel={followUp.ctaLabel}
            onPress={followUp.onPress}
            onDismiss={() => setNextAction(null)}
          />
        )}

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F7F7" },
  content: { padding: 20, paddingBottom: 140 },
  successCard: { paddingVertical: 32, paddingHorizontal: 16, alignItems: "center", marginTop: 16 },
  iconWrap: { marginBottom: 20 },
  title: {
    textAlign: "center",
    marginBottom: 8,
  },
  message: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.RadioCanadaRegular,
    color: Color.colorGray_200,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 8,
  },
  messageAmount: { fontFamily: FontFamily.RadioCanadaSemiBold, fontWeight: "700" },
  detailBlock: { alignSelf: "stretch", marginTop: 24 },
  detailLabel: { marginBottom: 8 },
  detailValue: {},
});

export default PaymentConfirmationScreen;
