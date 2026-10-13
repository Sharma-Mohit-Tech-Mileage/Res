// [51768] Scroll container owning screen geometry; fill/clearTabBar are opt-in.
// [55104] `framed` applies the app-wide frame (side inset, top space, tab-bar clearance); `stack` adds the app-wide card gap (utilities `container.stack`). Tablets use the same full-width frame as phones.
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { LAYOUT } from "../../../utils/responsive";
import { container } from "../../../styles/utilities";

// clearTabBar: true uses the token, a number carries an existing 100/120/150 through the migration.
// ScrollComponent lets a screen supply its own scroller (54136's KeyboardAwareScrollView) while keeping this geometry.
export const ScreenScroll = React.forwardRef(function ScreenScroll({
  children,
  style,
  contentContainerStyle,
  fill = false,
  clearTabBar = false,
  framed = false,
  stack = false,
  ScrollComponent = ScrollView,
  ...rest
}, ref) {
  const clearance = clearTabBar === true || (framed && clearTabBar === false) ? LAYOUT.tabBarClearance : clearTabBar;
  return (
    <ScrollComponent
      ref={ref}
      style={[fill ? styles.fill : null, style]}
      contentContainerStyle={[
        clearance ? { paddingBottom: clearance } : null,
        contentContainerStyle,
      ]}
      {...rest}
    >
      {framed || stack ? <View style={[framed ? container.frame : null, stack ? container.stack : null]}>{children}</View> : children}
    </ScrollComponent>
  );
});

const styles = StyleSheet.create({
  fill: { flex: 1 },
});

// [55104] Non-scrolling counterpart for screens whose list scrolls itself (FlatList panels): same frame and tab-bar clearance.
export function ScreenFrame({ children, style, clearTabBar = true }) {
  const clearance = clearTabBar === true ? LAYOUT.tabBarClearance : clearTabBar;
  return (
    <View style={styles.fill}>
      <View style={[styles.fill, container.frame, clearance ? { marginBottom: clearance } : null, style]}>{children}</View>
    </View>
  );
}

export default ScreenScroll;
