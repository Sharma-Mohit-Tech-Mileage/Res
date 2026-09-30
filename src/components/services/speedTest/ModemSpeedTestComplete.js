import React from "react";
import InfoIcon from "../../../../assets/svgs/InfoIcon";
import { View } from "react-native";
import NotificationAlert from "../../common/customui/NotificationAlert";
import { Body } from "../../common/customui/Typography";
import styles from "./speedTestStyles";

const ModemSpeedTestComplete = ({ error = false, message }) => (
  <View style={styles.statusContent}>
    <NotificationAlert
      type={error ? "error" : "success"}
      title={error ? "Speed test failed" : "Speed test complete"}
      message={error ? message || "We couldn't complete your speed test. Please try again." : "Thank you for your patience."}
      containerStyle={styles.statusNotice}
      showCloseIcon={false}
    />
    <View style={styles.refreshHint}>
      <View accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <InfoIcon size={18} />
      </View>
      <Body style={styles.refreshHintText}>Pull down screen to refresh content.</Body>
    </View>
  </View>
);
export default ModemSpeedTestComplete;
