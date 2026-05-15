import React from "react";
import { View, Text, StyleSheet } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { theme } from "../../../styles/theme";
import { serviceCard, skeletonLoader } from "../../../styles/compositions";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import SecondaryButton from "../../common/customui/PrimaryButton";

const SpeedBanner = ({ downloadSpeed, uploadSpeed }) => (
  <View style={styles.speedBanner}>
    {/* Download */}
    <View
      style={styles.speedColumn}
      accessible={true}
      accessibilityLabel={`Download Speed: ${downloadSpeed || '--'} Megabits per second`}
    >
      <Text style={styles.speedHeroValue}>{downloadSpeed || '--'}</Text>
      <Text style={styles.speedHeroUnit}>Mbps</Text>
      <View style={styles.speedTagRow}>
        <Text style={styles.speedTagArrow}>{"↓ "}</Text>
        <Text style={styles.speedTagText}>Download</Text>
      </View>
    </View>

    {/* Divider */}
    <View style={styles.speedBannerDivider} />

    {/* Upload */}
    <View
      style={styles.speedColumn}
      accessible={true}
      accessibilityLabel={`Upload Speed: ${uploadSpeed || '--'} Megabits per second`}
    >
      <Text style={styles.speedHeroValue}>{uploadSpeed || '--'}</Text>
      <Text style={styles.speedHeroUnit}>Mbps</Text>
      <View style={styles.speedTagRow}>
        <Text style={styles.speedTagArrow}>{"↑ "}</Text>
        <Text style={styles.speedTagText}>Upload</Text>
      </View>
    </View>
  </View>
);

const InternetCard = ({
  planName,
  downloadSpeed,
  uploadSpeed,
  loading = false,
  dataPlan = null,
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
        <View style={styles.card}>
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
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.serviceHeader}>
          <View
            style={styles.iconWrapper}
            accessible={false}
            importantForAccessibility="no"
            accessibilityElementsHidden={true}
          >
            <MaterialCommunityIcons
              name="web"
              size={16}
              color={theme.colors.primary}
              accessible={false}
              importantForAccessibility="no"
            />
          </View>
          <Text
            style={styles.serviceType}
            accessible={true}
            accessibilityLabel="Internet"
            accessibilityLevel={2}
            accessibilityRole="header"
          >
            INTERNET
          </Text>
        </View>

        {/* Plan Name */}
        <View style={styles.content}>
          <Text
            style={styles.planName}
            accessible={true}
            accessibilityLabel={`Plan Name - ${planName}`}
          >
            {planName}
          </Text>
        </View>

        {/* Speed Banner */}
        <SpeedBanner downloadSpeed={downloadSpeed} uploadSpeed={uploadSpeed} />

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
                    backgroundColor: getDataUsageColor(dataPlan.percentageUsed),
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
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: serviceCard.container,
  card: serviceCard.card,
  bottomButton: serviceCard.bottomButton,
  serviceHeader: serviceCard.serviceHeader,
  iconWrapper: serviceCard.iconWrapper,
  serviceType: serviceCard.serviceType,
  content: serviceCard.content,
  planName: serviceCard.planName,

  // ── Speed Banner ──
  speedBanner: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: theme.spacing.md,
    borderRadius: theme.radius.sm,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.base,
    backgroundColor: `${theme.colors.primary}0C`,
    borderWidth: 1,
    borderColor: `${theme.colors.primary}20`,
  },
  speedColumn: {
    flex: 1,
    alignItems: "center",
  },
  speedHeroValue: {
    fontSize: 36,
    fontFamily: theme.typography.family.semiBold,
    fontWeight: "700",
    color: theme.colors.primaryDark,
    lineHeight: 40,
  },
  speedHeroUnit: {
    fontSize: theme.typography.size.xs,
    fontFamily: theme.typography.family.regular,
    color: theme.colors.text.secondary,
    marginTop: 2,
    letterSpacing: 0.5,
  },
  speedTagRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: theme.spacing.xs,
    backgroundColor: `${theme.colors.primary}14`,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  speedTagArrow: {
    fontSize: theme.typography.size.xs,
    fontWeight: "700",
    color: theme.colors.primary,
  },
  speedTagText: {
    fontSize: theme.typography.size.xs,
    fontFamily: theme.typography.family.semiBold,
    fontWeight: "700",
    color: theme.colors.primary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  speedBannerDivider: {
    width: 1,
    height: 50,
    backgroundColor: `${theme.colors.primary}20`,
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
    marginBottom: theme.spacing.sm,
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
    backgroundColor: `${theme.colors.freedatabackground}30`,
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
