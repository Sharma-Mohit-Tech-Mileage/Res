import React, { useEffect, useRef } from "react";
import { View, Text, Modal, StyleSheet, Pressable } from "react-native";
import { Color, FontFamily, FontSize, Border } from "../../../styles/GlobalStyles";
import { A11Y } from "../../../styles/theme";
import Touchable from "../../common/customui/Touchable";
import { setFocusToRef } from "../../../utils/a11y";
import {SectionTitle,SectionContent,Hyperlink} from "../../common/customui/Typography";
import ModalCard from "../../common/customui/ModalCard";
import { LAYOUT } from "../../../utils/responsive";

const ConfirmActionModal = ({
  visible,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  onConfirm,
  onCancel,
}) => {
  const titleRef = useRef(null);

  useEffect(() => {
    if (visible) setFocusToRef(titleRef, { delay: 350 });
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.backdropWrap}>
        <Pressable
          style={styles.backdrop}
          onPress={onCancel}
          accessibilityRole="button"
          accessibilityLabel={`Dismiss, ${cancelLabel}`}
        />
        <ModalCard style={styles.sheet} accessibilityViewIsModal importantForAccessibility="yes" maxWidth={LAYOUT.maxContentWidth}>
          <SectionTitle ref={titleRef} style={styles.title} accessibilityRole="header" accessibilityLevel={2}>
            {title}
          </SectionTitle>
          {!!message && <SectionContent style={styles.message}>{message}</SectionContent>}
          <Touchable
            style={[styles.confirmButton, destructive && styles.destructiveButton]}
            onPress={onConfirm}
            accessibilityLabel={confirmLabel}
          >
            <Text style={styles.confirmText}>{confirmLabel}</Text>
          </Touchable>
          <Touchable style={styles.cancelButton} onPress={onCancel} accessibilityLabel={cancelLabel}>
            <Hyperlink >{cancelLabel}</Hyperlink>
          </Touchable>
        </ModalCard>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdropWrap: { flex: 1, justifyContent: "flex-end" },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.5)" },
  sheet: {
    backgroundColor: Color.sparklightWhite,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 34,
  },
  title: {
    marginBottom: 8,
  },
  message: {
    marginBottom: 20,
  },
  confirmButton: {
    minHeight: A11Y.minTouch,
    borderRadius: Border.br_81xl,
    backgroundColor: Color.colorMidnightblue,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  destructiveButton: { backgroundColor: Color.errorText },
  confirmText: {
    color: Color.sparklightWhite,
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.RadioCanadaSemiBold,
    fontWeight: "600",
  },
  cancelButton: {
    minHeight: A11Y.minTouch,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelText: {
    color: Color.colorMidnightblue,
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.RadioCanadaSemiBold,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});

export default ConfirmActionModal;
