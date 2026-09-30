import React from "react";
import EquipmentAlert from "./EquipmentAlert";
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
    <EquipmentAlert
      type="success"

      containerStyle={styles.alert}
      title="Modem Reboot Successful!"
      message="Your modem has restarted. It may take a few minutes for your service to fully reconnect."
    />
  </RebootModemLayout>
);

export default RebootModemSuccess;
