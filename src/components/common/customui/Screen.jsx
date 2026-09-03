// [51768] Scroll container owning large-screen geometry; fill/clearTabBar are opt-in, cap/gutter null at compact.
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { LAYOUT, contentWidthStyle, useResponsive } from "../../../utils/responsive";

// clearTabBar: true uses the token, a number carries an existing 100/120/150 through the migration.
export const ScreenScroll = ({
  children,
  style,
  contentContainerStyle,
  maxWidth,
  gutter = true,
  fill = false,
  clearTabBar = false,
  ...rest
}) => {
  const { sizeClass, gutterStyle } = useResponsive();
  const clearance = clearTabBar === true ? LAYOUT.tabBarClearance : clearTabBar;
  // maxWidth on a ScrollView's contentContainerStyle does not constrain it, so cap an inner wrapper instead.
  const cap = contentWidthStyle(sizeClass, maxWidth);
  return (
    <ScrollView
      style={[fill ? styles.fill : null, style]}
      contentContainerStyle={[
        cap ? styles.centerContent : null,
        gutter ? gutterStyle : null,
        clearance ? { paddingBottom: clearance } : null,
        contentContainerStyle,
      ]}
      {...rest}
    >
      {cap ? <View style={cap}>{children}</View> : children}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  fill: { flex: 1 },
  centerContent: { alignItems: "center" },
});

export default ScreenScroll;
