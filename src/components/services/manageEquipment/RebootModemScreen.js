import React, { useEffect, useRef, useState } from "react";
import NotificationAlert from "../../common/customui/NotificationAlert";
import PrimaryButton from "../../common/customui/PrimaryButton";
import styles from "./RebootModemStateStyles";
import RebootModemLayout from "./RebootModemLayout";
import RebootModemLoading from "./RebootModemLoading";
import RebootModemSuccess from "./RebootModemSuccess";
import RebootModemFailure from "./RebootModemFailure";

import speedTestApi from "../../../network/apis/services/speedTest.service";
const RebootModemScreen = ({ navigation, route, onReboot }) => {
  const [status, setStatus] = useState("confirmation");
  const pending = useRef(false);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  const handleReboot = async () => {
    if (pending.current) return;
    pending.current = true;
    setStatus("loading");
    try {
      const result = await (onReboot
        ? onReboot()
        : speedTestApi.rebootModem(route?.params?.ip));
      if (result === false) throw new Error("Reboot failed");
      if (mounted.current) setStatus("success");
    } catch (error) {
      if (mounted.current) setStatus("failure");
    } finally {
      pending.current = false;
    }
  };

  if (status === "loading")
    return <RebootModemLoading navigation={navigation} />;
  if (status === "success")
    return <RebootModemSuccess navigation={navigation} />;
  if (status === "failure")
    return (
      <RebootModemFailure navigation={navigation} onRetry={handleReboot} />
    );

  return (
    <RebootModemLayout
      navigation={navigation}
      actions={
        <>
          <PrimaryButton
            title={"Reboot Modem"}
            buttonType="submit"
            onPress={handleReboot}
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
        type="info"
        showCloseIcon={false}
        containerStyle={styles.alert}
        title="Reboot your modem?"
        message="During this process, your service will be briefly interrupted."
      />
    </RebootModemLayout>
  );
};

export default RebootModemScreen;
