import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import CheckBox from "@react-native-community/checkbox";
import Touchable from "../../common/customui/Touchable";
import { Color, FontFamily, FontSize } from "../../../../GlobalStyles";

const AgreeTermsRow = ({ value, onValueChange, onViewTerms }) => (
  <View style={styles.row}>
    <Touchable
      onPress={() => onValueChange(!value)}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: !!value }}
      accessibilityLabel="I agree to Terms & Conditions"
      accessibilityHint="Double tap to toggle agreement."
      style={styles.agreePress}
    >
      <View pointerEvents="none" style={styles.checkboxBox}>
        <CheckBox
          disabled
          value={value}
          boxType="square"
          style={styles.checkbox}
          tintColors={{ true: Color.colorMidnightblue, false: "#D0D5DD" }}
          tintColor="#D0D5DD"
          onCheckColor={Color.colorMidnightblue}
          onTintColor={Color.colorMidnightblue}
          accessible={false}
          importantForAccessibility="no"
        />
      </View>
      <Text style={styles.agreeText}>I agree to</Text>
    </Touchable>
    <Touchable
      onPress={onViewTerms}
      accessibilityRole="link"
      accessibilityLabel="Terms & Conditions"
      accessibilityHint="Opens the Terms and Conditions."
      style={styles.linkPress}
    >
      <Text style={styles.linkText}>Terms & Conditions</Text>
    </Touchable>
  </View>
);

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", marginVertical: 4 },
  agreePress: { flexDirection: "row", justifyContent: "flex-start", minHeight: 48 },
  checkboxBox: { marginRight: Platform.OS === "ios" ? 10 : 16 },

  checkbox: { width: 12, height: 12 },
  agreeText: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.openSansRegular,
    color: Color.colorGray_200,
  },
  linkPress: { justifyContent: "center", minHeight: 48, paddingHorizontal: 4 },
  linkText: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.openSansSemiBold,
    fontWeight: "700",
    color: Color.sparklightBrightPurple,
    textDecorationLine: "underline",
  },
});

export default AgreeTermsRow;
