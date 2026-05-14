import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { Color, FontFamily, FontSize, Padding, Border } from "../../../../GlobalStyles";
import { A11Y } from "../../../styles/theme";
import { interaction } from "../../../styles/utilities";
import Touchable from "./Touchable";

const PrimaryButton = ({ title, onPress, buttonType, accessibilityLabel }) => {
  const textStyles = [buttonType === 'submit' ? styles.submitText : styles.cancelText];

  return (
    <View style={styles.margin}>
      <Touchable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel !== undefined ? accessibilityLabel : undefined}
        style={({ pressed }) => [
          buttonType === 'submit' ? styles.button : styles.canbutton,
          buttonType === 'submit' ? styles.submitButton : null,
          pressed && interaction.pressed,
        ]}
        onPress={onPress}
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
  submitText: {
    textAlign: "center",
    color: Color.sparklightWhite,
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.openSansSemiBold,
    fontWeight: "700",
  },
  cancelText: {
    textAlign: "center",
    color: Color.colorMidnightblue,
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.openSansRegular,
  },
});

export default PrimaryButton;