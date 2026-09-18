import React from "react";
import InfoIcon from "../../../res/svgIcons/InfoIcon";
import { View } from "react-native";
import NotificationAlert from "../../common/customui/NotificationAlert";
import { Body } from "../../common/customui/Typography";
import { theme } from "../../../styles/theme";
import styles from "./speedTestStyles";

const ModemSpeedTestComplete = () => (
  <View style={{margin: theme.spacing.base}}>
    <NotificationAlert
      type="success"
      title="Speed test complete"
      message="Thank you for your patience."
      showCloseIcon={false}
    />
    <View style={styles.refreshHint}>
      <View accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <InfoIcon width={18} height={18} viewBox="0 0 16 16" />
      </View>
      <Body style={styles.refreshHintText}>Pull down screen to refresh content.</Body>
    </View>
  </View>
);
export default ModemSpeedTestComplete;
