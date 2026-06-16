// [51768] Reusable two-button confirm dialog. Replaces native Alert.alert (which iOS renders tiny on iPad).
import React from "react";
import { Modal, View, Text, StyleSheet } from "react-native";
import Touchable from "./Touchable";
import { modalOverlay } from "../../../styles/utilities";
import { MODAL_MAX_WIDTH } from "../../../utils/responsive";
import colors from "../../../res/Colors";
import { FontFamily } from "../../../../GlobalStyles";

const ConfirmDialog = ({
  visible,
  title,
  message,
  confirmText = "OK",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) => (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
    <View style={styles.overlay}>
      <View style={styles.card}>
        {!!title && <Text style={styles.title}>{title}</Text>}
        {!!message && <Text style={styles.message}>{message}</Text>}
        <View style={styles.actions}>
          <Touchable
            style={[styles.btn, styles.cancelBtn]}
            onPress={onCancel}
            accessibilityRole="button"
            accessibilityLabel={cancelText}
          >
            <Text style={styles.cancelText}>{cancelText}</Text>
          </Touchable>
          <Touchable
            style={[styles.btn, styles.confirmBtn]}
            onPress={onConfirm}
            accessibilityRole="button"
            accessibilityLabel={confirmText}
          >
            <Text style={styles.confirmText}>{confirmText}</Text>
          </Touchable>
        </View>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  overlay: modalOverlay,
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    width: "85%",
    maxWidth: MODAL_MAX_WIDTH,
  },
  title: {
    fontFamily: FontFamily.openSansRegular,
    fontSize: 20,
    fontWeight: "600",
    color: colors.black,
    textAlign: "center",
  },
  message: {
    fontFamily: FontFamily.openSansRegular,
    fontSize: 16,
    color: colors.darkest_grey,
    textAlign: "center",
    lineHeight: 24,
    marginTop: 12,
  },
  actions: {
    flexDirection: "row",
    marginTop: 24,
    gap: 12,
  },
  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtn: {
    backgroundColor: "#F2F2F7",
  },
  confirmBtn: {
    backgroundColor: colors.sparklight_purple_blue,
  },
  cancelText: {
    fontFamily: FontFamily.openSansRegular,
    fontSize: 16,
    fontWeight: "600",
    color: colors.sparklight_purple_blue,
  },
  confirmText: {
    fontFamily: FontFamily.openSansRegular,
    fontSize: 16,
    fontWeight: "600",
    color: colors.snow_white,
  },
});

export default ConfirmDialog;
