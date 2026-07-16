import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  StyleSheet,
  View,
  Animated,
  ScrollView,
  Platform,
  AppState,
  Linking,
  Alert,
  AccessibilityInfo,
} from "react-native";
import Touchable from "../common/customui/Touchable";
import { Color, Padding } from "../../../GlobalStyles";
import ProfileSettingsHeader from "../common/ProfileSettingsHeader";
import { useRoute, useIsFocused } from "@react-navigation/native";
import { widthPercentageToDP } from "react-native-responsive-screen";
import NotificationAlert from "../common/customui/NotificationAlert";
import moment from "moment";
import Toggle from "../common/Toggle";
import { getUser } from "../../redux/utils/LocalStorage";
import { getDeviceUniqueId } from "../../firebase/FirebaseUtils";
import { PostApiRequest } from "../../network/RestApiClient";
import { getEndpoint, ENDPOINTS } from "../../network/apis/endpoints/Endpoints";
import LoadingOverlay from "../common/customui/LoadingOverlay";
import useAccessibilityFocus from "../../../src/hooks/useAccessibilityFocus";
import AppStyles from "../../styles/AppStyles";
import SecondaryButton from "../common/customui/PrimaryButton";
import { SectionTitle, SectionContent } from "../common/customui/Typography";
import {
  getFcmToken,
  notifyPermission,
  requestUserPermission,
} from "../../firebase/FirebaseUtils";
import { getPushNotificationStatus } from "../../redux/utils/LocalStorage";

const initialFormState = {
  optOut: false,
  outageOptOut: false,
  billingOptOutStatus: false,
};

const InAppNotifications = ({ navigation }) => {
  const route = useRoute();
  const [formData, setFormData] = useState(() => ({
    ...initialFormState,
    ...(route.params?.additionalData || {}),
  }));
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isNotificationRequired, setIsNotificationRequired] = useState(false);
  const [screenReaderEnabled, setScreenReaderEnabled] = useState(false);

  const scrollViewRef = useRef(null);
  const animatedValue = useRef(new Animated.Value(-100)).current;
  const timeoutRef = useRef(null);
  const isFocused = useIsFocused();

  const isAndroidA11yModalActive =
    Platform.OS === "android" &&
    screenReaderEnabled &&
    notification?.type === "error";

  useEffect(() => {
    AccessibilityInfo.isScreenReaderEnabled().then(setScreenReaderEnabled);
  }, []);

  const translateY = animatedValue;

  const animateNotification = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    animatedValue.setValue(-100);
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [animatedValue]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (notification) {
      scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
      animateNotification();
    }
  }, [notification, animateNotification]);

  useEffect(() => {
    if (isFocused) {
      const initializedSettings = route.params?.additionalData || {};
      setFormData((prev) => ({ ...prev, ...initializedSettings }));
    }
  }, [isFocused, route.params?.additionalData]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        initialNotificationStatus();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (route.params?.updateFailed) {
      setNotification({
        message:
          route.params.errorMessage || "In-App Notifications update failed.",
        type: "error",
      });
      navigation.setParams({
        updateFailed: undefined,
        errorMessage: undefined,
      });
    }
  }, [route.params?.updateFailed, route.params?.errorMessage, navigation]);

  useEffect(() => {
    if (route.params?.updateSuccess) {
      setNotification({
        message:
          route.params.successMessage ||
          "Your in-app notification preferences have been updated successfully.",
        type: "success",
      });
      navigation.setParams({
        updateSuccess: undefined,
        successMessage: undefined,
      });
    }
  }, [route.params?.updateSuccess, route.params?.successMessage, navigation]);

  const handleToggleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const initialNotificationStatus = async () => {
    const enabledPermission = await requestUserPermission();
    setIsNotificationRequired(!enabledPermission);
  };

  const checkNofif = async (value) => {
    if (!value) return;

    const pushNotification = await getPushNotificationStatus();
    if (pushNotification?.permanentSkip) {
      await notifyPermission();
      return;
    }

    const enabledPermission = await requestUserPermission();
    if (enabledPermission) {
      setIsNotificationRequired(false);
      return;
    }

    setIsNotificationRequired(true);
    Alert.alert(
      "Sparklight Would Like to Send You Notifications",
      "Receive app alerts related to your account, updates from Sparklight. Please go to your Settings and allow Notifications.",
      [
        {
          text: "Go to Settings",
          style: "cancel",
          onPress: () => {
            if (Platform.OS === "ios") {
              Linking.openURL("app-settings:");
            } else {
              Linking.openSettings();
            }
          },
        },
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => {
            setIsNotificationRequired(false);
          },
        },
      ],
    );
  };

  const postRequestInAppNotification = async () => {
    if (
      formData.optOut ||
      formData.outageOptOut ||
      formData.billingOptOutStatus
    ) {
      await checkNofif(true);
    }

    setIsSubmitting(true);
    setIsLoading(true);

    try {
      const token = await getFcmToken();
      const user = await getUser();
      const deviceId = await getDeviceUniqueId();
      const accountNumber = user.userInfo?.accountNumber || null;
      const userName = user.userInfo?.userName || null;

      const requestData = {
        accountNumber,
        deviceToken: token || deviceId,
        DeviceId: deviceId,
        deviceTokenTimestamp: moment().format(),
        isAndroid: Platform.OS === "android",
        optOut: !formData.optOut,
        outageOptOut: !formData.outageOptOut,
        userName,
        billingOptOutStatus: !formData.billingOptOutStatus,
        customerType: "Residential",
      };

      PostApiRequest(
        getEndpoint(ENDPOINTS.MOBILE_NOTIFICATION_PREFS, { userName }),
        requestData,
        (res) => {
          setIsLoading(false);
          setIsSubmitting(false);
          if (res) {
            setNotification({
              message:
                "Your in-app notification preferences have been updated successfully.",
              type: "success",
            });
          }
        },
        (error) => {
          setIsLoading(false);
          setIsSubmitting(false);
          console.warn("Error on retrying postRequestInAppNotification", error);
          setNotification({
            message: "In-App Notifications update failed.",
            type: "error",
          });
        },
      );
    } catch (error) {
      setIsLoading(false);
      setIsSubmitting(false);
      console.warn("Permission error:", error);
      setNotification({
        message: "Failed to update notification preferences.",
        type: "error",
      });
    }
  };

  const handleSave = async () => {
    await postRequestInAppNotification();
  };

  return (
    <View style={styles.inAppNotifications}>
      <ProfileSettingsHeader
        title="Edit In-App Notifications"
        onPressBack={() => navigation.navigate("Notifications")}
      />

      {isLoading && (
        <LoadingOverlay
          loading={isLoading}
          loadingTxt="Saving"
          accessibilityLiveRegion="polite"
        />
      )}

      <ScrollView ref={scrollViewRef}>
        <View style={styles.inAppNotificationsInner}>
          <View style={[AppStyles.card, styles.cardContainer]}>
            <View style={styles.frameBorder}>
              {notification && (
                <Animated.View
                  style={[
                    styles.alertContainer,
                    { transform: [{ translateY }] },
                  ]}
                  accessible={false}
                  importantForAccessibility="yes"
                >
                  <View style={styles.spaceBottom}>
                    <NotificationAlert
                      type={notification.type}
                      title={
                        notification.type === "error" ? "Error" : "Success"
                      }
                      message={notification.message}
                      showCloseIcon={true}
                      onClose={() => setNotification(null)}
                      accessibilityLiveRegion="assertive"
                      accessibilityRole="alert"
                      accessibilityLabel={notification.message}
                      isVisible={true}
                      autoFocusTitle={false}
                    />
                  </View>
                </Animated.View>
              )}

              <View
                importantForAccessibility={
                  isAndroidA11yModalActive ? "no-hide-descendants" : "auto"
                }
                accessibilityElementsHidden={isAndroidA11yModalActive}
              >
                <NotificationSetting
                  title="Appointments"
                  name="optOut"
                  value={formData.optOut}
                  description="Receive app notifications when your appointments have updates."
                  onChange={handleToggleChange}
                />

                <View style={styles.divider} />

                <NotificationSetting
                  title="Outage Alerts"
                  name="outageOptOut"
                  value={formData.outageOptOut}
                  description="Receive app notifications when outages occur."
                  onChange={handleToggleChange}
                />

                <View style={styles.divider} />

                <NotificationSetting
                  title="Billing"
                  name="billingOptOutStatus"
                  value={formData.billingOptOutStatus}
                  description="Receive app notifications for billing."
                  onChange={handleToggleChange}
                />
              </View>
            </View>
          </View>

          <View style={styles.buttonsParent}>
            <SecondaryButton
              title="Save"
              onPress={handleSave}
              accessibilityLabel={
                isSubmitting ? "Saving settings..." : "Save settings"
              }
              accessibilityHint="Double tap to save your notification preferences"
              style={styles.saveButton}
              disabled={isSubmitting}
              buttonType="submit"
            />
            <SecondaryButton
              title="Cancel"
              onPress={() => navigation.goBack()}
              accessibilityLabel="Cancel"
              accessibilityHint="Double tap to cancel and go back"
              style={styles.cancelButton}
              disabled={isSubmitting}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const NotificationSetting = ({ name, value, title, description, onChange }) => (
  <Touchable
    minSize={0}
    style={styles.frameContainer}
    accessible={false}
    importantForAccessibility="no"
    onPress={() => onChange(name, !value)}
  >
    <View style={styles.frameView}>
      <View style={styles.rowContent}>
        <View style={styles.textWrap}>
          <View style={styles.titleRow}>
            <SectionTitle
              style={styles.appointments}
              accessible={true}
              accessibilityRole="text"
              accessibilityLabel={`${title} for In-app notifications. ${description}`}
            >
              {title}
            </SectionTitle>
            <Toggle
              name={name}
              initialValue={value}
              label={title}
              description={description}
              onToggle={() => onChange(name, !value)}
              section="inAppNotif"
            />
          </View>
          <SectionContent
            style={styles.descriptionText}
            accessible={false}
            importantForAccessibility="no"
          >
            {description}
          </SectionContent>
        </View>
      </View>
    </View>
  </Touchable>
);

const styles = StyleSheet.create({
  cardContainer: {
    margin: 16,
    padding: 0,
    overflow: "hidden",
  },
  frameBorder: {
    borderColor: Color.sparklightGray,
    backgroundColor: Color.sparklightWhite,
    alignItems: "center",
    borderStyle: "solid",
  },
  alertContainer: {
    paddingHorizontal: Padding.p_5xl,
    paddingTop: Padding.p_base,
    width: "100%",
  },
  divider: {
    height: 1,
    backgroundColor: Color.sparklightGray,
    alignSelf: "stretch",
  },
  appointments: {
    flex: 1,
  },
  rowContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    width: "100%",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  frameView: {
    paddingVertical: Padding.p_5xs,
    flexDirection: "row",
    paddingHorizontal: Padding.p_5xl,
    width: "100%",
  },
  frameContainer: {
    borderBottomWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "stretch",
  },
  textWrap: {
    flexDirection: "column",
    flex: 1,
    marginRight: 10,
  },
  descriptionText: {
    marginTop: 0,
    marginBottom: Padding.p_9xs,
  },
  spaceBottom: {
    marginVertical: 16,
    width: widthPercentageToDP("85%"),
  },
  buttonsParent: {
    margin: 16,
    alignSelf: "center",
    width: "90%",
  },
  saveButton: {
    backgroundColor: Color.colorMidnightblue,
  },
  cancelButton: {
    backgroundColor: Color.colorWhitesmoke_200,
  },
  inAppNotificationsInner: {
    width: "100%",
  },
  inAppNotifications: {
    flex: 1,
    backgroundColor: Color.colorWhitesmoke_200,
  },
});

export default InAppNotifications;
