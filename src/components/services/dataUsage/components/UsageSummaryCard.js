/**
 * UsageSummaryCard.js - CLEAN GB LABELS ONLY
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Svg, Circle, Line, Defs, LinearGradient, Stop, G } from "react-native-svg";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { theme } from "../../../../styles/theme";
import { card } from "../../../../styles/utilities";

const DonutWithCallouts = ({ usedPercent, remainingPercent, usedGB, remainingGB, size = 140 }) => {
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;
  
  const usedArc = (circumference * usedPercent) / 100;
  const remainingArc = (circumference * remainingPercent) / 100;

  const usedMidAngle = 135 + (usedPercent / 100) * 180;
  const remainingMidAngle = 135 + (usedPercent / 100) * 360 + (remainingPercent / 100) * 180;
  
  const getPoint = (angle) => {
    const rad = (angle * Math.PI) / 180;
    return {
      x: center + radius * Math.cos(rad),
      y: center + radius * Math.sin(rad),
    };
  };

  const usedAnchor = getPoint(usedMidAngle);
  const remainingAnchor = getPoint(remainingMidAngle);

  const leftLineX = -25;
  const rightLineX = size + 25;

  return (
    <View style={{ height: size + 60, width: '100%', alignItems: 'center' }}>
      <Svg width={size + 100} height={size + 60}>
        <Defs>
          <LinearGradient id="used" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={theme.colors.primary} />
            <Stop offset="100%" stopColor={theme.colors.primaryDark} />
          </LinearGradient>
          
          <LinearGradient id="remaining" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#2ECC71" />
            <Stop offset="100%" stopColor={theme.colors.status.success} />
          </LinearGradient>
        </Defs>

        <G transform={`translate(45, 20)`}>
          <Circle cx={center} cy={center + 2} r={radius} stroke="#00000008" strokeWidth={strokeWidth} fill="none" />
          <Circle cx={center} cy={center} r={radius} stroke="#F5F5F5" strokeWidth={strokeWidth} fill="none" />
          
          <Circle
            cx={center} cy={center} r={radius}
            stroke="url(#used)" strokeWidth={strokeWidth} fill="none"
            strokeDasharray={`${usedArc} ${circumference - usedArc}`}
            strokeLinecap="butt"
            rotation="135" origin={`${center}, ${center}`}
          />
          
          <Circle
            cx={center} cy={center} r={radius}
            stroke="url(#remaining)" strokeWidth={strokeWidth} fill="none"
            strokeDasharray={`${remainingArc} ${circumference - remainingArc}`}
            strokeDashoffset={-usedArc}
            strokeLinecap="butt"
            rotation="135" origin={`${center}, ${center}`}
          />

          <Line x1={usedAnchor.x} y1={usedAnchor.y} x2={leftLineX} y2={usedAnchor.y} 
                stroke={theme.colors.primary} strokeWidth="2.5" />
          <Circle cx={leftLineX} cy={usedAnchor.y} r="6" fill={theme.colors.primary} />

          <Line x1={remainingAnchor.x} y1={remainingAnchor.y} x2={rightLineX} y2={remainingAnchor.y} 
                stroke={theme.colors.status.success} strokeWidth="2.5" />
          <Circle cx={rightLineX} cy={remainingAnchor.y} r="6" fill={theme.colors.status.success} />
        </G>
      </Svg>

      {/* Text labels */}
      <View style={[styles.textLabel, { position: 'absolute', top: usedAnchor.y + 10, left: 0 }]}>
        <Text style={[styles.labelText, { color: theme.colors.primary }]}>
          {usedGB} 
        </Text>
        <Text style={styles.labelSubtext}> GB Used</Text>
      </View>
      
      <View style={[styles.textLabel, { position: 'absolute', top: remainingAnchor.y + 10, right: 0, alignItems: 'flex-end' }]}>
        <Text style={[styles.labelText, { color: theme.colors.status.success }]}>
          {remainingGB} 
        </Text>
        <Text style={styles.labelSubtext}>GB Left</Text>
      </View>
    </View>
  );
};

const UsageSummaryCard = ({ currentUsage, dailyData }) => {
  const startDate = new Date(currentUsage.beginDate).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const endDate = new Date(currentUsage.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const remainingPercent = 100 - currentUsage.dataUsedPercent;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <MaterialCommunityIcons name="chart-donut" size={18} color={theme.colors.primary} />
          <Text style={styles.headerTitle}>DATA USAGE</Text>
        </View>

        <DonutWithCallouts 
          usedPercent={currentUsage.dataUsedPercent}
          remainingPercent={remainingPercent}
          usedGB={currentUsage.usedDataGB}
          remainingGB={currentUsage.dataRemaining.toFixed(1)}
        />

        {/* <View style={styles.summaryBar}>
          <Text style={styles.summaryText}>
            {currentUsage.dataUsedPercent}% of {currentUsage.dataPlanGB} GB plan
          </Text>
        </View> */}

        <View style={styles.stats}>
          <View style={styles.statBox}>
            <MaterialCommunityIcons name="calendar-range" size={20} color={theme.colors.primary} />
            <Text style={styles.statValue}>{startDate} - {endDate}</Text>
            <Text style={styles.statLabel}>Billing Period</Text>
          </View>
          
          <View style={styles.statBox}>
            <MaterialCommunityIcons name="calendar-clock" size={20} color={theme.colors.primary} />
            <Text style={styles.statValue}>{currentUsage.remainingDays} days</Text>
            <Text style={styles.statLabel}>Remaining</Text>
          </View>
          
          <View style={styles.statBox}>
            <MaterialCommunityIcons name="chart-pie" size={20} color={theme.colors.primary} />
            <Text style={styles.statValue}>{currentUsage.dataUsedPercent}%</Text>
            <Text style={styles.statLabel}>Used</Text>
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
  textLabel: {
    alignItems: 'flex-start',
  },
  labelText: {
    fontSize: 14,
    fontFamily: theme.typography.family.semiBold,
    fontWeight: '700',
  },
  labelSubtext: {
    fontSize: 11,
    fontFamily: theme.typography.family.regular,
    color: theme.colors.text.secondary,
    marginTop: 1,
  },
  summaryBar: {
    alignItems: "center",
    paddingVertical: theme.spacing.xs,
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: theme.radius.xs,
    marginBottom: theme.spacing.base,
  },
  summaryText: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.family.semiBold,
    fontWeight: "600",
    color: theme.colors.text.primary,
  },
  stats: {
    flexDirection: "row",
    gap: theme.spacing.xs,
  },
  statBox: {
    flex: 1,
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing["2xs"],
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: theme.radius.xs,
  },
  statValue: {
    fontSize: 12,
    fontFamily: theme.typography.family.semiBold,
    fontWeight: "600",
    color: theme.colors.text.primary,
    textAlign: "center",
    marginVertical: 2,
  },
  statLabel: {
    fontSize: 10,
    fontFamily: theme.typography.family.regular,
    color: theme.colors.text.secondary,
    textAlign: "center",
  },
});

export default UsageSummaryCard;