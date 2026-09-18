import React from "react";
import NotificationAlert from "../../common/customui/NotificationAlert";
import PrimaryButton from "../../common/customui/PrimaryButton";
import RebootModemLayout from "./RebootModemLayout";
import styles from "./RebootModemStateStyles";

const RebootModemFailure = ({ navigation, onRetry }) => (
  <RebootModemLayout
    navigation={navigation}
    actions={
      <>
        <PrimaryButton
          title="Retry Modem Reboot"
          buttonType="submit"
          onPress={onRetry}
          containerStyle={styles.primary}
        />
        <PrimaryButton
          title="Cancel"
          buttonType="outline"
          containerStyle={styles.secondary}
          onPress={() => navigation.goBack()}
        />
      </>
    }
  >
    <NotificationAlert
      type="error"
      showCloseIcon={false}
      containerStyle={styles.alert}
      title="Modem reboot failed"
      message="We couldn't reboot your modem. Try again, or see Modem Help."
    />
  </RebootModemLayout>
);

export default RebootModemFailure;
