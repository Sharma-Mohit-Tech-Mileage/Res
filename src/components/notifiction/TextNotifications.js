import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Animated,
  StyleSheet,
  View,
  Keyboard,
  AccessibilityInfo,
  findNodeHandle,
} from "react-native";
import KeyboardAwareScrollView from "../common/customui/KeyboardAwareScrollView";
import { ScreenScroll } from "../common/customui/Screen";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRoute } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import SparkLightInput from "../common/customui/SparkLightInput";
import ProfileSettingsHeader from "../common/ProfileSettingsHeader";
import NotificationAlert from "../common/customui/NotificationAlert";
import { getUser } from "../../redux/utils/LocalStorage";
import LoadingOverlay from "../common/customui/LoadingOverlay";
import { PostApiRequest } from "../../network/RestApiClient";
import { getEndpoint, ENDPOINTS } from "../../network/apis/endpoints/Endpoints";
import useAccessibilityFocus from "../../../src/hooks/useAccessibilityFocus";
import AppStyles from "../../styles/AppStyles";

import SecondaryButton from "../common/customui/PrimaryButton";

import {
  Color,
  FontFamily,
  FontSize,
  Padding,
  Border,
} from "../../styles/GlobalStyles";

import Toggle from "../common/Toggle";
import Alerttriangle from "../../res/svgIcons/AlertIcon";

import {
  SectionTitle,
  SectionContent,
  HintText,
} from "../common/customui/Typography";
import { logWarn } from "../../utils/logger";
import { useTextConsent, TextConsentCheckbox, TextConsentLinks, LINKS_ROW_GAP } from "../common/TextConsent";
import { normalizePhoneDigits, TEXT_DISCLAIMER_SUBSCRIBED, TEXT_DISCLAIMER_SUBSCRIBING } from "../../utils/textConsent";

// Define your validation schema
const validationSchema = yup.object().shape({
  phoneNumber: yup
    .string()
    .matches(
      /^(?:1)?\s*(?:\([2-9]\d{2}\)\s*|[2-9]\d{2}[- ]?)?[2-9]\d{2}[- ]?\d{4}(?:\s*(?:ext|x)\s*\d{2,6})?$/,
      "Invalid mobile phone number.",
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
  const [savedNumber, setSavedNumber] = useState(formatedData?.phoneNumber || "");
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
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
  const isAdding = !normalizePhoneDigits(savedNumber);
  const consent = useTextConsent({ savedNumber, currentNumber: watch("phoneNumber") });
  const disclaimer = isAdding ? TEXT_DISCLAIMER_SUBSCRIBING : TEXT_DISCLAIMER_SUBSCRIBED;
  const message = isAdding
    ? "Please enter your mobile phone number below and then select the type of message you would like to receive."
    : "Please enter the mobile phone number you would like to receive all future customer communications. You may opt out at any time.";

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
          AccessibilityInfo.announceForAccessibility(
            "Text Notifications update failed.",
          );
        } catch (e) {
          logWarn("Accessibility focus error:", e);
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
          logWarn("Accessibility focus error:", e);
        }
      }, 600);

      const t2 = setTimeout(() => {
        try {
          if (successIconRef.current) {
            const handle = findNodeHandle(successIconRef.current);
            if (handle) AccessibilityInfo.setAccessibilityFocus(handle);
          }
        } catch (e) {
          logWarn("Accessibility focus retry error:", e);
        }
      }, 1200);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [showSuccessAlert, screenReaderEnabled]);

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
    consent.validate({ focus: false });
    if (formErrors?.phoneNumber) {
      setTimeout(() => {
        phoneInputRef.current?.focus();
      }, 400);
    }
  };

  const handleToggleChange = (e) => {
    const { name, value } = e.target;
    formatedData[name] = value;
    if(value) {
       setShowErrorAlert(false);

    }
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
    ``;
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
    const hasMessageType = formatedData.billingOptOutStatus || formatedData.outageOptOut || formatedData.optOut;
    if (isAdding && !hasMessageType) {
      consent.validate({ focus: false });
      setErrorText("Please select the type of messages you would like to receive.");
      setShowErrorAlert(true);
      scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
      return;
    }
    if (!consent.validate()) return;
    setShowErrorAlert(false);
    postRequestTextNotification();
  };

  const postRequestTextNotification = async () => {
    setIsSubmitting(true);
    let user = await getUser();
    const accountNumber = user.userInfo?.accountNumber || null;
    formatedData["accountNumber"] = accountNumber;
    const postData = {
      accountNumber: accountNumber,
      phoneNumber: normalizePhoneDigits(formatedData.phoneNumber),
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
          setSavedNumber(postData.phoneNumber);
          setIsLoading(false);
          setIsSubmitting(false);
          setShowSuccessAlert(true);
          setNotification({
            message:
              "Your text notification preferences have been updated successfully.",
            type: "success",
          });
        }
      },
      (error) => {
        setIsLoading(false);
        setIsSubmitting(false);
        logWarn("Error on retrying postRequestTextNotification", error);
        setNotification({
          message: "Text Notifications update failed.",
          type: "error",
        });
        setShowErrorAlert(true);
      },
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: Color.Gray300 }}>
      <ProfileSettingsHeader
        title={isAdding ? "Add Text Notifications" : "Edit Text Notifications"}
        onPressBack={() => navigation.goBack()}
      />
      {isLoading && (
        <LoadingOverlay
          loading={isLoading}
          loadingTxt="Saving"
          accessibilityLiveRegion="polite"
        />
      )}
      <ScreenScroll framed ScrollComponent={KeyboardAwareScrollView} ref={scrollViewRef} keyboardShouldPersistTaps="always">
        <View style={styles.textNotificationsInner}>
          <View style={[AppStyles.card, { paddingBottom: 16 }]}>
            {notification && (
              <Animated.View
                style={{
                  transform: [{ translateY }],
                  paddingHorizontal: Padding.p_xs,
                }}
                accessible={false}
                importantForAccessibility="no"
              >
                <View
                  style={styles.spaceBottom}
                  ref={notification.type === "error" ? errorRef : successRef}
                >
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
                    iconRef={
                      notification.type === "success" ? successIconRef : null
                    }
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
                  message={disclaimer}
                  showCloseIcon={false}
                  isVisible={true}
                  iconComponent={Alerttriangle}
                  iconColor={Color.sparkLightInfo}
                  customStyle={styles.warningAlert}
                  containerStyle={styles.disclaimerBanner}
                  contentStyle={styles.disclaimerContent}
                  iconStyle={styles.disclaimerIcon}
                >
                  <TextConsentLinks navigation={navigation} />
                </NotificationAlert>
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

            <View style={styles.section}>
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
                    keyboardType="number-pad"
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
            <View style={styles.frameChild} />
            <NotificationSetting
              title="Outage Alerts"
              name="outageOptOut"
              value={formatedData.outageOptOut}
              description="Receive text notifications when outages occur."
              onChange={handleToggleChange}
            />
            <View style={styles.frameChild} />
            <NotificationSetting
              title="Billing"
              name="billingOptOutStatus"
              value={formatedData.billingOptOutStatus}
              description="Receive text notifications for billing."
              compactBottom={true}
              onChange={handleToggleChange}
            />

            {consent.required && (
              <TextConsentCheckbox consent={consent} navigation={navigation} style={styles.consent} />
            )}
          </View>
          <View style={styles.buttonContainer}>
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
      </ScreenScroll>
    </View>
  );
};

const NotificationSetting = ({
  name,
  value,
  title,
  description,
  onChange,
  compactBottom = false,
}) => (
  <View style={[styles.frameContainer]}>
    <View
      style={[styles.frameView, compactBottom && styles.frameViewCompactBottom]}
    >
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
            style={[
              styles.descriptionText,
              compactBottom && styles.descriptionTextCompactBottom,
            ]}
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
    fontFamily: FontFamily.RadioCanadaRegular,
  },
  mobilePhoneTypo: {
    color: Color.colorblack_100,
    fontSize: FontSize.size_base,
    lineHeight: 22,
    fontWeight: "400",
    textAlign: "left",
    fontFamily: FontFamily.RadioCanadaRegular,
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
    fontFamily: FontFamily.RadioCanadaSemiBold,
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 4,
  },
  makeTypo: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.RadioCanadaRegular,
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
    fontFamily: FontFamily.RadioCanadaRegular,
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
  // The checkbox's 48dp target insets the box by 16, so this lines the box up with the toggle titles.
  consent: { marginTop: Padding.p_9xs, marginLeft: 8, marginRight: 20 },
  // Links row target leaves LINKS_ROW_GAP under its text; match it on top (less the first block's 4) so gaps are even and the icon centres.
  disclaimerBanner: { paddingVertical: 20 - LINKS_ROW_GAP },
  disclaimerContent: { paddingTop: LINKS_ROW_GAP - 4 },
  disclaimerIcon: { marginTop: 0 },
  warningAlert: {
    borderLeftWidth: 4,
    borderLeftColor: Color.warningAccent,
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
    fontFamily: FontFamily.RadioCanadaRegular,
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
    color: Color.sparklightGray1,
    lineHeight: 22,
    fontWeight: "400",
    fontFamily: FontFamily.RadioCanadaRegular,
    textAlign: "left",
    alignSelf: "stretch",
    fontSize: FontSize.size_sm,
  },
  byOptingInContainer: {
    fontSize: FontSize.RadioCanadaSemiBold_size,
    color: Color.sparklightGray1,
    fontFamily: FontFamily.RadioCanadaRegular,
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
    flex: 1,

    overflow: "hidden",
  },
  makeTypo: {
    width: 282,
    fontFamily: FontFamily.RadioCanadaRegular,
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
  frameViewCompactBottom: {
    paddingBottom: 0,
  },
  frameContainer: {
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
  section: {
    paddingHorizontal: Padding.p_5xl,
    paddingVertical: Padding.p_5xl,
  },
  descriptionTextCompactBottom: {
    marginBottom: 0,
  },
  receiveAppNotifications1: {
    lineHeight: 22,
  },
  frameBorder: {
    borderColor: Color.sparklightGray,
    backgroundColor: Color.sparklightWhite,
    alignItems: "center",
    borderStyle: "solid",
  },
});

export default TextNotifications;
