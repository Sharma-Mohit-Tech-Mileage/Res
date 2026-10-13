import React from "react";
import { StyleSheet } from "react-native";
import SpeedBanner from "../cards/SpeedBanner";
import { theme } from "../../../styles/theme";

const formatSpeed = value =>
  ["number", "string"].includes(typeof value) && String(value).trim() !== "" &&
  Number.isFinite(Number(value)) && Number(value) >= 0 ? Number(value).toFixed(2) : "---";

const SpeedTestResults = ({ download, upload, loading = false }) => (
  <SpeedBanner loading={loading} downloadSpeed={formatSpeed(download)} uploadSpeed={formatSpeed(upload)} style={styles.spacing} />
);

const styles = StyleSheet.create({
  spacing: {
    marginTop: 0,
    marginHorizontal: theme.spacing.base,
    marginBottom: theme.spacing.base,
  },
});

export default SpeedTestResults;
