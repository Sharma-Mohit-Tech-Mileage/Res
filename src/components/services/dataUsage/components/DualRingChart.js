/**
 * DualRingChart.js - Upload/Download Ring Visualization
 * Path: src/components/services/dataUsage/components/DualRingChart.js
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { theme } from "../../../../styles/theme";

const DualRingChart = ({ uploadGB, downloadGB, totalGB, size = 180 }) => {
  const strokeWidth = 16;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  const uploadPercent = (uploadGB / totalGB) * 100;
  const downloadPercent = (downloadGB / totalGB) * 100;
  
  const uploadOffset = circumference - (circumference * uploadPercent) / 100;
  const downloadOffset = circumference - (circumference * downloadPercent) / 100;
  
  return (
    <View style={styles.container}>
      <Svg width={size} height={size} style={styles.svg}>
        {/* Background circles */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={theme.colors.surfaceVariant}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius - strokeWidth - 4}
          stroke={theme.colors.surfaceVariant}
          strokeWidth={strokeWidth}
          fill="none"
        />
        
        {/* Download ring (outer) */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={theme.colors.primary}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={downloadOffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        
        {/* Upload ring (inner) */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius - strokeWidth - 4}
          stroke={theme.colors.status.warning}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={uploadOffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      
      {/* Center text */}
      <View style={styles.centerText}>
        <Text style={styles.totalValue}>{totalGB}</Text>
        <Text style={styles.totalLabel}>GB Used</Text>
      </View>
      
      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: theme.colors.primary }]} />
          <Text style={styles.legendText}>
            ↓ {downloadGB} GB ({downloadPercent.toFixed(0)}%)
          </Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: theme.colors.status.warning }]} />
          <Text style={styles.legendText}>
            ↑ {uploadGB} GB ({uploadPercent.toFixed(0)}%)
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  svg: {
    transform: [{ rotate: "0deg" }],
  },
  centerText: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -50 }, { translateY: -40 }],
    alignItems: "center",
  },
  totalValue: {
    fontSize: 32,
    fontFamily: theme.typography.family.semiBold,
    fontWeight: "700",
    color: theme.colors.text.primary,
  },
  totalLabel: {
    fontSize: theme.typography.size.xs,
    fontFamily: theme.typography.family.regular,
    color: theme.colors.text.secondary,
    marginTop: 4,
  },
  legend: {
    marginTop: theme.spacing.base,
    gap: theme.spacing.xs,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  legendText: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.family.semiBold,
    fontWeight: "600",
    color: theme.colors.text.primary,
  },
});

export default DualRingChart;