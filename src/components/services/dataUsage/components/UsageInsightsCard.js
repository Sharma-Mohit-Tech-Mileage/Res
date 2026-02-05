/**
 * UsageInsightsCard.js - Complete Component
 * Path: src/components/services/dataUsage/components/UsageInsightsCard.js
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { theme } from "../../../../styles/theme";
import { card } from "../../../../styles/utilities";
import { calculatePace, forecastUsage, calculateComparison } from "../mockDataUsage";

const UsageInsightsCard = ({ currentUsage, currentMonth, previousMonth }) => {
  const pace = calculatePace(currentUsage);
  const forecast = forecastUsage(currentUsage);
  const comparison = calculateComparison(currentMonth, previousMonth);
  
  const paceColor = pace.isOnTrack 
    ? theme.colors.status.success 
    : theme.colors.status.warning;
  
  const forecastColor = forecast.willExceed 
    ? theme.colors.status.error 
    : theme.colors.status.success;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          <MaterialCommunityIcons
            name="chart-line-variant"
            size={18}
            color={theme.colors.primary}
          />
          <Text style={styles.headerTitle}>USAGE INSIGHTS</Text>
        </View>

        {/* Top Row - On Track + Projected */}
        <View style={styles.topRow}>
          <View style={[styles.bigTile, { backgroundColor: `${paceColor}10` }]}>
            <View style={styles.tileIconWrapper}>
              <MaterialCommunityIcons
                name="speedometer"
                size={24}
                color={paceColor}
              />
            </View>
            <Text style={styles.bigTileValue}>{pace.pace}%</Text>
            <Text style={styles.bigTileLabel}>
              {pace.isOnTrack ? "On Track" : "Over Pace"}
            </Text>
            <Text style={styles.bigTileSubtext}>vs expected usage</Text>
          </View>

          <View style={[styles.bigTile, { backgroundColor: `${forecastColor}10` }]}>
            <View style={styles.tileIconWrapper}>
              <MaterialCommunityIcons
                name="chart-timeline-variant"
                size={24}
                color={forecastColor}
              />
            </View>
            <Text style={styles.bigTileValue}>{forecast.projected} GB</Text>
            <Text style={styles.bigTileLabel}>Projected</Text>
            <Text style={styles.bigTileSubtext}>by end of period</Text>
          </View>
        </View>

        {/* Bottom Row - Usage Trends */}
        <View style={styles.bottomRow}>
          {/* Total Usage */}
          <View style={styles.trendTile}>
            <Text style={styles.trendLabel}>Total Usage</Text>
            <View style={styles.trendRow}>
              <MaterialCommunityIcons
                name={comparison.isIncrease ? "trending-up" : "trending-down"}
                size={16}
                color={comparison.isIncrease ? theme.colors.status.warning : theme.colors.status.success}
              />
              <Text style={[
                styles.trendPercentage,
                { color: comparison.isIncrease ? theme.colors.status.warning : theme.colors.status.success }
              ]}>
                {comparison.totalChange}%
              </Text>
            </View>
            <Text style={styles.trendSubtext}>vs last month</Text>
          </View>

          {/* Download */}
          <View style={styles.trendTile}>
            <Text style={styles.trendLabel}>Download</Text>
            <Text style={styles.trendPercentage}>
              {comparison.downloadChange}%
            </Text>
            <Text style={styles.trendValue}>{currentMonth.downloadGB} GB</Text>
          </View>

          {/* Upload */}
          <View style={styles.trendTile}>
            <Text style={styles.trendLabel}>Upload</Text>
            <Text style={styles.trendPercentage}>
              {comparison.uploadChange}%
            </Text>
            <Text style={styles.trendValue}>{currentMonth.uploadGB} GB</Text>
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
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.base,
  },
  headerTitle: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.family.semiBold,
    fontWeight: "600",
    color: theme.colors.text.secondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  
  // Top Row - Big Tiles
  topRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.base,
  },
  bigTile: {
    flex: 1,
    borderRadius: theme.radius.sm,
    padding: theme.spacing.base,
    alignItems: "center",
  },
  tileIconWrapper: {
    marginBottom: theme.spacing.xs,
  },
  bigTileValue: {
    fontSize: 28,
    fontFamily: theme.typography.family.semiBold,
    fontWeight: "700",
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  bigTileLabel: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.family.semiBold,
    fontWeight: "600",
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  bigTileSubtext: {
    fontSize: theme.typography.size.xs,
    fontFamily: theme.typography.family.regular,
    color: theme.colors.text.secondary,
  },
  
  // Bottom Row - Usage Trends
  bottomRow: {
    flexDirection: "row",
    gap: theme.spacing.base,
  },
  trendTile: {
    flex: 1,
    alignItems: "flex-start",
  },
  trendLabel: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.family.regular,
    color: theme.colors.text.secondary,
    marginBottom: 4,
  },
  trendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 2,
  },
  trendPercentage: {
    fontSize: theme.typography.size.xl,
    fontFamily: theme.typography.family.semiBold,
    fontWeight: "700",
    color: theme.colors.text.primary,
  },
  trendSubtext: {
    fontSize: theme.typography.size.xs,
    fontFamily: theme.typography.family.regular,
    color: theme.colors.text.secondary,
  },
  trendValue: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.family.regular,
    color: theme.colors.text.primary,
    marginTop: 2,
  },
});

export default UsageInsightsCard;