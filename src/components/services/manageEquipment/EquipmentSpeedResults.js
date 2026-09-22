import React from "react";
import { View, Text, StyleSheet } from "react-native";
import DownloadcircleIcon from "../../../res/svgIcons/DownloadcircleIcon";
import UploadcircleIcon from "../../../res/svgIcons/UploadcircleIcon";
import { HintText } from "../../common/customui/Typography";
import { theme } from "../../../styles/theme";

const SpeedReading = ({ label, value, Icon }) => {
  const display = String(value ?? "---");
  const [whole, decimal] = display.split(".");
  return (
    <View
      style={styles.column}
      accessible
      accessibilityLabel={`${label} ${display} megabits per second`}
    >
      <View style={styles.valueRow}>
        <View style={styles.icon}>
          <Icon
            width={24}
            height={24}
            viewBox="-1 -1 24 24"
            accessible={false}
          />
        </View>
        <Text
          style={styles.value}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.75}
        >
          {whole}
          <Text style={styles.decimal}>{decimal ? `.${decimal}` : ""}</Text>
        </Text>
      </View>
      <Text
        style={styles.label}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.8}
      >
        {label}
        <HintText style={styles.unit}> Mbps</HintText>
      </Text>
    </View>
  );
};

const EquipmentSpeedResults = ({ download, upload, style }) => (
  <View style={[styles.row, style]} accessibilityLiveRegion="polite">
    <SpeedReading label="Download" value={download} Icon={DownloadcircleIcon} />
    <SpeedReading label="Upload" value={upload} Icon={UploadcircleIcon} />
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    marginHorizontal: theme.spacing.base,
    marginBottom: theme.spacing.base,
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.md,
  },
  column: { flex: 1, minWidth: 0, alignItems: "center" },
  icon: { width: 24, height: 24, flexShrink: 0 },
  valueRow: {
    maxWidth: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  value: {
    flexShrink: 1,
    includeFontPadding: false,
    fontFamily: theme.typography.family.regular,
    fontSize: 28,
    lineHeight: 36,
    color: theme.colors.purpleBright,
  },
  decimal: { fontSize: theme.typography.size.lg },
  label: {
    marginTop: theme.spacing.sm,
    fontFamily: theme.typography.family.semiBold,
    fontSize: theme.typography.size.base,
    color: theme.colors.text.secondary,
  },
  unit: {
    fontFamily: theme.typography.family.regular,
    fontSize: theme.typography.size.base,
    color: theme.colors.text.secondary,
  },
});

export default EquipmentSpeedResults;
