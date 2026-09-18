import React, { useEffect, useRef, useState } from "react";
import { StyleSheet } from "react-native";
import NotificationAlert from "../../common/customui/NotificationAlert";
import PrimaryButton from "../../common/customui/PrimaryButton";
import { theme } from "../../../styles/theme";
import RebootModemLayout from "./RebootModemLayout";
import RebootModemLoading from "./RebootModemLoading";
import RebootModemSuccess from "./RebootModemSuccess";
import RebootModemFailure from "./RebootModemFailure";

// UI demo: first attempt fails after 2 seconds; retry succeeds.
// An injected onReboot can replace the demo when the service is ready.
const RebootModemScreen = ({ navigation, onReboot }) => {
  const [status, setStatus] = useState("confirmation");
  const pending = useRef(false);
  const mounted = useRef(true);
  const demoTimer = useRef(null);
  const demoAttempts = useRef(0);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      clearTimeout(demoTimer.current);
    };
  }, []);
  const handleReboot = async () => {
    if (pending.current) return;
    pending.current = true;
    setStatus("loading");
    if (!onReboot) {
      demoAttempts.current += 1;
      demoTimer.current = setTimeout(() => {
        if (mounted.current) {
          setStatus(demoAttempts.current === 1 ? "failure" : "success");
        }
        pending.current = false;
      }, 2000);
      return;
    }
    try {
      await onReboot();
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
    <RebootModemLayout navigation={navigation}>
      <NotificationAlert
        type="info"
        showCloseIcon={false}
        containerStyle={styles.confirmation}
        title="Reboot your modem?"
        message="During this process, your service will be briefly interrupted."
      />
      <PrimaryButton
        title={"Reboot Modem"}
        buttonType="submit"
        onPress={handleReboot}
        containerStyle={styles.reboot}
      />
      <PrimaryButton
        title="Cancel"
        buttonType="cancel"
        onPress={() => navigation.goBack()}
      />
    </RebootModemLayout>
  );
};

const styles = StyleSheet.create({
  confirmation: { marginTop: theme.spacing.base, marginBottom: 0 },
  reboot: { marginTop: theme.spacing.xl },
});

export default RebootModemScreen;
