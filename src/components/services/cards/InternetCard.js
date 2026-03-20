import React from "react";
import { View, Text, StyleSheet } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { theme } from "../../../styles/theme";
import { serviceCard, internetSpeed, skeletonLoader } from "../../../styles/compositions";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import SecondaryButton from "../../common/customui/PrimaryButton";

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

        {/* Speed Display */}
        <View style={styles.speedContainer}>
          <View
            style={styles.speedItem}
            accessible={true}
            accessibilityLabel={`Download Speed: ${downloadSpeed} Mbps`}
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

          <View
            style={styles.speedItem}
            accessible={true}
            accessibilityLabel={`Upload Speed: ${uploadSpeed} Mbps`}
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

        {/* DATA USAGE SNAPSHOT */}
        {dataPlan && (
          <View style={styles.dataUsageSnapshot}>
            <View style={styles.snapshotHeader}>
              <Text style={styles.snapshotLabel}>Data Usage</Text>
            </View>

            <View style={styles.snapshotProgress}>
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

              <View style={styles.snapshotFooter}>
                <Text style={styles.snapshotText}>
                  {dataPlan.usedGB} / {dataPlan.totalGB} GB ({dataPlan.percentageUsed}%)
                </Text>
              </View>
            </View>

            {/* CTA BUTTON - Now matches Phone and Video cards */}
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
  speedContainer: internetSpeed.container,
  speedItem: internetSpeed.speedItem,
  speedIcon: internetSpeed.speedIcon,
  speedArrow: internetSpeed.speedArrow,
  speedInfo: internetSpeed.speedInfo,
  speedLabel: internetSpeed.speedLabel,
  speedValueRow: internetSpeed.speedValueRow,
  speedValue: internetSpeed.speedValue,
  speedUnit: internetSpeed.speedUnit,
  skeleton: skeletonLoader.skeleton,
  skeletonHeader: skeletonLoader.skeletonHeader,
  skeletonTitle: skeletonLoader.skeletonTitle,
  skeletonSpeedContainer: skeletonLoader.skeletonSpeedContainer,
  skeletonSpeedRight: skeletonLoader.skeletonSpeedRight,
  skeletonSpeedLeft: skeletonLoader.skeletonSpeedLeft,

  // Data Usage Snapshot
  dataUsageSnapshot: {
    marginTop: theme.spacing.base,
    paddingTop: theme.spacing.base,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  snapshotHeader: {
    marginBottom: theme.spacing.xs,
  },
  snapshotLabel: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.family.semiBold,
    fontWeight: "600",
    color: theme.colors.text.secondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  snapshotProgress: {
    gap: 4,
  },
  snapshotBar: {
    height: 6,
    backgroundColor: theme.colors.freedatabackground,
    borderRadius: 3,
    overflow: "hidden",
  },
  snapshotFill: {
    height: "100%",
    borderRadius: 3,
  },
  snapshotFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  snapshotText: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.family.regular,
    color: theme.colors.text.secondary,
  },
});

export default InternetCard;