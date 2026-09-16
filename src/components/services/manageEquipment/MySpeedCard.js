import ClockIcon from "../../../res/svgIcons/ClockIcon";
import SpeedometerIcon from "../../../res/svgIcons/SpeedometerIcon";
import DownloadcircleIcon from "../../../res/svgIcons/DownloadcircleIcon";
import UploadcircleIcon from "../../../res/svgIcons/UploadcircleIcon";
import React, { useEffect, useRef, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import SpeedAnimation from "../../common/SpeedAnimation";
import SurfaceCard from "../../common/customui/SurfaceCard";
import Touchable from "../../common/customui/Touchable";
import PrimaryButton from "../../common/customui/PrimaryButton";
import LinkText from "../../common/customui/LinkText";
import {
  Body,
  FieldTitle,
  FieldContent,
  SectionTitle,
} from "../../common/customui/Typography";
import { theme } from "../../../styles/theme";
import AppStyles from "../../../styles/AppStyles";
import { dataUsageTabs } from "../../../styles/compositions";


const SAMPLE_RESULTS = {
  wifi: { download: "220.74", upload: "216.29" },
  modem: { download: "300.00", upload: "285.50" },
};

const DecorativeIcon = ({ name, size = 20, color = theme.colors.primary }) => (
  <View
    accessible={false}
    accessibilityElementsHidden
    importantForAccessibility="no-hide-descendants"
  >
    <MaterialCommunityIcons name={name} size={size} color={color} />
  </View>
);

const SpeedResult = ({ label, value, icon: ResultIcon }) => (
  <View style={styles.result}>
    <View style={styles.resultValue}>
      <ResultIcon width={12} height={12} accessible={false} />
      <Body style={styles.number}>
        {value.split(".")[0]}
        <Body style={styles.decimal}>.{value.split(".")[1]}</Body>
      </Body>
    </View>
    <FieldContent style={styles.resultLabel}>
      <FieldTitle>{label}</FieldTitle> Mbps
    </FieldContent>
  </View>
);

// Static preview only: these values do not measure the device's connection.
const MySpeedCard = ({ hasEeroDevice = true, navigation }) => {
  const [tab, setTab] = useState("wifi");
  const [testing, setTesting] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const testSpeed = () => {
    if (navigation) {
      navigation.navigate(tab === "wifi" ? "WifiSpeedTest" : "ModemSpeedTest");
      return;
    }
    if (timer.current) return;
    setTesting(true);
    timer.current = setTimeout(() => {
      setTesting(false);
      timer.current = null;
    }, 2000);
  };
  const result = SAMPLE_RESULTS[tab];

  return (
    <SurfaceCard style={styles.card}>
      <View style={styles.header}>
        <View style={styles.badge}>
          <SpeedometerIcon />
        </View>
        <SectionTitle style={styles.title}>My Speed</SectionTitle>
        <FieldTitle style={styles.plan}>300 Mbps</FieldTitle>
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
            onPress={() =>
              Alert.alert(
                "About WiFi speed",
                "WiFi speeds vary with distance from your router, interference, and your device. A wired modem connection can provide higher speeds. The results shown here are sample values for this UI preview.",
              )
            }
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
              disabled={testing}
              onPress={() => setTab(value)}
              minSize={0}
              style={[styles.tab, tab === value && styles.activeTab]}
            >
              <FieldTitle
                style={[styles.tabText, tab === value && styles.activeTabText]}
              >
                {value === "wifi" ? "WiFi Speed" : "Modem Speed"}
              </FieldTitle>
            </Touchable>
          ))}
        </View>
        <View style={styles.testContent}>
          <Body style={styles.description}>
            {tab === "wifi"
              ? "Wifi speed reported by your mobile device"
              : "Speed reported by your modem"}
          </Body>
          <SurfaceCard style={styles.connection}>
            <SpeedAnimation speedType={tab} hasEeroDevice={hasEeroDevice} />
            {testing && (
              <Body style={styles.testingLabel} accessibilityLiveRegion="polite">
                Testing speed...
              </Body>
            )}
          </SurfaceCard>
          <View style={styles.results} accessibilityLiveRegion="polite">
            <SpeedResult
              label="Download"
              value={result.download}
              icon={DownloadcircleIcon}
            />
            <SpeedResult
              label="Upload"
              value={result.upload}
              icon={UploadcircleIcon}
            />
          </View>
          <PrimaryButton
            title={testing ? "Testing Speed..." : "Test Speed"}
            buttonType="submit"
            disabled={testing}
            onPress={testSpeed}
            style={styles.testButton}
          />
        </View>
        <View style={styles.footer}>
          <ClockIcon color={theme.colors.text.secondary} />
          <FieldContent>
            <FieldContent style={styles.muted}>Last run </FieldContent>10/05/23
            11:32am
          </FieldContent>
        </View>
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
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.base,
  },
  badge: {
    width: theme.iconSize.xl,
    height: theme.iconSize.xl,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surfaceVariant,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { flex: 1, color: theme.colors.text.secondary },
  plan: { color: theme.colors.primaryDark },
  notice: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: theme.radius.base,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.base,
  },
  noticeContent: { flex: 1 },
  body: {
    fontSize: theme.typography.size.sm,
    lineHeight: theme.typography.lineHeight.tight,
  },
  learnMore: { paddingHorizontal: 0, paddingVertical: theme.spacing.sm },
  learnMoreText: {
    textDecorationLine: "none",
    fontSize: theme.typography.size.sm,
    color: theme.colors.primaryDark,
  },
  panel: { borderWidth: 1, borderColor: theme.colors.border },
  tabs: {
    ...dataUsageTabs.tabsContainer,
    padding: 3,
    marginBottom: theme.spacing.sm,
  },
  tab: {
    ...dataUsageTabs.tab,
    paddingVertical: 10,
    minHeight: 44,
    justifyContent: "center",
  },
  activeTab: dataUsageTabs.activeTab,
  tabText: {
    ...dataUsageTabs.tabText,
    fontSize: theme.typography.size.base,
    fontWeight: "700",
  },
  activeTabText: { color: theme.colors.primaryDark },
  testContent: { padding: theme.spacing.sm },
  description: {
    textAlign: "center",
    fontSize: theme.typography.size.sm,
    marginVertical: theme.spacing.sm,
  },
  connection: {
    ...theme.shadows.sm,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    minHeight: 104,
    justifyContent: "center",
  },
  testingLabel: { textAlign: "center", marginTop: theme.spacing.sm },
  results: { flexDirection: "row", marginTop: theme.spacing.lg },
  result: { flex: 1, alignItems: "center" },
  resultValue: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing["2xs"],
  },
  number: {
    color: theme.colors.primary,
    fontSize: theme.typography.size["2xl"],
  },
  decimal: {
    color: theme.colors.primary,
    fontSize: theme.typography.size.base,
  },
  resultLabel: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing["2xs"],
  },
  testButton: { paddingVertical: theme.spacing.sm },
  footer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.xs,
    borderTopWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  muted: { color: theme.colors.text.secondary },
});

export default MySpeedCard;
