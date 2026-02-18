import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  StyleSheet,
  Text,
  Pressable,
  View,
  Animated,
  ScrollView,
  Platform,
  AppState,
  Linking,
  Alert,
  AccessibilityInfo,
  findNodeHandle,
} from "react-native";
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
import { widthPercentageToDP } from "react-native-responsive-screen";
import NotificationAlert from "../common/customui/NotificationAlert";
import moment from "moment";
import Toggle from "../common/Toggle";
import { getUser } from "../../redux/utils/LocalStorage";
import { getDeviceUniqueId } from "../../firebase/FirebaseUtils";
import { PostApiRequest } from "../../network/APIClient";
import LoadingOverlay from "../common/customui/CustomLoading";
import useAccessibilityFocus from "../../../src/hooks/useAccessibilityFocus";

import {
  getFcmToken,
  notifyPermission,
  requestUserPermission,
} from "../../firebase/FirebaseUtils";
import { getPushNotificationStatus } from "../../redux/utils/LocalStorage";

const InAppNotifications = ({ navigation }) => {
  const route = useRoute();
  const [initialize, setInitializeSettings] = useState(
    route.params?.additionalData,
  );
  const [showErrorAlert, setShowErrorAlert] = useState(false);
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
  const isAndroidA11yModalActive =
    Platform.OS === "android" && screenReaderEnabled && !!notification;

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
            console.log("Accessibility focus error:", e);
          }
        }, 600);

        const t2 = setTimeout(() => {
          try {
            if (notification.type === "success" && successIconRef.current) {
              const handle = findNodeHandle(successIconRef.current);
              if (handle) AccessibilityInfo.setAccessibilityFocus(handle);
            }
          } catch (e) {
            console.log("Accessibility focus retry error:", e);
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
    }).start(() => {
      // Only auto-dismiss if notification is NOT an error type
      // if (notification && notification.type !== "error") {
      //   timeoutRef.current = setTimeout(() => {
      //     Animated.timing(animatedValue, {
      //       toValue: -100,
      //       duration: 500,
      //       useNativeDriver: true,
      //     }).start(() => setNotification(null));
      //   }, 2000);
      // }
    });
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
    // setInitializeSettings((initialize) => {
    //   const updatedSettings = {
    //     ...initialize,
    //     [name]: !value,
    //   };
    //   return updatedSettings;
    // });

    //checkNofif(value);
  };

  const initialNotificationStatus = async () => {
    const enabledPermission = await requestUserPermission();
    console.log("FCM INITIAL ENABLED?", enabledPermission);
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
        await notifyPermission();
      } else {
        const enabledPermission = await requestUserPermission();
        if (enabledPermission) {
          setIsNotificationRequired(false);
          //storePushNotificationStatus(localData);
          //await dispatch(updatePushNotifications(data, null));
        } else {
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
        }
      }
    } else {
      console.log("FCM HOME ALREADY ENABLED");
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
    } else if (route.params?.updateFailed) {
      //setNotification({ message: route.params.failureMessage, type: "error" });
    }
  }, [route.params]);

  const handleSave = async () => {
    console.log("isNotificationRquired", isNotificationRquired);

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
    console.log("postRequestInAppNotification requestData", requestData);
    const requestUrl = `api/mobilenotificationpreferences/${userName}/mobilepreferences`;
    PostApiRequest(
      requestUrl,
      requestData,
      (res) => {
        console.log("postRequestInAppNotification response", res);
        setIsLoading(false);
        if (res) {
          setNotification({
            message:
              "Your in-app notification preferences have been updated successfully.",
            type: "success",
          });
          //navigation.navigate("Notifications", { updateSuccess: true, successMessage: "In-App Notifications updated successfully." });
        }
      },
      (error) => {
        setIsLoading(false);
        console.error("Error on retrying postRequestInAppNotification", error);
        setNotification({
          message: "In-App Notifications update failed.",
          type: "error",
        });
        //setShowErrorAlert(true);
        //navigation.navigate("Notifications", { updateFailed: true, failureMessage: "In-App Notifications update failed." });
      },
    );
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

      <ScrollView>
        <View style={styles.inAppNotificationsInner}>
          <View style={{ alignSelf: "stretch" }}>
            <View style={[styles.frameGroup, styles.frameBorder]}>
              {notification && (
                <Animated.View
                  style={{
                    transform: [{ translateY }],
                    paddingHorizontal: Padding.p_5xl,
                  }}
                  accessible={false}
                  importantForAccessibility="yes"
                  accessibilityViewIsModal={isAndroidA11yModalActive}
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

                <View style={styles.buttonsParent}>
                  <Pressable
                    accessible={true}
                    accessibilityLabel="Save"
                    accessibilityRole="button"
                    style={({ pressed }) => [
                      {
                        backgroundColor: Color.colorMidnightblue,
                        opacity: pressed ? 0.7 : 1.0,
                      }, // Changes opacity based on press state
                      styles.buttonsLayout,
                    ]}
                    onPress={handleSave}
                  >
                    <Text
                      style={[{ color: Color.sparklightWhite }, styles.makeTypo]}
                    >
                      Save
                    </Text>
                  </Pressable>
                  <Pressable
                    accessible={true}
                    accessibilityLabel="Cancel"
                    accessibilityRole="button"
                    style={({ pressed }) => [
                      styles.buttons1,
                      styles.buttonsLayout,
                      { opacity: pressed ? 0.7 : 1.0 },
                    ]}
                    onPress={() => navigation.navigate("Notifications")}
                  >
                    <Text
                      style={[{ color: Color.colorMidnightblue }, styles.makeTypo]}
                    >
                      Cancel
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const NotificationSetting = ({ name, value, title, description, onChange }) => (
  <Pressable
    style={[styles.frameContainer, styles.frameBorder]}
    accessible={false}
    importantForAccessibility="no"
    onPress={() =>
      onChange({ target: { name, value: !value, type: "toggle" } })
    }
  >
    <View style={styles.frameView}>
      <View style={styles.appointmentsParent}>
        <View style={{ flexDirection: "column", flex: 1.7, marginRight: 10 }}>
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

        <View style={{ flex: 0.2 }}>
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
  </Pressable>
);

const styles = StyleSheet.create({
  frameBorder: {
    borderColor: Color.sparklightGray,
    backgroundColor: Color.sparklightWhite,
    alignItems: "center",
    borderStyle: "solid",
  },
  tabsParentFlexBox: {
    justifyContent: "center",
  },
  frameParent3: {
    justifyContent: "center",
    flex: 1,
  },
  mobilePhoneTypo: {
    color: Color.sparklightGray1,
    fontSize: FontSize.size_base,
    lineHeight: 22,
    textAlign: "left",
    fontFamily: FontFamily.openSansRegular,
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
    //alignItems: "center",
    paddingHorizontal: Padding.p_5xl,
    //flex: 1,
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
    width: widthPercentageToDP("85%"),
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
  inAppNotifications: {
    flex: 1,
    backgroundColor: Color.colorWhitesmoke_200,
  },
  infoCircleIcon: {
    width: 16,
    height: 16,
    overflow: "hidden",
  },
  infoCircleWrapper: {
    paddingVertical: Padding.p_8xs,
    flexDirection: "row",
  },
  youAreSubscribed: {
    lineHeight: 22,
  },
  youAreSubscribedContainer: {
    marginLeft: 8,
    color: Color.colorGray_200,
    textAlign: "left",
    fontFamily: FontFamily.openSansRegular,
    fontSize: FontSize.size_sm,
    flex: 1,
  },
  containerTypo: {
    textAlign: "left",
    fontFamily: FontFamily.openSansRegular,
  },
  receiveTextNotifications1: {
    color: Color.sparklightaddGray,
    lineHeight: 22,
    fontFamily: FontFamily.openSansRegular,
    textAlign: "left",
    alignSelf: "stretch",
    fontSize: FontSize.size_sm,
  },
  frameChild: {
    height: 1,
    backgroundColor: Color.sparklightGray,
    alignSelf: "stretch",
  },
});

export default InAppNotifications;
