import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Linking,
} from "react-native";
import AlertIcon from "../../res/svgIcons/AlertIconV2";
import { FontFamily,Color } from "../../../GlobalStyles";

import Touchable from "./customui/Touchable";
import PrimaryButton from "./customui/PrimaryButton";
import { getAnalytics, setUserId, setUserProperty } from "@react-native-firebase/analytics";


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

  // Login failed, so clear the analytics identifier left from the previous session.
  const handleClose = () => {
    try {
      setUserId(getAnalytics(), null).catch(() => {});
      setUserProperty(getAnalytics(), "Sparklight_user_id", null).catch(() => {});
    } catch (_) {}
    globalErrorManager.hide();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.alertContainer}>
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
            onPress={handleClose}
            accessibilityLabel="Close"
            style={[ { marginTop: 24 }]}
            accessibilityHint="Double tap to close the error modal"
          />
        </View>
      </View>
    </Modal>
  );
}
           
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
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
    color: Color.colorblack_100,
    fontFamily: FontFamily.RadioCanadaRegular,
    textAlign: "center",
  },
  messageContainer: {
    width: "100%",
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  message: {
    color: Color. colorGray_200,
    fontFamily: FontFamily.RadioCanadaRegular,
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 28,
    textAlign: "left",
  },
  // Using EXACT button styles from CustomAlertModal
  closeBtn: {
    backgroundColor: Color.Gray300,
    paddingHorizontal: 30,
    paddingVertical: 10,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  closeAlertTxt: {
    color: Color.colorMidnightblue,
    fontWeight: "400",
    fontFamily: FontFamily.RadioCanadaRegular,
    textAlign: "center",
    fontSize: 16,
  },
  phoneNumber: {
    color: Color.sparklightPrimaryPurple,
    fontWeight: "700",
    textDecorationLine: "underline",
  },
});