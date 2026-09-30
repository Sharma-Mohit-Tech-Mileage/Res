import React from "react";
import Touchable from "../../common/customui/Touchable";
import { Body } from "../../common/customui/Typography";
import styles from "./wifiSpeedStyles";
const WifiSpeedTestReady = ({ onStart }) => (
  <Touchable
    onPress={onStart}
    accessibilityLabel="Start WiFi speed test"
    style={styles.go}
  >
    <Body style={styles.goText}>GO</Body>
  </Touchable>
);
export default WifiSpeedTestReady;
