import React from 'react';
import { Text, Pressable, StyleSheet, View } from 'react-native';
import { Color, FontFamily, FontSize, Padding, Border } from "../../../../GlobalStyles";

const PrimaryButtom = ({ title, onPress, buttonType, accessibilityLabel }) => {
  const textStyles = [buttonType === 'submit' ? styles.submitText : styles.cancelText];

  return (
    <View style={styles.margin}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel !== undefined ? accessibilityLabel : undefined}
        style={({ pressed }) => [
          buttonType === 'submit' ? styles.button : styles.canbutton,
          buttonType === 'submit' ? styles.submitButton : null,
          pressed && styles.pressed,
        ]}
        onPress={onPress}
      >
        <Text style={textStyles}>{title}</Text>
      </Pressable>
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
  },
  canbutton: {
    alignSelf: "stretch",
    paddingVertical: Padding.p_base,
    paddingHorizontal: Padding.p_base,
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
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
});

export default PrimaryButtom;