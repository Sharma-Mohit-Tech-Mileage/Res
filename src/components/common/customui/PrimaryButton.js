import React from 'react';
import { Text, Pressable, StyleSheet ,View} from 'react-native';
import { Color, FontFamily, FontSize, Padding, Border } from "../../../../GlobalStyles";

const PrimaryButtom = ({ title, onPress, buttonType }) => {
  const buttonStyles = [buttonType === 'submit' ? styles.button : styles.canbutton, buttonType === 'submit' ? styles.submitButton : styles.cancelButton];
  const textStyles = [buttonType === 'submit' ? styles.submitText : styles.cancelText];

  return (
    <View style={styles.margin}>
    <Pressable accessibilityRole='button' style={buttonStyles} onPress={onPress}>
      <Text style={textStyles}>{title}</Text>
    </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    //marginTop: Border.p_base,
    alignSelf: "stretch",
    paddingVertical: Padding.p_base,
    paddingHorizontal: Padding.p_base,
    borderRadius: Border.br_11xs, // Adjust as needed
    elevation: Padding.p_5xs, // For Android shadow
  },
  canbutton: {
    //marginTop: Border.p_base,
    alignSelf: "stretch",
    paddingVertical: Padding.p_base,
    paddingHorizontal: Padding.p_base,
    //borderRadius: Border.br_11xs, // Adjust as needed
    //elevation: Padding.p_5xs, // For Android shadow
  },
  margin:{
    marginTop: Padding.p_base,
  },

  submitButton: {
    backgroundColor: Color.colorMidnightblue,
  },
  cancelButton: {
   // backgroundColor: '#fff', // Adjust color as needed
  },
  submitText: {
    textAlign: "center",
    color: Color.sparklightWhite,
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.openSansRegular,
  },
  cancelText: {
    textAlign: "center",
    color: Color.colorMidnightblue, // Adjust color as needed
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.openSansRegular,
  },
});

export default PrimaryButtom