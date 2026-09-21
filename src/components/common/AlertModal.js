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

// Shared presentation for errors and required updates. Callers own the actions.
const AlertModal = ({ visible, title, message, actions, onRequestClose, iconColor }) => {
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
          /^\d{3}-\d{3}-\d{4}$/.test(part) ? (
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
      onRequestClose={onRequestClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container} accessibilityViewIsModal={true}>
          <View style={styles.header}>
            <AlertIcon color={iconColor} />
            <Text accessibilityRole="header" style={styles.title}>{title}</Text>
          </View>

          <View style={styles.divider} />

          {renderMessage(message)}

          <View style={styles.buttonContainer}>
            {actions.map((action, index) => (
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
                onPress={action.onPress}
                accessibilityRole="button"
                accessibilityLabel={action.accessibilityLabel || action.label}
                accessibilityHint={action.accessibilityHint}
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
    flexShrink: 1,
    textAlign: "center",
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
    color: Color.colorGray_200,
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
    borderRadius: Border.br_81xl,
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
    textAlign: "center",
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
    fontFamily: FontFamily.RadioCanadaBold,
  },
});

export default AlertModal;
