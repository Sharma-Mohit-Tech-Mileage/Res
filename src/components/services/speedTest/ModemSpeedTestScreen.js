import React, { useEffect, useRef, useState } from "react";
import { View, RefreshControl } from "react-native";
import SurfaceCard from "../../common/customui/SurfaceCard";
import PrimaryButton from "../../common/customui/PrimaryButton";
import { Body, FieldTitle } from "../../common/customui/Typography";
import SpeedTestLayout from "./SpeedTestLayout";
import SpeedTestResults from "./SpeedTestResults";
import ModemSpeedTestProgress from "./ModemSpeedTestProgress";
import ModemSpeedTestComplete from "./ModemSpeedTestComplete";
import ClockIcon from "../../../res/svgIcons/ClockIcon";
import styles from "./speedTestStyles";
import AppStyles from "../../../styles/AppStyles";

// Hardcoded preview; no network speed measurement is performed.
const ModemSpeedTestScreen = ({ navigation, onRunSpeedTest }) => {
  const [complete, setComplete] = useState(false);
  const timer = useRef(null);
  const mounted = useRef(false);
  const pending = useRef(false);
  const [error, setError] = useState(false);
  const [results, setResults] = useState(null);
  const run = async () => {
    if (pending.current) return;
    pending.current = true;
    clearTimeout(timer.current);
    setComplete(false);
    setError(false);
    setResults(null);
    if (!onRunSpeedTest) {
      timer.current = setTimeout(() => {
        if (mounted.current) {
          setResults({
            download: "963",
            upload: "59",
            updated: new Date().toLocaleString(),
          });
          setComplete(true);
        }
        pending.current = false;
      }, 3000);
      return;
    }
    try {
      const result = await onRunSpeedTest();
      if (result?.download == null || result?.upload == null)
        throw new Error("Missing speed results");
      if (mounted.current) {
        setResults({ ...result, updated: new Date().toLocaleString() });
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
      clearTimeout(timer.current);
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
        <SpeedTestResults
          download={results?.download ?? "---"}
          upload={results?.upload ?? "---"}
        />
        <View style={styles.updated}>
          <ClockIcon />
          <View>
            <FieldTitle style={styles.updatedTitle}>Updated</FieldTitle>
            <Body>{results?.updated ?? "---"}</Body>
          </View>
        </View>
      </SurfaceCard>
    </SpeedTestLayout>
  );
};
export default ModemSpeedTestScreen;
