import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import { Svg, Circle, Ellipse, Path, Defs, LinearGradient, Stop } from "react-native-svg";
import { statusSection } from "../../../styles/compositions";
import { theme } from "../../../styles/theme";
import NotificationAlert from "../../common/customui/NotificationAlert";
import SecondaryButton from "../../common/customui/PrimaryButton";

const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);

const GLOBE_SIZE = 58;
const CX = GLOBE_SIZE / 2;
const CY = GLOBE_SIZE / 2;
const R = GLOBE_SIZE / 2 - 3;

const StatusIcon = ({ isAnimating = false }) => {
  const meridianAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isAnimating) {
      const spin = Animated.loop(
        Animated.timing(meridianAnim, {
          toValue: 1,
          duration: 2500,
          easing: Easing.linear,
          useNativeDriver: false,
        })
      );
      const arrow = Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1400,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
      spin.start();
      arrow.start();
      return () => {
        spin.stop();
        arrow.stop();
      };
    } else {
      meridianAnim.setValue(0);
      rotateAnim.setValue(0);
    }
  }, [isAnimating]);

  const meridian1Rx = meridianAnim.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [2, R * 0.6, R, R * 0.6, 2],
  });
  const meridian2Rx = meridianAnim.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [R * 0.6, R, R * 0.6, 2, R * 0.6],
  });
  const meridian3Rx = meridianAnim.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [R, R * 0.6, 2, R * 0.6, R],
  });

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["360deg", "0deg"],
  });

  const primaryColor = theme.colors.primary;

  return (
    <View
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      accessibilityElementsHidden={true}
      style={styles.iconContainer}
    >
      {/* Rotating arrow ring */}
      {isAnimating && (
        <Animated.View
          style={[
            styles.arrowRing,
            { transform: [{ rotate }] },
          ]}
        >
          <Svg width={88} height={88} viewBox="0 0 88 88">
            <Defs>
              <LinearGradient id="arrowGrad" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0" stopColor={primaryColor} stopOpacity="0.9" />
                <Stop offset="0.6" stopColor={primaryColor} stopOpacity="0.3" />
                <Stop offset="1" stopColor={primaryColor} stopOpacity="0" />
              </LinearGradient>
            </Defs>
            <Path
              d="M44 6 A38 38 0 1 1 6 44"
              fill="none"
              stroke="url(#arrowGrad)"
              strokeWidth={3}
              strokeLinecap="round"
            />
            <Path
              d="M44 2 L44 10 L37 6 Z"
              fill={primaryColor}
            />
          </Svg>
        </Animated.View>
      )}

      {/* Globe in center — solid style */}
      <View style={styles.globeCenter}>
        <Svg width={GLOBE_SIZE} height={GLOBE_SIZE} viewBox={`0 0 ${GLOBE_SIZE} ${GLOBE_SIZE}`}>
          {/* Outer circle */}
          <Circle cx={CX} cy={CY} r={R} fill="none" stroke={primaryColor} strokeWidth={2.5} />

          {/* Equator — single curved arc across full width */}
          <Path
            d={`M ${CX - R} ${CY} Q ${CX} ${CY + R * 0.18} ${CX + R} ${CY}`}
            fill="none"
            stroke={primaryColor}
            strokeWidth={2}
          />

          {/* Upper latitude parallel — curves downward toward center */}
          <Path
            d={`M ${CX - R * 0.82} ${CY - R * 0.58} Q ${CX} ${CY - R * 0.58 + R * 0.22} ${CX + R * 0.82} ${CY - R * 0.58}`}
            fill="none"
            stroke={primaryColor}
            strokeWidth={2}
          />

          {/* Lower latitude parallel — curves upward toward center */}
          <Path
            d={`M ${CX - R * 0.82} ${CY + R * 0.58} Q ${CX} ${CY + R * 0.58 - R * 0.22} ${CX + R * 0.82} ${CY + R * 0.58}`}
            fill="none"
            stroke={primaryColor}
            strokeWidth={2}
          />

          {/* Vertical meridians */}
          {isAnimating ? (
            <>
              <AnimatedEllipse cx={CX} cy={CY} rx={meridian1Rx} ry={R} fill="none" stroke={primaryColor} strokeWidth={2} />
              <AnimatedEllipse cx={CX} cy={CY} rx={meridian2Rx} ry={R} fill="none" stroke={primaryColor} strokeWidth={2} />
              <AnimatedEllipse cx={CX} cy={CY} rx={meridian3Rx} ry={R} fill="none" stroke={primaryColor} strokeWidth={2} />
            </>
          ) : (
            <>
              <Ellipse cx={CX} cy={CY} rx={R * 0.35} ry={R} fill="none" stroke={primaryColor} strokeWidth={2} />
              <Ellipse cx={CX} cy={CY} rx={R * 0.7} ry={R} fill="none" stroke={primaryColor} strokeWidth={2} />
            </>
          )}
        </Svg>
      </View>
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
              : "Globe icon"
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
  },
  title: statusSection.title,
  subtitle: statusSection.subtitle,

  iconContainer: {
    width: 88,
    height: 88,
    alignItems: "center",
    justifyContent: "center",
  },

  arrowRing: {
    position: "absolute",
    width: 88,
    height: 88,
  },

  globeCenter: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default StatusSection;
