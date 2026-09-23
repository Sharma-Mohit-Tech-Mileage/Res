import React, { useEffect, useRef, useState } from "react";
import { RefreshControl } from "react-native";
import SpeedTestTimestamp from "./SpeedTestTimestamp";
import SurfaceCard from "../../common/customui/SurfaceCard";
import PrimaryButton from "../../common/customui/PrimaryButton";
import SpeedTestLayout from "./SpeedTestLayout";
import SpeedTestResults from "./SpeedTestResults";
import ModemSpeedTestProgress from "./ModemSpeedTestProgress";
import ModemSpeedTestComplete from "./ModemSpeedTestComplete";
import styles from "./speedTestStyles";
import AppStyles from "../../../styles/AppStyles";

import speedTestApi from "../../../network/apis/services/speedTest.service";
import NotificationAlert from "../../common/customui/NotificationAlert";
const ModemSpeedTestScreen = ({ navigation, route, onRunSpeedTest }) => {
  const [complete, setComplete] = useState(false);
  const mounted = useRef(false);
  const pending = useRef(false);
  const [error, setError] = useState(false);
  const [results, setResults] = useState(null);
  const loading = !complete && !error;
  const run = async () => {
    if (pending.current) return;
    pending.current = true;
    setComplete(false);
    setError(false);
    setResults(null);
    try {
      const result = await (onRunSpeedTest ? onRunSpeedTest() : speedTestApi.runEeroSpeedTest({
        idType: route?.params?.idType || "account",
        isCancelled: () => !mounted.current,
      }));
      if (result?.download == null || result?.upload == null)
        throw new Error("Missing speed results");
      if (mounted.current) {
        setResults({ ...result, updated: result.updated || new Date().toLocaleString() });
        setComplete(true);
      }
    } catch {
      if (mounted.current) setError(true);
    } finally {
      pending.current = false;
    }
  };
  useEffect(() => {
    mounted.current = true;
    run();
    return () => {
      mounted.current = false;
    };
  }, []);
  return (
    <SpeedTestLayout
      navigation={navigation}
      title="Modem Speed Test"
      refreshControl={<RefreshControl refreshing={false} onRefresh={run} />}
      action={
        <PrimaryButton
          title={
            error
              ? "Retry Speed Test"
              : complete
              ? "Run Speed Test Again"
              : "Run Speed Test"
          }
          buttonType="submit"
          disabled={!complete && !error}
          onPress={run}
          containerStyle={styles.action}
          style={!complete && !error && styles.disabled}
          textStyle={!complete && !error && styles.disabledText}
        />
      }
    >
      <SurfaceCard style={AppStyles.card}>
        {error ? (
          <ModemSpeedTestComplete error />
        ) : complete ? (
          <ModemSpeedTestComplete />
        ) : (
          <ModemSpeedTestProgress />
        )}
        {results?.historySaved === false && <NotificationAlert
          type="error" title="Result not saved" showCloseIcon={false}
          message="Your test completed, but its history could not be saved."
        />}
        <SpeedTestResults
          loading={loading}
          download={results?.download ?? "---"}
          upload={results?.upload ?? "---"}
        />
        <SpeedTestTimestamp variant="updated" label="Updated" value={results?.updated} loading={loading} />
      </SurfaceCard>
    </SpeedTestLayout>
  );
};
export default ModemSpeedTestScreen;
