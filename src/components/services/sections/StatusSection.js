import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import { Svg, Path, Defs, LinearGradient, Stop } from "react-native-svg";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { statusSection } from "../../../styles/compositions";
import { theme } from "../../../styles/theme";
import NotificationAlert from "../../common/customui/NotificationAlert";
import SecondaryButton from "../../common/customui/PrimaryButton";

const StatusIcon = ({ isAnimating = false }) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isAnimating) {
      const arrow = Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1400,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
      arrow.start();
      return () => arrow.stop();
    } else {
      rotateAnim.setValue(0);
    }
  }, [isAnimating]);

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

      {/* Center icon */}
      <MaterialCommunityIcons
        name="access-point"
        size={48}
        color={primaryColor}
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
});

export default StatusSection;
