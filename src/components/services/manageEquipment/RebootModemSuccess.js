import React from "react";
import NotificationAlert from "../../common/customui/NotificationAlert";
import PrimaryButton from "../../common/customui/PrimaryButton";
import RebootModemLayout from "./RebootModemLayout";
import styles from "./RebootModemStateStyles";

const RebootModemSuccess = ({ navigation }) => (
  <RebootModemLayout navigation={navigation}>
    <NotificationAlert
      type="success"
      layout="centered"
      showCloseIcon={false}
      iconSize={40}
      containerStyle={styles.alert}
      title="Modem Reboot Successful!"
    />
    <PrimaryButton
      title="Return to manage equipment"
      buttonType="submit"
      onPress={() => navigation.navigate("manageEquipment")}
      style={styles.button}
      containerStyle={styles.primary}
    />
  </RebootModemLayout>
);

export default RebootModemSuccess;
