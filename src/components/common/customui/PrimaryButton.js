import React from 'react';
import { Text, StyleSheet, View, Platform } from 'react-native';
import { Color, FontFamily, FontSize, Padding, Border } from "../../../../GlobalStyles";
import { A11Y } from "../../../styles/theme";
import { interaction } from "../../../styles/utilities";
import Touchable from "./Touchable";

const PrimaryButton = ({ title, onPress, buttonType, accessibilityLabel, disabled = false, textStyle }) => {
  const isSubmit = buttonType === 'submit';
  const isOutline = buttonType === 'outline';
  const textStyles = [
    isSubmit ? styles.submitText : isOutline ? styles.outlineText : styles.cancelText,
    (isSubmit || isOutline) && disabled && styles.disabledText,
    textStyle,
  ];

  return (
    <View style={styles.margin}>
      <Touchable
        accessibilityRole="button"
        accessibilityLabel={`${accessibilityLabel !== undefined ? accessibilityLabel : title}${
          disabled && Platform.OS === "ios" ? ", not enabled" : ""
        }`}
        accessibilityState={{ disabled }}
        disabled={disabled}
        style={({ pressed }) => [
          isSubmit || isOutline ? styles.button : styles.canbutton,
          isSubmit ? styles.submitButton : null,
          isOutline ? styles.outlineButton : null,
          isSubmit && disabled ? styles.disabledButton : null,
          isOutline && disabled ? styles.disabledOutlineButton : null,
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
    //marginTop: Border.p_base,
    alignSelf: "stretch",
    paddingVertical: Padding.p_base,
    paddingHorizontal: Padding.p_base,
    borderRadius: Border.br_81xl, // Adjust as needed
    minHeight: A11Y.minTouch,
    justifyContent: "center",
  },
  canbutton: {
    //marginTop: Border.p_base,
    alignSelf: "stretch",
    paddingVertical: Padding.p_base,
    paddingHorizontal: Padding.p_base,
    //borderRadius: Border.br_11xs, // Adjust as needed
    //elevation: Padding.p_5xs, // For Android shadow
    minHeight: A11Y.minTouch,
    justifyContent: "center",
  },
  margin:{
    marginTop: Padding.p_base,
  },

  submitButton: {
    backgroundColor: Color.sparklightPrimaryPurple,
  },
  cancelButton: {
   // backgroundColor: Color.colorWhitesmoke_200, // Adjust color as needed
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
  disabledOutlineButton: {
    borderColor: "#98A2B3",
  },
  submitText: {
    textAlign: "center",
    color: Color.sparklightWhite,
    fontSize: FontSize.size_lg,
    fontFamily: FontFamily.RadioCanadaRegular,
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
    color: Color.sparklightPrimaryPurple, // Adjust color as needed
    fontSize: FontSize.size_lg,
    textDecorationLine: "underline",
    fontWeight: "600",
    fontStyle: "normal",
    fontFamily: FontFamily.RadioCanadaBold,
  },
});

export default PrimaryButton;
