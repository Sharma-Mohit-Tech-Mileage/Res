import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { statusSection } from "../../../styles/compositions";
import { theme } from "../../../styles/theme";
import NotificationAlert from "../../common/customui/NotificationAlert";
import SupportIcon from "../../../res/svgIcons/SupportIcon";
import SecondaryButton from "../../common/customui/PrimaryButton";
import SmallLoader from "../../common/customui/SmallLoader";
const WiFiLoadingAnimation = ({ isAnimating = false }) => {
  if (!isAnimating) {
    return <SupportIcon color={theme.colors.primary} filled={true} size={28} />;
  }

  return (
    <View style={styles.animationContainer}>
      <View style={styles.lottieWrapper}>
        <SmallLoader isWhite={false} width={210} height={210} />
      </View>

      <View style={styles.centerIcon}>
        <SupportIcon color={theme.colors.primary} filled={true} size={28} />
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
            />
          </View>
        )}

        <View
          style={styles.iconWrapper}
          accessible={false}
          importantForAccessibility="no"
        >
          <View style={styles.iconBadge}>
            <WiFiLoadingAnimation isAnimating={checking} />
          </View>
        </View>

        <Text
          style={styles.title}
          accessible={true}
          accessibilityLabel="Stay Connected with Confidence, Heading level 2"
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
  iconBadge: statusSection.iconBadge,
  title: statusSection.title,
  subtitle: statusSection.subtitle,

  animationContainer: {
    width: 90,
    height: 90,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  lottieWrapper: {
    position: "absolute",
    width: 90,
    height: 90,
    alignItems: "center",
    justifyContent: "center",
  },
  centerIcon: {
    position: "absolute",
    zIndex: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default StatusSection;
