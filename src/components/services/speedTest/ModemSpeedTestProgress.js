import React from "react";
import { View } from "react-native";
import ServiceLoader from "../../common/customui/ServiceLoader";
import { Body } from "../../common/customui/Typography";
import styles from "./speedTestStyles";

const ModemSpeedTestProgress = () => (
  <View style={styles.notice} accessibilityLiveRegion="polite">
    <ServiceLoader />
    <Body style={styles.noticeText}>
      Speed test in progress, one moment, please. This may take a few minutes
      to complete.
    </Body>
  </View>
);
export default ModemSpeedTestProgress;
