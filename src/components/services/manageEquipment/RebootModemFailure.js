import React from "react";
import NotificationAlert from "../../common/customui/NotificationAlert";
import PrimaryButton from "../../common/customui/PrimaryButton";
import { Body } from "../../common/customui/Typography";
import WarningIcon from "../../../../assets/svgs/Alerttriangle";
import RebootModemLayout from "./RebootModemLayout";
import styles from "./RebootModemStateStyles";

const RebootModemFailure = ({ navigation, onRetry }) => (
  <RebootModemLayout navigation={navigation}>
    <NotificationAlert
      type="error"
      layout="centered"
      showCloseIcon={false}
      iconComponent={WarningIcon}
      iconSize={40}
      containerStyle={styles.alert}
      title="Modem Reboot Failed"
    >
      <Body style={styles.message}>
        We have encountered an error. Please retry or refer to the Modem Help
        Instructions.
      </Body>
    </NotificationAlert>
    <PrimaryButton
      title="Retry Modem Reboot"
      buttonType="submit"
      onPress={onRetry}
      style={styles.button}
      containerStyle={styles.primary}
    />
    <PrimaryButton
      title="Cancel"
      buttonType="outline"
      onPress={() => navigation.goBack()}
      style={styles.button}
      containerStyle={styles.secondary}
    />
  </RebootModemLayout>
);

export default RebootModemFailure;
