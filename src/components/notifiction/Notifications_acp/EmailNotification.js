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

const validationSchema = yup.object().shape({
  email: yup.string().email("Invalid email address").required("Email is required"),
});

const AddNotificationScreen = () => {
  const [toggleCheckBoxTerm, setToggleCheckBoxTerm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);
  const [formState, setFormState] = useState({ paperlessBilling: false });
  const [reduceMotionEnabled, setReduceMotionEnabled] = useState(false);
  const [screenReaderEnabled, setScreenReaderEnabled] = useState(false);
  const [isCheckboxVisible, setIsCheckboxVisible] = useState(null);
  const scrollViewRef = useRef(null);
  const animatedValue = useRef(new Animated.Value(-100)).current;
  const timeoutRef = useRef(null);

  const route = useRoute();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const is_enrolled = route.params?.is_enrolled;
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

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotionEnabled);
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
      // For error notifications, do nothing - they stay on screen until manually dismissed
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
    console.log("Paperless Billing toggle:", newValue.target.value);
    setFormState((prevState) => ({ ...prevState, paperlessBilling: newValue.target.value }));
  }, []);

  const handleSave = useCallback(
    (data) => {
      const { email } = data;
      const { paperlessBilling } = formState;
      console.log("Only require acceptance of terms if paperless billing is enabled and hasn't been accepted before.", paperlessBilling, toggleCheckBoxTerm, paperlessStatusAcp);
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
            account: accountDetails?.accountNumber,
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

  return (
    <View style={styles.container}>
      <ProfileSettingsHeader
        title={is_enrolled ? "Edit Email Notifications" : "Add Email Notifications"}
        onPressBack={() => navigation.goBack()}
        accessibilityLabel="Add Email Notifications"
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
                    showCloseIcon={notification.type === "error"}
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
                title="Critical Notifications"
                message="By providing your email address, you're signing up for critical notifications. We'll keep you informed without overwhelming your inbox."
                showCloseIcon={false}
                isVisible={true}
                accessibilityLabel="Important: By providing your email address, you're signing up for critical notifications"
                accessibilityLiveRegion="polite"
                accessibilityRole="alert"
                customStyle={styles.warningAlert}
              />
            </View>
            <View style={[styles.section, { paddingHorizontal: Padding.p_5xl }]}>
              <Text style={styles.instructions}>
                Please enter your email address below and stay connected with us.
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
                  <Image
                    style={styles.icon}
                    resizeMode="cover"
                    source={require("../../../../assets/checkcircle.png")}
                    accessible={false}
                  />
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
            {isCheckboxVisible &&<View style={[styles.checkBoxArea, { flexDirection: 'row', alignItems: 'center' }]}>
              <TouchableOpacity
                onPress={() => setToggleCheckBoxTerm(!toggleCheckBoxTerm)}
                accessibilityRole="checkbox"
                accessibilityLabel="Agree to Paperless Billing Terms and Conditions checkbox"
                accessibilityState={{ checked: toggleCheckBoxTerm }}
              >
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
              </TouchableOpacity>
              <TouchableOpacity
                onPress={(event) => {
                  event.stopPropagation();
                  navigation.navigate("ArticalWindowUtility", {
                    url: "https://www.sparklight.com/legal/paperless-terms-and-conditions",
                    name: "Terms & Conditions",
                  });
                }}
                accessibilityRole="link"
                accessibilityLabel="Paperless Billing Terms & Conditions"
                accessibilityHint="Opens Paperless Billing Terms & Conditions"
                style={{ marginLeft: 1 }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', flexShrink: 1 }}>
                  <Text
                    style={[styles.checkBoxAreaViewText, { lineHeight: undefined }]}
                    allowFontScaling={true}
                    maxFontSizeMultiplier={1}
                  >
                    {" I agree to "}
                  </Text>
                  <Text
                    style={[
                      styles.checkBoxAreaViewText,
                      { color: Color.sparklightBrightPurple, textDecorationLine: "underline", lineHeight: undefined },
                    ]}
                    allowFontScaling={true}
                    maxFontSizeMultiplier={1}
                  >
                    Paperless Billing Terms & Conditions
                  </Text>
                </View>
              </TouchableOpacity>
            </View>}
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
    marginRight: Platform.OS === "ios" ? 2 : 4,
    backgroundColor: Color.colorWhitesmoke_100,
  },
  checkBoxArea: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Padding.p_5xl,
  },
  checkBoxAreaViewText: {
    fontSize: 14,
    fontFamily: FontFamily.openSansRegular,
    lineHeight: 30,
    color: Color.colorGray_200,
  },
});

export default AddNotificationScreen;