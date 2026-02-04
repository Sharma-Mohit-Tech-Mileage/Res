/**
 * UsageSummaryCard Component
 * Path: src/components/services/dataUsage/components/UsageSummaryCard.js
 * 
 * Displays current data usage with:
 * - Horizontal progress bar (not circular)
 * - Clean stats WITHOUT icons
 * - Status color coding
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { theme } from "../../../../styles/theme";
import { dataUsageSummary } from "../../../../styles/compositions";

const UsageSummaryCard = ({ dataPlan, billingCycle }) => {
  // Calculate percentage and average
  const percentageUsed = Math.round((dataPlan.usedGB / dataPlan.totalGB) * 100);
  const averageDaily = (dataPlan.usedGB / billingCycle.daysElapsed).toFixed(1);
  
  // Determine status color based on usage
  const getStatusColor = () => {
    if (percentageUsed >= 90) return theme.colors.status.error;
    if (percentageUsed >= 75) return theme.colors.status.warning;
    return theme.colors.status.success;
  };

  const statusColor = getStatusColor();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Header with Icon */}
        <View style={styles.header}>
          <View
            style={styles.iconWrapper}
            accessible={false}
            importantForAccessibility="no-hide-descendants"
            accessibilityElementsHidden={true}
          >
            <MaterialCommunityIcons
              name="chart-box-outline"
              size={18}
              color={theme.colors.primary}
              accessible={false}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>DATA USAGE</Text>
            <Text style={styles.planName}>{dataPlan.name}</Text>
          </View>
        </View>

        {/* Usage Display - HORIZONTAL BAR */}
        <View
          style={styles.usageSection}
          accessible={true}
          accessibilityRole="progressbar"
          accessibilityLabel={`You have used ${dataPlan.usedGB} gigabytes out of ${dataPlan.totalGB} gigabytes. ${percentageUsed} percent used. ${dataPlan.remainingGB} gigabytes remaining.`}
          accessibilityValue={{
            min: 0,
            max: dataPlan.totalGB,
            now: dataPlan.usedGB,
          }}
        >
          {/* Usage Numbers */}
          <View style={styles.usageNumbers}>
            <Text style={styles.usageValue}>{dataPlan.usedGB}</Text>
            <Text style={styles.usageUnit}> GB</Text>
            <Text style={styles.separator}> of </Text>
            <Text style={[styles.usageUnit, { color: theme.colors.text.tertiary }]}>
              {dataPlan.totalGB} GB
            </Text>
          </View>

          {/* Horizontal Progress Bar */}
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.min(percentageUsed, 100)}%`,
                  backgroundColor: statusColor
                }
              ]}
            />
          </View>

          {/* Progress Labels */}
          <View style={styles.progressLabels}>
            <Text style={[styles.progressText, { color: statusColor }]}>
              {percentageUsed}% used
            </Text>
            <Text style={styles.progressText}>
              {dataPlan.remainingGB} GB left
            </Text>
          </View>
        </View>

        {/* Stats - NO ICONS (Simplified) */}
        <View style={styles.statsContainer}>
          {/* Billing Period */}
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Billing Period</Text>
            <Text
              style={styles.statValue}
              accessible={true}
              accessibilityLabel={`Billing period from ${formatDateAccessible(billingCycle.startDate)} to ${formatDateAccessible(billingCycle.endDate)}`}
            >
              {formatDate(billingCycle.startDate)} - {formatDate(billingCycle.endDate)}
            </Text>
          </View>

          <View style={styles.statDivider} />

          {/* Average Daily */}
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Avg Daily</Text>
            <Text
              style={styles.statValue}
              accessible={true}
              accessibilityLabel={`Average daily usage ${averageDaily} gigabytes per day`}
            >
              {averageDaily} GB/day
            </Text>
          </View>

          <View style={styles.statDivider} />

          {/* Days Left */}
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Days Left</Text>
            <Text
              style={styles.statValue}
              accessible={true}
              accessibilityLabel={`${billingCycle.daysRemaining} days remaining in billing period`}
            >
              {billingCycle.daysRemaining} days
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

// Helper: Format date for display
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Helper: Format date for accessibility
const formatDateAccessible = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

const styles = StyleSheet.create({
  container: dataUsageSummary.container,
  card: dataUsageSummary.card,
  header: dataUsageSummary.header,
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${theme.colors.primary}12`,
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing.sm,
  },
  label: dataUsageSummary.label,
  planName: dataUsageSummary.planName,
  
  // Usage Section
  usageSection: {
    marginBottom: theme.spacing.lg,
  },
  usageNumbers: dataUsageSummary.usageNumbers,
  usageValue: {
    fontSize: 36,
    fontFamily: theme.typography.family.semiBold,
    fontWeight: "700",
    color: theme.colors.text.primary,
  },
  usageUnit: dataUsageSummary.usageUnit,
  separator: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.text.tertiary,
    marginHorizontal: 4,
  },
  
  // Progress Bar
  progressBar: dataUsageSummary.progressBar,
  progressFill: dataUsageSummary.progressFill,
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: theme.spacing.xs,
  },
  progressText: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.family.semiBold,
    fontWeight: "600",
  },
  
  // Stats Container - Horizontal, NO ICONS
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: theme.spacing.base,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: theme.colors.border,
  },
  statLabel: {
    fontSize: theme.typography.size.xs,
    fontFamily: theme.typography.family.regular,
    color: theme.colors.text.secondary,
    marginBottom: 4,
    textAlign: "center",
  },
  statValue: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.family.semiBold,
    fontWeight: "600",
    color: theme.colors.text.primary,
    textAlign: "center",
  },
});

export default UsageSummaryCard;