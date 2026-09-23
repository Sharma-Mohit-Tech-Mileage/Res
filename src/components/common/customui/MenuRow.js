import React from "react";
import { View, StyleSheet } from "react-native";
import Touchable from "./Touchable";
import { MenuText, SectionTitle } from "./Typography";
import { Color, Padding } from "../../../../GlobalStyles";
import AppStyles from "../../../styles/AppStyles";
import RightIcon from '../../../../assets/svgs/Chevonright';

export const MenuCard = ({ title, children, style }) => (
  <View style={[AppStyles.card, style]}>
    {title && (
      <View style={styles.heading}>
        <SectionTitle accessibilityRole="header">{title}</SectionTitle>
      </View>
    )}
    {children}
  </View>
);

export default function MenuRow({
  label,
  onPress,
  leadingIcon,
  showChevron = true,
  divider = true,
  style,
  accessibilityLabel = label,
  ...props
}) {
  return (
    <Touchable
      {...props}
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      style={[styles.row, divider && styles.divider, style]}
    >
      {leadingIcon && (
        <View
          accessible={false}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={styles.leading}
        >
          {leadingIcon}
        </View>
      )}
      <MenuText style={styles.label}>{label}</MenuText>
      {showChevron && (
        <View
          accessible={false}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={styles.chevron}
        >
          <RightIcon />
        </View>
      )}
    </Touchable>
  );
}
const styles = StyleSheet.create({
  heading: {
    paddingHorizontal: Padding.p_5xl,
    paddingVertical: Padding.p_base,
  },
  row: {
    minHeight: 58,
    paddingVertical: Padding.p_base,
    paddingHorizontal: Padding.p_5xl,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "stretch",
  },
  divider: { borderTopWidth: 1, borderTopColor: Color.sparklightGray },
  label: { flex: 1, lineHeight: 28 },
  leading: { width: 24, alignItems: "center", marginRight: 20 },
  chevron: {
    width: 24,
    height: 24,
    marginLeft: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});
