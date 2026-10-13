import ServiceIcon from "../../../res/svgIcons/InternetServiceIcon";
import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { theme } from "../../../styles/theme";
import { serviceCard, skeletonLoader } from "../../../styles/compositions";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import SecondaryButton from "../../common/customui/PrimaryButton";
import { SectionTitle, Hyperlink } from "../../common/customui/Typography";
import AppStyles from "../../../styles/AppStyles";
import SpeedBanner from "./SpeedBanner";
import SpeedometerIcon from "../../../res/svgIcons/SpeedometerIcon";

const InternetCard = ({
  planName,
  downloadSpeed,
  uploadSpeed,
  loading = false,
  dataPlan = null,
  onViewMySpeed,
}) => {
  const navigation = useNavigation();

  const getDataUsageColor = (percentage) => {
    if (percentage >= 90) return theme.colors.status.error;
    if (percentage >= 75) return theme.colors.status.warning;
    return theme.colors.primaryDark;
  };

  const handleViewDataUsage = () => {
    navigation.navigate("DataUsage", {
      planName,
      downloadSpeed,
      uploadSpeed,
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={[styles.card, styles.cardSpacing1]}>
          <SkeletonPlaceholder
            backgroundColor={theme.colors.skeleton.base}
            highlightColor={theme.colors.skeleton.highlight}
            speed={1000}
          >
            <View style={styles.skeletonHeader} />
            <View style={styles.skeletonTitle} />
            <View style={styles.skeletonSpeedContainer}>
              <View style={styles.skeletonSpeedRight} />
              <View style={styles.skeletonSpeedLeft} />
            </View>
          </SkeletonPlaceholder>
        </View>
      </View>
    );
  }

  if (!planName) return null;

  return (
    <View style={styles.container}>
      <View style={[styles.card, styles.cardSpacing]}>
        {/* Header */}
        <View style={styles.cardHreader}>
          <View
            style={styles.iconWrapper}
            accessible={false}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          >
            <ServiceIcon />
          </View>
          <SectionTitle
            style={{ paddingLeft: 8 }}
            accessible={true}
            accessibilityLabel="Internet"
            accessibilityLevel={2}
            accessibilityRole="header"
          >
            Internet
          </SectionTitle>
        </View>
        <View style={{ padding: 16, paddingBottom: dataPlan ? 0 : 16 }}>
          {/* Plan Name */}
          <View style={styles.content}>
            <Text
              style={styles.planName}
              accessible={true}
              accessibilityLabel={`Plan Name - ${planName}`}
            >
              {planName && planName.charAt(0).toUpperCase() + planName.slice(1)}
            </Text>
          </View>

          {/* Speed Banner */}
          <SpeedBanner
            downloadSpeed={downloadSpeed}
            uploadSpeed={uploadSpeed}
          />

          {/* DATA USAGE SNAPSHOT */}
          {dataPlan && (
            <View style={styles.dataUsageSnapshot}>
              {/* Header row with label + percentage badge */}
              <View style={styles.snapshotHeaderRow}>
                <Text style={styles.snapshotLabel}>Data Usage</Text>
                <View
                  style={[
                    styles.percentBadge,
                    {
                      backgroundColor:
                        getDataUsageColor(dataPlan.percentageUsed) + "15",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.percentBadgeText,
                      { color: getDataUsageColor(dataPlan.percentageUsed) },
                    ]}
                  >
                    {dataPlan.percentageUsed}% used
                  </Text>
                </View>
              </View>

              {/* Progress bar */}
              <View style={styles.snapshotBar}>
                <View
                  style={[
                    styles.snapshotFill,
                    {
                      width: `${Math.min(dataPlan.percentageUsed, 100)}%`,
                      backgroundColor: getDataUsageColor(
                        dataPlan.percentageUsed,
                      ),
                    },
                  ]}
                />
              </View>

              {/* Usage breakdown */}
              <View style={styles.usageBreakdown}>
                <View style={styles.usageStat}>
                  <Text style={styles.usageStatValue}>{dataPlan.usedGB}</Text>
                  <Text style={styles.usageStatLabel}> GB used</Text>
                </View>
                <View style={styles.usageStat}>
                  <Text style={styles.usageStatValue}>
                    {(dataPlan.totalGB - dataPlan.usedGB).toFixed(2)}
                  </Text>
                  <Text style={styles.usageStatLabel}> GB left</Text>
                </View>
                <View style={styles.usageStat}>
                  <Text style={styles.usageStatValue}>{dataPlan.totalGB}</Text>
                  <Text style={styles.usageStatLabel}> GB total</Text>
                </View>
              </View>

              <SecondaryButton
                title="View Data Usage"
                buttonType="submit"
                onPress={handleViewDataUsage}
                style={styles.bottomButton}
                accessibilityLabel="View Data Usage details"
                accessibilityRole="button"
              />

              <Pressable
                style={styles.speedTestRow}
                onPress={onViewMySpeed}
                accessibilityRole="button"
                accessibilityLabel="Test your device speed now, go to My Speed"
              >
                <SpeedometerIcon />
                <Hyperlink style={styles.speedTestLink}>
                  Test your device speed now
                </Hyperlink>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { ...serviceCard.container, marginBottom: theme.spacing.base },
  card: {
    ...AppStyles.card,
  },
  cardSpacing: {
    marginHorizontal: 16,
  },
  cardSpacing1: {
    padding: 16,
    marginHorizontal: 16,
  },
  bottomButton: serviceCard.bottomButton,
  serviceHeader: serviceCard.serviceHeader,
  iconWrapper: serviceCard.iconWrapper,
  serviceType: serviceCard.serviceType,
  content: serviceCard.content,
  planName: serviceCard.planName,

  // ── Speed Banner ──
  cardHreader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.white,
    width: "100%",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    padding: 10,
  },
  // ── Skeleton ──
  skeleton: skeletonLoader.skeleton,
  skeletonHeader: skeletonLoader.skeletonHeader,
  skeletonTitle: skeletonLoader.skeletonTitle,
  skeletonSpeedContainer: skeletonLoader.skeletonSpeedContainer,
  skeletonSpeedRight: skeletonLoader.skeletonSpeedRight,
  skeletonSpeedLeft: skeletonLoader.skeletonSpeedLeft,

  // ── Data Usage Snapshot ──
  dataUsageSnapshot: {
    marginTop: theme.spacing.base,
    paddingTop: theme.spacing.base,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  snapshotHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing.base,
  },
  speedTestRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingVertical: theme.spacing.lg,
    minHeight: 45,
  },
  speedTestLink: {
    marginLeft: theme.spacing.sm,
    alignSelf: "center",
  },
  snapshotLabel: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.family.semiBold,
    fontWeight: "600",
    color: theme.colors.text.secondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  percentBadge: {
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  percentBadgeText: {
    fontSize: theme.typography.size.xs,
    fontFamily: theme.typography.family.semiBold,
    fontWeight: "700",
  },
  snapshotBar: {
    height: 8,
    backgroundColor: theme.colors.blueBright,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: theme.spacing.md,
  },
  snapshotFill: {
    height: "100%",
    borderRadius: 4,
  },
  usageBreakdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing.sm,
  },
  usageStat: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  usageStatValue: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.family.semiBold,
    fontWeight: "700",
    color: theme.colors.text.primary,
  },
  usageStatLabel: {
    fontSize: theme.typography.size.xs,
    fontFamily: theme.typography.family.regular,
    color: theme.colors.text.secondary,
  },
});

export default InternetCard;
