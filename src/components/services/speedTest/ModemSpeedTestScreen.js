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

// Hardcoded preview; no network speed measurement is performed.
const ModemSpeedTestScreen = ({ navigation }) => {
  const [complete, setComplete] = useState(false);
  const timer = useRef(null);
  const run = () => {
    clearTimeout(timer.current);
    setComplete(false);
    timer.current = setTimeout(() => setComplete(true), 3000);
  };
  useEffect(() => {
    run();
    return () => clearTimeout(timer.current);
  }, []);
  return (
    <SpeedTestLayout
      navigation={navigation}
      title="Modem Speed Test"
      refreshControl={<RefreshControl refreshing={false} onRefresh={run} />}
      action={
        <PrimaryButton
          title={complete ? "Run Speed Test Again" : "Run Speed Test"}
          buttonType="submit"
          disabled={!complete}
          onPress={run}
          containerStyle={styles.action}
          style={!complete && styles.disabled}
        />
      }
    >
      <SurfaceCard style={styles.card}>
        {complete ? <ModemSpeedTestComplete /> : <ModemSpeedTestProgress />}
        <SpeedTestResults
          download={complete ? "963" : "---"}
          upload={complete ? "59" : "---"}
        />
        <View style={styles.updated}>
          <ClockIcon />
          <View>
            <FieldTitle style={styles.updatedTitle}>Updated</FieldTitle>
            <Body>{complete ? "07/24/24   4:46pm" : "---"}</Body>
          </View>
        </View>
      </SurfaceCard>
    </SpeedTestLayout>
  );
};
export default ModemSpeedTestScreen;
