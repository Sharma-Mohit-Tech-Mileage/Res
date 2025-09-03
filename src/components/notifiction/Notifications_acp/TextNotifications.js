import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Image,
  Animated,
  StyleSheet,
  Text,
  Pressable,
  View,
  Keyboard,
  ScrollView,
  TouchableOpacity,
  AccessibilityInfo
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import CheckBox from "@react-native-community/checkbox";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRoute } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { updateTextNotification } from "../../../redux/actions/ProfileActionSuite";
import SparkLightInput from "../../common/customui/SparkLightInput";
import ProfileSettingsHeader from "../../common/ProfileSettingsHeader";
import NotificationAlert from "../../common/customui/NotificationAlert";
import { getUser } from "../../../redux/utils/LocalStorage";
import { getDeviceUniqueId } from "../../../firebase/FirebaseUtils";
import LoadingOverlay from "../../common/customui/CustomLoading";
import { PostApiRequest } from "../../../network/APIClient";

import {
  Color,
  FontFamily,
  FontSize,
  Padding,
  Border,
} from "../../../../GlobalStyles";

import Toggle from "../../common/Toggle";
import AlertIcon from "../../../../assets/svgs/Alerttriangle";
import { widthPercentageToDP } from "react-native-responsive-screen";

// Define your validation schema
const validationSchema = yup.object().shape({
  phoneNumber: yup
    .string()
    .matches(
      /^(?:1)?\s*(?:\([2-9]\d{2}\)\s*|[2-9]\d{2}[- ]?)?[2-9]\d{2}[- ]?\d{4}(?:\s*(?:ext|x)\s*\d{2,6})?$/,
      "Invalid mobile phone number."
    )
    .required("Phone number is required"),
  optOut: yup.boolean(),
  outageOptOut: yup.boolean(),
  billingOptOutStatus: yup.boolean(),
});
const TextNotifications = ({ navigation }) => {
  const scrollViewRef = useRef(null);
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState(false);
  const route = useRoute();
  const dispatch = useDispatch();
  const animatedValue = useRef(new Animated.Value(-100)).current;
  const timeoutRef = useRef(null);
  const [notification, setNotification] = useState(null);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorText, setErrorText] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const formatedData = route.params?.additionalData || {};
  const [isCheckboxVisible, setIsCheckboxVisible] = useState(false);
  const [toggleCheckBoxTerm, setToggleCheckBoxTerm] = useState(false);
  const [isTermRequired, setIsTermRequired] = useState(false);
  const [message1, setMessage1] = useState(
    "You are subscribing to text message alerts. Reply STOP to cancel at any time. Call 1-800-123-0456 for support. Message and data rates may apply."
  );
  const [message, setMessage] = useState(
    "Please enter your mobile phone number below and then select the type of message you would like to receive."
  );
  //console.log("pass data", route.params?.additionalData);
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      phoneNumber: formatedData?.phoneNumber || "",
      optOut: formatedData?.optOut || false,
      outageOptOut: formatedData?.outageOptOut || false,
      billingOptOutStatus: formatedData?.billingOptOutStatus || false,
      accountNumber: "",
    },
  });
  const translateY = animatedValue;
  const handleCheckboxToggle = useCallback(() => {
    setToggleCheckBoxTerm(!toggleCheckBoxTerm);
    if (!toggleCheckBoxTerm) {
      setIsTermRequired(false);
    }
  }, [toggleCheckBoxTerm]);

  const handleTermsLinkPress = useCallback(
    (event) => {
      event.stopPropagation();
      navigation.navigate("ArticalWindowUtility", {
        url: "https://www.sparklight.com/legal/text-messaging-terms-and-conditions",
        name: "Terms & Conditions",
      });
    },
    [navigation]
  );

  useEffect(() => {
    if (formatedData?.phoneNumber) {
      setIsCheckboxVisible(false);
      setMessage(
        "Please enter the mobile phone number you would like to receive all future customer communications. You may opt out at any time."
      );
      setMessage1(
        "You are subscribed to text message alerts. Reply STOP to cancel at any time. Call 1-800-123-0456 for support. Message and data rates may apply."
      );
    } else {
      setIsCheckboxVisible(true);
    }
  }, []);

  useEffect(() => {
    if (route.params?.updateFailed) {
      setErrorText("Something went wrong. Please try again.");
      setShowErrorAlert(true);
      scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
      navigation.setParams({ updateFailed: undefined });
    }
  }, [route.params?.updateFailed, navigation, dispatch]);

  const handleValidationError = () => {
    scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
    setErrorText("Please enter valid information to continue.");
    //setShowErrorAlert(true);
  };


  const handleToggleChange = (e) => {
    const { name, value } = e.target;
    formatedData[name] = value;
    console.log("toggle data", JSON.stringify(formatedData));
    // setInitializeSettings((initialize) => {
    //   const updatedSettings = {
    //     ...initialize,
    //     [name]: !value,
    //   };
    //   return updatedSettings;
    // });
  };

  useEffect(() => {
    if (route.params?.updateSuccess) {
      setNotification({
        message: route.params.successMessage,
        type: "success",
      });
    } else if (route.params?.updateFailed) {
      setNotification({ message: route.params.failureMessage, type: "error" });
    }
  }, [route.params]);

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
      if (notification && notification.type !== "error") {
        timeoutRef.current = setTimeout(() => {
          Animated.timing(animatedValue, {
            toValue: -100,
            duration: 500,
            useNativeDriver: true,
          }).start(() => setNotification(null));
        }, 3000);
      }
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

  const onSubmit = () => {
    Keyboard.dismiss();
    if (isCheckboxVisible) {
      if (!toggleCheckBoxTerm) {
        setIsTermRequired(true);
        return;
      }
      if (formatedData.billingOptOutStatus || formatedData.outageOptOut || formatedData.optOut) {
        //dispatch(updateTextNotification(formatedData, navigation));
        postRequestTextNotification();
      } else {
        setErrorText(
          "Please select the type of messages you would like to receive."
        );
        setShowErrorAlert(true);
        scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
      }
    } else {
      //dispatch(updateTextNotification(data, navigation));
      postRequestTextNotification();
    }
    //console.log('data',data)
    //dispatch(updateTextNotification(data, navigation));
  };

  const postRequestTextNotification = async () => {
    let user = await getUser();
    const accountNumber = user.userInfo?.accountNumber || null;
    formatedData["accountNumber"] = accountNumber;
    const postData = {
      accountNumber: accountNumber,
      phoneNumber: formatedData.phoneNumber,
      optOut: !formatedData.optOut,
      outageOptOut: !formatedData.outageOptOut,
      billingOptOutStatus: !formatedData.billingOptOutStatus,
    };

    console.log("postTextNotifications", postData);
    setIsLoading(true);
    PostApiRequest(
      `/api/SMS`,
      postData,
      (res) => {
        console.log(
          "Response postRequestTextNotification",
          JSON.stringify(res)
        );
        if (res) {
          setIsLoading(false);
          setNotification({
            message: "Text Notifications updated successfully.",
            type: "success",
          });
          //navigation.navigate("Notifications", { updateSuccess: true, successMessage: "In-App Notifications updated successfully." });
        }
      },
      (error) => {
        setIsLoading(false);
        console.error("Error on retrying postRequestTextNotification", error);
        setNotification({
          message: "Text Notifications update failed.",
          type: "error",
        });
        //setShowErrorAlert(true);
        //navigation.navigate("Notifications", { updateFailed: true, failureMessage: "In-App Notifications update failed." });
      }
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: Color.colorWhitesmoke_200 }}>
      <ProfileSettingsHeader
        title={
          formatedData?.phoneNumber
            ? "Edit Text Notifications"
            : "Add Text Notifications"
        }
        onPressBack={() => navigation.navigate("Notifications")}
      />
      {isLoading && (
        <LoadingOverlay
          loading={isLoading}
          loadingTxt="Saving"
          accessibilityLiveRegion="polite"
        />
      )}
      <ScrollView ref={scrollViewRef} keyboardShouldPersistTaps="always">
        <View style={styles.textNotificationsInner}>
          <View style={[styles.navigationBorder]}>
            {notification && (
              <Animated.View
                style={{
                  transform: [{ translateY }],
                  paddingHorizontal: Padding.p_5xl,
                }}
                accessible={true}
              >
                <View style={styles.spaceBottom}>
                  <NotificationAlert
                    type={notification.type}
                    title={notification.type === "error" ? "Error" : "Success"}
                    message={notification.message}
                    showCloseIcon={false}
                    onClose={() => setNotification(null)}
                    accessibilityLiveRegion="assertive"
                    accessibilityRole="alert"
                    accessibilityLabel={notification.message}
                  />
                </View>
              </Animated.View>
            )}

            <View style={styles.frameGroup}>
              <View style={{ width: "100%" }}>
                <NotificationAlert
                  type="error"
                  title="Error"
                  message={
                    errorText ? errorText : "Notifications updated failed."
                  }
                  showCloseIcon={true}
                  isVisible={showErrorAlert}
                  onClose={() => setShowErrorAlert(false)}
                />
              </View>
              <View style={{ width: "100%" }}>
                <NotificationAlert
                  type="warning"
                  title={""}
                  message={message1}
                  showCloseIcon={false}
                  isVisible={true}
                  accessibilityLabel={
                    formatedData?.phoneNumber
                      ? "You are subscribed to text message alerts. Reply STOP to cancel at any time. Call 1-800-123-0456 for support. Message and data rates may apply."
                      : "You are subscribing to text message alerts. Reply STOP to cancel at any time. Call 1-800-123-0456 for support. Message and data rates may apply."
                  }
                  accessibilityLiveRegion="polite"
                  accessibilityRole="alert"
                  customStyle={styles.warningAlert}
                />
              </View>
            </View>

            <View style={{ marginHorizontal: 20 }}>
              {/* <Text style={[styles.mobilePhoneTypo]}>
                Edit Mobile Phone Number
                </Text> */}
              <Text style={[styles.mobilePhoneTypo]}>{message}</Text>
            </View>

            <View style={styles.frameGroup}>
              <View style={[styles.frameParent3,{width:widthPercentageToDP('82%')}]}>
                {/* <Text style={styles.mobilePhoneTypo}>Mobile Phone</Text> */}
                <View
                  style={{
                    paddingVertical: 4,
                  }}
                >
                  <Controller
                    control={control}
                    name="phoneNumber"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <SparkLightInput
                        placeholder="Mobile Number"
                        label={"Mobile Number"}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        keyboardType="number-pad"
                        value={value}
                        error={errors.phoneNumber?.message}
                        maxLength={11}
                      />
                    )}
                  />
                </View>
              </View>
            </View>
            <View style={styles.frameChild} />
            <NotificationSetting
                title="Appointments"
                name="optOut"
                value={formatedData.optOut}
                description="Receive text notifications when your appointments have updates."
                onChange={handleToggleChange}
              />
              <NotificationSetting
                title="Outage Alerts"
                name="outageOptOut"
                value={formatedData.outageOptOut}
                description="Receive text notifications when outage occur."
                onChange={handleToggleChange}
              />
              <NotificationSetting
                title="Billing"
                name="billingOptOutStatus"
                value={formatedData.billingOptOutStatus}
                description="Receive text notifications for billing."
                onChange={handleToggleChange}
              />

            <View style={styles.frameChild} />
            {isCheckboxVisible && (
              <View
                style={{
                  paddingVertical: 16,
                  marginHorizontal: 20,
                  alignContent: "flex-start",
                  alignItems: "flex-start",
                }}
              >
                <View style={styles.checkBoxArea}>
                  <TouchableOpacity
                    style={styles.checkboxTouchable}
                    onPress={handleCheckboxToggle}
                    accessibilityRole="checkbox"
                    accessibilityLabel="I agree to Text Messaging Terms and Conditions"
                    accessibilityState={{ checked: toggleCheckBoxTerm }}
                  >
                    <View style={styles.checkboxContainer}>
                      <CheckBox
                        disabled={true}
                        value={toggleCheckBoxTerm}
                        style={styles.checkBox}
                        boxType="square"
                        tintColor={
                          isTermRequired ? "#EF4E3E" : Color.colorWhitesmoke_300
                        }
                        tintColors={{
                          true: "#1B99FF",
                          false: isTermRequired? "#EF4E3E": "#D0D5DD",
                        }}
                        accessible={false}
                      />
                      <Text
                        style={[styles.checkBoxAreaViewText, { marginLeft: 4 }]}
                        allowFontScaling={true}
                        maxFontSizeMultiplier={1}
                      >
                        I agree to{" "}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleTermsLinkPress}
                    accessibilityRole="link"
                    accessibilityLabel="View Text Messaging Terms and Conditions"
                    accessibilityHint="Opens Text Messaging Terms and Conditions in a new window"
                  >
                    <Text
                      style={[
                        styles.checkBoxAreaViewText,
                        {
                          color: Color.sparklightBrightPurple,
                          textDecorationLine: "underline",
                        },
                      ]}
                      allowFontScaling={true}
                      maxFontSizeMultiplier={1}
                    >
                      Text Messaging Terms & Conditions
                    </Text>
                  </TouchableOpacity>
                </View>
                {isTermRequired && (
                  <View style={{ paddingTop: 8 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        alignItems: "center",
                      }}
                    >
                      <AlertIcon />
                      <Text style={styles.ErrorToggle}>
                        Please agree to the Terms & Conditions to proceed.
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            )}
          </View>
          <View style={[{ alignSelf: "stretch" }]}>
            <Pressable
              accessible={true}
              accessibilityLabel="Save"
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.buttons,
                styles.buttonsLayout,
                { opacity: pressed ? 0.7 : 1 },
              ]}
              onPress={handleSubmit(onSubmit, handleValidationError)}
            >
              <Text style={[styles.makePayment, styles.makeTypo]}>Save</Text>
            </Pressable>
            <View style={{ padding: 8 }}></View>
            <Pressable
              accessible={true}
              accessibilityLabel="Cancel"
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.buttonsLayout,
                { opacity: pressed ? 0.7 : 1 },
              ]}
              onPress={() => navigation.navigate("Notifications")}
            >
              <Text style={[styles.accountClr, styles.makeTypo]}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};


const NotificationSetting = ({ name, value, title, description, onChange }) => (
  <View style={[styles.frameContainer, styles.frameBorder]}>
    <View style={styles.frameView}>
      <View style={styles.appointmentsParent}>
        <View style={{ flexDirection: "column", flex: 1.7, marginRight: 10 }}>
          <Text style={styles.appointments}>{title}</Text>
          <Text
            style={[
              styles.receiveAppNotifications1,
              styles.receiveTypo,
              { marginTop: 8 },
            ]}
          >
            {description}
          </Text>
        </View>

        <View style={{ flex: 0.2 }}>
          <Toggle
            name={name}
            initialValue={value}
            section="textNotif"
            label={title}
            onToggle={onChange}
          />
        </View>
      </View>
    </View>
  </View>
);


const styles = StyleSheet.create({
  navigationBorder: {
    borderColor: Color.sparklightWhite,
    justifyContent: "center",
    borderStyle: "solid",
    backgroundColor: Color.sparklightWhite,
  },
  containerTypo: {
    textAlign: "left",
    fontFamily: FontFamily.openSansRegular,
  },
  mobilePhoneTypo: {
    color: Color.colorblack_100,
    fontSize: FontSize.size_base,
    lineHeight: 22,
    fontWeight: "400",
    textAlign: "left",
    fontFamily: FontFamily.openSansRegular,
  },
  buttonsLayout: {
    width: "100%",
    paddingVertical: Padding.p_base,
    paddingHorizontal: 0,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Border.br_11xs,
    height: 56,
  },
  ErrorToggle: {
    color: Color.sparkLightRed,
    fontFamily: FontFamily.openSansSemiBold,
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 4,
  },
  makeTypo: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.openSansRegular,
  },
  accountClr: {
    color: Color.colorMidnightblue,
    textAlign: "center",
  },
  infoCircleIcon: {
    width: 16,
    height: 16,
    overflow: "hidden",
  },
  infoCircleWrapper: {
    paddingVertical: Padding.p_5xs,
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
  frameView: {
    borderRadius: 8,
    backgroundColor: Color.colorWhitesmoke_100,
    paddingHorizontal: Padding.p_base,
    paddingVertical: 6,
    flexDirection: "row",
  },
  warningAlert: {
    borderLeftWidth: 4,
    borderLeftColor: "#FF9800",
    marginBottom: 0,
    borderRadius: 0,
  },
  frameChild: {
    height: 1,
    backgroundColor: Color.sparklightGray,
    alignSelf: "stretch",
  },
  text: {
    fontSize: FontSize.size_base,
    lineHeight: 22,
    textAlign: "left",
    color: Color.colorGray_200,
    fontFamily: FontFamily.openSansRegular,
  },
  frameParent3: {
    justifyContent: "center",
    flex: 1,
  },
  frameParent4: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "stretch",
  },
  frameWrapper2: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },
  receiveTextNotifications1: {
    color: Color.sparklightDarkGray,
    lineHeight: 22,
    fontWeight: "400",
    fontFamily: FontFamily.openSansRegular,
    textAlign: "left",
    alignSelf: "stretch",
    fontSize: FontSize.size_sm,
  },
  byOptingInContainer: {
    fontSize: FontSize.textXsSemibold_size,
    color: Color.sparklightDarkGray,
    fontFamily: FontFamily.openSansRegular,
    textAlign: "left",
    alignSelf: "stretch",
  },
  frameWrapper10: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Color.sparklightWhite,
    alignSelf: "stretch",
  },
  spaceBottom: {
    marginTop: 16,
    width: widthPercentageToDP("85%"),
  },
  frameGroup: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
    paddingVertical: Padding.p_base,
    paddingHorizontal: Padding.p_base,
  },
  makePayment: {
    textAlign: "center",
    color: Color.sparklightWhite,
  },
  buttons: {
    marginTop: 16,
    backgroundColor: Color.colorMidnightblue,
  },
  textNotificationsInner: {
    paddingTop: Padding.p_5xl,
    flex: 1,
    paddingHorizontal: Padding.p_base,
    marginBottom: 200,
  },
  checkBox: {
    width: 12,
    height: 12,
    marginRight: Platform.OS === "ios" ? 2 : 16,
    
  },
  checkBoxArea: {
    flexDirection: "row",
  },
  checkboxTouchable: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 0,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkBoxAreaViewText: {
    fontSize: 14,
    fontFamily: FontFamily.openSansRegular,
    color: Color.colorGray_200,
  },makeTypo: {
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
  },frameBorder: {
    borderColor: Color.sparklightGray,
    backgroundColor: Color.sparklightWhite,
    alignItems: "center",
    borderStyle: "solid",
  },
});

export default TextNotifications;
