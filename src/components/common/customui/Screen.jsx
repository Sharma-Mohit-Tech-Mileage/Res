// [51768] Scroll container that owns large-screen geometry, so screens never ask how wide the window is.
// Geometry only, never layout the caller did not ask for: fill and clearTabBar are opt-in, cap and gutter are null at compact.
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
  // maxWidth on a vertical ScrollView's contentContainerStyle does NOT constrain it - the
  // container takes the ScrollView's width. Centre the container and cap an inner wrapper
  // instead. At compact the cap is null, so no wrapper is added and output is unchanged.
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
