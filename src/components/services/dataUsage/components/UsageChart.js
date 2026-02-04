/**
 * UsageChart Component
 * Path: src/components/services/dataUsage/components/UsageChart.js
 * 
 * Displays historical usage with:
 * - Skinnier chart (160px height)
 * - Upload/Download split (dual bars)
 * - Tabs attached to card
 * - Horizontal scrolling
 * - Full accessibility
 */

import React from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { theme } from "../../../../styles/theme";
import { dataUsageChart, dataUsageTabs } from "../../../../styles/compositions";

const UsageChart = ({ 
  data, 
  type = "monthly", 
  onBarPress, 
  selectedBar, 
  activeTab, 
  onTabChange 
}) => {
  if (!data || data.length === 0) return null;

  // Chart dimensions
  const maxUsage = Math.max(...data.map(item => item.total), 1);
  const chartHeight = 160; // SKINNIER!
  const barWidth = 18;
  const barSpacing = 4;
  const groupSpacing = 12;
  const groupWidth = (barWidth * 2) + barSpacing + groupSpacing;
  const totalWidth = groupWidth * data.length;
  
  // Y-axis points
  const yAxisPoints = [
    Math.ceil(maxUsage),
    Math.ceil(maxUsage * 0.75),
    Math.ceil(maxUsage * 0.5),
    Math.ceil(maxUsage * 0.25),
    0
  ];

  const handleBarPress = (item) => {
    if (onBarPress) onBarPress(item);
  };

  const tabs = [
    { id: "daily", label: "Daily" },
    { id: "monthly", label: "Monthly" }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.chartHeaderRow}>
          <Text style={styles.chartTitle}>Historical Usage</Text>
        </View>

        {/* Tabs - ATTACHED TO CARD */}
        <View
          style={styles.tabsContainer}
          accessible={false}
          importantForAccessibility="no-hide-descendants"
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            
            return (
              <Pressable
                key={tab.id}
                style={({ pressed }) => [
                  styles.tab,
                  isActive && styles.activeTab,
                  pressed && { opacity: 0.7 }
                ]}
                onPress={() => onTabChange(tab.id)}
                accessible={true}
                accessibilityRole="tab"
                accessibilityState={{ selected: isActive }}
                accessibilityLabel={tab.label}
                accessibilityHint={
                  isActive 
                    ? `Selected. Showing ${tab.label.toLowerCase()} usage data` 
                    : `Double tap to view ${tab.label.toLowerCase()} usage data`
                }
              >
                <Text
                  style={[
                    styles.tabText,
                    isActive && styles.activeTabText
                  ]}
                  accessible={false}
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Chart Area */}
        <View style={styles.chartRow}>
          {/* Y-axis Labels */}
          <View
            style={styles.yAxis}
            accessible={false}
            importantForAccessibility="no-hide-descendants"
          >
            {yAxisPoints.map((value, index) => (
              <Text key={index} style={styles.yAxisLabel}>
                {value}
              </Text>
            ))}
          </View>

          {/* Scrollable Chart - DUAL BARS */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={true}
            style={styles.chartArea}
            contentContainerStyle={[
              styles.scrollContainer,
              { minWidth: totalWidth }
            ]}
            accessible={false}
            importantForAccessibility="no-hide-descendants"
          >
            {/* Grid Lines */}
            <View style={styles.gridLines} accessible={false}>
              {yAxisPoints.map((_, index) => (
                <View key={index} style={styles.gridLine} />
              ))}
            </View>

            {/* Bars Container */}
            <View style={styles.barsContainer}>
              {data.map((item, index) => {
                const downloadHeight = Math.max(
                  (item.download / maxUsage) * (chartHeight - 40), 
                  4
                );
                const uploadHeight = Math.max(
                  (item.upload / maxUsage) * (chartHeight - 40), 
                  4
                );
                const isSelected = selectedBar?.date === item.date;
                const isCurrentMonth = item.isCurrentMonth;
                
                return (
                  <Pressable
                    key={index}
                    style={[styles.barGroup, { width: groupWidth }]}
                    onPress={() => handleBarPress(item)}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel={
                      type === "monthly"
                        ? `${item.month} ${item.year}. Download ${item.download} gigabytes, Upload ${item.upload} gigabytes${isCurrentMonth ? ', current month' : ''}`
                        : `${item.dayOfWeek}, ${item.dayLabel}. Download ${item.download} gigabytes, Upload ${item.upload} gigabytes`
                    }
                    accessibilityHint="Double tap to select and view details"
                    accessibilityState={{ selected: isSelected }}
                  >
                    {/* Dual Bars */}
                    <View style={styles.dualBars}>
                      {/* Download Bar (Purple) */}
                      <View
                        style={[
                          styles.bar,
                          {
                            width: barWidth,
                            height: downloadHeight,
                            backgroundColor: isSelected
                              ? theme.colors.primary
                              : isCurrentMonth
                              ? theme.colors.primaryLight
                              : `${theme.colors.primary}80`,
                            opacity: isSelected ? 1 : 0.85
                          }
                        ]}
                        accessible={false}
                      />
                      
                      {/* Upload Bar (Orange) */}
                      <View
                        style={[
                          styles.bar,
                          {
                            width: barWidth,
                            height: uploadHeight,
                            backgroundColor: isSelected
                              ? theme.colors.status.warning
                              : isCurrentMonth
                              ? `${theme.colors.status.warning}60`
                              : `${theme.colors.status.warning}40`,
                            opacity: isSelected ? 1 : 0.85,
                            marginLeft: barSpacing
                          }
                        ]}
                        accessible={false}
                      />
                    </View>

                    {/* Selection Indicator */}
                    {isSelected && (
                      <View style={styles.selectionDot} accessible={false} />
                    )}

                    {/* X-axis Label */}
                    <Text 
                      style={[
                        styles.xAxisLabel,
                        isSelected && styles.xAxisLabelSelected
                      ]}
                      accessible={false}
                      numberOfLines={1}
                    >
                      {type === "monthly" ? item.month : item.dayLabel}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>
        </View>

        {/* Legend - Upload/Download + Past/Current */}
        <View
          style={styles.legend}
          accessible={true}
          accessibilityLabel="Chart legend showing download in purple, upload in orange, with past months and current month indicators"
        >
          {/* Row 1: Download/Upload */}
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[
                styles.legendDot, 
                { backgroundColor: theme.colors.primary }
              ]} />
              <Text style={styles.legendText}>Download</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[
                styles.legendDot, 
                { backgroundColor: theme.colors.status.warning }
              ]} />
              <Text style={styles.legendText}>Upload</Text>
            </View>
          </View>
          
          {/* Row 2: Past/Current (only for monthly) */}
          {type === "monthly" && (
            <View style={styles.legendRow}>
              <View style={styles.legendItem}>
                <View style={[
                  styles.legendDot, 
                  { backgroundColor: `${theme.colors.primary}80` }
                ]} />
                <Text style={styles.legendText}>Past months</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[
                  styles.legendDot, 
                  { backgroundColor: theme.colors.primaryLight }
                ]} />
                <Text style={styles.legendText}>Current month</Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: dataUsageChart.container,
  card: dataUsageChart.card,
  
  chartHeaderRow: {
    marginBottom: theme.spacing.sm,
  },
  chartTitle: {
    fontSize: theme.typography.size.lg,
    fontFamily: theme.typography.family.semiBold,
    fontWeight: "600",
    color: theme.colors.text.primary,
  },
  
  // Tabs
  tabsContainer: {
    ...dataUsageTabs.tabsContainer,
    marginBottom: theme.spacing.base,
  },
  tab: dataUsageTabs.tab,
  activeTab: dataUsageTabs.activeTab,
  tabText: dataUsageTabs.tabText,
  activeTabText: dataUsageTabs.activeTabText,
  
  // Chart
  chartRow: {
    flexDirection: "row",
    height: 160, // SKINNIER
  },
  yAxis: {
    width: 36,
    justifyContent: "space-between",
    paddingRight: theme.spacing.xs,
  },
  yAxisLabel: dataUsageChart.yAxisLabel,
  
  chartArea: dataUsageChart.chartArea,
  scrollContainer: {
    paddingRight: theme.spacing.base,
  },
  gridLines: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 36,
    justifyContent: "space-between",
  },
  gridLine: dataUsageChart.gridLine,
  
  barsContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingBottom: 36,
    minWidth: "100%",
  },
  barGroup: {
    alignItems: "center",
    justifyContent: "flex-end",
    minHeight: 44, // Accessibility
  },
  dualBars: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  bar: {
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  selectionDot: {
    position: "absolute",
    bottom: -6,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.primary,
  },
  
  xAxisLabel: {
    fontSize: theme.typography.size.xs,
    fontFamily: theme.typography.family.regular,
    color: theme.colors.text.tertiary,
    marginTop: theme.spacing.xs,
    textAlign: "center",
  },
  xAxisLabelSelected: {
    fontFamily: theme.typography.family.semiBold,
    fontWeight: "600",
    color: theme.colors.primary,
  },
  
  // Legend
  legend: {
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    gap: theme.spacing.xs,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.base,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendText: {
    fontSize: theme.typography.size.xs,
    fontFamily: theme.typography.family.regular,
    color: theme.colors.text.secondary,
  },
});

export default UsageChart;