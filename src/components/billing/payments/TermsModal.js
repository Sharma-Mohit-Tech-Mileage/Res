import React, { useEffect, useRef } from "react";
import { View, Text, Modal, ScrollView, StyleSheet, Pressable, Animated, Easing, useWindowDimensions } from "react-native";
import Touchable from "../../common/customui/Touchable";
import CloseIcon from "../../../res/svgIcons/CloseIcon";
import { Color, FontFamily, FontSize } from "../../../../GlobalStyles";
import { setFocusToRef } from "../../../utils/a11y";
import { LAYOUT } from "../../../utils/responsive";

const TERMS_COPY = `By clicking 'Submit,' I authorize Sparklight to charge the payment method I specified for the full amount due in my monthly billing statement, including monthly service fees, installation and equipment charges, and any applicable taxes or government fees. If I set up recurring payments, this authorization is to remain in effect until this authorization is canceled by me, my bank, or Sparklight. I may cancel this authorization, or change the payment method to be charged, via the online Bill Pay Center or by calling Sparklight customer service at 1-877-692-2253 (between the hours of 8 a.m. and 5 p.m., local time) at least three banking days before the due date on my billing statement. It is my responsibility to keep my payment method information current, and Sparklight may obtain updated information from my bank. In the event that a payment is returned for insufficient funds, I authorize Sparklight to electronically debit my bank account for the original amount of the transaction, as well as a returned item fee, up to the maximum amount allowed by law.`;


const TermsModal = ({ visible, onClose }) => {
  const titleRef = useRef(null);
  const { height: windowHeight } = useWindowDimensions();
  const slideY = useRef(new Animated.Value(windowHeight)).current;

  useEffect(() => {
    if (visible) {
      slideY.setValue(windowHeight);
      Animated.timing(slideY, { toValue: 0, duration: 280, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
      setFocusToRef(titleRef, { delay: 350 });
    }
  }, [visible, slideY, windowHeight]);

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.backdropWrap}>
        <Pressable
          style={styles.backdrop}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Dismiss Terms and Conditions"
        />
        <Animated.View style={[styles.sheet, { transform: [{ translateY: slideY }] }]} accessibilityViewIsModal importantForAccessibility="yes">
          <View style={styles.dragHandle} accessible={false} importantForAccessibility="no" />
          <View style={styles.titleRow}>
            <Text ref={titleRef} style={styles.title} accessibilityRole="header" accessibilityLevel={2}>
              Terms & Conditions
            </Text>
            <Touchable
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Close Terms and Conditions"
              style={styles.closePress}
            >
              <CloseIcon width={24} height={24} color={Color.colorGray_200} />
            </Touchable>
          </View>
          <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator>
            <Text style={styles.termsText}>{TERMS_COPY}</Text>
          </ScrollView>
        </Animated.View>
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
    paddingTop: 8,
    paddingBottom: 34,

    maxHeight: "80%",
    overflow: "hidden",
    width: "100%",
    maxWidth: LAYOUT.maxContentWidth,
    alignSelf: "center",
  },
  dragHandle: {
    alignSelf: "center",
    width: 48,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#D0D5DD",
    marginBottom: 12,
  },
  titleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  title: {
    fontSize: FontSize.size_20,
    fontFamily: FontFamily.RadioCanadaSemiBold,
    fontWeight: "600",
    color: Color.colorGray_200,
    flexShrink: 1,
    marginRight: 8,
  },
  closePress: { padding: 4 },

  scrollArea: { flexGrow: 0, flexShrink: 1, marginBottom: 8, marginRight: -20 },
  scrollContent: { paddingRight: 20 },
  termsText: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.RadioCanadaRegular,
    color: Color.colorGray_200,
    lineHeight: 24,
  },
});

export default TermsModal;
