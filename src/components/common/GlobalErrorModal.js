import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Linking,
} from "react-native";
import AlertIcon from "../../res/svgIcons/AlertIconV2";
import { FontFamily } from "../../../GlobalStyles";
import colors from "../../res/Colors";
import Touchable from "./customui/Touchable";
import PrimaryButton from "./customui/PrimaryButton";
import ModalCard from "./customui/ModalCard";
import ModalOverlay from "./customui/ModalOverlay";


// Simple error manager
class ErrorManager {
  listeners = [];

  show() {
    this.listeners.forEach((listener) => listener(true));
  }

  hide() {
    this.listeners.forEach((listener) => listener(false));
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }
}

export const globalErrorManager = new ErrorManager();

const SUPPORT_NUMBER_RAW = "18776922253";
const SUPPORT_NUMBER_DISPLAY = "1-877-692-2253";

export const GlobalErrorModal = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => globalErrorManager.subscribe(setVisible), []);

  if (!visible) return null;

  const dialSupport = () => Linking.openURL(`tel:${SUPPORT_NUMBER_RAW}`);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => globalErrorManager.hide()}
    >
      <ModalOverlay>
        <ModalCard style={styles.alertContainer}>
          <View style={styles.iconWrapper}>
            <AlertIcon />
          </View>

          <Text style={styles.alertTitle}>Login Unavailable</Text>

          <View style={styles.messageContainer}>
            <Touchable
              accessible={true}
              accessibilityRole="link"
              accessibilityLabel="We apologize but due to technical issues, we are unable to log in at this time. Please call 1 8 7 7 6 9 2 2 2 5 3 for further assistance."
              accessibilityHint="Double tap to call support"
              accessibilityActions={[{ name: "activate", label: `Call ${SUPPORT_NUMBER_DISPLAY}` }]}
              onAccessibilityAction={({ nativeEvent }) => {
                if (nativeEvent.actionName === "activate") dialSupport();
              }}
              onPress={dialSupport}
            >
              <Text style={styles.message}>
                We apologize but due to technical issues, we are unable to log in
                at this time. Please call{" "}
                <Text style={styles.phoneNumber}>{SUPPORT_NUMBER_DISPLAY}</Text>{" "}
                for further assistance.
              </Text>
            </Touchable>
          </View>

          <PrimaryButton
            title="Close"
            buttonType="cancel"
            onPress={() => globalErrorManager.hide()}
            accessibilityLabel="Close"
            style={[ { marginTop: 24 }]}
            accessibilityHint="Double tap to close the error modal"
          />
        </ModalCard>
      </ModalOverlay>
    </Modal>
  );
}
           
const styles = StyleSheet.create({
  alertContainer: {
    backgroundColor: "white",
    padding: 24,
    borderRadius: 8,
    alignItems: "center",
    width: "90%",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  iconWrapper: { marginBottom: 16 },
  alertTitle: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 20,
    color: colors.black,
    fontFamily: FontFamily.RadioCanadaRegular,
    textAlign: "center",
  },
  messageContainer: {
    width: "100%",
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  message: {
    color: colors.darkest_grey,
    fontFamily: FontFamily.RadioCanadaRegular,
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 28,
    textAlign: "left",
  },
  // Using EXACT button styles from CustomAlertModal
  closeBtn: {
    backgroundColor: colors.backgound_blue,
    paddingHorizontal: 30,
    paddingVertical: 10,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  closeAlertTxt: {
    color: colors.sparklight_purple_blue,
    fontWeight: "400",
    fontFamily: FontFamily.RadioCanadaRegular,
    textAlign: "center",
    fontSize: 16,
  },
  phoneNumber: {
    color: colors.sparklight_bright_purple,
    fontWeight: "700",
    textDecorationLine: "underline",
  },
});