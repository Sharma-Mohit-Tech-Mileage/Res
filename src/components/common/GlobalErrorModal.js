import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  AccessibilityInfo,
} from "react-native";
import AlertIcon from "../../res/svgIcons/AlertIconV2";
import { FontFamily } from "../../../GlobalStyles";
import colors from "../../res/Colors";

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
  const [srEnabled, setSrEnabled] = useState(false); // screen reader on/off

  useEffect(() => {
    const unsubscribe = globalErrorManager.subscribe(setVisible);

    // fetch current SR state
    AccessibilityInfo.isScreenReaderEnabled()
      .then(setSrEnabled)
      .catch(() => {});

    // subscribe to changes (RN new vs legacy API)
    const sub = AccessibilityInfo.addEventListener
      ? AccessibilityInfo.addEventListener("screenReaderChanged", setSrEnabled)
      : null;

    return () => {
      unsubscribe();
      // remove listener safely across RN versions
      if (sub && typeof sub.remove === "function") sub.remove();
    };
  }, []);

  if (!visible) return null;

  const dialSupport = () => Linking.openURL(`tel:${SUPPORT_NUMBER_RAW}`);

  // When screen reader is ON - entire text is clickable
  if (srEnabled) {
    return (
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => globalErrorManager.hide()}
      >
        <View style={styles.overlay}>
          <View style={styles.alertContainer}>
            {/* Alert Icon - centered like in new design */}
            <View style={styles.iconWrapper}>
              <AlertIcon />
            </View>

            <Text style={styles.alertTitle}>Login Unavailable</Text>

            <View style={styles.messageContainer}>
              <TouchableOpacity
                activeOpacity={0.7}
                accessible={true}
                accessibilityRole="link"
                accessibilityLabel="We apologize but due to technical issues, we are unable to log in at this time. Please call 1 8 7 7 6 9 2 2 2 5 3 for further assistance."
                accessibilityHint="Double tap to call support"
                onPress={dialSupport}
              >
                <Text style={styles.message}>
                  We apologize but due to technical issues, we are unable to log in
                  at this time. Please call{" "}
                  <Text style={styles.phoneNumber}>
                    {SUPPORT_NUMBER_DISPLAY}
                  </Text>{" "}
                  for further assistance.
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              accessibilityRole="button"
              style={[styles.closeBtn, { marginTop: 24 }]}
              onPress={() => globalErrorManager.hide()}
            >
              <Text style={styles.closeAlertTxt}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  // When screen reader is OFF - only phone number is clickable
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => globalErrorManager.hide()}
    >
      <View style={styles.overlay}>
        <View style={styles.alertContainer}>
          {/* Alert Icon - centered like in new design */}
          <View style={styles.iconWrapper}>
            <AlertIcon />
          </View>

          <Text style={styles.alertTitle}>Login Unavailable</Text>

          <View style={styles.messageContainer}>
            <Text style={styles.message}>
              We apologize but due to technical issues, we are unable to log in
              at this time. Please call{" "}
              <Text
                style={styles.phoneNumber}
                onPress={dialSupport}
              >
                {SUPPORT_NUMBER_DISPLAY}
              </Text>{" "}
              for further assistance.
            </Text>
          </View>

          <TouchableOpacity
            accessibilityRole="button"
            style={[styles.closeBtn, { marginTop: 24 }]}
            onPress={() => globalErrorManager.hide()}
          >
            <Text style={styles.closeAlertTxt}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

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
    borderRadius: 1,
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
    color: colors.sparklight_grey,
    fontFamily: FontFamily.openSansRegular,
    textAlign: "center",
  },
  messageContainer: {
    width: "100%",
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  message: {
    color: colors.darkest_grey,
    fontFamily: FontFamily.openSansRegular,
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
    fontFamily: FontFamily.openSansRegular,
    textAlign: "center",
    fontSize: 16,
  },
  phoneNumber: {
    color: colors.sparklight_purple_blue,
    fontWeight: "700",
    textDecorationLine: "underline",
  },
});