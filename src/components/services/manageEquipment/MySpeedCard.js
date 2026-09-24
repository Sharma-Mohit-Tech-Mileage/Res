import SpeedTestTimestamp from "../speedTest/SpeedTestTimestamp";
import ServiceLoader from "../../common/customui/ServiceLoader";
import SpeedometerIcon from "../../../res/svgIcons/SpeedometerIcon";
import EquipmentSpeedResults from "./EquipmentSpeedResults";
import React, { useEffect, useState } from "react";
import { Alert, Linking, StyleSheet, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import SpeedAnimation from "../../common/SpeedAnimation";
import SurfaceCard from "../../common/customui/SurfaceCard";
import Touchable from "../../common/customui/Touchable";
import PrimaryButton from "../../common/customui/PrimaryButton";
import LinkText from "../../common/customui/LinkText";
import {
  Body,
  SectionTitle,
} from "../../common/customui/Typography";
import { theme } from "../../../styles/theme";
import AppStyles from "../../../styles/AppStyles";


import speedTestApi from "../../../network/apis/services/speedTest.service";

const DecorativeIcon = ({ name, size = 20, color = theme.colors.primary }) => (
  <View
    accessible={false}
    accessibilityElementsHidden
    importantForAccessibility="no-hide-descendants"
  >
    <MaterialCommunityIcons name={name} size={size} color={color} />
  </View>
);

const MySpeedCard = ({ hasEeroDevice = true, navigation, refreshKey, onLoadEnd }) => {
  const [tab, setTab] = useState("wifi");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [result, setResult] = useState(null);
  useEffect(() => {
    let active = true;
    let request = 0;
    const load = async () => {
      const current = ++request;
      setLoading(true);
      setError(false);
      setResult(null);
      try {
        const latest = await (tab === "wifi" ? speedTestApi.getOoklaResult() : speedTestApi.getEeroHistory());
        if (active && current === request) setResult(latest);
      } catch {
        if (active && current === request) setError(true);
      } finally {
        if (active && current === request) { setLoading(false); onLoadEnd?.(); }
      }
    };
    load();
    const unsubscribe = navigation?.addListener?.("focus", load);
    return () => { active = false; unsubscribe?.(); };
  }, [tab, navigation, refreshKey, onLoadEnd]);
  const testSpeed = () => navigation?.navigate(tab === "wifi" ? "WifiSpeedTest" : "ModemSpeedTest");

  return (
    <SurfaceCard style={styles.card}>
      <View style={styles.header}>
        <View style={styles.badge}>
          <SpeedometerIcon />
        </View>
        <SectionTitle style={styles.title}>My Speed</SectionTitle>
      </View>
      <View style={styles.notice}>
        <DecorativeIcon
          name="information-outline"
          size={18}
          color={theme.colors.primaryDark}
        />
        <View style={styles.noticeContent}>
          <Body style={styles.body}>
            WiFi speeds on mobile devices are typically lower than wired speeds.
          </Body>
          <LinkText
            text="Learn More"
            style={styles.learnMore}
            textStyle={styles.learnMoreText}
            onPress={() => Linking.openURL("https://support.sparklight.com/hc/en-us/articles/115010349927-Can-I-Run-an-Internet-Speed-Test").catch(() => Alert.alert("Unable to open link", "Please try again."))}
          />
        </View>
      </View>
      <View style={styles.panel}>
        <View style={styles.tabs} accessibilityRole="tablist">
          {["wifi", "modem"].map((value) => (
            <Touchable
              key={value}
              accessibilityRole="tab"
              accessibilityLabel={
                value === "wifi" ? "WiFi Speed" : "Modem Speed"
              }
              accessibilityState={{ selected: tab === value }}
              disabled={loading}
              onPress={() => setTab(value)}
              minSize={0}
              style={[styles.tab, tab === value && styles.activeTab]}
            >
              <SectionTitle
                style={[styles.tabText, tab === value && styles.activeTabText]}
              >
                {value === "wifi" ? "WiFi Speed" : "Modem Speed"}
              </SectionTitle>
            </Touchable>
          ))}
        </View>
        <View style={styles.testContent}>
          <View style={styles.descriptionContainer}>
          <Body style={styles.description}>
            {tab === "wifi"
              ? "Wifi speed reported by your mobile device"
              : "Speed reported by your modem"}
          </Body>
          </View>
          <SurfaceCard style={styles.connection}>
            <SpeedAnimation speedType={tab} hasEeroDevice={hasEeroDevice} />
            {loading && (
              <Body style={styles.loadingLabel} accessibilityLiveRegion="polite">
                Loading latest result...
              </Body>
            )}
          </SurfaceCard>
          <View accessibilityLiveRegion="polite">
            <EquipmentSpeedResults loading={loading} download={result?.download ?? "---"} upload={result?.upload ?? "---"} style={{marginHorizontal: 0, marginTop: theme.spacing.md}} />
          </View>
          {error && <Body accessibilityLiveRegion="polite">Unable to load the latest result.</Body>}
          {!loading && !error && !result && <Body>No speed test results yet.</Body>}
          {loading ? (
            <View style={styles.testLoader} accessible accessibilityRole="progressbar"
              accessibilityLabel="Loading speed test data" accessibilityState={{ busy: true }}>
              <ServiceLoader />
            </View>
          ) : <PrimaryButton
            title="Test Speed"
            buttonType="submit"
            onPress={testSpeed}
            style={styles.testButton}
          />}
        </View>
        <SpeedTestTimestamp label="Last run" value={result?.updated} loading={loading} />
      </View>
    </SurfaceCard>
  );
};

const styles = StyleSheet.create({
  card: {
     ...AppStyles.card,
    marginHorizontal: theme.spacing.base,
    marginBottom: theme.spacing.base,
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing['2xl'],
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    marginBottom: theme.spacing.base,
  },
  badge: {
    marginLeft: -(theme.iconSize.xl - 25) / 2,
    width: theme.iconSize.xl,
    height: theme.iconSize.xl,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.secondarySurface,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { flex: 1, color: theme.colors.text.secondary },
  plan: { color: theme.colors.primaryDark },
  notice: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.secondarySurface,
    borderRadius: theme.radius.base,
    padding: theme.spacing.base,
    marginBottom: theme.spacing.base,
    paddingBottom: 0,
  },
  noticeContent: { flex: 1 },
  body: {
    fontSize: theme.typography.size.sm,
    lineHeight: theme.typography.lineHeight.tight,
  },
  learnMore: { paddingHorizontal: 0, paddingVertical: theme.spacing.sm },
  learnMoreText: {
    ...AppStyles.hyperlink,
    fontSize: theme.typography.size.sm,
    color: theme.colors.purpleBright,
  },
  panel: { borderWidth: 1, borderColor: theme.colors.border },
  tabs: { flexDirection: "row" },
  tab: {
    flex: 1,
    minHeight: 48,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.secondarySurface,
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  activeTab: { backgroundColor: theme.colors.white, borderBottomColor: theme.colors.white },
  tabText: { color: theme.colors.text.secondary },
  activeTabText: { color: theme.colors.purpleBright },
  testContent: { paddingHorizontal: theme.spacing.md, paddingTop: 0, paddingBottom: theme.spacing.lg },
  descriptionContainer: { minHeight: 48, justifyContent: "center", alignItems: "center" },
  description: {
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: theme.typography.size.sm,
    marginVertical: 0,
  },
  connection: {
    ...theme.shadows.sm,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    minHeight: 104,
    justifyContent: "center",
  },
  loadingLabel: { textAlign: "center", marginTop: theme.spacing.sm },
  testButton: { paddingVertical: theme.spacing.md },
  testLoader: { minHeight: 60, alignItems: "center", justifyContent: "center" },
});

export default MySpeedCard;
