import React, { useRef, useState, useEffect } from "react";
import { View, Text, StyleSheet, Animated, Easing, Platform } from "react-native";
import { Svg, Circle, Line, Defs, LinearGradient, Stop, G } from "react-native-svg";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { theme } from "../../../../styles/theme";
import { card } from "../../../../styles/utilities";
import { cardHeader } from "../../../../styles/compositions";

const DonutWithCallouts = ({ usedPercent, remainingPercent, usedGB, remainingGB, size = 140 }) => {
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  const animValue = useRef(new Animated.Value(0)).current;
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    animValue.setValue(0);
    setProgress(0);
    const id = animValue.addListener(({ value }) => setProgress(value));
    Animated.timing(animValue, {
      toValue: 1,
      duration: 1200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
    return () => animValue.removeListener(id);
  }, [usedPercent, remainingPercent]);

  const usedArc = (circumference * usedPercent * progress) / 100;
  const remainingArc = (circumference * remainingPercent * progress) / 100;

  const calloutOpacity = progress > 0.6 ? Math.min(1, (progress - 0.6) / 0.4) : 0;
  const labelOpacity = animValue.interpolate({
    inputRange: [0.6, 1],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

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

  const gaugeA11yLabel =
    `You have used ${usedGB} gigabytes of data, which is ${usedPercent.toFixed(2)} percent of your total allowance. ` +
    `You have ${remainingGB} gigabytes remaining.`;

  return (
    <View
      style={{ height: size + 60, width: '100%', alignItems: 'center' }}
      accessible={true}
      accessibilityLabel={gaugeA11yLabel}
    >
      <Svg
        width={size + 100}
        height={size + 60}
        accessible={false}
        {...Platform.select({
          ios: { accessibilityElementsHidden: true },
          android: { importantForAccessibility: "no-hide-descendants" },
        })}
      >
        <Defs>
          <LinearGradient id="used" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={theme.colors.primaryDark} />
            <Stop offset="100%" stopColor={theme.colors.primaryDark} />
          </LinearGradient>
          
          <LinearGradient id="remaining" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={theme.colors.freedatabackground} />
            <Stop offset="100%" stopColor={theme.colors.freedatabackground} />
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
                stroke={theme.colors.primaryDark} strokeWidth="2.5" opacity={calloutOpacity} />
          <Circle cx={leftLineX} cy={usedAnchor.y} r="6" fill={theme.colors.primaryDark} opacity={calloutOpacity} />

          <Line x1={remainingAnchor.x} y1={remainingAnchor.y} x2={rightLineX} y2={remainingAnchor.y} 
                stroke={theme.colors.freedatabackground} strokeWidth="2.5" opacity={calloutOpacity} />
          <Circle cx={rightLineX} cy={remainingAnchor.y} r="6" fill={theme.colors.freedatabackground} opacity={calloutOpacity} />
        </G>
      </Svg>

      {/* ---------- A11Y FIX #1b: Hide visual callout labels from screen readers ---------- */}
      {/* These are purely visual; the parent's accessibilityLabel covers the data. */}
      <Animated.View
        style={[styles.textLabel, { position: 'absolute', top: usedAnchor.y + 10, left: 0, opacity: labelOpacity }]}
        accessible={false}
        accessibilityElementsHidden={true}
        importantForAccessibility="no-hide-descendants"
      >
        <Text style={[styles.labelText]}>
          {usedGB} 
        </Text>
        <Text style={styles.labelSubtext}> GB Used</Text>
      </Animated.View>
      
      <Animated.View
        style={[styles.textLabel, { position: 'absolute', top: remainingAnchor.y + 10, right: 0, alignItems: 'flex-end', opacity: labelOpacity }]}
        accessible={false}
        accessibilityElementsHidden={true}
        importantForAccessibility="no-hide-descendants"
      >
        <Text style={[styles.labelText]}>
          {remainingGB} 
        </Text>
        <Text style={styles.labelSubtext}>GB Left</Text>
      </Animated.View>
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
        {/* Header — icon already decorative */}
        <View style={styles.header}>
          <View
            style={styles.iconWrapper}
            accessible={false}
            importantForAccessibility="no-hide-descendants"
            accessibilityElementsHidden={true}
          >
            <MaterialCommunityIcons name="chart-donut" size={20} color={theme.colors.primary} />
          </View>
          <Text style={styles.headerTitle} accessibilityRole="header">DATA USAGE</Text>
        </View>

        <DonutWithCallouts 
          usedPercent={currentUsage.dataUsedPercent}
          remainingPercent={remainingPercent}
          usedGB={currentUsage.usedDataGB}
          remainingGB={currentUsage.dataRemaining.toFixed(1)}
        />

        <View style={styles.stats}>
          <View
            style={[styles.statBox, styles.statBoxWide]}
            accessible={true}
            accessibilityLabel={`Billing Period: ${startDate} through ${endDate}`}
          >
            <View
              accessible={false}
              importantForAccessibility="no-hide-descendants"
              accessibilityElementsHidden={true}
            >
              <MaterialCommunityIcons name="calendar-range" size={20} color={theme.colors.primary} />
            </View>
            <Text style={styles.statValue}>{startDate} - {endDate}</Text>
            <Text style={styles.statLabel}>Billing Period</Text>
          </View>
          
          <View
            style={styles.statBox}
            accessible={true}
            accessibilityLabel={`${currentUsage.remainingDays} days remaining in this billing period`}
          >
            <View
              accessible={false}
              importantForAccessibility="no-hide-descendants"
              accessibilityElementsHidden={true}
            >
              <MaterialCommunityIcons name="calendar-clock" size={20} color={theme.colors.primary} />
            </View>
            <Text style={styles.statValue}>{currentUsage.remainingDays} days</Text>
            <Text style={styles.statLabel}>Remaining</Text>
          </View>
          
          <View
            style={[styles.statBox, styles.statBoxNarrow]}
            accessible={true}
            accessibilityLabel={`${currentUsage.dataUsedPercent} percent used`}
          >
            <View
              accessible={false}
              importantForAccessibility="no-hide-descendants"
              accessibilityElementsHidden={true}
            >
              <MaterialCommunityIcons name="chart-pie" size={20} color={theme.colors.primary} />
            </View>
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
  header: cardHeader.container,
  headerTitle: cardHeader.title,
  textLabel: {
    alignItems: 'flex-start',
  },
  labelText: {
    fontSize: 16,
    fontFamily: theme.typography.family.regular,
    color: theme.colors.text.secondary,
    fontWeight: '700',
  },
  labelSubtext: {
    fontSize: 14,
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
  statBoxWide: {
    flex: 1.4,
  },
  statBoxNarrow: {
    flex: 0.7,
  },
  statValue: {
    fontSize: 14,
    fontFamily: theme.typography.family.semiBold,
    fontWeight: "600",
    color: theme.colors.text.primary,
    textAlign: "center",
    marginVertical: 2,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: theme.typography.family.regular,
    color: theme.colors.text.secondary,
    textAlign: "center",
  },
  iconWrapper: cardHeader.iconWrapper,
});

export default UsageSummaryCard;