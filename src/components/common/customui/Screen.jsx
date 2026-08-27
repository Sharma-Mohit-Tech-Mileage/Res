// [51768] Screen shells that own large-screen geometry so components never ask how wide the window is.
import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { useResponsive } from "../../../utils/responsive";
import theme from "../../../styles/theme";

// Caps and centres a screen's content column. At compact both extra styles are null, so the rendered style array is equivalent to today's.
export const Screen = ({ children, style, maxWidth, gutter = true, ...rest }) => {
  const { sizeClass, contentStyle, gutterStyle } = useResponsive();
  const cap = maxWidth ? { width: "100%", maxWidth, alignSelf: "center" } : contentStyle;
  return (
    <View style={[styles.fill, sizeClass === "compact" ? null : cap, gutter ? gutterStyle : null, style]} {...rest}>
      {children}
    </View>
  );
};

// Scrolling variant. Also owns clearance for the absolute tab bar, which screens currently hard-code as 100/120/140/150 by hand.
export const ScreenScroll = ({
  children,
  style,
  contentContainerStyle,
  maxWidth,
  gutter = true,
  clearTabBar = true,
  ...rest
}) => {
  const { sizeClass, contentStyle, gutterStyle } = useResponsive();
  const cap = maxWidth ? { width: "100%", maxWidth, alignSelf: "center" } : contentStyle;
  return (
    <ScrollView
      style={[styles.fill, style]}
      contentContainerStyle={[
        sizeClass === "compact" ? null : cap,
        gutter ? gutterStyle : null,
        clearTabBar ? { paddingBottom: theme.layout.tabBarClearance } : null,
        contentContainerStyle,
      ]}
      {...rest}
    >
      {children}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  fill: { flex: 1 },
});

export default Screen;
