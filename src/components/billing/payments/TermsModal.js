import React, { useEffect, useRef } from "react";
import { View, Text, Modal, ScrollView, StyleSheet, Pressable } from "react-native";
import PrimaryButton from "../../common/customui/PrimaryButton";
import { Color, FontFamily, FontSize } from "../../../../GlobalStyles";
import { setFocusToRef } from "../../../utils/a11y";

// Placeholder copy until the portal team hands over the final AutoPay terms content
const PLACEHOLDER_TERMS = `By enrolling in Sparklight Auto Pay, you authorize Sparklight to automatically charge your selected payment method for your full account balance on your bill due date each month.

Payments will continue until you deactivate Auto Pay. You can update your payment method or deactivate Auto Pay at any time from the Billing section of the app.

If a scheduled payment fails, you remain responsible for paying your balance by the due date to avoid late fees or service interruption. Changes made within 24 hours of your due date may not apply until the next billing cycle.

Standard account terms, conditions, and privacy policies apply.`;

const TermsModal = ({ visible, onClose }) => {
  const titleRef = useRef(null);

  useEffect(() => {
    if (visible) setFocusToRef(titleRef, { delay: 350 });
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdropWrap}>
        <Pressable
          style={styles.backdrop}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Dismiss Terms and Conditions"
        />
        <View style={styles.sheet} accessibilityViewIsModal importantForAccessibility="yes">
          <Text ref={titleRef} style={styles.title} accessibilityRole="header" accessibilityLevel={2}>
            Terms & Conditions
          </Text>
          <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator>
            <Text style={styles.termsText}>{PLACEHOLDER_TERMS}</Text>
          </ScrollView>
          <PrimaryButton title="Close" buttonType="submit" accessibilityLabel="Close Terms and Conditions" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdropWrap: { flex: 1, justifyContent: "flex-end" },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.5)" },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 34,
    maxHeight: 560,
    width: "100%",
    maxWidth: 640,
    alignSelf: "center",
  },
  title: {
    fontSize: FontSize.size_lg,
    fontFamily: FontFamily.openSansSemiBold,
    fontWeight: "600",
    color: Color.colorGray_100,
    marginBottom: 12,
  },
  scrollArea: { flexGrow: 0, marginBottom: 8 },
  termsText: {
    fontSize: FontSize.size_sm,
    fontFamily: FontFamily.openSansRegular,
    color: Color.colorGray_200,
    lineHeight: 21,
  },
});

export default TermsModal;
