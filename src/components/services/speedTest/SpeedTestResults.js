import React from "react";
import { StyleSheet } from "react-native";
import SpeedBanner from "../cards/SpeedBanner";
import { theme } from "../../../styles/theme";

const SpeedTestResults = ({ download, upload }) => (
  <SpeedBanner downloadSpeed={download} uploadSpeed={upload} style={styles.spacing} />
);

const styles = StyleSheet.create({
  spacing: {
    marginTop: 0,
    marginHorizontal: theme.spacing.base,
    marginBottom: theme.spacing.base,
  },
});

export default SpeedTestResults;
