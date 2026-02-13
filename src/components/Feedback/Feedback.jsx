import React, { useState, useEffect, useRef } from "react";
import { AccessibilityInfo } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { feedbackSchema } from "../utility/validationSchema";
import WarningIcon from "../../../assets/svgs/Alerttriangle";
import {
  ScrollView,
  StyleSheet,
  Pressable,
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  Layout,
} from "react-native-reanimated";
import {
  Color,
  FontFamily,
  FontSize,
  Border,
  Padding,
} from "../../../GlobalStyles";
import ProfileSettingsHeader from "../common/ProfileSettingsHeader";
import { useNavigation, useRoute } from "@react-navigation/native";
import SparkLightInput from "../common/customui/SparkLightInput";
import NotificationAlert from "../common/customui/NotificationAlert";
import { useDispatch } from "react-redux";
import { saveUserFeedback } from "../../redux/actions/ProfileActionSuite";
import useUserEmailPrefill from "../../hooks/useUserEmailPrefill";
import FeedbackRatingSelector from "./FeedbackRatingSelector";
import AreaOfConcernSelector from "./AreaOfConcernSelector";

const Feedback = () => {
  const navigation = useNavigation();
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const route = useRoute();
  const dispatch = useDispatch();
  const isSubmittingRef = useRef(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState("facehappy");
  const [selectedConcerns, setSelectedConcerns] = useState([]);
  const [errormsg, setErrormsg] = useState(
    "Please enter valid information to continue."
  );
  const scrollViewRef = useRef(null);

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(feedbackSchema),
    defaultValues: {
      category: "compliment",
      feedbackValue: 5,
      areaOfConcern: [],
      feedbackText: "",
      feedbackEmail: "",
    },
  });

  useUserEmailPrefill(getValues, setValue, "feedbackEmail");

  const handleValidationError = () => {
    isSubmittingRef.current = false;
    setIsSubmitting(false);
  };

  const handleRatingSelect = (option) => {
    if (isSubmittingRef.current) return;
    setSelectedFeedback(option.name);
    setValue("category", option.category);
    setValue("feedbackValue", option.value);

    // Reset area of concern if rating >= 3
    if (option.value >= 3) {
      setSelectedConcerns([]);
      setValue("areaOfConcern", [], {
        shouldDirty: true,
        shouldValidate: true,
      });
      clearErrors("areaOfConcern");
    }
  };

  const handleConcernSelect = (concernId) => {
    if (isSubmittingRef.current) return;

    const updatedConcerns = selectedConcerns.includes(concernId)
      ? selectedConcerns.filter((id) => id !== concernId)
      : [...selectedConcerns, concernId];

    setSelectedConcerns(updatedConcerns);
    setValue("areaOfConcern", updatedConcerns, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const onSubmit = (data) => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setIsSubmitting(true);
    dispatch(saveUserFeedback(data, navigation));
  };

  useEffect(() => {
    if (route.params?.updateFailed) {
      setErrormsg(
        "Feedback submission failed. Please try again later or contact support"
      );
      setShowErrorAlert(true);
      scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
      isSubmittingRef.current = false;
      setIsSubmitting(false);
      navigation.setParams({ updateFailed: undefined });
    }
  }, [route.params?.updateFailed, navigation]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ProfileSettingsHeader
        title="Feedback"
        onPressBack={() => navigation.goBack()}
      />
      <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false}>
        <Animated.View
          entering={FadeInUp.delay(100).springify()}
          style={styles.content}
        >
          {showErrorAlert && (
            <Animated.View
              entering={FadeInDown.springify()}
              layout={Layout.springify()}
              style={styles.alertWrapper}
            >
              <NotificationAlert
                type="error"
                title="Error"
                message={errormsg}
                showCloseIcon={true}
                isVisible={showErrorAlert}
                autoFocusTitle={true}
                onClose={() => setShowErrorAlert(false)}
              />
            </Animated.View>
          )}

          <Animated.View
            entering={FadeInDown.delay(200).springify()}
            style={styles.sectionWrapper}
          >
            <Text style={styles.question}>
              How would you rate your experience using the MySparklight app?
            </Text>
            <Text
              style={styles.requiredFieldsText}
              accessibilityRole="text"
              accessible={true}
              accessibilityLabel="Fields marked with an asterisk are required"
            >
              Fields marked with * are required.
            </Text>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(300).springify()}
            style={styles.ratingWrapper}
          >
            <FeedbackRatingSelector
              selectedFeedback={selectedFeedback}
              onSelect={handleRatingSelect}
              disabled={isSubmitting}
            />
          </Animated.View>

          {getValues("feedbackValue") < 3 && (
            <Animated.View
              entering={FadeInDown.delay(400).springify()}
              style={styles.concernWrapper}
            >
              <Controller
                control={control}
                name="areaOfConcern"
                render={({ field: { value } }) => (
                  <>
                    <AreaOfConcernSelector
                      selectedConcerns={selectedConcerns}
                      onSelect={handleConcernSelect}
                      disabled={isSubmitting}
                      hasError={!!errors.areaOfConcern}
                    />
                    {errors.areaOfConcern && (
                      <View style={styles.errorContainer}>
                        <View style={styles.errorIcon}>
                          <WarningIcon />
                        </View>
                        <Text style={styles.errorText}>
                          {errors.areaOfConcern.message}
                        </Text>
                      </View>
                    )}
                  </>
                )}
              />
            </Animated.View>
          )}

          <Animated.View
            entering={FadeInDown.delay(500).springify()}
            style={styles.inputWrapper}
          >
            <Controller
              control={control}
              name="feedbackText"
              render={({ field: { onChange, onBlur, value } }) => {
                const handleChange = (text) => {
                  onChange(text);
                  AccessibilityInfo.announceForAccessibility(
                    `You have ${500 - (text.length || 0)} characters available`
                  );
                };
                return (
                  <>
                    <SparkLightInput
                      label="Additional Feedback *"
                      textAlignVertical="top"
                      onChangeText={handleChange}
                      onBlur={onBlur}
                      value={value}
                      multiline={true}
                      maxLength={500}
                      height={130}
                      error={errors.feedbackText?.message}
                      accessibilityLabel="Additional Feedback required"
                    />
                    <Text
                      style={styles.charCount}
                      accessibilityRole="text"
                      accessibilityLiveRegion="polite"
                      accessibilityLabel={`You have ${500 - (value?.length || 0)} characters available`}
                    >
                      {`${value?.length || 0}/500`}
                    </Text>
                  </>
                );
              }}
            />
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(600).springify()}
            style={styles.inputWrapper}
          >
            <Controller
              control={control}
              name="feedbackEmail"
              render={({ field: { onChange, onBlur, value } }) => (
                <SparkLightInput
                  label="Email *"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value ? value.toLowerCase() : ""}
                  error={errors.feedbackEmail?.message}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  accessibilityLabel="Email required"
                />
              )}
            />
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(700).springify()}
            style={styles.buttonContainer}
          >
            <Pressable
              accessibilityLabel={
                isSubmitting ? "Feedback Submitting in progress" : "Submit Feedback"
              }
              accessibilityRole="button"
              accessible={true}
              style={[
                styles.submitButton,
                isSubmitting && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit(onSubmit, handleValidationError)}
              disabled={isSubmitting}
            >
              <Text style={styles.submitButtonText}>
                {isSubmitting ? "Submitting..." : "Submit Feedback"}
              </Text>
            </Pressable>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(800).springify()}
            style={styles.cancelWrapper}
          >
            <Pressable
              accessibilityLabel="Cancel"
              accessibilityRole="button"
              accessible={true}
              onPress={() => navigation.navigate("Account")}
              disabled={isSubmitting}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </Animated.View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.sparklightWhite,
  },
  content: {
    paddingBottom: 150,
  },
  alertWrapper: {
    paddingTop: Padding.p_base,
    paddingHorizontal: Padding.p_base,
  },
  sectionWrapper: {
    paddingTop: Padding.p_base,
    paddingHorizontal: Padding.p_base,
  },
  question: {
    fontSize: 22,
    lineHeight: 28,
    fontFamily: FontFamily.openSansRegular,
    color: Color.gray600,
  },
  requiredFieldsText: {
    fontSize: 14,
    fontFamily: FontFamily.openSansRegular,
    color: Color.gray600,
    marginTop: Padding.p_base,
    textAlign: "left",
  },
  ratingWrapper: {
    paddingTop: Padding.p_5xl,
    paddingHorizontal: Padding.p_base,
  },
  concernWrapper: {
    paddingTop: Padding.p_5xl,
    paddingHorizontal: Padding.p_base,
  },
  inputWrapper: {
    paddingTop: Padding.p_5xl,
    paddingHorizontal: Padding.p_base,
  },
  charCount: {
    textAlign: "right",
    fontFamily: FontFamily.openSansRegular,
    fontWeight: "400",
    color: Color.sparklightDarkGray,
    fontSize: FontSize.size_xs,
    marginTop: Padding.p_5xs,
  },

  buttonContainer: {
    paddingTop: Padding.p_5xl,
    paddingHorizontal: Padding.p_base,
  },
  submitButton: {
    backgroundColor: Color.colorMidnightblue,
    padding: Padding.p_base,
    borderRadius: Border.br_11xs,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: Color.sparklightWhite,
    textAlign: "center",
    fontFamily: FontFamily.openSansRegular,
    fontSize: FontSize.size_base,
    fontWeight: "600",
    lineHeight: 20,
  },
  cancelWrapper: {
    marginTop: Padding.p_13xl,
    paddingHorizontal: Padding.p_base,
    alignItems: "center",
  },
  cancelText: {
    color: Color.colorMidnightblue,
    textAlign: "center",
    fontFamily: FontFamily.openSansRegular,
    fontSize: FontSize.size_base,
    fontWeight: "600",
    lineHeight: 20,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  errorIcon: {
    width: 20,
    height: 20,
    marginRight: Padding.p_xs,
  },
  
  errorText: {
    color: "red",
    fontSize: FontSize.size_sm,
    fontFamily: FontFamily.openSansRegular,
    marginTop: Padding.p_5xs,
  },
});

export default Feedback;
