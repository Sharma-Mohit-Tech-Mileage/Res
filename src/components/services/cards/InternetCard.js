/**
 * InternetCard Component - WITH DATA USAGE SNAPSHOT
 * Path: src/components/services/cards/InternetCard.js
 * 
 * Displays internet service details with:
 * - Plan name
 * - Download/Upload speeds
 * - Quick data usage snapshot (NEW!)
 * - Navigation to full data usage screen
 */

import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { theme } from "../../../styles/theme";
import { serviceCard, internetSpeed, skeletonLoader } from "../../../styles/compositions";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

const InternetCard = ({
  planName,
  downloadSpeed,
  uploadSpeed,
  loading = false,
  // NEW: Data usage props
  dataPlan = null, // { usedGB, totalGB, percentageUsed }
}) => {
  const navigation = useNavigation();

  // Get status color for data usage
  const getDataUsageColor = (percentage) => {
    if (percentage >= 90) return theme.colors.status.error;
    if (percentage >= 75) return theme.colors.status.warning;
    return theme.colors.status.success;
  };

  // Handle navigation to full data usage screen
  const handleViewDataUsage = () => {
    navigation.navigate("DataUsage", {
      planName,
      downloadSpeed,
      uploadSpeed,
    });
  };

  // Loading state
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
        {/* Service Header */}
        <View style={styles.serviceHeader}>
          <View
            style={styles.iconWrapper}
            accessible={false}
            importantForAccessibility="no"
            accessibilityElementsHidden={true}
          >
            <MaterialCommunityIcons
              name="wifi"
              size={16}
              color={theme.colors.primary}
              accessible={false}
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

        {/* Speed Display */}
        <View style={styles.speedContainer}>
          {/* Download Speed */}
          <View
            style={styles.speedItem}
            accessible={true}
            accessibilityLabel={`Download Speed: ${downloadSpeed} Megabits per second`}
          >
            <View
              style={styles.speedIcon}
              accessible={false}
              importantForAccessibility="no"
            >
              <Text style={styles.speedArrow}>↓</Text>
            </View>
            <View style={styles.speedInfo}>
              <Text style={styles.speedLabel}>Download</Text>
              <View style={styles.speedValueRow}>
                <Text style={styles.speedValue}>{downloadSpeed}</Text>
                <Text style={styles.speedUnit}>Mbps</Text>
              </View>
            </View>
          </View>

          {/* Upload Speed */}
          <View
            style={styles.speedItem}
            accessible={true}
            accessibilityLabel={`Upload Speed: ${uploadSpeed} Megabits per second`}
          >
            <View
              style={styles.speedIcon}
              accessible={false}
              importantForAccessibility="no"
            >
              <Text style={styles.speedArrow}>↑</Text>
            </View>
            <View style={styles.speedInfo}>
              <Text style={styles.speedLabel}>Upload</Text>
              <View style={styles.speedValueRow}>
                <Text style={styles.speedValue}>{uploadSpeed}</Text>
                <Text style={styles.speedUnit}>Mbps</Text>
              </View>
            </View>
          </View>
        </View>

        {/* DATA USAGE SNAPSHOT - NEW! */}
        {dataPlan && (
          <View style={styles.dataUsageSnapshot}>
            <View style={styles.snapshotHeader}>
              <Text style={styles.snapshotLabel}>Data Usage</Text>
              <Pressable
                onPress={handleViewDataUsage}
                accessible={true}
                accessibilityRole="link"
                accessibilityLabel="View detailed data usage"
                accessibilityHint="Double tap to navigate to data usage details page"
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.viewDetails}>View Details</Text>
              </Pressable>
            </View>

            <View style={styles.snapshotProgress}>
              {/* Progress Bar */}
              <View style={styles.snapshotBar}>
                <View
                  style={[
                    styles.snapshotFill,
                    {
                      width: `${Math.min(dataPlan.percentageUsed, 100)}%`,
                      backgroundColor: getDataUsageColor(dataPlan.percentageUsed),
                    },
                  ]}
                  accessible={false}
                />
              </View>

              {/* Usage Text */}
              <Text
                style={styles.snapshotText}
                accessible={true}
                accessibilityLabel={`Data usage: ${dataPlan.usedGB} gigabytes used out of ${dataPlan.totalGB} gigabytes. ${dataPlan.percentageUsed} percent used.`}
              >
                {dataPlan.usedGB} / {dataPlan.totalGB} GB ({dataPlan.percentageUsed}%)
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Container & Card
  container: serviceCard.container,
  card: serviceCard.card,

  // Service Header
  serviceHeader: serviceCard.serviceHeader,
  iconWrapper: serviceCard.iconWrapper,
  serviceType: serviceCard.serviceType,

  // Content
  content: serviceCard.content,
  planName: serviceCard.planName,

  // Speed Display
  speedContainer: internetSpeed.container,
  speedItem: internetSpeed.speedItem,
  speedIcon: internetSpeed.speedIcon,
  speedArrow: internetSpeed.speedArrow,
  speedInfo: internetSpeed.speedInfo,
  speedLabel: internetSpeed.speedLabel,
  speedValueRow: internetSpeed.speedValueRow,
  speedValue: internetSpeed.speedValue,
  speedUnit: internetSpeed.speedUnit,

  // Skeleton Loader
  skeleton: skeletonLoader.skeleton,
  skeletonHeader: skeletonLoader.skeletonHeader,
  skeletonTitle: skeletonLoader.skeletonTitle,
  skeletonSpeedContainer: skeletonLoader.skeletonSpeedContainer,
  skeletonSpeedRight: skeletonLoader.skeletonSpeedRight,
  skeletonSpeedLeft: skeletonLoader.skeletonSpeedLeft,

  // ==========================================
  // DATA USAGE SNAPSHOT - NEW STYLES
  // ==========================================
  dataUsageSnapshot: {
    marginTop: theme.spacing.base,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  snapshotHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.xs,
  },
  snapshotLabel: {
    fontSize: theme.typography.size.xs,
    fontFamily: theme.typography.family.semiBold,
    fontWeight: "600",
    color: theme.colors.text.secondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  viewDetails: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.family.semiBold,
    fontWeight: "600",
    color: theme.colors.primary,
  },
  snapshotProgress: {
    gap: 4,
  },
  snapshotBar: {
    height: 6,
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: 3,
    overflow: "hidden",
  },
  snapshotFill: {
    height: "100%",
    borderRadius: 3,
  },
  snapshotText: {
    fontSize: theme.typography.size.xs,
    fontFamily: theme.typography.family.regular,
    color: theme.colors.text.secondary,
  },
});

export default InternetCard;