import React, { useState, useEffect, useRef, useCallback } from "react";
import { StyleSheet, Text, View, ScrollView, Animated, Platform, AccessibilityInfo, findNodeHandle} from "react-native";
import Touchable from "../common/customui/Touchable";
import { Color, Padding, FontSize, FontFamily } from "../../../GlobalStyles";
import { A11Y } from "../../styles/theme";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import SparklightCheckBox from "../common/customui/SparklightCheckBox";
import { useNavigation, useRoute } from "@react-navigation/native";
import Toggle from "../common/Toggle";
import SparkLightInput from "../common/customui/SparkLightInput";
import { useDispatch, useSelector } from "react-redux";
import ProfileSettingsHeader from "../common/ProfileSettingsHeader";
import NotificationAlert from "../common/customui/NotificationAlert";
import SecondaryButton from "../common/customui/PrimaryButton";
import LoadingOverlay from "../common/customui/LoadingOverlay";
import { updatePrimaryAndPaperlessRequest } from "../../redux/actions/NotificationActionSuite";
import { fetchACPUserAccountDetails } from "../../redux/actions/ProfileActionSuite";
import { getPrimaryEmail } from "../utility/constant";
import AlertIcon from "../../res/svgIcons/AlertIcon";
import SuccessIcon from "../../../assets/svgs/SuccessIcon";
import { A11y } from "react-native-a11y-order";
import useAccessibilityFocus from "../../../src/hooks/useAccessibilityFocus";
import AppStyles from "../../styles/AppStyles";
import Alerttriangle from "../../res/svgIcons/AlertIcon";
import {
  HintText,
  IndicatorText,
  SectionTitle,
  SectionContent,
  Hyperlink
} from "../common/customui/Typography";

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .matches(emailRegex, "Invalid email address")
    .required("Email is required"),
});

const AddNotificationScreen = () => {
  const [toggleCheckBoxTerm, setToggleCheckBoxTerm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);
  const successIconRef = useRef(null);
  const [successRef, setSuccessFocus] = useAccessibilityFocus();
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [isTermRequired, setIsTermRequired] = useState(false);
  const [screenReaderEnabled, setScreenReaderEnabled] = useState(false);
  const user = useSelector((state) => state.user.userData);
  const [isCheckboxVisible, setIsCheckboxVisible] = useState(null);
  const scrollViewRef = useRef(null);
  const inputRef = useRef(null);
  const animatedValue = useRef(new Animated.Value(-100)).current;
  const timeoutRef = useRef(null);
  const route = useRoute();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [paperlessStatus, setPaperlessStatus] = useState(true);
  const accountDetails = useSelector(
    (state) => state.profile?.accountDetails
  );
  const paperlessStatusAcp = useSelector(
    (state) => state.profile?.paperlessStatusAcp
  );

  const [formState, setFormState] = useState({
    paperlessBilling: paperlessStatusAcp,
  });
  const primaryEmail = accountDetails ? getPrimaryEmail(accountDetails) : "";

 
  const [messageRef, setMessageFocus] = useAccessibilityFocus();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      email: primaryEmail || route.params?.additionalData?.email || "",
    },
  });

  const translateY = animatedValue;

  // Get the initial is_enrolled value from route params, but also check for primaryEmail
  const initialIsEnrolled = route.params?.is_enrolled;
  const [isEnrolled, setIsEnrolled] = useState(!!initialIsEnrolled);

  useEffect(() => {
    AccessibilityInfo.isScreenReaderEnabled().then(setScreenReaderEnabled);
  }, []);



  useEffect(() => {
    if (notification && screenReaderEnabled) {
      // Focus only (no announcements). iOS retries because header/back may steal focus during the animation.
      const delays = Platform.OS === "ios" ? [900, 1600] : [600, 1200];

      const timers = delays.map((ms) =>
        setTimeout(() => {
          try {
            if (notification.type === "success" && successIconRef.current) {
              const handle = findNodeHandle(successIconRef.current);
              if (handle) AccessibilityInfo.setAccessibilityFocus(handle);
              return;
            }

            setMessageFocus();
          } catch (e) {
            console.warn("Accessibility focus error:", e);
          }
        }, ms)
      );

      return () => {
        timers.forEach(clearTimeout);
      };
    }
  }, [notification, screenReaderEnabled]);

  useEffect(() => {
    setIsCheckboxVisible(!paperlessStatusAcp);
  }, [paperlessStatusAcp, isCheckboxVisible]);

  useEffect(() => {
    const updateAccountDetails = async () => {
      if (route.params?.updateSuccess) {
        try {
          await dispatch(fetchACPUserAccountDetails());
          setNotification({
            message: route.params.successMessage,
            type: "success",
          });
        } catch (error) {
          setNotification({
            message: "Error updating account details",
            type: "error",
          });
          setFocusEmail();
        } finally {
          setIsSubmitting(false);
          setToggleCheckBoxTerm(true);
        }
        
      } else if (route.params?.updateFailed) {
        setNotification({
          message: route.params.failureMessage,
          type: "error",
        });
        setIsSubmitting(false);
        setToggleCheckBoxTerm(false);
        setFocusEmail();
      }
      
    };
  
    updateAccountDetails();

    let emailToSet = primaryEmail || route.params?.additionalData?.email || "";
    //setValue("email", emailToSet);
    setIsEnrolled(!!emailToSet);
  }, [route.params, dispatch]);



  const setFocusEmail = () => {
    setTimeout(() => {  
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 400);
  };



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

  const handleToggleChange = useCallback((newValue) => {
    setFormState((prevState) => ({
      ...prevState,
      paperlessBilling: newValue.target.value,
    }));
    if (newValue.target.value === true) {
      setIsTermRequired(false);
    }
    setPaperlessStatus(newValue.target.value);
  }, []);

  const handleSave = useCallback(
    (data) => {
      const { email } = data;
      const { paperlessBilling } = formState;
      if (isCheckboxVisible && paperlessBilling && !toggleCheckBoxTerm) {
        setIsTermRequired(true);
        return;
      }
      setIsSubmitting(true);
      setPaperlessStatus(true);
      dispatch(
        updatePrimaryAndPaperlessRequest(
          {
            newEmail: email,
            oldEmail: primaryEmail,
            paperlessBilling,
            account: user.userInfo?.accountNumber,
          },
          navigation
        )
      );
    },
    [
      dispatch,
      formState,
      toggleCheckBoxTerm,
      primaryEmail,
      accountDetails,
      navigation,
      animateNotification,
      paperlessStatusAcp,
    ]
  );

  const handleValidationError = useCallback((formErrors) => {
    scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
    if (formErrors?.email) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 400);
    }
  }, []);

  const handleCheckboxToggle = useCallback(() => {
    setToggleCheckBoxTerm(!toggleCheckBoxTerm);
    setIsTermRequired(false);
  }, [toggleCheckBoxTerm]);

  const handleTermsLinkPress = useCallback(
    (event) => {
      event.stopPropagation();
      navigation.navigate("ArticleWindowUtility", {
        url: "https://www.sparklight.com/legal/paperless-terms-and-conditions",
        name: "Terms & Conditions",
      });
    },
    [navigation]
  );

  return (
    <View style={styles.container}>
      <ProfileSettingsHeader
        title={
          isEnrolled ? "Edit Email Notifications" : "Add Email Notifications"
        }
        onPressBack={() => navigation.goBack()}
        accessibilityLabel={
          isEnrolled ? "Edit Email Notifications" : "Add Email Notifications"
        }
      />
      {isSubmitting && (
        <LoadingOverlay
          loading={isSubmitting}
          loadingTxt="Saving"
          accessibilityLiveRegion="polite"
        />
      )}
      <ScrollView ref={scrollViewRef}>
      
        <View style={[AppStyles.card,{margin: Padding.p_base}]}>
          <View style={{ paddingVertical: 16 }}>
            {notification && (
              <Animated.View
                style={{
                  transform: [{ translateY }],
                  paddingHorizontal: Padding.p_xs,
                }}
                accessible={false}
                importantForAccessibility="no"
              >
                <View style={styles.spaceBottom} ref={messageRef} >
                  <NotificationAlert
                    type={notification.type}
                    title={notification.type === "error" ? "Error" : "Success"}
                    message={notification.message}
                    showCloseIcon={true}
                    onClose={() => setNotification(null)}
                    isVisible={true}
                    autoFocusTitle={false}
                    iconRef={successIconRef}
                  />
                </View>
              </Animated.View>
            )}
           {
            <View style={{ paddingHorizontal: Padding.p_xs }}>
              <NotificationAlert
                type="warning"
                title={!isEnrolled ? "Critical Notifications" : undefined}
                message={
                  !isEnrolled
                    ? "By providing your email address, you're signing up for critical notifications. We'll keep you informed without overwhelming your inbox."
                    : "By updating your email, you agree that this change will apply to all Sparklight email customer communications sent to you, including, but not limited to, account notifications, order updates, marketing emails, and service-related messages."
                }
                showCloseIcon={false}
                isVisible={true}
                iconComponent={Alerttriangle}
                iconColor="#F88700"
                accessibilityLabel="Important: By providing your email address, you're signing up for critical notifications"
                accessibilityLiveRegion="polite"
                accessibilityRole="alert"
                customStyle={styles.warningAlert}
              />
            </View>
            }
            <View
              style={[styles.section, { paddingHorizontal: Padding.p_5xl }]}
            >
              <SectionContent style={styles.instructions}>
                {!isEnrolled
                  ? "Please enter your email address below and stay connected with us."
                  : "Please enter the email address you would like to receive all future customer communications. You may opt out at any time."}
              </SectionContent>

              <HintText
               style={styles.requiredFieldsText}
                  accessibilityRole="text" 
                  accessible={true}
                  accessibilityLabel="Fields marked with asterisk are required.">
                {" "}
                Fields marked with * are required.
              </HintText>
              <View style={styles.section}></View>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <SparkLightInput
                    placeholder="Email Address"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value ? value.toLowerCase() : ""}
                    error={errors.email?.message}
                    label="Email Address *"
                    required={true}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    textContentType="emailAddress"
                    style={styles.emailInput}
                    ref={inputRef}
                  />
                )}
              />
            </View>
            <View style={styles.divider} />
            <View
              style={[styles.section, { paddingHorizontal: Padding.p_5xl }]}
            >
              <View style={styles.toggleHeader}>
                <SectionTitle accessibilityRole="text"
                accessible={true}
                accessibilityLabel={`Critical Notifications, ${
                primaryEmail ? "enabled" : "disabled"
              }, cannot be changed`}
                accessibilityHint="Receive critical information, account changes, and service
                updates.">
                  Critical Notifications
                </SectionTitle>
                <View style={styles.iconContainer}>
                  <View style={styles.icon} accessible={false}>
                    {primaryEmail ? (
                      <SuccessIcon />
                    ) : (
                      <SuccessIcon color={"#4C5458"} />
                    )}
                  </View>
                  {/* Display text "On" or "Off" after the icon */}
                  <IndicatorText style={styles.toggleStatus} accessible={false} importantForAccessibility="no">
                    {primaryEmail ? "On" : "Off"}
                  </IndicatorText>
                </View>
              </View>
              <SectionContent style={{marginVertical: 8}} accessible={false} importantForAccessibility="no">
                Receive critical information, account changes, and service
                updates.
              </SectionContent>
            </View>
            <View style={styles.divider} />
            <A11y.Order
              style={[styles.section, { paddingHorizontal: Padding.p_5xl, paddingVertical: 0 }]}
            >
              <View style={styles.toggleHeader}>
                <A11y.Index index={0} >
                <SectionTitle
                  accessible={true}
                  accessibilityRole="text"
                  accessibilityLabel="Paperless Billing for email notifications"
                  accessibilityHint="Opt for email statements and say goodbye to paper clutter. It's
                convenient, eco-friendly, and keeps your information at your
                fingertips."
                >
                  Paperless Billing
                </SectionTitle>
                </A11y.Index>
                <View  accessible={false} importantForAccessibility="no">
                  <A11y.Index index={1}>
                  <Toggle
                    name="paperlessBilling"
                    initialValue={paperlessStatusAcp || false}
                    onToggle={handleToggleChange}
                    disabled={!toggleCheckBoxTerm && !paperlessStatusAcp}
                    section="paperless"
                    description={paperlessStatusAcp ? "Paperless Billing is enabled." : "Need to accept Paperless Billing Terms & Conditions to enable this toggle. Swipe to take action."}
                  />
                  </A11y.Index>
                </View>
              </View>
              <SectionContent  accessible={false} importantForAccessibility="no">
                Opt for email statements and say goodbye to paper clutter. It's
                convenient, eco-friendly, and keeps your information at your
                fingertips.
              </SectionContent>
             { (!paperlessStatus ) && (
              <View style={{ paddingVertical: Padding.p_5xs }}>
              <NotificationAlert
                type="warning"
                title={undefined}
                message={
                  "By deactivating paperless billing, you will be charged a $3 paper statement fee where legally permitted."
                }
                showCloseIcon={false}
                isVisible={true}
                iconComponent={Alerttriangle}
                iconColor="#F88700"
                accessibilityLabel="By deactivating paperless billing, you will be charged a $3 paper statement fee where legally permitted."
                accessibilityLiveRegion="polite"
                accessibilityRole="alert"
                customStyle={styles.warningAlert}
              />
            </View>
              )}
            </A11y.Order>
           
    {isCheckboxVisible && (
      <View style={[styles.checkboxSection]}>
          <View style={styles.checkBoxArea}>
            <Touchable
              style={styles.checkboxTouchable}
              onPress={handleCheckboxToggle}
              accessibilityRole="checkbox"
              accessibilityLabel="I agree to Paperless Billing Terms and Conditions"
              accessibilityState={{ checked: toggleCheckBoxTerm }}
              minSize={0}
            >
              <SparklightCheckBox
                disabled={true}
                value={toggleCheckBoxTerm}
                boxStyle={styles.checkBox}
                accessible={false}
                importantForAccessibility="no"
              />
            </Touchable>
            <Text
              style={[styles.checkBoxAreaViewText, styles.checkBoxTextWrapper]}
              allowFontScaling={true}
              maxFontSizeMultiplier={1}
            >
              I agree to{' '}
              <Hyperlink
                onPress={handleTermsLinkPress}
                accessibilityRole="link"
                accessibilityLabel="View Paperless Billing Terms and Conditions"
                accessibilityHint="Opens Paperless Billing Terms and Conditions in a new window"
                allowFontScaling={true}
                maxFontSizeMultiplier={1}
              >
                Paperless Billing Terms & Conditions
              </Hyperlink>
            </Text>
          </View>
        

          {/* Add error message display */}
          {isTermRequired && (
            <View
              style={styles.errorContainer}
              accessible={true}
              accessibilityRole="alert"
              accessibilityLiveRegion="assertive"
              accessibilityLabel="Error: Please agree to the Terms and Conditions to proceed"
            >
              <AlertIcon />
              <Text style={styles.errorText} importantForAccessibility="no">
                Please agree to the Terms & Conditions to proceed.
              </Text>
            </View>
          )}
        </View>
       )}
       </View>
          
        </View>
        <View style={styles.buttonContainer}>
          <SecondaryButton
            title="Save"
            buttonType="submit"
            onPress={handleSubmit(handleSave, handleValidationError)}
            accessibilityLabel={
              isSubmitting ? "Saving settings" : "Save settings"
            }
            accessibilityRole="button"
            style={styles.saveButton}
            disabled={isSubmitting}
          />
          <SecondaryButton
            title="Cancel"
            onPress={() => navigation.goBack()}
            accessibilityLabel="Cancel"
            accessibilityRole="button"
            style={styles.cancelButton}
            disabled={isSubmitting}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.Gray300,
    paddingBottom: 100,
  },
  frameContainer: {
    backgroundColor: Color.sparklightWhite,
    marginHorizontal: Padding.p_base,
    marginTop: Padding.p_5xl,
    overflow: "hidden",
  },
  warningAlert: {
    borderLeftWidth: 4,
    borderLeftColor: "#FF9800",
    marginBottom: 0,
    borderRadius: 0,
  },
  section: {
    paddingVertical: Padding.p_xs,
  },
  instructions: {
    marginBottom: Padding.p_base,
  },
  emailInput: {
    marginTop: Padding.p_5xs,
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    minWidth: A11Y.minTouch,
  },
  icon: {
    width: 18,
    height: 18,
  },
  toggleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  toggleTitle: {
    fontFamily: FontFamily.RadioCanadaSemiBold,
    fontSize: FontSize.size_base,
    color: Color.colorGray_200,
  },
  ErrorToggle: {
    color: Color.sparkLightRed,
    fontFamily: FontFamily.RadioCanadaSemiBold,
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 4,
  },
  toggleStatus: {
    marginLeft: 4,
    fontFamily: FontFamily.RadioCanadaRegular,
    fontSize: FontSize.size_base,
    color: Color.colorGray_200,
  },
  toggleDescription: {
    fontFamily: FontFamily.RadioCanadaRegular,
    fontSize: FontSize.size_sm,
    color: Color.sparklightGray1,
    marginTop: 4,
  },
  buttonContainer: {
    padding: Padding.p_base,
    gap: 12,
  },
  saveButton: {
    backgroundColor: Color.sparklightPrimaryPurple,
  },
  cancelButton: {
    backgroundColor: Color.Gray300,
  },
  spaceBottom: {
    marginBottom: 16,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkBox: {
    width: 16,
    height: 16,
    marginTop: 0,
    marginRight: Platform.OS === "ios" ? 8 : 8,
  },
  checkBoxArea: {
    flexDirection: "row",
    alignItems: "flex-start",
    flexWrap: "wrap",
    width: "100%",
    minHeight: A11Y.minTouch,
    paddingVertical: Padding.p_5xs,
  },
  checkBoxTextWrapper: {
    flex: 1,
    flexWrap: "wrap",
    marginLeft: 8,
  },
  termsLinkText: {
    color: Color.sparklightPrimaryPurple,
    textDecorationLine: "underline",
  },
  checkboxSection: {
    paddingHorizontal: 16,
    alignSelf: "flex-start",
    justifyContent: 'flex-start',
    width: "95%",
    marginTop: Padding.p_base,
  },
  checkboxTouchable: {
    flexDirection: "row",
   
    marginRight: 0,
   
    paddingVertical: Padding.p_9xs,
    marginLeft: 8,
  },
  termsLinkTouchable: {
    minHeight: A11Y.minTouch,
    justifyContent: "center",
    paddingVertical: Padding.p_5xs,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    flexWrap: "wrap",
    
  },
  checkBoxAreaViewText: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.RadioCanadaRegular,
    color: Color.sparklightGray1,
    flexShrink: 1,
    flexWrap: "wrap",
  },
   
  errorText: {
    marginLeft: 8,
    color: "red",
    fontSize: 14,
    lineHeight: 20,
  }, errorContainer: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
  },
   requiredFieldsText: {
    textAlign: "left",
  },
});

export default AddNotificationScreen;
