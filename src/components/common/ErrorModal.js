import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Linking,
  AccessibilityInfo,
} from "react-native";
import { FontFamily, Border, Color, Padding } from "../../../GlobalStyles";

import AlertIcon from "../../res/svgIcons/AlertIcon";
import Touchable from "./customui/Touchable";
import { A11Y } from "../../styles/theme";

export const ErrorType = {
  NETWORK_ERROR: "NETWORK_ERROR",
  AUTH_TIMEOUT: "AUTH_TIMEOUT",
  BROWSER_UNAVAILABLE: "BROWSER_UNAVAILABLE",
  USER_CANCELLED: "USER_CANCELLED",
  API_ERROR: "API_ERROR",
  API_ERROR_204: "API_ERROR_204",
  ADMIN_PERMISSION: "ADMIN_PERMISSION",
  BUSINESS_ACCOUNT: "BUSINESS_ACCOUNT",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
};

const ERROR_MESSAGES = {
  [ErrorType.NETWORK_ERROR]: {
    title: "Connection Error",
    message: "Please check your internet connection and try again.",
    actions: [
      { label: "Retry", action: "RETRY", primary: true },
      { label: "Cancel", action: "CANCEL", primary: false },
    ],
  },
  [ErrorType.AUTH_TIMEOUT]: {
    title: "Login Timeout",
    message:
      "The login process took too long. This may happen if the browser did not open properly.",
    actions: [
      { label: "Try Again", action: "RETRY", primary: true },
      { label: "Cancel", action: "CANCEL", primary: false },
    ],
  },
  [ErrorType.BROWSER_UNAVAILABLE]: {
    title: "Browser Not Available",
    message:
      "Unable to open your browser for secure login. Please check your device settings.",
    actions: [
      { label: "Open Settings", action: "OPEN_SETTINGS", primary: true },
      { label: "Try Again", action: "RETRY", primary: false },
      { label: "Cancel", action: "CANCEL", primary: false },
    ],
  },
  [ErrorType.USER_CANCELLED]: {
    title: "Login Cancelled",
    message: "You cancelled the login process.",
    actions: [
      { label: "Try Again", action: "RETRY", primary: true },
      { label: "Cancel", action: "CANCEL", primary: false },
    ],
  },
  [ErrorType.API_ERROR]: {
    title: "Service Error",
    message:
      "We encountered an issue connecting to our services. Please try again.",
    actions: [
      { label: "Retry", action: "RETRY", primary: true },
      { label: "Cancel", action: "CANCEL", primary: false },
    ],
  },
  [ErrorType.API_ERROR_204]: {
    title: "Login Unavailable",
    message:
      "We're unable to complete your login right now due to a technical issue. Please try again or contact us at 877-692-2253 if the issue continues.",
    actions: [
      { label: "Retry", action: "RETRY", primary: true },
      { label: "Cancel", action: "CANCEL", primary: false },
    ],
  },
  [ErrorType.ADMIN_PERMISSION]: {
    title: "Access Denied",
    message: "Please sign in using your Primary Admin account to continue.",
    actions: [{ label: "Close", action: "CANCEL", primary: true }],
  },
  [ErrorType.BUSINESS_ACCOUNT]: {
  title: "App Mismatch Detected",
  message:
    "Only customers with Sparklight home internet services can use the MySparklight mobile app for account management. Please download the MySparklight Business mobile app to manage your Sparklight Business account.",
  actions: [
    {
      label: "Download Business App",
      action: "DOWNLOAD_BUSINESS_APP",
      primary: true,
    },
    { label: "Cancel", action: "CANCEL", primary: false },
  ],
},
  [ErrorType.UNKNOWN_ERROR]: {
    title: "Something Went Wrong",
    message:
      "An unexpected error occurred. Please try again or contact support if the issue persists.",
    actions: [
      { label: "Retry", action: "RETRY", primary: true },
      { label: "Cancel", action: "CANCEL", primary: false },
    ],
  },
};

const ErrorModal = ({ visible, errorType, onAction, customMessage }) => {
  const errorConfig =
    ERROR_MESSAGES[errorType] || ERROR_MESSAGES[ErrorType.UNKNOWN_ERROR];
  const displayMessage = customMessage || errorConfig.message;
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isScreenReaderEnabled().then(setIsScreenReaderEnabled);
    const sub = AccessibilityInfo.addEventListener(
      "screenReaderChanged",
      setIsScreenReaderEnabled
    );
    return () => sub?.remove?.();
  }, []);

  const PHONE_REGEX = /(\d{3}-\d{3}-\d{4})/g;

  const renderMessage = (message) => {
    const matches = message.match(PHONE_REGEX) || [];
    const phone = matches[0];
    if (!phone) {
      return <Text style={styles.message}>{message}</Text>;
    }
    const parts = message.split(PHONE_REGEX);
    const visibleText = (
      <Text style={styles.message}>
        {parts.map((part, index) =>
          PHONE_REGEX.test(part) ? (
            <Text
              key={index}
              style={[styles.message, styles.phoneLink]}
              onPress={isScreenReaderEnabled ? undefined : () => Linking.openURL(`tel:${part}`)}
            >
              {part}
            </Text>
          ) : (
            part
          )
        )}
      </Text>
    );
    if (!isScreenReaderEnabled) {
      return visibleText;
    }
    return (
      <Touchable
        minSize={0}
        onPress={() => Linking.openURL(`tel:${phone}`)}
        accessible={true}
        accessibilityRole="link"
        accessibilityLabel={message}
        accessibilityHint="Double tap to call"
      >
        <View
          accessibilityElementsHidden={true}
          importantForAccessibility="no-hide-descendants"
        >
          {visibleText}
        </View>
      </Touchable>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => onAction("CANCEL")}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <AlertIcon
              color={
                errorType === ErrorType.BUSINESS_ACCOUNT ? "#DD6D02" : undefined
              }
            />
            <Text style={styles.title}>{errorConfig.title}</Text>
          </View>

          <View style={styles.divider} />

          {renderMessage(displayMessage)}

          <View style={styles.buttonContainer}>
            {errorConfig.actions.map((action, index) => (
              <Touchable
                key={action.action}
                minSize={0}
                style={[
                  styles.button,
                  action.primary
                    ? styles.primaryButton
                    : styles.secondaryButton,
                  index > 0 && styles.buttonSpacing,
                ]}
                onPress={() => onAction(action.action)}
                accessibilityRole="button"
                accessibilityLabel={action.label}
              >
                <Text
                  style={[
                    styles.buttonText,
                    action.primary
                      ? styles.primaryButtonText
                      : styles.secondaryButtonText,
                  ]}
                >
                  {action.label}
                </Text>
              </Touchable>
            ))}
          </View>
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
  container: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: Border.br_5xs,
    width: "90%",
    maxWidth: 400,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: FontFamily.RadioCanadaRegular,
    color: Color.colorblack_100,
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "#F4F4F5",
    marginBottom: 15,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: FontFamily.RadioCanadaRegular,
    color: Color. colorGray_200,
    marginBottom: 20,
    textAlign: "center",
  },
  phoneLink: {
    color: Color.colorMidnightblue,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  buttonContainer: {
    gap: 8,
  },
  button: {
    alignSelf: "stretch",
    paddingVertical: Padding.p_base,
    paddingHorizontal: Padding.p_base,
    borderRadius: Border.br_81xl, // Adjust as needed
    minHeight: A11Y.minTouch,
    justifyContent: "center",
  },
  primaryButton: {
    backgroundColor: Color.sparklightPrimaryPurple,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
  },
  buttonSpacing: {
    marginTop: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: FontFamily.RadioCanadaBold,
  },
  primaryButtonText: {
    color: Color.sparklightWhite,
    
  },
  secondaryButtonText: {
    color: Color.sparklightPrimaryPurple,
    textDecorationLine: "underline",
    FontFamily: FontFamily.RadioCanadaBold,
  },
});

export default ErrorModal;
