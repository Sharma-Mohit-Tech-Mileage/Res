import React, { useState, useEffect } from "react";
import { Text, StyleSheet, AccessibilityInfo } from "react-native";
import { FontFamily, Color } from "../../../GlobalStyles";

const processText = (text) => {
  const emailRegex = /[\w.-]+@[\w.-]+\.\w+/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = emailRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    parts.push(
      <Text style={{ fontWeight: 'bold',color:Color.colorMidnightblue }} key={`email-${match.index}`}>
        {match[0]}
      </Text>
    );
    lastIndex = emailRegex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  return parts;
};

export default RenderText = ({
  instruction,
  navigation,
  splitKey = '',
  style,
  internalTextStyle,
  onTextPress = () => { },
  isFromNotification = false
}) => {

  const [screenReaderEnabled, setIsScreenReaderEnabled] = useState(false);

  let instructionFirstPart = '';
  let instructionSecondPart = '';
  if (instruction?.includes(splitKey)) {
    instructionFirstPart = instruction.split(splitKey)[0];
    instructionSecondPart = instruction.split(splitKey)[1];
  }

  useEffect(() => {
    async function getAccessibility() {
      try {
        const accessibility = await AccessibilityInfo.isScreenReaderEnabled();
        setIsScreenReaderEnabled(accessibility);
      } catch (error) {
        console.log(
          "There has been a problem with AccessibilityInfo.isScreenReaderEnabled(): " +
          error.message
        );
        setIsScreenReaderEnabled(false);
      }
    }
    getAccessibility();
    const reduceMotionChangedSubscription = AccessibilityInfo.addEventListener(
      "screenReaderChanged",
      (isScreenReaderEnabled) => {
        setIsScreenReaderEnabled(isScreenReaderEnabled);
      }
    );
    return () => {
      reduceMotionChangedSubscription.remove();
    };
  }, [screenReaderEnabled]);

  if (screenReaderEnabled) {
    return (
      instruction?.includes(splitKey)
        ?
        <Text
          style={[styles.instructionText, style]}
          accessible={true}
          accessibilityLabel={`${instructionFirstPart} ${splitKey} link ${instructionSecondPart}`}
          onPress={() => onTextPress()}
        >
          {processText(isFromNotification ? instructionFirstPart.replace('Please', '\nPlease') : instructionFirstPart)}
          <Text
            accessibilityLabel="Contact us for more information"
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
            style={[styles.linkText, internalTextStyle]}
          >
            {`${splitKey}`}
          </Text>
          {processText(instructionSecondPart)}
        </Text>
        :
        <Text style={[styles.instructionText, style]}>
          {processText(instruction)}
        </Text>
    )
  }
  else {
    return (
      instruction.includes(splitKey) ?
        <Text style={[styles.instructionText, style]}>
          {processText(isFromNotification ? instructionFirstPart.replace('Please', '\nPlease') : instructionFirstPart)}
          <Text
            accessible={true}
            accessibilityRole="link"
            accessibilityLabel="Contact us for more information"
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
            style={[styles.linkText, internalTextStyle]}
            onPress={() => {
              onTextPress()
            }}
          >
            {`${splitKey}`}
          </Text>
          {instructionSecondPart?.length > 0 ? processText(instructionSecondPart) : null}
        </Text>
        :
        <Text style={[styles.instructionText, style]}>
          {processText(instruction)}
        </Text>
    )
  }
};

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
    fontStyle: "normal",
    fontWeight: "700",
    paddingLeft: 5,
    flexWrap: "wrap",
  },
});