import React from "react";
import { View } from "react-native";
import ServiceLoader from "../../common/customui/ServiceLoader";
import RebootModemLayout from "./RebootModemLayout";
import styles from "./RebootModemStateStyles";

const RebootModemLoading = ({ navigation }) => (
  <RebootModemLayout navigation={navigation}>
    <View
      style={styles.loading}
      accessibilityLiveRegion="polite"
      accessibilityState={{ busy: true }}
    >
      <ServiceLoader ring label="Rebooting" />
    </View>
  </RebootModemLayout>
);

export default RebootModemLoading;
