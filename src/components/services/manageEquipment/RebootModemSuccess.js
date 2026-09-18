import React from "react";
import NotificationAlert from "../../common/customui/NotificationAlert";
import PrimaryButton from "../../common/customui/PrimaryButton";
import RebootModemLayout from "./RebootModemLayout";
import styles from "./RebootModemStateStyles";

const RebootModemSuccess = ({ navigation }) => (
  <RebootModemLayout
    navigation={navigation}
    actions={
      <>
        <PrimaryButton
          title="Return to manage equipment"
          buttonType="submit"
          onPress={() => navigation.navigate("manageEquipment")}
          containerStyle={styles.primary}
        />
      </>
    }
  >
    <NotificationAlert
      type="success"
      showCloseIcon={false}
      containerStyle={styles.alert}
      title="Modem Reboot Successful!"
    />
  </RebootModemLayout>
);

export default RebootModemSuccess;
