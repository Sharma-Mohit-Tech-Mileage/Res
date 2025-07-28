import React, { useState, useEffect, useRef, useCallback } from "react";
import { StyleSheet, Text, View, ScrollView, Image, Animated, Platform, TouchableOpacity, AccessibilityInfo, } from "react-native";
import { Color, Padding, FontSize, FontFamily } from "../../../../GlobalStyles";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import CheckBox from "@react-native-community/checkbox";
import { useNavigation, useRoute } from "@react-navigation/native";
import Toggle from "../../common/Toggle";
import SparkLightInput from "../../common/customui/SparkLightInput";
import { useDispatch, useSelector } from "react-redux";
import ProfileSettingsHeader from "../../common/ProfileSettingsHeader";
import NotificationAlert from "../../common/customui/NotificationAlert";
import SecondaryButton from "../../common/customui/PrimaryButton";
import LoadingOverlay from "../../common/customui/CustomLoading";
import { updatePrimaryAndPaperlessRequest } from "../../../redux/actions/NotificationActionSuite";
import { fetchACPUserAccountDetails, getPaperlessStatus } from "../../../redux/actions/ProfileActionSuite";
import { getPrimaryEmail } from "../../utility/constant";
import Checkcircle from '../../../../assets/svgs/Checkcircle';
import Checkcircle1 from '../../../../assets/svgs/Checkcircle1';

const validationSchema = yup.object().shape({
  email: yup.string().email("Invalid email address").required("Email is required"),
});

const AddNotificationScreen = () => {
  const [toggleCheckBoxTerm, setToggleCheckBoxTerm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);
  const [formState, setFormState] = useState({ paperlessBilling: false });
  const [screenReaderEnabled, setScreenReaderEnabled] = useState(false);
  const user = useSelector(state => state.combinedReducers.user.userData);
  const [isCheckboxVisible, setIsCheckboxVisible] = useState(null);
  const scrollViewRef = useRef(null);
  const animatedValue = useRef(new Animated.Value(-100)).current;
  const timeoutRef = useRef(null);
  const route = useRoute();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const accountDetails = useSelector(
    (state) => state.combinedReducers.profile?.accountDetails
  );
  const paperlessStatusAcp = useSelector(
    (state) => state.combinedReducers.profile?.paperlessStatusAcp
  );

  const primaryEmail = accountDetails ? getPrimaryEmail(accountDetails) : "";

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
      AccessibilityInfo.announceForAccessibility(notification.message);
    }
  }, [notification, screenReaderEnabled]);

  useEffect(() => {
    if (accountDetails) {
      const updatedPrimaryEmail = getPrimaryEmail(accountDetails);
      setValue("email", updatedPrimaryEmail);
      dispatch(getPaperlessStatus(updatedPrimaryEmail));
      
      // Update isEnrolled based on the actual presence of a primary email
      setIsEnrolled(!!updatedPrimaryEmail);
    }
  }, [accountDetails, setValue, dispatch]);

  useEffect(() => {
    setIsCheckboxVisible(!paperlessStatusAcp);
  }, [paperlessStatusAcp, isCheckboxVisible]);

  useEffect(() => {
    const updateAccountDetails = async () => {
      if (route.params?.updateSuccess) {
        try {
          await dispatch(fetchACPUserAccountDetails());
          setNotification({ message: route.params.successMessage, type: "success" });
        } catch (error) {
          setNotification({ message: 'Error updating account details', type: "error" });
        } finally {
          setIsSubmitting(false);
          setToggleCheckBoxTerm(false);
        }
      } else if (route.params?.updateFailed) {
        setNotification({ message: route.params.failureMessage, type: "error" });
        setIsSubmitting(false);
        setToggleCheckBoxTerm(false);
      }
    };

    updateAccountDetails();
  }, [route.params, dispatch]);

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

  const handleToggleChange = useCallback((newValue) => {
    setFormState((prevState) => ({ ...prevState, paperlessBilling: newValue.target.value }));
  }, []);

  const handleSave = useCallback(
    (data) => {
      const { email } = data;
      const { paperlessBilling } = formState;
     if (paperlessBilling && isCheckboxVisible && !toggleCheckBoxTerm) {
        setNotification({
          message: "Please accept the Paperless Billing Terms & Conditions to continue.",
          type: "error",
        });
        animateNotification();
        return;
      }
      setIsSubmitting(true);
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

  const handleValidationError = useCallback(() => {
    scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
    setNotification({ message: "Please enter valid information to continue.", type: "error" });
    animateNotification();
  }, [animateNotification]);

  const handleCheckboxToggle = useCallback(() => {
    setToggleCheckBoxTerm(!toggleCheckBoxTerm);
  }, [toggleCheckBoxTerm]);

  const handleTermsLinkPress = useCallback((event) => {
    event.stopPropagation();
    navigation.navigate("ArticalWindowUtility", {
      url: "https://www.sparklight.com/legal/paperless-terms-and-conditions",
      name: "Terms & Conditions",
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ProfileSettingsHeader
        title={isEnrolled ? "Edit Email Notifications" : "Add Email Notifications"}
        onPressBack={() => navigation.goBack()}
        accessibilityLabel={isEnrolled ? "Edit Email Notifications" : "Add Email Notifications"}
      />
      {isSubmitting && (
        <LoadingOverlay loading={isSubmitting} loadingTxt="Saving" accessibilityLiveRegion="polite" />
      )}
      <ScrollView ref={scrollViewRef}>
        <View style={styles.frameContainer}>
          <View style={{ paddingVertical: 16 }}>
            {notification && (
              <Animated.View
                style={{ transform: [{ translateY }], paddingHorizontal: Padding.p_5xl }}
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

            <View style={{ paddingHorizontal: Padding.p_5xl }} >
              <NotificationAlert
                type="warning"
                title={"Disconnect Error"}
                message={!isEnrolled?"By providing your email address, you're signing up for critical notifications. We'll keep you informed without overwhelming your inbox.":"By updating your email, you agree that this change will apply to all Sparklight email customer communications sent to you, including, but not limited to, account notifications, order updates, marketing emails, and service-related messages."}
                showCloseIcon={false}
                isVisible={true}
                accessibilityLabel="Important: By providing your email address, you're signing up for critical notifications"
                accessibilityLiveRegion="polite"
                accessibilityRole="alert"
                customStyle={styles.warningAlert}
              />
            </View>
            <View style={[styles.section, { paddingHorizontal: Padding.p_5xl }]}>
            {isEnrolled &&<Text style={styles.instructions}>
                {"Edit Email Address"}
              </Text>}
              <Text style={styles.instructions}>
                {!isEnrolled?"Please enter your email address below and stay connected with us.":"Please enter the email address you would like to receive all future customer communications. You may opt out at any time."}
              </Text>
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
                    label="Email Address"
                    accessibilityLabel="Email address input"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    textContentType="emailAddress"
                    style={styles.emailInput}
                  />
                )}
              />
            </View>
            <View style={styles.divider} />
            <View style={[styles.section, { paddingHorizontal: Padding.p_5xl }]} >
              <View style={styles.toggleHeader}>
                <Text style={styles.toggleTitle}>Critical Notifications</Text>
                <View style={styles.iconContainer}>
                  <View style={styles.icon}>
                    <Checkcircle />
                  </View>
                  {/* <Image
                    style={styles.icon}
                    resizeMode="cover"
                    source={require("../../../../assets/checkcircle.png")}
                    accessible={false}
                  /> */}
                  <Text style={styles.toggleStatus}>On</Text>
                </View>
              </View>
              <Text style={styles.toggleDescription}>
                Receive critical information, account changes, and service updates.
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={{ paddingTop: Padding.p_base, paddingBottom: 8, paddingHorizontal: Padding.p_5xl }}>
              <View style={styles.toggleHeader}>
                <Text style={styles.toggleTitle}>Paperless Billing</Text>
                <Toggle
                  name="paperlessBilling"
                  initialValue={paperlessStatusAcp || false}
                  onToggle={handleToggleChange}
                  disabled={!toggleCheckBoxTerm && !paperlessStatusAcp}
                  section="paperless"
                />
              </View>
              <Text style={styles.toggleDescription}>
                Opt for email statements and say goodbye to paper clutter. It's convenient, eco-friendly, and keeps your information at your fingertips.
              </Text>
            </View>
            {isCheckboxVisible && (
              <View style={styles.checkBoxArea}>
                <TouchableOpacity
                  style={styles.checkboxTouchable}
                  onPress={handleCheckboxToggle}
                  accessibilityRole="checkbox"
                  accessibilityLabel="I agree to Paperless Billing Terms and Conditions"
                  accessibilityState={{ checked: toggleCheckBoxTerm }}
                >
                  <View style={styles.checkboxContainer}>
                    <CheckBox
                      disabled={true}
                      value={toggleCheckBoxTerm}
                      style={styles.checkBox}
                      boxType="square"
                      tintColors={{
                        true: "#1B99FF",
                        false: Platform.OS === "ios" ? Color.colorWhitesmoke_300 : "#D0D5DD",
                      }}
                      accessible={false}
                    />
                    <Text
                      style={[styles.checkBoxAreaViewText,{marginLeft: 4}]}
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
                  accessibilityLabel="View Paperless Billing Terms and Conditions"
                  accessibilityHint="Opens Paperless Billing Terms and Conditions in a new window"
                >
                  <Text
                    style={[
                      styles.checkBoxAreaViewText,
                      { color: Color.sparklightBrightPurple, textDecorationLine: "underline" },
                    ]}
                    allowFontScaling={true}
                    maxFontSizeMultiplier={1}
                  >
                    Paperless Billing Terms & Conditions
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <SecondaryButton
            title="Save"
            buttonType="submit"
            onPress={handleSubmit(handleSave, handleValidationError)}
            accessibilityLabel={isSubmitting ? "Saving settings" : "Save settings"}
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
    backgroundColor: Color.colorWhitesmoke_200,
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
    paddingVertical: Padding.p_base,
  },
  instructions: {
    fontFamily: FontFamily.openSansRegular,
    fontSize: FontSize.size_base,
    color: Color.colorGray_200,
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
    fontFamily: FontFamily.openSansSemiBold,
    fontSize: FontSize.size_base,
    color: Color.colorGray_200,
  },
  toggleStatus: {
    marginLeft: 4,
    fontFamily: FontFamily.openSansRegular,
    fontSize: FontSize.size_sm,
    color: Color.sparklightDarkGray,
  },
  toggleDescription: {
    fontFamily: FontFamily.openSansRegular,
    fontSize: FontSize.size_sm,
    color: Color.sparklightDarkGray,
    marginTop: 4,
  },
  buttonContainer: {
    padding: Padding.p_base,
    gap: 12,
  },
  saveButton: {
    backgroundColor: "#3F51B5",
  },
  cancelButton: {
    backgroundColor: Color.colorWhitesmoke_200,
  },
  spaceBottom: {
    marginBottom: 16,
  },
  checkBox: {
    width: 12,
    height: 12,
    marginRight: Platform.OS === "ios" ? 2 : 16,
    backgroundColor: Color.colorWhitesmoke_100,
  },
  checkBoxArea: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    paddingHorizontal: Padding.p_5xl,
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
  },
});

export default AddNotificationScreen;