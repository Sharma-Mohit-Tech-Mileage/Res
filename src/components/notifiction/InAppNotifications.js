import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  Animated,
  ScrollView,
  Platform,
  AppState,
  Linking,
  AccessibilityInfo,
  findNodeHandle,
} from "react-native";
import Touchable from "../common/customui/Touchable";
import {
  Color,
  FontSize,
  FontFamily,
  Padding,
  Border,
} from "../../../GlobalStyles";

import ProfileSettingsHeader from "../common/ProfileSettingsHeader";
import { useRoute, useIsFocused } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import NotificationAlert from "../common/customui/NotificationAlert";
import ConfirmDialog from "../common/customui/ConfirmDialog";
import moment from "moment";
import Toggle from "../common/Toggle";
import { getUser } from "../../redux/utils/LocalStorage";
import { getDeviceUniqueId } from "../../firebase/FirebaseUtils";
import { PostApiRequest } from "../../network/RestApiClient";
import { getEndpoint, ENDPOINTS } from "../../network/apis/endpoints/Endpoints";
import LoadingOverlay from "../common/customui/LoadingOverlay";
import useAccessibilityFocus from "../../../src/hooks/useAccessibilityFocus";

import {
  getFcmToken,
  notifyPermission,
  requestUserPermission,
} from "../../firebase/FirebaseUtils";
import { getPushNotificationStatus } from "../../redux/utils/LocalStorage";
import { container } from "../../styles/utilities";


const InAppNotifications = ({ navigation }) => {
  const route = useRoute();
  const [initialize, setInitializeSettings] = useState(
    route.params?.additionalData,
  );
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showNotifPermission, setShowNotifPermission] = useState(false);
  const additionalData = route.params?.additionalData;
  const dispatch = useDispatch();
  const scrollViewRef = useRef(null);
  const animatedValue = useRef(new Animated.Value(-100)).current;
  const timeoutRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const isFocused = useIsFocused();
  const [isNotificationRquired, setIsNotificationRequired] = useState(false);
  const [notification, setNotification] = useState(null);
  const [errorRef, setErrorFocus] = useAccessibilityFocus();
  const [successRef, setSuccessFocus] = useAccessibilityFocus();
  const successIconRef = useRef(null);
  const formatedData = route.params?.additionalData || {};
  const [screenReaderEnabled, setScreenReaderEnabled] = useState(false);
  // Android TalkBack: hide background elements only for error alerts, not for success banners.
  const isAndroidA11yModalActive =
    Platform.OS === "android" && screenReaderEnabled && notification?.type === "error";

  useEffect(() => {
      AccessibilityInfo.isScreenReaderEnabled().then(setScreenReaderEnabled);
    }, []);
  
  
  
    useEffect(() => {
      if (notification && screenReaderEnabled) {
        // Focus-only, mirror Text Notifications: prefer success icon; fallback to container refs. Retry once.
        const t1 = setTimeout(() => {
          try {
            if (notification.type === "success" && successIconRef.current) {
              const handle = findNodeHandle(successIconRef.current);
              if (handle) AccessibilityInfo.setAccessibilityFocus(handle);
            } else if (notification.type === "success") {
              setSuccessFocus();
            } else {
              setErrorFocus();
            }
          } catch (e) {
            console.warn("Accessibility focus error:", e);
          }
        }, 600);

        const t2 = setTimeout(() => {
          try {
            if (notification.type === "success" && successIconRef.current) {
              const handle = findNodeHandle(successIconRef.current);
              if (handle) AccessibilityInfo.setAccessibilityFocus(handle);
            }
          } catch (e) {
            console.warn("Accessibility focus retry error:", e);
          }
        }, 1200);

        return () => { clearTimeout(t1); clearTimeout(t2); };
      }
    }, [notification, screenReaderEnabled, setSuccessFocus, setErrorFocus]);
  

  const translateY = animatedValue;
  const animateNotification = useCallback(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Always animate in notification from off-screen
    animatedValue.setValue(-100);

    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [animatedValue, notification]);

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
      const initializedSettings = additionalData;
      setInitializeSettings(initializedSettings);
    }

    return () => {
      if (isFocused) {
        setInitializeSettings({});
      }
    };
  }, [isFocused]);

  // Handle app state changes
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

  const handleToggleChange = (e) => {
    const { name, value } = e.target;
    formatedData[name] = value;
  };

  const initialNotificationStatus = async () => {
    const enabledPermission = await requestUserPermission();
    if (enabledPermission) {
      setIsNotificationRequired(false);
    } else {
      setIsNotificationRequired(true);
    }
  };

  const checkNofif = async (value) => {
    if (value) {
      const pushNotification = await getPushNotificationStatus();
      if (pushNotification?.permanentSkip) {
        const enabled = await notifyPermission();
        if (!enabled) {
          setIsNotificationRequired(true);
          setShowNotifPermission(true);
        }
      } else {
        const enabledPermission = await requestUserPermission();
        if (enabledPermission) {
          setIsNotificationRequired(false);
        } else {
          setIsNotificationRequired(true);
          setShowNotifPermission(true);
        }
      }
    } else {
    }
  };

  useEffect(() => {
    if (route.params?.updateFailed) {
      setShowErrorAlert(true);
      scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
      navigation.setParams({ updateFailed: undefined });
    }
  }, [route.params?.updateFailed, navigation, dispatch]);

  useEffect(() => {
    if (route.params?.updateSuccess) {
      setNotification({
        message: route.params.successMessage,
        type: "success",
      });
    }
  }, [route.params]);

  const handleSave = async () => {

    await postRequestInAppNotification();
  };

  const postRequestInAppNotification = async () => {
    if (
      formatedData.optOut ||
      formatedData.outageOptOut ||
      formatedData.billingOptOutStatus
    ) {
      checkNofif(true);
    }
    const token = await getFcmToken();
    let user = await getUser();
    let deviceId = await getDeviceUniqueId();
    const accountNumber = user.userInfo?.accountNumber || null;
    const userName = user.userInfo?.userName || null;

    setIsLoading(true);
    const requestData = {
      accountNumber: accountNumber,
      deviceToken: token || deviceId,
      DeviceId: deviceId,
      deviceTokenTimestamp: moment().format(),
      isAndroid: Platform.OS === "android",
      optOut: !formatedData.optOut,
      outageOptOut: !formatedData.outageOptOut,
      userName: userName,
      billingOptOutStatus: !formatedData.billingOptOutStatus,
      customerType: "Residential",
    };
    PostApiRequest(
      getEndpoint(ENDPOINTS.MOBILE_NOTIFICATION_PREFS, { userName }),
      requestData,
      (res) => {
        setIsLoading(false);
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
        console.warn("Error on retrying postRequestInAppNotification", error);
        setNotification({
          message: "In-App Notifications update failed.",
          type: "error",
        });
      },
    );
  };

  return (
    <View style={styles.inAppNotifications}>
      <ProfileSettingsHeader
        title="Edit In-App Notifications"
        onPressBack={() => navigation.navigate("Notifications")}
      />

      <ConfirmDialog
        visible={showNotifPermission}
        title="Sparklight Would Like to Send You Notifications"
        message="Receive app alerts related to your account, updates from Sparklight. Please go to your Settings and allow Notifications."
        confirmText="Go to Settings"
        cancelText="Cancel"
        onConfirm={() => {
          setShowNotifPermission(false);
          if (Platform.OS === "ios") {
            Linking.openURL("app-settings:");
          } else {
            Linking.openSettings();
          }
        }}
        onCancel={() => {
          setShowNotifPermission(false);
          setIsNotificationRequired(false);
        }}
      />

      {isLoading && (
        <LoadingOverlay
          loading={isLoading}
          loadingTxt="Saving"
          accessibilityLiveRegion="polite"
        />
      )}

      <ScrollView>
        <View style={styles.inAppNotificationsInner}>
          <View style={{ alignSelf: "stretch" }}>
            <View style={[styles.frameGroup, styles.frameBorder]}>
              {notification && (
                <Animated.View
                  style={{
                    transform: [{ translateY }],
                    paddingHorizontal: Padding.p_5xl,
                    alignSelf: "stretch",
                  }}
                  accessible={false}
                  importantForAccessibility="yes"
                >
                  <View
                    style={styles.spaceBottom}
                    ref={notification.type === "error" ? errorRef : successRef}
                  >
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
                      iconRef={successIconRef}
                    />
                  </View>
                </Animated.View>
              )}

              {/* Hide background controls from TalkBack while the notification is visible */}
              <View
                importantForAccessibility={
                  isAndroidA11yModalActive ? "no-hide-descendants" : "auto"
                }
                accessibilityElementsHidden={isAndroidA11yModalActive}
              >
                <View style={styles.infoWrapper}>
                  <NotificationAlert
                    type="error"
                    title="Error"
                    message="Notifications updated failed."
                    showCloseIcon={true}
                    isVisible={showErrorAlert}
                    autoFocusTitle={true}
                    onClose={() => setShowErrorAlert(false)}
                  />
                </View>
                <NotificationSetting
                  title="Appointments"
                  name="optOut"
                  value={formatedData.optOut}
                  description="Receive app notifications when your appointments have updates."
                  onChange={handleToggleChange}
                />
                <NotificationSetting
                  title="Outage Alerts"
                  name="outageOptOut"
                  value={formatedData.outageOptOut}
                  description="Receive app notifications when outage occur."
                  onChange={handleToggleChange}
                />
                <NotificationSetting
                  title="Billing"
                  name="billingOptOutStatus"
                  value={formatedData.billingOptOutStatus}
                  description="Receive app notifications for billing."
                  onChange={handleToggleChange}
                />
              </View>
              </View>

                <View style={styles.buttonsParent}>
                  <Touchable
                    minSize={0}
                    accessible={true}
                    accessibilityLabel="Save"
                    accessibilityRole="button"
                    style={[
                      { backgroundColor: Color.colorMidnightblue },
                      styles.buttonsLayout,
                    ]}
                    onPress={handleSave}
                  >
                    <Text
                      style={[{ color: Color.sparklightWhite }, styles.makeTypo]}
                    >
                      Save
                    </Text>
                  </Touchable>
                  <Touchable
                    minSize={0}
                    accessible={true}
                    accessibilityLabel="Cancel"
                    accessibilityRole="button"
                    style={[
                      styles.buttons1,
                      styles.buttonsLayout,
                    ]}
                    onPress={() => navigation.navigate("Notifications")}
                  >
                    <Text
                      style={[{ color: Color.colorMidnightblue }, styles.makeTypo]}
                    >
                      Cancel
                    </Text>
                  </Touchable>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const NotificationSetting = ({ name, value, title, description, onChange }) => (
  <Touchable
    minSize={0}
    style={[styles.frameContainer, styles.frameBorder, { justifyContent: 'flex-start' }]}
    accessible={false}
    importantForAccessibility="no"
    onPress={() =>
      onChange({ target: { name, value: !value, type: "toggle" } })
    }
  >
    <View style={styles.frameView}>
      <View style={styles.appointmentsParent}>
        <View style={{ flexDirection: "column", flex: 1, marginRight: 10 }}>
          <Text
            style={styles.appointments}
            accessible={true}
            accessibilityRole="text"
            accessibilityLabel={`${title} for In-app notifications. ${description}`}
          >
            {title}
          </Text>
          <Text
            style={[
              styles.receiveAppNotifications1,
              styles.receiveTypo,
              { marginTop: 8 },
            ]}
            accessible={false}
            importantForAccessibility="no"
          >
            {description}
          </Text>
        </View>

        <View>
          <Toggle
            name={name}
            initialValue={value}
            label={title}
            description={description}
            onToggle={(e) => {
              onChange({ target: { name, value: !value, type: "toggle" } });
            }}
            section="inAppNotif"
          />
        </View>
      </View>
    </View>
  </Touchable>
);

const styles = StyleSheet.create({
  frameBorder: {
    borderColor: Color.sparklightGray,
    backgroundColor: Color.sparklightWhite,
    alignItems: "center",
    borderStyle: "solid",
  },
  receiveTypo: {
    fontSize: FontSize.textXsSemibold_size,
    color: Color.sparklightaddGray,
    textAlign: "left",
    fontFamily: FontFamily.openSansRegular,
    alignSelf: "stretch",
  },
  buttonsLayout: {
    paddingHorizontal: 0,
    width: "100%",
    paddingVertical: Padding.p_base,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Border.br_11xs,
    height: 56,
  },
  makeTypo: {
    width: 282,
    fontFamily: FontFamily.openSansRegular,
    fontSize: FontSize.size_base,
    textAlign: "center",
  },
  appointments: {
    color: Color.colorGray_100,
    textAlign: "left",
    fontFamily: FontFamily.openSansRegular,
    fontSize: FontSize.size_base,
    lineHeight: 22,
    flex: 1,
  },
  appointmentsParent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  frameView: {
    paddingVertical: Padding.p_base,
    flexDirection: "row",
    paddingHorizontal: Padding.p_5xl,
  },
  frameContainer: {
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "stretch",
  },
  receiveAppNotifications1: {
    color: Color.colorGray_100,
    lineHeight: 22,
  },
  frameGroup: {
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Border.br_11xs,
    backgroundColor: Color.sparklightWhite,
    alignSelf: "stretch",
    overflow: "hidden",
  },
  infoWrapper: {
    paddingHorizontal: Padding.p_5xl,
    alignSelf: "stretch",
  },
  spaceBottom: {
    marginVertical: 16,
    alignSelf: "stretch",
  },
  buttons1: {
    marginTop: 16,
    backgroundColor: Color.colorWhitesmoke_200,
    paddingHorizontal: 0,
  },
  buttonsParent: {
    marginTop: 16,
    alignSelf: "stretch",
  },
  inAppNotificationsInner: {
    paddingTop: Padding.p_xl,
    paddingBottom: Padding.p_base,
    paddingHorizontal: Padding.p_base,
    width: "100%",
    overflow: "hidden",
  },
  inAppNotifications: container.page,
});

export default InAppNotifications;
