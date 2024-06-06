import React, { useState, useEffect } from "react";
import {
  Text,
  StyleSheet,
  AccessibilityInfo
} from "react-native";
import { FontFamily, Color } from "../../../GlobalStyles";


export default RenderText = ({ instruction, navigation, splitKey = '' , style }) => {

  const [screenReaderEnabled, setIsScreenReaderEnabled] = useState(false);

  let instructionFirstPart = '';
  let instructionSecondPart = '';
  if (instruction.includes(splitKey)) {
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
        setIsScreenReaderEnabled(false); // Setting a default value in case of error
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
      instruction.includes(splitKey)
        ?
        <Text
          style={[styles.instructionText,style]}
          accessible={true}
          // accessibilityRole="link"
          accessibilityLabel={`${instructionFirstPart} ${splitKey} link ${instructionSecondPart}`}
          onPress={() => navigation.navigate("SupportStack", { isContactUs: true })}
        >
          {instructionFirstPart}
          <Text
            accessibilityLabel="Contact us for more information"
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
            style={styles.linkText}
          >
            {`${splitKey}`}
          </Text>
          {instructionSecondPart}
        </Text>
        :
        <Text style={styles.instructionText}>
          {instruction}
        </Text>
    )
  }
  else {
    return (
      instruction.includes(splitKey) ?
        <Text style={[styles.instructionText,style]}>
          {instructionFirstPart}
          <Text
            accessible={true}
            accessibilityRole="link"
            accessibilityLabel="Contact us for more information"
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
            style={styles.linkText}
            onPress={() => {
              navigation.navigate("SupportStack", {
                isContactUs: true,
              });
            }}
          >
            {`${splitKey}`}
          </Text>
          {instructionSecondPart?.length > 0 ? `${instructionSecondPart}` : null}
        </Text>
        :
        <Text style={styles.instructionText}>
          {instruction}
        </Text>
    )
  }
};


const styles = StyleSheet.create({
  instructionText: {
    // flex: 1,
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