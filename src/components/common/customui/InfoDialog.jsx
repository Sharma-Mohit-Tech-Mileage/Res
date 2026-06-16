// [51768] Reusable one-button info/error dialog. Replaces native Alert.alert (which iOS renders tiny on iPad).
import React from "react";
import { Modal, View, Text, StyleSheet } from "react-native";
import Touchable from "./Touchable";
import { modalOverlay } from "../../../styles/utilities";
import { MODAL_MAX_WIDTH } from "../../../utils/responsive";
import colors from "../../../res/Colors";
import { FontFamily } from "../../../../GlobalStyles";

const InfoDialog = ({ visible, title, message, buttonText = "OK", onClose }) => (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
    <View style={styles.overlay}>
      <View style={styles.card}>
        {!!title && <Text style={styles.title}>{title}</Text>}
        {!!message && <Text style={styles.message}>{message}</Text>}
        <Touchable
          style={styles.btn}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel={buttonText}
        >
          <Text style={styles.btnText}>{buttonText}</Text>
        </Touchable>
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
  btn: {
    marginTop: 24,
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.sparklight_purple_blue,
  },
  btnText: {
    fontFamily: FontFamily.openSansRegular,
    fontSize: 16,
    fontWeight: "600",
    color: colors.snow_white,
  },
});

export default InfoDialog;
