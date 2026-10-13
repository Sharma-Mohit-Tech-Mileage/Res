import React from "react";
import PrimaryButton from "../../common/customui/PrimaryButton";
import { View } from "react-native";
import SmallLoader from "../../common/customui/SmallLoader";
import { Body } from "../../common/customui/Typography";
import { theme } from "../../../styles/theme";
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
      <View accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <SmallLoader width={120} height={120} />
      </View>
      <Body style={{ color: theme.colors.text.secondary, textAlign: "center", marginTop: theme.spacing.base }}>Rebooting Modem...</Body>
    </View>
  </RebootModemLayout>
);

export default RebootModemLoading;
