// [55104] Stacks cards vertically on phone widths and side by side from 600dp up, with the app-wide card gap either way.
import React from "react";
import { StyleSheet, View } from "react-native";
import { LAYOUT, useResponsive } from "../../../utils/responsive";

const ResponsiveRow = ({ children, gap = LAYOUT.cardGap, style }) => {
  const { isCompact } = useResponsive();
  if (isCompact) return <View style={[{ gap }, style]}>{children}</View>;
  const items = React.Children.toArray(children).filter(Boolean);
  return (
    <View style={[styles.row, { gap }, style]}>
      {items.map((child, index) => (
        <View key={child.key ?? index} style={styles.cell}>
          {child}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "stretch" },
  cell: { flex: 1 },
});

export default ResponsiveRow;
