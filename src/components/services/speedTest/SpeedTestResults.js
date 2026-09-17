import DownloadcircleIcon from "../../../res/svgIcons/DownloadcircleIcon";
import UploadcircleIcon from "../../../res/svgIcons/UploadcircleIcon";
import React from "react";
import { View, StyleSheet } from "react-native";
import { Body, FieldContent } from "../../common/customui/Typography";
import { theme } from "../../../styles/theme";



const SpeedTestResults = ({ download, upload }) => {
const downloadIcon = <DownloadcircleIcon width={12} height={12} style={styles.speedTagArrow} />
const uploadIcon = <UploadcircleIcon width={12} height={12} style={styles.speedTagArrow} />

  return (
  <View style={styles.row}>
    {[
      ["DOWNLOAD", download, downloadIcon],
      ["UPLOAD", upload, uploadIcon],
    ].map(([label, value, ResultIcon], index) => (
      <View key={label} style={[styles.cell, index === 1 && styles.divider]}>
        <Body style={styles.value}>{value}</Body>
        <FieldContent>Mbps</FieldContent>
        <View style={styles.tag}>
          {label === "DOWNLOAD" ? downloadIcon : uploadIcon}
          <Body style={styles.label}>{label}</Body>
        </View>
      </View>
    ))}
  </View>
  )
}
const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    backgroundColor: theme.colors.primaryLight,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.base,
    marginBottom: theme.spacing.base,
    marginHorizontal: theme.spacing.base,
  },
  cell: { flex: 1, alignItems: "center" },
  divider: { borderLeftWidth: 1, borderColor: theme.colors.primaryLight },
  value: {
    fontSize: theme.typography.size["3xl"],
    color: theme.colors.primaryDark,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing["2xs"],
    marginTop: theme.spacing.md,
  },
  label: {
    fontSize: theme.typography.size.xs,
    color: theme.colors.primary,
  },speedTagArrow: {
    fontSize: theme.typography.size.xs,
    fontWeight: "700",
    marginRight: 4,
    color: theme.colors.primary,
  },
});
export default SpeedTestResults;
