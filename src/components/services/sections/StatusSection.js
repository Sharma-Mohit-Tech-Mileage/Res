import React from "react";
import { View, Text, StyleSheet } from "react-native";
import ServiceStatusSpinner from "../../common/ServiceStatusSpinner";
import { statusSection } from "../../../styles/compositions";
import { theme } from "../../../styles/theme";
import NotificationAlert from "../../common/customui/NotificationAlert";
import SecondaryButton from "../../common/customui/PrimaryButton";
import AppStyles from "../../../styles/AppStyles";

const MATCHED_CARD_MIN_HEIGHT = 220;

const StatusSection = ({
  onCheckStatus,
  outageData,
  checking,
  onCloseNotification,
  hasUserInitiatedCheck = false,
}) => {
  const handleCheckStatus = () => {
    if (onCheckStatus) {
      onCheckStatus();
    }
  };

  return (
    <View style={[styles.container]}>
      <View
        style={[
          AppStyles.card,
          {
            padding: 16,
            marginHorizontal: 16,
            minHeight: MATCHED_CARD_MIN_HEIGHT,
          },
        ]}
      >
        {hasUserInitiatedCheck && outageData && (
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
            <ServiceStatusSpinner isAnimating={checking} />
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
});

export default StatusSection;
