import React, { useEffect, useRef } from "react";
import { View, Text, Modal, StyleSheet, Pressable } from "react-native";
import { Color, FontFamily, FontSize, Border } from "../../../../GlobalStyles";
import { A11Y } from "../../../styles/theme";
import Touchable from "../../common/customui/Touchable";
import CancelButton from "../../common/customui/CancelButton";
import { setFocusToRef } from "../../../utils/a11y";
import {SectionTitle,SectionContent} from "../../common/customui/Typography";

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
        <View style={styles.sheet} accessibilityViewIsModal importantForAccessibility="yes">
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
          <CancelButton title={cancelLabel} onPress={onCancel} accessibilityLabel={cancelLabel} />
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
  destructiveButton: { backgroundColor: "#B92A1C" },
  confirmText: {
    color: "#FFFFFF",
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.RadioCanadaSemiBold,
    fontWeight: "600",
  },
});

export default ConfirmActionModal;
