import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Color, FontFamily, FontSize, Padding } from "../../../../GlobalStyles";
import Touchable from "./Touchable";

// Shared link-style cancellation action. Keep the full accessible touch target.
const CancelButton = ({
  title = "Cancel",
  disabled = false,
  containerStyle,
  style,
  textStyle,
  ...props
}) => (
  <View style={containerStyle}>
    <Touchable
      {...props}
      disabled={disabled}
      accessibilityRole="button"
      style={[style, styles.button, disabled && styles.disabled]}
    >
      <Text style={[textStyle, styles.text]}>{title}</Text>
    </Touchable>
  </View>
);

const styles = StyleSheet.create({
  button: {
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
    padding: Padding.p_base,
    backgroundColor: "transparent",
    borderWidth: 0,
  },
  disabled: { opacity: 0.6 },
  text: {
    textAlign: "center",
    color: Color.sparklightPrimaryPurple,
    fontSize: FontSize.size_lg,
    fontFamily: FontFamily.RadioCanadaBold,
    fontWeight: "700",
    textDecorationLine: "underline",
  },
});

export default CancelButton;
