import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  View,
  Keyboard,
  ScrollView,
  Platform,
  AccessibilityInfo,
  findNodeHandle,
} from "react-native";
import Touchable from "../common/customui/Touchable";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import CheckBox from "@react-native-community/checkbox";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRoute } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import SparkLightInput from "../common/customui/SparkLightInput";
import ProfileSettingsHeader from "../common/ProfileSettingsHeader";
import NotificationAlert from "../common/customui/NotificationAlert";
import { getUser } from "../../redux/utils/LocalStorage";
import LoadingOverlay from "../common/customui/LoadingOverlay";
import { PostApiRequest } from "../../network/RestApiClient";
import { getEndpoint,ENDPOINTS } from "../../network/apis/endpoints/Endpoints";
import useAccessibilityFocus from "../../../src/hooks/useAccessibilityFocus";
import { A11Y } from "../../styles/theme";
import AppStyles from "../../styles/AppStyles";

import SecondaryButton from "../common/customui/PrimaryButton";

import {
  Color,
  FontFamily,
  FontSize,
  Padding,
  Border,
} from "../../../GlobalStyles";

import Toggle from "../common/Toggle";
import AlertIcon from "../../../assets/svgs/Alerttriangle";
import { widthPercentageToDP } from "react-native-responsive-screen";

import {SectionTitle,SectionContent,HintText,Hyperlink} from "../common/customui/Typography";

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
  const phoneInputRef = useRef(null);
  const route = useRoute();
  const dispatch = useDispatch();
  const animatedValue = useRef(new Animated.Value(-100)).current;
  const timeoutRef = useRef(null);
  const [notification, setNotification] = useState(null);
  const successIconRef = useRef(null);
   const [isSubmitting, setIsSubmitting] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
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


  const [screenReaderEnabled, setScreenReaderEnabled] = useState(false);

  const [errorRef, setErrorFocus] = useAccessibilityFocus();
  const [successRef, setSuccessFocus] = useAccessibilityFocus();
  useEffect(() => {
    AccessibilityInfo.isScreenReaderEnabled().then(setScreenReaderEnabled);
  }, []);

  // Announce error message if screen reader is enabled
  useEffect(() => {
    if (showErrorAlert && screenReaderEnabled) {
     

      // After the animation, set focus on the alert and re-announce for reliability (especially on Android)
      const t = setTimeout(() => {
        try {
          setErrorFocus();
          AccessibilityInfo.announceForAccessibility('Text Notifications update failed.');
        } catch (e) {
          console.warn("Accessibility focus error:", e);
        }
      }, 600);

      return () => clearTimeout(t);
    }
  }, [showErrorAlert, screenReaderEnabled, setErrorFocus]);


  // Announce error message if screen reader is enabled
  useEffect(() => {
    if (showSuccessAlert && screenReaderEnabled) {
      const t1 = setTimeout(() => {
        try {
          if (successIconRef.current) {
            const handle = findNodeHandle(successIconRef.current);
            if (handle) AccessibilityInfo.setAccessibilityFocus(handle);
          } else {
            setSuccessFocus();
          }
        } catch (e) {
          console.warn("Accessibility focus error:", e);
        }
      }, 600);

      const t2 = setTimeout(() => {
        try {
          if (successIconRef.current) {
            const handle = findNodeHandle(successIconRef.current);
            if (handle) AccessibilityInfo.setAccessibilityFocus(handle);
          }
        } catch (e) {
          console.warn("Accessibility focus retry error:", e);
        }
      }, 1200);

      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [showSuccessAlert, screenReaderEnabled]);


  const handleTermsLinkPress = useCallback(
    (event) => {
      event.stopPropagation();
      navigation.navigate("ArticleWindowUtility", {
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

  const handleValidationError = (formErrors) => {
    scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
    setErrorText("Please enter valid information to continue.");
    if (formErrors?.phoneNumber) {
      setTimeout(() => {
        phoneInputRef.current?.focus();
      }, 400);
    }
  };


  const handleToggleChange = (e) => {
    const { name, value } = e.target;
    formatedData[name] = value;
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

  const animateNotification = useCallback(() => {``
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

  const onSubmit = () => {
    formatedData["phoneNumber"] = getValues("phoneNumber");
    Keyboard.dismiss();
    if (isCheckboxVisible) {
      if (!toggleCheckBoxTerm) {
        setIsTermRequired(true);
        return;
      }
      if (formatedData.billingOptOutStatus || formatedData.outageOptOut || formatedData.optOut) {
        postRequestTextNotification();
      } else {
        setErrorText(
          "Please select the type of messages you would like to receive."
        );
        setShowErrorAlert(true);
        scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
      }
    } else {
      postRequestTextNotification();
    }
  };

  const postRequestTextNotification = async () => {
    setIsSubmitting(true);
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

    setIsLoading(true);
    const endpointUrl = getEndpoint(ENDPOINTS.UPDATE_TEXT_NOTIFICATION);
    PostApiRequest(
      endpointUrl,
      postData,
      (res) => {
        if (res) {
          setIsLoading(false);
          setIsSubmitting(false);
          setShowSuccessAlert(true);
          setNotification({
            message: "Your text notification preferences have been updated successfully.",
            type: "success",
          });
        }
      },
      (error) => {
        setIsLoading(false);
        setIsSubmitting(false);
        console.warn("Error on retrying postRequestTextNotification", error);
        setNotification({
          message: "Text Notifications update failed.",
          type: "error",
        });
        setShowErrorAlert(true);
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
        onPressBack={() => navigation.goBack()}
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
           <View style={[AppStyles.card]}>
            {notification && (
              <Animated.View
                style={{
                  transform: [{ translateY }],
                  paddingHorizontal: Padding.p_5xl,
                }}
                accessible={false}
                importantForAccessibility="no"
              >
                <View style={styles.spaceBottom} ref={notification.type === "error" ? errorRef : successRef}>
                  <NotificationAlert
                    type={notification.type}
                    title={notification.type === "error" ? "Error" : "Success"}
                    
                    message={notification.message}
                    showCloseIcon={true}
                    onClose={() => setNotification(null)}
                    autoFocusTitle={false}
                    accessibilityLiveRegion="assertive"
                    accessibilityRole="alert"
                    accessibilityLabel={notification.message}
                    iconRef={notification.type === "success" ? successIconRef : null}
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
                  autoFocusTitle={true}
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
              <SectionContent
                accessibilityRole="text"
                accessible={true}
                accessibilityLabel={message}
              >
                {message}
              </SectionContent>
              <HintText
                style={styles.requiredFieldsText}
                accessibilityRole="text"
                accessible={true}
                accessibilityLabel="Fields marked with an asterisk are required"
              >
                Fields marked with * are required.
              </HintText>
            </View>

            <View style={{ marginHorizontal: 20, paddingVertical: Padding.p_base }}>
              <Controller
                control={control}
                name="phoneNumber"
                render={({ field: { onChange, onBlur, value } }) => (
                  <SparkLightInput
                    ref={phoneInputRef}
                    placeholder="Mobile Number"
                    label={"Mobile Number *"}
                    required={true}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    keyboardType="phone-pad"
                    value={value}
                    error={errors.phoneNumber?.message}
                    maxLength={16}
                    isVisible={false}
                    autoFocusTitle={true}
                  />
                )}
              />
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
                  marginHorizontal: Platform.OS==='android'? 10: 20,
                  alignContent: "flex-start",
                  alignItems: "flex-start",
                }}
              >
                <View style={styles.checkBoxArea}>
                  <Touchable
                    minSize={0}
                    style={[styles.checkboxTouchable, { justifyContent: 'flex-start' }]}
                    onPress={handleCheckboxToggle}
                    accessibilityRole="checkbox"
                    accessibilityLabel="I agree to Text Messaging Terms and Conditions"
                    accessibilityState={{ checked: toggleCheckBoxTerm }}
                  >
                    <View style={styles.checkboxContainer}>
                      <View
                        pointerEvents="none"
                        importantForAccessibility="no-hide-descendants"
                      >
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
                          importantForAccessibility="no"
                        />
                      </View>
                      <Text
                        style={[styles.checkBoxAreaViewText, { marginLeft: 4 }]}
                        allowFontScaling={true}
                        maxFontSizeMultiplier={1}
                      >
                        I agree to{" "}
                      </Text>
                    </View>
                  </Touchable>
                  <Touchable
                    minSize={0}
                    onPress={handleTermsLinkPress}
                    accessibilityRole="link"
                    accessibilityLabel="View Text Messaging Terms and Conditions"
                    accessibilityHint="Opens Text Messaging Terms and Conditions in a new window"
                    hitSlop={A11Y.hitSlop}
                    style={styles.termsLinkTouchable}
                  >
                    <Hyperlink
                      allowFontScaling={true}
                      maxFontSizeMultiplier={1}
                    >
                      Text Messaging Terms & Conditions
                    </Hyperlink>
                  </Touchable>
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
         <View
            style={styles.buttonContainer}
            
          >
            <SecondaryButton
              title="Save"
              onPress={handleSubmit(onSubmit, handleValidationError)}
              accessibilityLabel="Save settings"
              accessibilityHint="Double tap to save your notification preferences"
              style={styles.saveButton}
              buttonType={"submit"}
              disabled={isSubmitting}
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
  <View style={[styles.frameContainer, styles.frameBorder]}>
    <View style={styles.frameView}>
      <View style={styles.rowContent}>
        <View style={styles.textWrap}>
          <View style={styles.titleRow}>
            <SectionTitle
              style={styles.appointments}
              accessible={true}
              accessibilityRole="text"
              accessibilityLabel={`${title} for text notifications ${description}`}
            >
              {title}
            </SectionTitle>
            <Toggle
              name={name}
              initialValue={value}
              section="textNotif"
              label={title}
              description={description}
              onToggle={onChange}
            />
          </View>
          <SectionContent
            style={[ styles.descriptionText]}
            accessible={false}
            importantForAccessibility="no"
          >
            {description}
          </SectionContent>
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
  requiredFieldsText: {
    marginTop: Padding.p_base,
    textAlign: "left",
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
  buttonContainer: {
    padding: Padding.p_base,
    gap: 12,
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
    borderRadius: Border.br_5xs,
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
    alignItems: "center",
    flexWrap: "wrap",
  },
  checkboxTouchable: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 0,
    minHeight: A11Y.minTouch,
    paddingVertical: Padding.p_5xs,
  },
  termsLinkTouchable: {
    minHeight: A11Y.minTouch,
    justifyContent: "center",
    paddingVertical: Padding.p_5xs,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkBoxAreaViewText: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.openSansRegular,
    color: Color.colorGray_200,
  },makeTypo: {
    width: 282,
    fontFamily: FontFamily.openSansRegular,
    fontSize: FontSize.size_base,
    textAlign: "center",
  },
  appointments: {
    textAlign: "left",
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
    paddingVertical: 0,
    paddingBottom: 12,
    flexDirection: "row",
    paddingHorizontal: Padding.p_5xl,
    width: "100%",
  },
  frameContainer: {
    borderBottomWidth: 1,
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
  receiveAppNotifications1: {
    lineHeight: 22,
  },frameBorder: {
    borderColor: Color.sparklightGray,
    backgroundColor: Color.sparklightWhite,
    alignItems: "center",
    borderStyle: "solid",
  },
});

export default TextNotifications;
