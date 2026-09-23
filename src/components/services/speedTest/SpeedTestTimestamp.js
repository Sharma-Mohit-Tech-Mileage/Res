import React from "react";
import { View, StyleSheet } from "react-native";
import ClockIcon from "../../../res/svgIcons/ClockIcon";
import { FieldContent } from "../../common/customui/Typography";
import SmallLoader from "../../common/customui/SmallLoader";
import timestampStyles from "./speedTestStyles";
import { theme } from "../../../styles/theme";

export default function SpeedTestTimestamp({ label, value, loading = false, variant = "footer" }) {
  const isUpdated = variant === "updated";
  return (
    <View style={isUpdated ? timestampStyles.updated : styles.footer}>
      <ClockIcon color={isUpdated ? theme.colors.purpleBright : theme.colors.text.secondary} />
      <FieldContent numberOfLines={1} style={styles.timestamp}>
        <FieldContent style={isUpdated ? [timestampStyles.updatedTitle, styles.updatedLabel] : styles.muted}>{label} </FieldContent>
        {!loading && (value || "---")}
      </FieldContent>
      {loading && <View accessible accessibilityRole="progressbar"
        accessibilityLabel={`${label} time loading`} accessibilityState={{ busy: true }}>
        <SmallLoader width={32} height={24} />
      </View>}
    </View>
  );
}
const styles = StyleSheet.create({
  footer: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: theme.spacing.xs, borderTopWidth: 1, borderColor: theme.colors.border,
    padding: theme.spacing.md,
  },
  timestamp: { flexShrink: 1 },
  updatedLabel: { fontFamily: theme.typography.family.semiBold },
  muted: { color: theme.colors.text.secondary },
});
