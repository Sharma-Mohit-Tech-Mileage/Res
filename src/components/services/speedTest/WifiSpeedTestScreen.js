import React, { useContext, useState } from "react";
import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomTabBarHeightContext } from "@react-navigation/bottom-tabs";
import CancelButton from "../../common/customui/CancelButton";
import { WebView } from "react-native-webview";
import ProfileSettingsHeader from "../../common/ProfileSettingsHeader";
import PrimaryButton from "../../common/customui/PrimaryButton";
import NotificationAlert from "../../common/customui/NotificationAlert";
import { theme } from "../../../styles/theme";

export default function WifiSpeedTestScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useContext(BottomTabBarHeightContext) ?? 0;
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  return <View style={styles.screen}>
    <ProfileSettingsHeader title="WiFi Speed Test" onPressBack={() => navigation.goBack()} />
    <View style={styles.card}>
    {failed ? <View style={styles.error}>
      <NotificationAlert type="error" title="Unable to load speed test" showCloseIcon={false} message="Check your connection and try again." />
      <PrimaryButton title="Retry" buttonType="submit" onPress={() => { setFailed(false); setAttempt(value => value + 1); }} />
    </View> : <WebView key={attempt} source={{uri: "https://cableone.speedtestcustom.com"}} style={styles.webview}
      startInLoadingState onError={() => setFailed(true)} onHttpError={() => setFailed(true)} accessibilityLabel="Sparklight WiFi speed test" />}
    </View>
    <View style={[styles.footer, { paddingBottom: Math.max(tabBarHeight, insets.bottom) + theme.spacing.base }]}>
      <CancelButton onPress={() => navigation.goBack()} accessibilityLabel="Cancel WiFi speed test" />
    </View>
  </View>;
}
const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: theme.colors.background},
  card: { flex: 1, marginHorizontal: theme.spacing.base, marginTop: theme.spacing.base, borderRadius: theme.radius.base, overflow: "hidden", backgroundColor: theme.colors.white },
  footer: { flexShrink: 0, paddingTop: theme.spacing.base, paddingHorizontal: theme.spacing.base },
  webview: {flex: 1},
  error: {flex: 1, padding: theme.spacing.base},
});
