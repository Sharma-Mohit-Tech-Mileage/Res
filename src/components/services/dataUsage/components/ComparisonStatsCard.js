/**
 * ComparisonStatsCard.js
 * Path: src/components/services/dataUsage/components/ComparisonStatsCard.js
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { theme } from "../../../../styles/theme";
import { card } from "../../../../styles/utilities";
import { calculateComparison } from "../mockDataUsage";

const ComparisonStatsCard = ({ currentMonth, previousMonth }) => {
  if (!currentMonth || !previousMonth) return null;
  
  const comparison = calculateComparison(currentMonth, previousMonth);
  const trendColor = comparison.isIncrease 
    ? theme.colors.status.warning 
    : theme.colors.status.success;
  const trendIcon = comparison.isIncrease ? "trending-up" : "trending-down";
  
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <MaterialCommunityIcons
            name="chart-line-variant"
            size={20}
            color={theme.colors.primary}
          />
          <Text style={styles.title}>Usage Trends</Text>
        </View>
        
        <View style={styles.statsGrid}>
          {/* Total Change */}
          <View style={styles.statBox}>
            <View style={styles.statHeader}>
              <Text style={styles.statLabel}>Total Usage</Text>
              <MaterialCommunityIcons
                name={trendIcon}
                size={16}
                color={trendColor}
              />
            </View>
            <Text style={[styles.statValue, { color: trendColor }]}>
              {comparison.isIncrease ? "+" : ""}{comparison.totalChange}%
            </Text>
            <Text style={styles.statSubtext}>vs last month</Text>
          </View>
          
          {/* Download Change */}
          <View style={styles.statBox}>
            <View style={styles.statHeader}>
              <Text style={styles.statLabel}>Download</Text>
            </View>
            <Text style={styles.statValue}>
              {comparison.downloadChange > 0 ? "+" : ""}{comparison.downloadChange}%
            </Text>
            <Text style={styles.statSubtext}>
              {currentMonth.downloadGB} GB
            </Text>
          </View>
          
          {/* Upload Change */}
          <View style={styles.statBox}>
            <View style={styles.statHeader}>
              <Text style={styles.statLabel}>Upload</Text>
            </View>
            <Text style={styles.statValue}>
              {comparison.uploadChange > 0 ? "+" : ""}{comparison.uploadChange}%
            </Text>
            <Text style={styles.statSubtext}>
              {currentMonth.uploadGB} GB
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: theme.spacing.base,
    marginBottom: theme.spacing.base,
  },
  card: {
    ...card.base,
    padding: theme.spacing.base,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.base,
    gap: theme.spacing.xs,
  },
  title: {
    fontSize: theme.typography.size.lg,
    fontFamily: theme.typography.family.semiBold,
    fontWeight: "600",
    color: theme.colors.text.primary,
  },
  statsGrid: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  statBox: {
    flex: 1,
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: theme.radius.xs,
    padding: theme.spacing.sm,
  },
  statHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: theme.typography.size.xs,
    fontFamily: theme.typography.family.regular,
    color: theme.colors.text.secondary,
  },
  statValue: {
    fontSize: theme.typography.size.xl,
    fontFamily: theme.typography.family.semiBold,
    fontWeight: "700",
    color: theme.colors.text.primary,
  },
  statSubtext: {
    fontSize: theme.typography.size.xs,
    fontFamily: theme.typography.family.regular,
    color: theme.colors.text.tertiary,
    marginTop: 2,
  },
});

export default ComparisonStatsCard;