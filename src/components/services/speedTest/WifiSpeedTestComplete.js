import React from "react";
import Touchable from "../../common/customui/Touchable";
import { Body } from "../../common/customui/Typography";
import styles from "./wifiSpeedStyles";
const WifiSpeedTestComplete = ({ onStart }) => (
  <Touchable
    style={styles.again}
    onPress={onStart}
    accessibilityLabel="Run WiFi speed test again"
  >
    <Body style={styles.blue}>AGAIN</Body>
  </Touchable>
);
export default WifiSpeedTestComplete;
