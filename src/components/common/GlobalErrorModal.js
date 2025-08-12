import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Platform,
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

export const GlobalErrorModal = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = globalErrorManager.subscribe(setVisible);
    return unsubscribe;
  }, []);

  if (!visible) return null;

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
                
                onPress={() => Linking.openURL("tel:18776922253")}
                accessibilityRole="link"
              >
                1-877-692-2253
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  iconWrapper: {
    marginBottom: 16,
  },
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
    textAlign: "left", // Left aligned as requested
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
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});
