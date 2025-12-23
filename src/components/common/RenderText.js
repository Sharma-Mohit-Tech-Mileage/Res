import React, { useState, useEffect } from "react";
import { Text, StyleSheet, AccessibilityInfo } from "react-native";
import { FontFamily, Color } from "../../../GlobalStyles";

// ==================== HELPER FUNCTIONS ====================

/**
 * Processes text and highlights email addresses
 */
const processEmailHighlighting = (text) => {
  if (!text) return [];

  const emailRegex = /[\w.-]+@[\w.-]+\.\w+/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = emailRegex.exec(text)) !== null) {
    // Add text before email
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    // Add highlighted email
    parts.push(
      <Text
        key={`email-${match.index}`}
        style={styles.emailText}
        accessibilityLabel={`Email address ${match[0]}`}
      >
        {match[0]}
      </Text>
    );

    lastIndex = emailRegex.lastIndex;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts;
};

/**
 * Splits instruction text based on splitKey
 */
const splitInstruction = (instruction, splitKey) => {
  if (!instruction?.includes(splitKey)) {
    return { firstPart: instruction, secondPart: "", hasSplit: false };
  }

  const parts = instruction.split(splitKey);
  return {
    firstPart: parts[0],
    secondPart: parts[1],
    hasSplit: true,
  };
};

/**
 * Formats text for notification display (adds line break before "Please")
 */
const formatNotificationText = (text, isFromNotification) => {
  return isFromNotification ? text.replace("Please", "\nPlease") : text;
};

// ==================== MAIN COMPONENT ====================

const RenderText = ({
  instruction = "",
  navigation,
  splitKey = "",
  style,
  internalTextStyle,
  onTextPress = () => {},
  isFromNotification = false,
}) => {
  const [screenReaderEnabled, setScreenReaderEnabled] = useState(false);

  const { firstPart, secondPart, hasSplit } = splitInstruction(
    instruction,
    splitKey
  );

  // ==================== EFFECTS ====================

  useEffect(() => {
    const checkAccessibility = async () => {
      try {
        const isEnabled = await AccessibilityInfo.isScreenReaderEnabled();
        setScreenReaderEnabled(isEnabled);
      } catch (error) {
        console.error("AccessibilityInfo error:", error.message);
        setScreenReaderEnabled(false);
      }
    };

    checkAccessibility();

    const subscription = AccessibilityInfo.addEventListener(
      "screenReaderChanged",
      setScreenReaderEnabled
    );

    return () => subscription.remove();
  }, []);

  // ==================== RENDER HELPERS ====================

  const renderLinkText = () => {
    return (
      <Text
        accessible={true}
        accessibilityRole="link"
        accessibilityLabel={`${splitKey} link`}
        accessibilityHint="Double tap to contact support for more information"
        style={[styles.linkText, internalTextStyle]}
        onPress={onTextPress}
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
      >
        {splitKey}
      </Text>
    );
  };

  const renderWithSplit = () => {
    const formattedFirstPart = formatNotificationText(
      firstPart,
      isFromNotification
    );

    if (screenReaderEnabled) {
      // Screen reader mode: parent container non-accessible, children individually accessible
      return (
        <Text 
          style={[styles.instructionText, style]}
          accessible={false}
          importantForAccessibility="no-hide-descendants"
        >
          <Text 
            accessible={true}
            accessibilityRole="text"
          >
            {processEmailHighlighting(formattedFirstPart)}
          </Text>
          <Text
            accessible={true}
            accessibilityRole="link"
            accessibilityLabel={`${splitKey} link`}
            accessibilityHint="Double tap to contact support for more information"
            onPress={onTextPress}
            style={[styles.linkText, internalTextStyle]}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          >
            {splitKey}
          </Text>
          <Text 
            accessible={true}
            accessibilityRole="text"
          >
            {processEmailHighlighting(secondPart)}
          </Text>
        </Text>
      );
    }

    // Normal mode: parent non-accessible, link individually accessible
    return (
      <Text 
        style={[styles.instructionText, style]}
        accessible={false}
        importantForAccessibility="no-hide-descendants"
      >
        <Text importantForAccessibility="no">
          {processEmailHighlighting(formattedFirstPart)}
        </Text>
        {renderLinkText()}
        {secondPart?.length > 0 && (
          <Text importantForAccessibility="no">
            {processEmailHighlighting(secondPart)}
          </Text>
        )}
      </Text>
    );
  };

  const renderWithoutSplit = () => {
    return (
      <Text
        style={[styles.instructionText, style]}
        accessible={true}
        accessibilityRole="text"
      >
        {processEmailHighlighting(instruction)}
      </Text>
    );
  };

  // ==================== RENDER ====================

  return hasSplit ? renderWithSplit() : renderWithoutSplit();
};

// ==================== STYLES ====================

const styles = StyleSheet.create({
  instructionText: {
    paddingLeft: 10,
    paddingRight: 6,
    color: Color.sparklightGray1,
    fontFamily: FontFamily.openSansRegular,
    fontSize: 16,
    fontWeight: "400",
  },
  linkText: {
    color: Color.colorMidnightblue,
    fontFamily: FontFamily.openSansSemiBold,
    fontSize: 16,
    fontWeight: "700",
    paddingLeft: 5,
    textDecorationLine: "underline",
  },
  emailText: {
    fontWeight: "700",
    color: Color.colorMidnightblue,
  },
});

export default RenderText;