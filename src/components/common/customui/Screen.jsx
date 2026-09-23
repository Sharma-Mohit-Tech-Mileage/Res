// [51768] Scroll container owning large-screen geometry; fill/clearTabBar are opt-in, cap/gutter null at compact.
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { LAYOUT, contentWidthStyle, useResponsive } from "../../../utils/responsive";

// clearTabBar: true uses the token, a number carries an existing 100/120/150 through the migration.
// ScrollComponent lets a screen supply its own scroller (54136's KeyboardAwareScrollView) while keeping this geometry.
export const ScreenScroll = React.forwardRef(function ScreenScroll({
  children,
  style,
  contentContainerStyle,
  maxWidth,
  gutter = true,
  fill = false,
  clearTabBar = false,
  ScrollComponent = ScrollView,
  ...rest
}, ref) {
  const { sizeClass, gutterStyle } = useResponsive();
  const clearance = clearTabBar === true ? LAYOUT.tabBarClearance : clearTabBar;
  // maxWidth on a ScrollView's contentContainerStyle does not constrain it, so cap an inner wrapper instead.
  const cap = contentWidthStyle(sizeClass, maxWidth);
  return (
    <ScrollComponent
      ref={ref}
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
    </ScrollComponent>
  );
});

const styles = StyleSheet.create({
  fill: { flex: 1 },
  centerContent: { alignItems: "center" },
});

export default ScreenScroll;
