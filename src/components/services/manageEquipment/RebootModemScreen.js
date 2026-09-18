import React, { useEffect, useRef, useState } from "react";
import { StyleSheet } from "react-native";
import NotificationAlert from "../../common/customui/NotificationAlert";
import PrimaryButton from "../../common/customui/PrimaryButton";
import { Body } from "../../common/customui/Typography";
import { theme } from "../../../styles/theme";
import {Color} from "../../../../GlobalStyles"
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
        iconSize={20}
        containerStyle={styles.confirmation}
        title="Reboot your modem?"
      >
        <Body style={styles.message}>
          During this process, your service will be briefly interrupted.
        </Body>
      </NotificationAlert>
      <PrimaryButton
        title={"Reboot Modem"}
        buttonType="submit"
        onPress={handleReboot}
        style={styles.button}
        containerStyle={styles.reboot}
      />
      <PrimaryButton
        title="Cancel"
        buttonType="cancel"
        onPress={() => navigation.goBack()}
        style={styles.button}
        containerStyle={styles.cancel}
      />
    </RebootModemLayout>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: theme.spacing.xl },
  card: {
    paddingHorizontal: theme.spacing.base,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing["3xl"],
    margin: 16,
  },
  title: {
    fontSize: theme.typography.size["2xl"],
    color: theme.colors.text.secondary,
  },
  confirmation: {
    marginTop: theme.spacing.base,
    marginBottom: 0,
    paddingVertical: theme.spacing.base,
    borderRadius: theme.radius.sm,
  },
  message: {
    textAlign: "left",
    marginTop: theme.spacing["3xs"],
    lineHeight: theme.typography.lineHeight.normal,
  },
  button: { paddingVertical: theme.spacing.md },
  reboot: { marginTop: theme.spacing.xl },
  cancel: { marginTop: theme.spacing.xl },
  help: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    paddingHorizontal: 0,
    marginTop: theme.spacing["3xl"],
  },
  helpTitle: { fontSize: theme.typography.size.xbl },
});

export default RebootModemScreen;
