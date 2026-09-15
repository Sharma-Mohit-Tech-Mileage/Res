import React from "react";
import { View } from "react-native";
import ServiceStatusSpinner from "../../common/ServiceStatusSpinner";
import { FieldTitle } from "../../common/customui/Typography";
import RebootModemLayout from "./RebootModemLayout";
import styles from "./RebootModemStateStyles";

const RebootModemLoading = ({ navigation }) => (
  <RebootModemLayout navigation={navigation}>
    <View
      style={styles.loading}
      accessibilityLiveRegion="polite"
      accessibilityState={{ busy: true }}
    >
      <ServiceStatusSpinner isAnimating />
      <FieldTitle style={styles.loadingTitle}>Rebooting Modem...</FieldTitle>
    </View>
  </RebootModemLayout>
);

export default RebootModemLoading;
