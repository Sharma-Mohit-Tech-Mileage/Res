// [51768] Reflows a card list into columns when the window earns them. At one column it renders a plain View, so phones keep today's single-column flow with no extra wrapper styling.
import React, { Children } from "react";
import { View, StyleSheet } from "react-native";
import { useResponsive } from "../../../utils/responsive";

const AdaptiveGrid = ({ children, columns: override, gap = 16, style, ...rest }) => {
  const { columns: resolved, select } = useResponsive();
  const columns = override ? select(override) || 1 : resolved;
  const items = Children.toArray(children);

  if (columns <= 1) {
    return (
      <View style={style} {...rest}>
        {children}
      </View>
    );
  }

  return (
    <View style={[styles.grid, { marginHorizontal: -gap / 2 }, style]} {...rest}>
      {items.map((child, index) => (
        <View key={index} style={{ width: `${100 / columns}%`, paddingHorizontal: gap / 2, marginBottom: gap }}>
          {child}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", alignItems: "flex-start" },
});

export default AdaptiveGrid;
