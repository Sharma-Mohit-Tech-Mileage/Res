import React, { useState, useEffect, useRef } from "react";
import { AccessibilityInfo } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { feedbackSchema } from "../utility/validationSchema";
import WarningIcon from "../../../assets/svgs/Alerttriangle";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Touchable from "../common/customui/Touchable";
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
import { useDispatch } from "react-redux";
import { saveUserFeedback } from "../../redux/actions/ProfileActionSuite";
import useUserEmailPrefill from "../../hooks/useUserEmailPrefill";
import FeedbackRatingSelector from "./FeedbackRatingSelector";
import AreaOfConcernSelector from "./AreaOfConcernSelector";
import { Radio } from "native-base";
import {HintText,FieldTitle} from "../common/customui/Typography";
import PrimaryButton from "../common/customui/PrimaryButton";

const Feedback = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const isSubmittingRef = useRef(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState("facehappy");
  const [selectedConcerns, setSelectedConcerns] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isError, setIsError] = useState(false);
  const scrollViewRef = useRef(null);
  const feedbackRemainingRef = useRef(500);
  const announcementTimerRef = useRef(null);
  const emailFieldRef = useRef(null);
  const feedbackTextRef = useRef(null);

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(feedbackSchema),
    mode: "onBlur",
    defaultValues: {
      category: "compliment",
      feedbackValue: 5,
      areaOfConcern: [],
      feedbackText: "",
      feedbackEmail: "",
      cosentContactUs: null,
    },
  });

  useUserEmailPrefill(getValues, setValue, "feedbackEmail");

  const handleValidationError = (fieldErrors) => {
    isSubmittingRef.current = false;
    setIsSubmitting(false);

    if (fieldErrors.cosentContactUs) {
      setIsError(true);
      scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
      return;
    }

    // Scroll to and focus the first field with an error so inline error is visible
    if (fieldErrors.areaOfConcern || fieldErrors.feedbackText) {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
      if (fieldErrors.feedbackText) {
        setTimeout(() => feedbackTextRef.current?.focus(), 400);
      }
    } else if (fieldErrors.feedbackEmail) {
      emailFieldRef.current?.focus();
    }
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

  const onChangeValue = (value) => {
    setSelectedOption(value);
    setValue("cosentContactUs", value === "yes", {
      shouldDirty: true,
      shouldValidate: true,
    });
    clearErrors("cosentContactUs");
    setIsError(false);
  };

  const onSubmit = (data) => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setIsSubmitting(true);
    dispatch(saveUserFeedback(data, navigation));
  };

  useEffect(() => {
    if (route.params?.updateFailed) {
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
          <Animated.View
            entering={FadeInDown.delay(200).springify()}
            style={styles.sectionWrapper}
          >
            <Text style={styles.question}>
              How would you rate your experience using the MySparklight app?
            </Text>
            <HintText
              style={{marginTop: Padding.p_base,}}
              accessibilityRole="text"
              accessible={true}
              accessibilityLabel="Fields marked with an asterisk are required"
            >
              Fields marked with * are required.
            </HintText>
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
                  const remaining = 500 - (text?.length || 0);
                  const previousRemaining = feedbackRemainingRef.current;
                  feedbackRemainingRef.current = remaining;

                  const thresholds = [320, 160, 80, 40, 20, 10, 0];

                  let thresholdToAnnounce = null;

                  if (thresholds.includes(remaining)) {
                    thresholdToAnnounce = remaining;
                  } else {
                    const crossed = thresholds.find(
                      (t) => remaining < t && previousRemaining >= t
                    );

                    if (crossed != null) {
                      thresholdToAnnounce = crossed;
                    }
                  }

                  if (thresholdToAnnounce != null) {
                    // Cancel pending announcement so rapid typing doesn't stack/swallow calls or collide with inline validation.
                    if (announcementTimerRef.current) {
                      clearTimeout(announcementTimerRef.current);
                    }
                    const delay = Platform.OS === "ios" ? 500 : 350;
                    announcementTimerRef.current = setTimeout(() => {
                      announcementTimerRef.current = null;
                      AccessibilityInfo.announceForAccessibility(
                        `${thresholdToAnnounce} characters remaining`
                      );
                    }, delay);
                  }
                };
                return (
                  <>
                    <SparkLightInput
                      ref={feedbackTextRef}
                      label="Additional Feedback *"
                      required={true}
                      textAlignVertical="top"
                      onChangeText={handleChange}
                      onBlur={onBlur}
                      value={value}
                      multiline={true}
                      maxLength={500}
                      height={130}
                      error={errors.feedbackText?.message}
                    />
                    <Text
                      style={styles.charCount}
                      accessibilityRole="text"
                      accessibilityLabel={`${value?.length || 0} of 500 characters used`}
                      {...Platform.select({
                        android: { accessibilityLiveRegion: "polite" },
                        ios: {},
                      })}
                    >
                      {`${value?.length || 0}/500`}
                    </Text>
                  </>
                );
              }}
            />
          </Animated.View>



          <View style={{ paddingHorizontal: 16 }}>

              <FieldTitle
                style={[
                  (isError || errors.cosentContactUs) && styles.optionTxtError,
                ]}
              accessibilityLabel={"May Sparklight contact you about your feedback? Required"}
              >
              May Sparklight contact you about your feedback? *
              </FieldTitle>
              <Radio.Group
                name="surveyOptions"
                value={selectedOption}
                onChange={onChangeValue}
                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginRight: 4,
                  }}
                >
                  <Radio
                    value="yes"
                    accessibilityLabel="Yes"
                    accessibilityHint="Select this option if Sparklight may contact you about your feedback"
                    accessibilityRole="radio"
                    style={{
                      marginTop: 4,
                      marginRight: 4,
                      transform: [{ scale: 0.9 }],
                    }}
                  />
                  <Text
                    style={[
                      styles.optionTxt,
                      { marginBottom: 0, marginTop: 4 },
                    ]}
                  >
                    Yes {"  "}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Radio
                    value="no"
                    accessibilityLabel="No"
                    accessibilityHint="Select this option if Sparklight may not contact you about your feedback"
                    accessibilityRole="radio"
                    
                    style={{
                      marginTop: 4,
                      alignItems: "center",
                      marginRight:4 ,
                      transform: [{ scale: 0.9 }],
                    }}
                  />
                  <Text
                    style={[
                      styles.optionTxt,
                      { marginBottom: 0, marginTop: 4},
                    ]}
                  >
                    No
                  </Text>
                </View>
              </Radio.Group>
              {(isError || errors.cosentContactUs) && (
                <View
                  style={styles.errorContainer}
                  accessible={true}
                  accessibilityLabel="Please choose Yes or No to contact you."
                  accessibilityRole="alert"
                  accessibilityLiveRegion="assertive"
                >
                  <View
                    style={styles.errorIcon}
                    accessible={false}
                    importantForAccessibility="no"
                  >
                    <WarningIcon />
                  </View>
                  <Text
                    style={styles.errorText}
                    accessible={false}
                    importantForAccessibility="no"
                  >
                    {errors.cosentContactUs?.message || "Please choose Yes or No to contact you."}
                  </Text>
                </View>
              )}
            </View>
              

          <Animated.View
            entering={FadeInDown.delay(600).springify()}
            style={styles.inputWrapper}
          >
            <Controller
              control={control}
              name="feedbackEmail"
              render={({ field: { onChange, onBlur, value } }) => (
                <SparkLightInput
                  ref={emailFieldRef}
                  label="Email *"
                  required={true}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value ? value.toLowerCase() : ""}
                  error={errors.feedbackEmail?.message}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              )}
            />
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(700).springify()}
            style={styles.buttonContainer}
          >
            <PrimaryButton
              title={isSubmitting ? "Submitting..." : "Submit Feedback"}
              onPress={handleSubmit(onSubmit, handleValidationError)}
              disabled={isSubmitting}
              accessibilityLabel={isSubmitting ? "Submitting feedback" : "Submit feedback"}
              accessibilityRole="button"
              buttonType="submit"
              accessible={!isSubmitting}
            />
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(800).springify()}
            style={styles.cancelWrapper}
          >
            <PrimaryButton
              title="Cancel"
              buttonType="cancel"
              onPress={() => navigation.navigate("Account")}
              disabled={isSubmitting}
              accessibilityLabel="Cancel feedback submission"
              accessibilityRole="button"
              accessible={!isSubmitting}
            />
            
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
    backgroundColor: Color.sparklightBrightPurple,
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
  },optionTxt: {
    fontSize: FontSize.size_base,
    color: Color.colorGray_200,
    fontFamily: FontFamily.RadioCanadaSemiBold,
  },
  optionTxtError: {
    color: "red",
  },
});

export default Feedback;
