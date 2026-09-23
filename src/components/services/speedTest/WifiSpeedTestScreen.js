import React, { useContext, useState, useEffect, useRef } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomTabBarHeightContext } from "@react-navigation/bottom-tabs";
import CancelButton from "../../common/customui/CancelButton";
import { WebView } from "react-native-webview";
import ProfileSettingsHeader from "../../common/ProfileSettingsHeader";
import ServiceLoader from "../../common/customui/ServiceLoader";
import PrimaryButton from "../../common/customui/PrimaryButton";
import NotificationAlert from "../../common/customui/NotificationAlert";
import Config from "react-native-config";
import speedTestApi from "../../../network/apis/services/speedTest.service";
import { OOKLA_HTML, parseOoklaCompletion } from "./ooklaBridge";
import { theme } from "../../../styles/theme";
import AppStyles from "../../../styles/AppStyles";

export default function WifiSpeedTestScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const tabBarHeight = useContext(BottomTabBarHeightContext) ?? 0;
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [saveState, setSaveState] = useState(null);
  const submissions = useRef(new Map());
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  const saveResult = async (result, retry = false) => {
    const previous = submissions.current.get(result.testId);
    if (previous && (!retry || previous !== "failed")) return;
    submissions.current.set(result.testId, "saving");
    setSaveState({ status: "saving", result });
    try {
      const saved = await speedTestApi.saveOoklaResult(result);
      if (saved !== true) throw new Error("Result not saved");
      submissions.current.set(result.testId, "saved");
      if (mounted.current)
        setSaveState((current) =>
          current?.result?.testId === result.testId
            ? { status: "saved", result }
            : current,
        );
    } catch {
      submissions.current.set(result.testId, "failed");
      if (mounted.current)
        setSaveState((current) =>
          current?.result?.testId === result.testId
            ? { status: "failed", result }
            : current,
        );
    }
  };
  const onMessage = (event) => {
    let result;
    try {
      result = parseOoklaCompletion(event.nativeEvent.data);
    } catch {
      setSaveState({ status: "invalid" });
      return;
    }
    if (result) saveResult(result);
  };
  return (
    <View style={styles.screen}>
      <ProfileSettingsHeader
        title="WiFi Speed Test"
        showChat={false}
        onPressBack={() => navigation.goBack()}
      />
      <ScrollView
        style={styles.content}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom:
              Math.max(tabBarHeight, insets.bottom) + theme.spacing["2xl"],
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.card,
            { height: Math.max(640, (width - theme.spacing.base * 2) * 1.6) },
          ]}
        >
          <View style={styles.cardContent}>
            {failed ? (
              <View style={styles.error}>
                <NotificationAlert
                  type="error"
                  title="Unable to load speed test"
                  showCloseIcon={false}
                  message="Check your connection and try again."
                />
                <PrimaryButton
                  title="Retry"
                  buttonType="submit"
                  onPress={() => {
                    setFailed(false);
                    setAttempt((value) => value + 1);
                  }}
                />
              </View>
            ) : (
              <WebView
                key={attempt}
                source={{ html: OOKLA_HTML, baseUrl: Config.PORTAL_BASE_URL }}
                originWhitelist={["https://*"]}
                onMessage={onMessage}
                style={styles.webview}
                scrollEnabled={false}
                nestedScrollEnabled={false}
                bounces={false}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                startInLoadingState
                renderLoading={() => (
                  <View style={styles.loadingOverlay}>
                    <ServiceLoader />
                  </View>
                )}
                onError={() => setFailed(true)}
                onHttpError={() => setFailed(true)}
                accessibilityLabel="Sparklight WiFi speed test"
              />
            )}
          </View>
        </View>
        {saveState && (
          <View style={styles.saveStatus}>
            <NotificationAlert
              type={
                saveState.status === "failed" || saveState.status === "invalid"
                  ? "error"
                  : "info"
              }
              showCloseIcon={false}
              title={
                saveState.status === "saving"
                  ? "Saving speed test result"
                  : saveState.status === "saved"
                  ? "Speed test result saved"
                  : "Unable to save speed test result"
              }
              message={
                saveState.status === "failed"
                  ? "Your test completed. Retry saving without running another test."
                  : saveState.status === "invalid"
                  ? "The widget returned an incomplete result. Please run the test again."
                  : saveState.status === "saved"
                  ? "Your result is available in My Speed."
                  : "Please wait while your result is saved."
              }
            />
            {saveState.status === "failed" && (
              <PrimaryButton
                title="Retry Saving Result"
                buttonType="submit"
                onPress={() => saveResult(saveState.result, true)}
              />
            )}
          </View>
        )}
        <View style={styles.footer}>
          <CancelButton
            onPress={() => navigation.goBack()}
            accessibilityLabel="Cancel WiFi speed test"
          />
        </View>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#E9EEF2" },
  content: { flex: 1 },
  scrollContent: {
    paddingTop: theme.spacing["2xl"],
    paddingHorizontal: theme.spacing.base,
  },
  card: {
    ...AppStyles.card,
    padding: 0,
  },
  cardContent: {
    flex: 1,
    padding: 0,
    borderRadius: AppStyles.card.borderRadius - AppStyles.card.borderWidth,
    overflow: "hidden",
  },
  footer: {
    flexShrink: 0,
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.base,
  },
  saveStatus: { paddingTop: theme.spacing.base },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.white,
  },
  webview: { flex: 1, backgroundColor: theme.colors.white },
  error: { flex: 1, padding: theme.spacing.base },
});
