import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { Color, FontFamily, FontSize, Padding, Border } from "../../../../GlobalStyles";
import { A11Y } from "../../../styles/theme";
import { interaction } from "../../../styles/utilities";
import Touchable from "./Touchable";

const PrimaryButton = ({ title, onPress, buttonType, accessibilityLabel, disabled = false }) => {
  const isSubmit = buttonType === 'submit';
  const isOutline = buttonType === 'outline';
  const textStyles = [
    isSubmit ? styles.submitText : isOutline ? styles.outlineText : styles.cancelText,
    isSubmit && disabled && styles.disabledText,
  ];

  return (
    <View style={styles.margin}>
      <Touchable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel !== undefined ? accessibilityLabel : undefined}
        accessibilityState={{ disabled }}
        style={({ pressed }) => [
          isSubmit || isOutline ? styles.button : styles.canbutton,
          isSubmit ? styles.submitButton : null,
          isOutline ? styles.outlineButton : null,
          isSubmit && disabled ? styles.disabledButton : null,
          pressed && !disabled && interaction.pressed,
        ]}
        onPress={() => !disabled && onPress && onPress()}
      >
        <Text style={textStyles}>{title}</Text>
      </Touchable>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    alignSelf: "stretch",
    paddingVertical: Padding.p_base,
    paddingHorizontal: Padding.p_base,
    borderRadius: Border.br_11xs,
    elevation: Padding.p_5xs,
    minHeight: A11Y.minTouch,
    justifyContent: "center",
  },
  canbutton: {
    alignSelf: "stretch",
    paddingVertical: Padding.p_base,
    paddingHorizontal: Padding.p_base,
    minHeight: A11Y.minTouch,
    justifyContent: "center",
  },
  margin: {
    marginTop: Padding.p_base,
  },
  submitButton: {
    backgroundColor: Color.colorMidnightblue,
  },
  outlineButton: {
    backgroundColor: Color.sparklightWhite,
    borderWidth: 1,
    borderColor: Color.colorMidnightblue,
    elevation: 0,
  },
  disabledButton: {
    backgroundColor: "#EAECF0",
    elevation: 0,
  },
  submitText: {
    textAlign: "center",
    color: Color.sparklightWhite,
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.openSansSemiBold,
    fontWeight: "700",
  },
  outlineText: {
    textAlign: "center",
    color: Color.colorMidnightblue,
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.openSansSemiBold,
    fontWeight: "600",
  },
  disabledText: {
    color: "#667085",
  },
  cancelText: {
    textAlign: "center",
    color: Color.colorMidnightblue,
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.openSansRegular,
  },
});

export default PrimaryButton;
