import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import Svg, { Circle } from "react-native-svg";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { statusSection } from "../../../styles/compositions";
import { theme } from "../../../styles/theme";
import NotificationAlert from "../../common/customui/NotificationAlert";
import SecondaryButton from "../../common/customui/PrimaryButton";

// Sparklight brand purples
const RING_OUTER = "#ba92bf";
const RING_MIDDLE = "#9e61a2";
const DOT_INNER = "#8e3c91";

const ICON_SIZE = 88;
const RING_WIDTH = 4;
const OUTER_SIZE = 72;
const MIDDLE_SIZE = 48;
const INNER_SIZE = 26;

// SVG arc ring: two opposite 60° arcs (left + right), 120° gaps (top + bottom).
// Replaces the old borderLeft/Right + transparent top/bottom trick, which
// Android refuses to render on rounded views (all-or-nothing border color).
const Ring = ({ size, color, style }) => {
  const r = (size - RING_WIDTH) / 2;
  const C = 2 * Math.PI * r;
  const arcLen = C / 6; // 60°
  const gapLen = C / 3; // 120°
  const c = size / 2;
  return (
    <Animated.View
      style={[
        { position: "absolute", width: size, height: size },
        style,
      ]}
    >
      <Svg width={size} height={size}>
        <Circle
          cx={c}
          cy={c}
          r={r}
          stroke={color}
          strokeWidth={RING_WIDTH}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${arcLen} ${gapLen}`}
          transform={`rotate(-30 ${c} ${c})`}
        />
      </Svg>
    </Animated.View>
  );
};

/**
 * Sparklight concentric-ring status icon.
 *
 * Always shows concentric rings + globe in center.
 * When idle      → rings are static
 * When animating → rings spin (outer CW, middle CCW), globe stays centered
 */
const StatusIcon = ({ isAnimating = false }) => {
  const outerAnim = useRef(new Animated.Value(0)).current;
  const middleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isAnimating) {
      const outer = Animated.loop(
        Animated.timing(outerAnim, {
          toValue: 1,
          duration: 4000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
      const middle = Animated.loop(
        Animated.timing(middleAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
      outer.start();
      middle.start();
      return () => {
        outer.stop();
        middle.stop();
      };
    } else {
      outerAnim.setValue(0);
      middleAnim.setValue(0);
    }
  }, [isAnimating]);

  const outerRotate = outerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "1600deg"],
  });

  const middleRotate = middleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "-1600deg"],
  });

  return (
    <View
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      accessibilityElementsHidden={true}
      style={styles.iconContainer}
    >
      {/* Outer ring */}
      <Ring
        size={OUTER_SIZE}
        color={RING_OUTER}
        style={isAnimating ? { transform: [{ rotate: outerRotate }] } : null}
      />

      {/* Middle ring */}
      <Ring
        size={MIDDLE_SIZE}
        color={RING_MIDDLE}
        style={isAnimating ? { transform: [{ rotate: middleRotate }] } : null}
      />

      {/* Globe icon in center */}
      <MaterialCommunityIcons
        name="earth"
        size={INNER_SIZE + 4}
        color={DOT_INNER}
      />
    </View>
  );
};

const StatusSection = ({
  onCheckStatus,
  outageData,
  checking,
  onCloseNotification,
}) => {
  const handleCheckStatus = () => {
    if (onCheckStatus) {
      onCheckStatus();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {outageData && (
          <View style={styles.alertInsideCard}>
            <NotificationAlert
              type={outageData.hasOutage ? "warning" : "info"}
              title={outageData.title}
              message={outageData.message}
              splitKey={outageData.splitKey || "contact us"}
              onClose={onCloseNotification}
              showCloseIcon={true}
              isVisible={true}
              autoFocusTitle={true}
            />
          </View>
        )}

        <View
          style={styles.iconWrapper}
          accessible={false}
          importantForAccessibility="no-hide-descendants"
          accessibilityElementsHidden={true}
          accessibilityLabel={
            checking
              ? "Checking service status, loading animation"
              : "Service status icon"
          }
        >
          <View style={styles.iconBadge}>
            <StatusIcon isAnimating={checking} />
          </View>
        </View>

        <Text
          style={styles.title}
          accessible={true}
          accessibilityLabel="Stay Connected with Confidence"
          accessibilityRole="header"
        >
          Stay Connected with Confidence
        </Text>

        <Text
          style={styles.subtitle}
          accessible={true}
          accessibilityLabel={
            checking
              ? "Checking your service status..."
              : "When your connection pauses, we hit play."
          }
        >
          {checking
            ? "Checking your service status..."
            : "When your connection pauses, we hit play."}
        </Text>

        <SecondaryButton
          title="Check Service Status"
          buttonType="submit"
          onPress={handleCheckStatus}
          accessibilityLabel="Check Service Status"
          accessibilityRole="button"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: statusSection.container,
  card: statusSection.card,
  alertInsideCard: statusSection.alertInsideCard,
  iconWrapper: statusSection.iconWrapper,
  iconBadge: {
    ...statusSection.iconBadge,
    backgroundColor: "transparent",
    overflow: "visible",
  },
  title: statusSection.title,
  subtitle: statusSection.subtitle,

  iconContainer: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default StatusSection;
