import ServiceIcon from "../../../../res/svgIcons/UsageServiceIcon";
import React, { useEffect } from "react";
import { View, Text, StyleSheet, Platform, useWindowDimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { Svg, Circle, Line, Defs, LinearGradient, Stop, G } from "react-native-svg";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { theme } from "../../../../styles/theme";
import { card } from "../../../../styles/utilities";
import { cardHeader } from "../../../../styles/compositions";
import AppStyles from "../../../../styles/AppStyles";
import { SectionTitle } from "../../../common/customui/Typography";

const CALLOUT_EPSILON = 0.5;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedG = Animated.createAnimatedComponent(G);

const DonutWithCallouts = ({ usedPercent, remainingPercent, usedGB, remainingGB, size = 140 }) => {
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = 0;
    progress.value = withTiming(1, {
      duration: 900,
      easing: Easing.out(Easing.cubic),
    });
  }, [usedPercent, remainingPercent]);

  const usedArcAnimatedProps = useAnimatedProps(() => {
    const arc = (circumference * usedPercent * progress.value) / 100;
    return { strokeDasharray: [arc, circumference - arc] };
  });

  const remainingArcAnimatedProps = useAnimatedProps(() => {
    const usedArcCurrent = (circumference * usedPercent * progress.value) / 100;
    const arc = (circumference * remainingPercent * progress.value) / 100;
    return {
      strokeDasharray: [arc, circumference - arc],
      strokeDashoffset: -usedArcCurrent,
    };
  });

  const calloutAnimatedProps = useAnimatedProps(() => ({
    opacity: progress.value > 0.6 ? Math.min(1, (progress.value - 0.6) / 0.4) : 0,
  }));

  const labelAnimatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value > 0.6 ? Math.min(1, (progress.value - 0.6) / 0.4) : 0,
  }));

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

  const showUsedCallout = usedPercent > CALLOUT_EPSILON;
  const showRemainingCallout = remainingPercent > CALLOUT_EPSILON;

  const gaugeA11yLabel =
    `You have used ${usedGB} gigabytes of data, which is ${usedPercent.toFixed(2)} percent of your total allowance. ` +
    `You have ${remainingGB} gigabytes remaining.`;

  return (
    <View
      style={{ height: size + 60, width: '100%', maxWidth: size + 280, alignSelf: 'center', alignItems: 'center' }}
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

          <AnimatedCircle
            cx={center} cy={center} r={radius}
            stroke="url(#used)" strokeWidth={strokeWidth} fill="none"
            strokeLinecap="butt"
            rotation="135" origin={`${center}, ${center}`}
            animatedProps={usedArcAnimatedProps}
          />

          <AnimatedCircle
            cx={center} cy={center} r={radius}
            stroke="url(#remaining)" strokeWidth={strokeWidth} fill="none"
            strokeLinecap="butt"
            rotation="135" origin={`${center}, ${center}`}
            animatedProps={remainingArcAnimatedProps}
          />

          {showUsedCallout && (
            <AnimatedG animatedProps={calloutAnimatedProps}>
              <Line x1={usedAnchor.x} y1={usedAnchor.y} x2={leftLineX} y2={usedAnchor.y}
                stroke={theme.colors.primaryDark} strokeWidth="2.5" />
              <Circle cx={leftLineX} cy={usedAnchor.y} r="6" fill={theme.colors.primaryDark} />
            </AnimatedG>
          )}

          {showRemainingCallout && (
            <AnimatedG animatedProps={calloutAnimatedProps}>
              <Line x1={remainingAnchor.x} y1={remainingAnchor.y} x2={rightLineX} y2={remainingAnchor.y}
                stroke={theme.colors.freedatabackground} strokeWidth="2.5" />
              <Circle cx={rightLineX} cy={remainingAnchor.y} r="6" fill={theme.colors.freedatabackground} />
            </AnimatedG>
          )}
        </G>
      </Svg>

      {showUsedCallout && (
        <Animated.View
          style={[styles.textLabel, { position: 'absolute', top: usedAnchor.y + 10, right: '50%', alignItems: 'flex-end', transform: [{ translateX: -(size / 2 + 38) }] }, labelAnimatedStyle]}
          accessible={false}
          accessibilityElementsHidden={true}
          importantForAccessibility="no-hide-descendants"
        >
          <Text style={[styles.labelText]}>
            {usedGB}
          </Text>
          <Text style={styles.labelSubtext}> GB Used</Text>
        </Animated.View>
      )}

      {showRemainingCallout && (
        <Animated.View
          style={[styles.textLabel, { position: 'absolute', top: remainingAnchor.y + 10, left: '50%', transform: [{ translateX: size / 2 + 28 }] }, labelAnimatedStyle]}
          accessible={false}
          accessibilityElementsHidden={true}
          importantForAccessibility="no-hide-descendants"
        >
          <Text style={[styles.labelText]}>
            {remainingGB}
          </Text>
          <Text style={styles.labelSubtext}>GB Left</Text>
        </Animated.View>
      )}
    </View>
  );
};

const UsageSummaryCard = ({ currentUsage, loading = false }) => {
  const { width: windowWidth } = useWindowDimensions();
  const donutSize = Math.min(220, Math.max(140, Math.floor(windowWidth * 0.32)));

  if (!currentUsage || loading) {
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.header}>
            <View style={styles.iconWrapper} accessible={false} importantForAccessibility="no-hide-descendants" accessibilityElementsHidden={true}>
              <MaterialCommunityIcons name="chart-donut" size={20} color={theme.colors.primary} />
            </View>
            <Text style={styles.headerTitle} accessibilityRole="header">DATA USAGE</Text>
          </View>
          <View style={{ height: 200, alignItems: "center", justifyContent: "center" }}>
            <Text style={styles.statLabel}>Loading usage data...</Text>
          </View>
        </View>
      </View>
    );
  }

  const startDate = new Date(currentUsage.beginDate).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const endDate = new Date(currentUsage.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const remainingPercent = 100 - currentUsage.dataUsedPercent;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.iconWrapper} accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants"><ServiceIcon /></View>
          <SectionTitle accessibilityRole="header">
            Data Usage
          </SectionTitle>
        </View>

        <DonutWithCallouts
          usedPercent={currentUsage.dataUsedPercent}
          remainingPercent={remainingPercent}
          usedGB={currentUsage.usedDataGB}
          remainingGB={currentUsage.dataRemaining.toFixed(2)}
          size={donutSize}
        />

        <View style={styles.stats}>
          <View
            style={styles.statBox}
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
     ...AppStyles.card,
    padding: theme.spacing.base,
  },
  header: cardHeader.container,
  headerTitle: cardHeader.title,
  textLabel: {
    alignItems: 'flex-start',
  },
  labelText: {
    fontSize: theme.typography.size.base,
    fontFamily: theme.typography.family.regular,
    color: theme.colors.text.secondary,
    fontWeight: '700',
  },
  labelSubtext: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.family.regular,
    color: theme.colors.text.secondary,
    marginTop: 1,
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
    backgroundColor: theme.colors.secondarySurface,
    borderRadius: theme.radius.base,
  },
  statValue: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.family.semiBold,
    fontWeight: "600",
    color: theme.colors.text.primary,
    textAlign: "center",
    marginVertical: 2,
  },
  statLabel: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.family.regular,
    color: theme.colors.text.secondary,
    textAlign: "center",
  },
  iconWrapper: cardHeader.iconWrapper,
});

export default UsageSummaryCard;
