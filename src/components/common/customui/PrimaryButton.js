import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { Color, FontFamily, FontSize, Padding, Border } from "../../../../GlobalStyles";
import { A11Y } from "../../../styles/theme";
import { interaction } from "../../../styles/utilities";
import Touchable from "./Touchable";

const PrimaryButton = ({ title, onPress, buttonType, disabled, textStyle }) => {
  const buttonStyles = [buttonType === 'submit' ? styles.button : styles.canbutton, buttonType === 'submit' ? styles.submitButton : styles.cancelButton];
  const textStyles = [buttonType === 'submit' ? styles.submitText : styles.cancelText, textStyle];

  return (
    <View style={styles.margin}>
    <Touchable style={({ pressed }) => [
      ...buttonStyles,
      disabled ? { opacity: 0.6 } : null,
      pressed && !disabled && interaction.pressed,
    ]}
     accessibilityRole="button"
     accessible={true}
     accessibilityLabel={title}
     disabled={disabled}
     onPress={onPress}>
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
  submitText: {
    textAlign: "center",
    color: Color.sparklightWhite,
    fontSize: FontSize.size_lg,
    fontFamily: FontFamily.RadioCanadaRegular,
    fontWeight: "700",
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