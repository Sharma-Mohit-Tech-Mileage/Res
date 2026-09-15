import React from "react";
import { View } from "react-native";
import ServiceStatusSpinner from "../../common/ServiceStatusSpinner";
import { Body } from "../../common/customui/Typography";
import styles from "./speedTestStyles";

const ModemSpeedTestProgress = () => (
  <View style={styles.notice} accessibilityLiveRegion="polite">
    <ServiceStatusSpinner isAnimating />
    <Body style={styles.noticeText}>
      Speed test in progress, one moment, please. This may take up to a minute
      to complete.
    </Body>
  </View>
);
export default ModemSpeedTestProgress;
