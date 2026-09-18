import ClockIcon from "../../../res/svgIcons/ClockIcon";
import SpeedometerIcon from "../../../res/svgIcons/SpeedometerIcon";
import EquipmentSpeedResults from "./EquipmentSpeedResults";
import React, { useEffect, useRef, useState } from "react";
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
  FieldContent,
} from "../../common/customui/Typography";
import { theme } from "../../../styles/theme";
import AppStyles from "../../../styles/AppStyles";


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
        <SectionTitle style={styles.plan}>300 Mbps</SectionTitle>
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
              disabled={testing}
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
            {testing && (
              <Body style={styles.testingLabel} accessibilityLiveRegion="polite">
                Testing speed...
              </Body>
            )}
          </SurfaceCard>
          <View accessibilityLiveRegion="polite">
            <EquipmentSpeedResults download={result.download} upload={result.upload} style={{marginHorizontal: 0, marginTop: theme.spacing.md}} />
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
    marginBottom: theme.spacing.base,
  },
  badge: {
    marginLeft: -(theme.iconSize.xl - 18) / 2,
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
    marginBottom: 0,
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
  testingLabel: { textAlign: "center", marginTop: theme.spacing.sm },
  testButton: { paddingVertical: theme.spacing.md },
  footer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.xs,
    borderTopWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    marginTop: 0,
  },
  muted: { color: theme.colors.text.secondary },
});

export default MySpeedCard;
