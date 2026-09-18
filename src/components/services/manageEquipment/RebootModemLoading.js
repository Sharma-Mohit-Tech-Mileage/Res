import React from "react";
import PrimaryButton from "../../common/customui/PrimaryButton";
import { View } from "react-native";
import ServiceLoader from "../../common/customui/ServiceLoader";
import RebootModemLayout from "./RebootModemLayout";
import styles from "./RebootModemStateStyles";

const RebootModemLoading = ({ navigation }) => (
  <RebootModemLayout
    navigation={navigation}
    actions={
      <>
        <PrimaryButton
          title="Reboot Modem"
          buttonType="submit"
          disabled
          containerStyle={styles.primary}
        />
        <PrimaryButton
          title="Cancel"
          buttonType="outline"
          disabled
          containerStyle={styles.secondary}
        />
      </>
    }
  >
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
