import React, { useState, useEffect, useRef, useCallback } from "react";
import { StyleSheet, Text, View, ScrollView, Image, Animated, Platform, TouchableOpacity, AccessibilityInfo, } from "react-native";
import { Color, Padding, FontSize, FontFamily } from "../../../../GlobalStyles";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import debounce from "lodash/debounce";
import CheckBox from "@react-native-community/checkbox";
import { useNavigation, useRoute } from "@react-navigation/native";
import Toggle from "../../common/Toggle";
import SparkLightInput from "../../common/customui/SparkLightInput";
import { useDispatch, useSelector } from "react-redux";
import ProfileSettingsHeader from "../../common/ProfileSettingsHeader";
import NotificationAlert from "../../common/customui/NotificationAlert";
import { manageEmailRequest } from "../../../redux/actions/ProfileActionSuite";
import SecondaryButton from "../../common/customui/PrimaryButton";
import LoadingOverlay from "../../common/LoadingOverlay";

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
});

const AddEmailNotification = () => {
  const [toggleCheckBoxTerm, setToggleCheckBoxTerm] = useState(false);
  const scrollViewRef = useRef(null);
  const isSubmittingRef = useRef(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [formState, setFormState] = useState({
    paperlessBilling: true,
    criticalNotifications: true,
  });
  const [reduceMotionEnabled, setReduceMotionEnabled] = useState(false);
  const [screenReaderEnabled, setScreenReaderEnabled] = useState(false);

  const route = useRoute();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const newEmail = route.params?.newEmail || false;
  const profile = useSelector((state) => state.combinedReducers.profile || {});
  const { allSvEmailAssociated = [] } = profile;
  const animatedValue = useRef(new Animated.Value(0)).current;

  // Check for accessibility preferences
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotionEnabled);
    AccessibilityInfo.isScreenReaderEnabled().then(setScreenReaderEnabled);
  }, []);

  // Announce error message if screen reader is enabled
  useEffect(() => {
    if (showErrorAlert && errorMsg && screenReaderEnabled) {
      AccessibilityInfo.announceForAccessibility(errorMsg);
    }
  }, [showErrorAlert, errorMsg, screenReaderEnabled]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      email: route.params?.additionalData?.email || "",
    },
  });

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-50, 0],
  });

  // Helper to trigger error animation (skips animation if reduce motion is enabled)
  const triggerErrorAnimation = () => {
    animatedValue.setValue(0);
    if (!reduceMotionEnabled) {
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    } else {
      animatedValue.setValue(1);
    }
  };

  const handleToggleChange = useCallback(
    debounce((e) => {
      const { name, value } = e.target;
      setFormState((prevState) => ({ ...prevState, [name]: value }));
    }, 200),
    []
  );

  const checkEmailAssociation = (email, associations) => {
    const emailToCheck = email.toLowerCase();
    const associatedWithPaperless = associations.some(
      (setting) =>
        setting.emailAddress?.toLowerCase() === emailToCheck && setting.invoice
    );
    const associatedWithMarketing = associations.some(
      (setting) =>
        setting.emailAddress?.toLowerCase() === emailToCheck &&
        setting.marketing
    );
    const associatedWithNoFlags = associations.some(
      (setting) =>
        setting.emailAddress?.toLowerCase() === emailToCheck &&
        !setting.invoice &&
        !setting.marketing
    );

    return {
      associatedWithPaperless,
      associatedWithMarketing,
      associatedWithNoFlags,
    };
  };

  const handleSave = useCallback(
    async (data) => {
      if (isSubmittingRef.current) return;
      isSubmittingRef.current = true;
      setIsSubmitting(true);

      const { email } = data;
      const { paperlessBilling, criticalNotifications } = formState;

      const {
        associatedWithPaperless,
        associatedWithMarketing,
        associatedWithNoFlags,
      } = checkEmailAssociation(email, allSvEmailAssociated);

      if (criticalNotifications && associatedWithMarketing) {
        setErrorMsg(
          "This email is already subscribed to marketing communications. Please choose another email or update the current subscription."
        );
      } else if (paperlessBilling && associatedWithPaperless) {
        setErrorMsg(
          "This email is already subscribed to paperless billing. You can update the subscription if needed."
        );
      } else if (associatedWithPaperless && associatedWithMarketing) {
        setErrorMsg(
          "This email is already subscribed to both paperless billing and marketing communications. Please edit the existing settings to make changes."
        );
      } else if (
        associatedWithNoFlags &&
        !paperlessBilling &&
        !criticalNotifications
      ) {
        setErrorMsg(
          "This email is already present with no subscriptions. Please select at least one subscription option."
        );
      } else if (
        (associatedWithPaperless || associatedWithMarketing) &&
        !paperlessBilling &&
        !criticalNotifications
      ) {
        setErrorMsg(
          "This email address is already being used for other notifications. Please select what notifications you would like to receive to this email address."
        );
      } else {
        try {
          await dispatch(
            manageEmailRequest(
              email,
              paperlessBilling,
              criticalNotifications,
              newEmail,
              navigation
            )
          );
          return;
        } catch (error) {
          setErrorMsg(
            "We encountered an issue while saving your settings. Please try again."
          );
        }
      }

      triggerErrorAnimation();
      setShowErrorAlert(true);
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    },
    [dispatch, navigation, formState, allSvEmailAssociated]
  );

  const handleValidationError = useCallback(() => {
    scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
    setErrorMsg("Please enter valid information to continue.");
    setShowErrorAlert(true);
    isSubmittingRef.current = false;
    setIsSubmitting(false);
    triggerErrorAnimation();
  }, []);

  return (
    <View style={styles.container}>
      <ProfileSettingsHeader
        title="Add Email Notifications"
        onPressBack={() => navigation.goBack()}
        accessibilityLabel="Add Email Notifications"
      />

      <LoadingOverlay
        isLoading={isSubmitting}
        message="Saving..."
        accessibilityLiveRegion="polite"
      />

      <ScrollView ref={scrollViewRef}>
        <View style={styles.frameContainer}>
          <View style={{ paddingVertical: 16 }}>
            {/* Error / Success Notification Alert */}
            {showErrorAlert && (
              <Animated.View
                style={{
                  transform: [{ translateY }],
                  paddingHorizontal: Padding.p_5xl,
                }}
                accessible={true}
              >
                <View style={styles.spaceBottom}>
                  <NotificationAlert
                    type="error"
                    title="Error"
                    message={errorMsg}
                    showCloseIcon={true}
                    onClose={() => {
                      triggerErrorAnimation();
                      setShowErrorAlert(false);
                    }}
                    accessibilityLiveRegion="assertive"
                    accessibilityRole="alert"
                    accessibilityLabel={errorMsg}
                  />
                </View>
              </Animated.View>
            )}

            <View style={{ paddingHorizontal: Padding.p_5xl }}>
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

            {/* Email Instructions and Input */}
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

            {/* Critical Notifications Display (non-interactive) */}
            <View
              style={[styles.section, { paddingHorizontal: Padding.p_5xl }]}
              accessible={true}
              accessibilityLabel={`Critical Notifications: ${formState.criticalNotifications ? "On" : "Off"
                }`}
            >
              <View style={styles.toggleHeader}>
                <Text style={styles.toggleTitle}>Critical Notifications</Text>
                <View style={styles.iconContainer}>
                  <Image
                    style={styles.icon}
                    resizeMode="cover"
                    source={
                      formState.criticalNotifications
                        ? require("../../../../assets/checkcircle.png")
                        : require("../../../../assets/checkcircle1.png")
                    }
                    accessible={false} // decorative
                  />
                  <Text style={styles.toggleStatus}>
                    {formState.criticalNotifications ? "On" : "Off"}
                  </Text>
                </View>
              </View>
              <Text style={styles.toggleDescription}>
                Receive critical information, account changes, and service updates.
              </Text>
            </View>

            <View style={styles.divider} />

            {/* Paperless Billing Group with Toggle */}
            <View
              style={{ paddingTop: Padding.p_base, paddingBottom: 8, paddingHorizontal: Padding.p_5xl, }}
            >
              <View style={styles.toggleHeader}>
                <Text style={styles.toggleTitle}>Paperless Billing</Text>
                <Toggle
                  name={""}
                  initialValue={formState.paperlessBilling || false}
                  onChange={(e) => handleToggleChange(e)}
                  disabled={false}
                  section="paperless"
                />
              </View>
              <Text style={styles.toggleDescription}>
                Opt for email statements and say goodbye to paper clutter. It's
                convenient, eco-friendly, and keeps your information at your
                fingertips.
              </Text>
            </View>

            {/* Checkbox and Terms & Conditions (wrapped in a touchable area) */}
            <TouchableOpacity
              onPress={() => setToggleCheckBoxTerm(!toggleCheckBoxTerm)}
              style={[styles.checkBoxArea, { paddingHorizontal: Padding.p_5xl }]}
              accessibilityRole="checkbox"
              accessibilityLabel="Agree to Paperless Billing Terms and Conditions"
              accessibilityState={{ checked: toggleCheckBoxTerm }}
            >
              <View
                style={
                  Platform.OS === "ios"
                    ? styles.checkBoxView
                    : styles.checkBoxViewAndroid
                }
              >
                <CheckBox
                  disabled={true} // Parent TouchableOpacity handles presses
                  value={toggleCheckBoxTerm}
                  style={
                    Platform.OS === "ios"
                      ? styles.checkBox
                      : styles.checkBoxAndroid
                  }
                  boxType="square"
                  tintColors={{
                    true: "#1B99FF",
                    false:
                      Platform.OS === "ios"
                        ? Color.colorWhitesmoke_300
                        : "#D0D5DD",
                  }}
                  accessible={false}
                />
              </View>
              <View style={styles.checkBoxAreaView}>
                <Text style={styles.checkBoxAreaViewText}>
                  I agree to{" "}
                  <Text
                    style={[
                      styles.checkBoxAreaViewText,
                      {
                        color: Color.sparklightBrightPurple,
                        textDecorationLine: "underline",
                      },
                    ]}
                    onPress={(event) => {
                      // Prevent toggling the checkbox when pressing the link
                      event.stopPropagation();
                      // Insert navigation to the terms and conditions screen here if needed
                    }}
                    accessibilityRole="link"
                    accessibilityHint="Opens Paperless Billing Terms & Conditions"
                    accessible={true}
                  >
                    Paperless Billing Terms & Conditions
                  </Text>
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Save and Cancel Buttons */}
        <View style={styles.buttonContainer}>
          <SecondaryButton
            title="Save"
            buttonType="submit"
            onPress={handleSubmit(handleSave, handleValidationError)}
            accessibilityLabel={isSubmitting ? "Saving settings" : "Save settings"}
            accessibilityRole="button"
            style={styles.saveButton}
          />
          <SecondaryButton
            title="Cancel"
            onPress={() => navigation.goBack()}
            accessibilityLabel="Cancel"
            accessibilityRole="button"
            style={styles.cancelButton}
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
    backgroundColor: Color.colorWhitesmoke_100,
  },
  checkBoxView: {
    width: 12,
    height: 12,
    marginRight: Platform.OS === "ios" ? 20 : 30,
    marginTop: 10,
    backgroundColor: Color.colorWhitesmoke_100,
  },
  checkBoxAndroid: {},
  checkBoxViewAndroid: {
    marginRight: 10,
    marginLeft: 10,
  },
  checkBoxArea: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkBoxAreaView: {
    marginRight: 5,
  },
  checkBoxAreaViewText: {
    fontSize: 14,
    fontFamily: FontFamily.openSansRegular,
    lineHeight: 30,
    marginRight: 10,
    color: Color.colorGray_200,
  },
});

export default AddEmailNotification;