import React, { useEffect, useRef, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import ProfileSettingsHeader from "../../common/ProfileSettingsHeader";
import PrimaryButton from "../../common/customui/PrimaryButton";
import NextActionCard from "./NextActionCard";
import AnimatedSuccessIcon from "./AnimatedSuccessIcon";
import { Color, FontFamily, FontSize } from "../../../../GlobalStyles";
import { card } from "../../../styles/utilities";
import { contentMaxWidth, formatCurrency } from "./paymentsShared";
import { setFocusToRef, announceA11y } from "../../../utils/a11y";

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

// Figma: shared success screen — one completed action, one optional follow-up offer (one hop max)
const PaymentConfirmationScreen = ({ navigation, route }) => {
  const kind = route.params?.kind || "";
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

  // Figma: dollar amounts inside the success message render bold
  const messageParts = message.split(/(\$[\d,]+\.?\d*)/g);
  const showBackToBilling = kind !== "autopay-activated" && kind !== "autopay-updated";

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
            }),
        }
      : null;

  return (
    <View style={styles.container}>
      <ProfileSettingsHeader title="Billing Details" onPressBack={() => navigation.popToTop()} />
      <ScrollView contentContainerStyle={[styles.content, contentMaxWidth]} showsVerticalScrollIndicator={false}>
        <View style={[card.elevated, styles.successCard]}>
          <View style={styles.iconWrap} accessible={false} importantForAccessibility="no-hide-descendants">
            <AnimatedSuccessIcon size={64} />
          </View>
          <Text ref={titleRef} style={styles.title} accessibilityRole="header" accessibilityLevel={1}>
            {successTitle}
          </Text>
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
              <Text style={styles.detailLabel}>{copy?.numberLabel || "Confirmation Number"}</Text>
              <Text style={styles.detailValue}>{confirmationNumber}</Text>
            </View>
          )}
          {!!email && (
            <View style={styles.detailBlock} accessible accessibilityLabel={`Email confirmation sent to ${email}`}>
              <Text style={styles.detailLabel}>Email Confirmation Sent to</Text>
              <Text style={styles.detailValue}>{email}</Text>
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

        {showBackToBilling && (
          <PrimaryButton
            title="Back to Billing"
            buttonType="submit"
            accessibilityLabel="Back to Billing"
            onPress={() => navigation.popToTop()}
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F7F7" },
  content: { padding: 20, paddingBottom: 80 },
  successCard: { padding: 24, alignItems: "center", marginTop: 16 },
  iconWrap: { marginBottom: 16 },
  title: {
    fontSize: FontSize.size_20,
    fontFamily: FontFamily.openSansSemiBold,
    fontWeight: "700",
    color: Color.colorGray_100,
    textAlign: "center",
    marginBottom: 8,
  },
  message: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.openSansRegular,
    color: Color.colorGray_200,
    textAlign: "center",
    lineHeight: 22,
  },
  messageAmount: { fontFamily: FontFamily.openSansSemiBold, fontWeight: "700" },
  detailBlock: { alignSelf: "stretch", marginTop: 16 },
  detailLabel: {
    fontSize: FontSize.size_sm,
    fontFamily: FontFamily.openSansRegular,
    color: Color.sparklightGray1,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.openSansSemiBold,
    fontWeight: "700",
    color: Color.colorGray_200,
  },
});

export default PaymentConfirmationScreen;
