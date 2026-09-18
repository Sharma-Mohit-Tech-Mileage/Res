import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import ProfileSettingsHeader from "../../common/ProfileSettingsHeader";
import PrimaryButton from "../../common/customui/PrimaryButton";
import NotificationAlert from "../../common/customui/NotificationAlert";
import { theme } from "../../../styles/theme";

export default function WifiSpeedTestScreen({ navigation }) {
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  return <View style={styles.screen}>
    <ProfileSettingsHeader title="WiFi Speed Test" onPressBack={() => navigation.goBack()} />
    {failed ? <View style={styles.error}>
      <NotificationAlert type="error" title="Unable to load speed test" showCloseIcon={false} message="Check your connection and try again." />
      <PrimaryButton title="Retry" buttonType="submit" onPress={() => { setFailed(false); setAttempt(value => value + 1); }} />
    </View> : <WebView key={attempt} source={{uri: "https://cableone.speedtestcustom.com"}} style={styles.webview}
      startInLoadingState onError={() => setFailed(true)} onHttpError={() => setFailed(true)} accessibilityLabel="Sparklight WiFi speed test" />}
    <PrimaryButton title="Cancel" onPress={() => navigation.goBack()} />
  </View>;
}
const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: theme.colors.background},
  webview: {flex: 1},
  error: {flex: 1, padding: theme.spacing.base},
});
