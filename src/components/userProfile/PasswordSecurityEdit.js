import React, { useState, useEffect, useRef } from "react";
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { StyleSheet, Text, View, AccessibilityInfo, findNodeHandle } from "react-native";
import KeyboardAwareScrollView from "../common/customui/KeyboardAwareScrollView";
import PrimaryButton from "../common/customui/PrimaryButton";
import { useNavigation, useRoute } from "@react-navigation/native";
import { FontFamily, Padding, Color, FontSize, Border } from "../../../GlobalStyles";
import { securityQuestions } from "../utility/constant";
import SparkLightInput from '../common/customui/SparkLightInput';
import SparkLightDropdown from '../common/customui/SparkLightDropdown';
import ProfileSettingsHeader from '../common/ProfileSettingsHeader';
import { useDispatch, useSelector } from 'react-redux';
import NotificationAlert from '../common/customui/NotificationAlert';
import { updateProfileSecurity } from '../../redux/actions/ProfileActionSuite';
import { GetApiRequest} from "../../network/RestApiClient";
import { getEndpoint, ENDPOINTS } from "../../network/apis/endpoints/Endpoints";
import LoadingOverlay from "../common/customui/LoadingOverlay";
import { securitySchema } from '../utility/validationSchema'; // Update the path as necessary
import colors from "../../res/Colors";
import { requiredField } from "../../styles/utilities";
import aesEncryption from "../../../src/utils/AESEncryption";
import { getUser } from "../../../src/redux/utils/LocalStorage";
import AppStyles from '../../styles/AppStyles'
import { HintText, SectionTitle, FieldTitle } from "../common/customui/Typography";
const announceForAccessibility = (message) => {
  AccessibilityInfo.announceForAccessibility(message);
};

const getSecurityAnswerDisplayValue = (value) => {
  if (!value) return "";
  const decryptedValue = aesEncryption.decryptAnswer(value);
  return decryptedValue || value;
};

const PasswordSecurityEdit = () => {

  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const scrollViewRef = useRef(null);
  const mainContentRef = useRef(null);
  const securityQuestionRef = useRef(null);
  const securityAnswerRef = useRef(null);
  const [isCustomQuestionSelected, setIsCustomQuestionSelected] = useState(false);
  const [customSecurityQuestion, setCustomSecurityQuestion] = useState('');
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showValidationAlert, setShowValidationAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingTxt, setLoadingTxt] = useState("Please wait...");
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [dropdownFocused, setDropdownFocused] = useState(false);
  const errorIconRef = useRef(null);
  const [screenReaderEnabled, setScreenReaderEnabled] = useState(false);
  const [securityQuestionsNew, setSecurityQuestionsNew] = useState(securityQuestions);

  const profile = useSelector(state => state.profile || {});
  const user = useSelector(state => state.user.userData);
  const profileDetailsfromStore = profile.profileDetails || {}; // Defaulting to an empty array if userList is undefined
  const [profileDetails, setLocalProfile] = useState(profileDetailsfromStore);
  const { control, handleSubmit, setValue, reset, formState: { errors } } = useForm({
    resolver: yupResolver(securitySchema(isCustomQuestionSelected)),
    defaultValues: profileDetails
  });

  const handleDropdownStateChange = (isOpen) => {
    setIsDropDownOpen(isOpen);
    setDropdownFocused(isOpen);
  };
  

  useEffect(() => {
    AccessibilityInfo.isScreenReaderEnabled().then(setScreenReaderEnabled);
  }, []);

  // Focus on error icon when error alert is shown
  useEffect(() => {
    if (showErrorAlert && screenReaderEnabled) {
      const t = setTimeout(() => {
        try {
          if (errorIconRef.current) {
            const handle = findNodeHandle(errorIconRef.current);
            if (handle) {
              AccessibilityInfo.setAccessibilityFocus(handle);
              AccessibilityInfo.announceForAccessibility("Error icon");
            }
          }
        } catch (e) {
          console.warn("Accessibility focus error:", e);
        }
      }, 300);

      return () => clearTimeout(t);
    }
  }, [showErrorAlert, screenReaderEnabled]);

  const handleSecurityQuestionChange = (itemValue) => {
    setLocalProfile({
      ...profileDetails,
      securityQuestion: itemValue === "Add your own question" ? '' : itemValue
    });
    setValue("securityAnswer", ""); // Clear the answer field when question changes
    setCustomSecurityQuestion(itemValue);
    setIsDropDownOpen(false);
    setDropdownFocused(false);
    setIsCustomQuestionSelected(itemValue === "Add your own question");
    if (mainContentRef.current) {
      mainContentRef.current.setNativeProps({
        accessibilityElementsHidden: false,
        importantForAccessibility: 'yes'
      });
    }
  };


  const handleSave = (formData) => {
    setLoading(true);
    formData.securityQuestion = isCustomQuestionSelected ?
      formData.securityQuestion :
      customSecurityQuestion;
    dispatch(updateProfileSecurity(formData, navigation)); // Dispatch with formData
    announceForAccessibility("Saving security question changes");
  };





  const handleValidationError = (errors) => {
    scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
    setShowValidationAlert(true);
    announceForAccessibility("Please fix validation errors before saving");
    const fieldOrder = [
      { key: "securityQuestion", ref: securityQuestionRef },
      { key: "securityAnswer", ref: securityAnswerRef },
    ];
    const firstInvalid = fieldOrder.find((f) => errors?.[f.key]);
    if (firstInvalid) firstInvalid.ref.current?.focus();
  };


  const getSecurityQuestions= async()=>{
    const user = await getUser();
    const userName = user?.userInfo?.userName || user?.userName || '';
    const requestWithEndpoint = getEndpoint(ENDPOINTS.SECURITY_QUESTIONS, { userName });
    GetApiRequest(
      requestWithEndpoint,
      (res) => {
        if (res) {
          setSecurityQuestionsNew(res);
          checkCustomSecurityQuestion(res);
        }
      },
      
      (error) => console.warn(error)
    );
  };


  const checkCustomSecurityQuestion = (questions) => {
    const storedQuestion = profileDetails.securityQuestion;
     setCustomSecurityQuestion(storedQuestion);
  };

  useEffect(() => {
    setLoading(false);
  }, [profileDetails]);



  useEffect(() => {
    const storedQuestion = profileDetails.securityQuestion;
     setCustomSecurityQuestion(storedQuestion);
    

  }, []);

  useEffect(() => {
    getSecurityQuestions();
  }, []);


  useEffect(() => {
    if (route.params?.updateFailed) {
      setShowErrorAlert(true);
      setLoading(false);
      scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
      navigation.setParams({ updateFailed: undefined });
    }
  }, [route.params?.updateFailed]);


  return (
    <View
      style={styles.passwordSecurityEdit}
      ref={mainContentRef}
      accessibilityLabel="Password Security Edit Screen"
    >
      <ProfileSettingsHeader
        accessible={!dropdownFocused}
        accessibilityElementsHidden={dropdownFocused}
        importantForAccessibility={dropdownFocused ? 'no-hide-descendants' : 'yes'}
        title="Edit Security Question"
        onPressBack={() => navigation.navigate('PasswordSecurity')}
      />
      <KeyboardAwareScrollView ref={scrollViewRef} >
        <View style={styles.passwordSecurityEditInner}>
          <View style={styles.frameParent}>
            <View style={[AppStyles.card, styles.wrapperSpaceBlock1]}>
              <View style={styles.infoWrapper}>
                <NotificationAlert
                  type="error"
                  title="Error"
                  message="Update failed. Please try again."
                  showCloseIcon={true}
                  isVisible={showErrorAlert}
                  onClose={() => setShowErrorAlert(false)}
                  accessible={!dropdownFocused}
                  iconRef={errorIconRef}
                />
              </View>
              <View style={styles.frameParent1}>
                <View
                  style={styles.securityQuestionWrapper}
                  accessible={!dropdownFocused}
                  accessibilityElementsHidden={dropdownFocused}
                >
                  <View style={{flexDirection:'column'}}>
                  <SectionTitle
                    
                    accessibilityRole="header" accessibilityLevel={2} accessibilityHint="Header"
                  >
                    Security Question
                  </SectionTitle>
                  <HintText style={[{ marginVertical: 10}]} accessible={true} importantForAccessibility="yes" accessibilityRole="text" accessibilityLabel="Fields marked with asterisk are required">
                  {" "}
                  Fields marked with * are required.
                </HintText>
                </View>
                </View>

                <View style={[styles.textinputWrapper, styles.wrapperSpaceBlock1]}>
                  <View style={styles.textinput}>
                    <FieldTitle
                      accessible={true}
                      importantForAccessibility="yes"
                      accessibilityRole="text"
                      accessibilityLabel="Password Reset Question Required"
                    >
                      Password Reset Question *
                    </FieldTitle>
                    <SparkLightDropdown
                      items={securityQuestionsNew}
                      selectedValue={customSecurityQuestion}
                      onValueChange={handleSecurityQuestionChange}
                      isDropDownOpen={handleDropdownStateChange}
                      accessibilityLabel="Password Reset Question Required"
                      accessibilityHint="Double tap to open security question options"
                    />
                  </View>
                </View>
                {isCustomQuestionSelected && (
                  <View
                    style={[styles.textinputWrapper, styles.wrapperSpaceBlock1]}
                    accessible={!dropdownFocused}
                    accessibilityElementsHidden={dropdownFocused}
                  >
                    <View style={styles.textinput}>
                      <Controller
                        control={control}
                        name="securityQuestion"
                        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                          <SparkLightInput
                            ref={securityQuestionRef}
                            onBlur={onBlur}
                            label="Type your Question"
                            onChangeText={onChange}
                            value={value}
                            error={error?.message}
                            accessibilityLabel="Custom security question input"
                            accessibilityHint="Enter your custom security question"
                          />

                        )}
                      />
                    </View>
                  </View>
                )}
                <View
                  style={[styles.textinputWrapper, styles.wrapperSpaceBlock1]}
                >

                  {/* <FieldTitle
                      style={[{marginBottom:8}]}
                      accessible={true}
                      importantForAccessibility="yes"
                      accessibilityRole="text"
                      accessibilityLabel="Password Reset Answer Required"
                    >
                      Password Reset Answer *
                    </FieldTitle> */}
                  <Controller
                    control={control}
                    name="securityAnswer"
                    render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                      <SparkLightInput
                        ref={securityAnswerRef}
                        onBlur={onBlur}
                        label="Password Reset Answer *"
                        onChangeText={onChange}
                        value={value}
                        error={error?.message}
                        accessibilityLabel="Password Reset Answer"
                        accessibilityHint="Enter your answer to the security question"
                      />
                    )}
                  />
                </View>
              </View>
            </View>
          </View>
          <View style={styles.frameParent1} >
            <PrimaryButton
              title="Save"
              onPress={handleSubmit(handleSave, handleValidationError)}
              buttonType="submit"
            />
            <PrimaryButton
              title="Cancel"
              onPress={() => navigation.navigate("PasswordSecurity")}
              buttonType="cancel"
            />
          </View>

          <LoadingOverlay
            loading={loading}
            loadingTxt={loadingTxt}
            onRequestClose={() => setLoading(false)}
          />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapperSpaceBlock1: {
    paddingVertical: Padding.p_base,
    alignSelf: "stretch",
  },
  infoWrapper: {
    paddingHorizontal: Padding.p_5xl,
    alignSelf: "stretch",
  },
  bulletPoiint: {
    color: Color.sparklightGray1,
    fontFamily: FontFamily.RadioCanadaRegular,
    fontSize: FontSize.size_xs,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 19,
  },
  bulletPointContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  passwordFlexBox: {
    textAlign: "left",
    fontFamily: FontFamily.RadioCanadaRegular,
    color: Color.sparklightGray1,
  },
  firstTypo: {
    fontSize: FontSize.RadioCanadaSemiBold_size,
    textAlign: "left",
    fontFamily: FontFamily.RadioCanadaSemiBold,
    fontWeight: "600",
  },
  wrapperSpaceBlock: {
    paddingVertical: 0,
    paddingHorizontal: Padding.p_5xl,
    alignSelf: "stretch",
  },
  buttonsLayout: {
    width: '100%',
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: Padding.p_base,
    paddingHorizontal: 0,
    borderRadius: Border.br_11xs,
    height: 56,
  },
  makeTypo: {
    width: 282,
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.RadioCanadaRegular,
    textAlign: "center",
  },

  password: {
    fontSize: FontSize.size_3xl,
    lineHeight: 28,
  },
  passwordWrapper: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: Padding.p_5xl,
  },
  bullet: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginRight: 10,
  },
  firstName: {
    color: Color.sparklightGray1,
    fontSize: FontSize.RadioCanadaSemiBold_size,
    flex: 1,
  },
  eyeIcon: {
    width: 16,
    height: 16,
    overflow: "hidden",
  },
  show: {
    marginLeft: 6,
    color: Color.colorMidnightblue,
    lineHeight: 28,
  },
  eyeParent: {
    marginLeft: 8,
    alignItems: "center",
    flexDirection: "row",
  },
  firstNameParent: {
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "stretch",
  },
  textinput: {
    justifyContent: "center",
    alignSelf: "stretch",
  },
  textinputWrapper: {
    justifyContent: "center",
    paddingHorizontal: Padding.p_5xl,
  },
  itMustBe: {
    lineHeight: 19,
    fontSize: FontSize.size_xs,
  },
  frameParent: {
    alignSelf: "stretch",
  },
  frameChild: {
    height: 1,
    backgroundColor: Color.sparklightGray,
    alignSelf: "stretch",
  },
  rectangleWrapper: {
    marginTop: Padding.p_base,
  },
  securityQuestionWrapper: {
    paddingBottom: Padding.p_5xs,
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: Padding.p_5xl,
    alignSelf: "stretch",
  },
  firstName1: {
    color: Color.sparklightGray1,
    fontSize: FontSize.RadioCanadaSemiBold_size,
    alignSelf: "stretch",
  },
  frameParent1: {
    marginTop: 16,
    alignSelf: "stretch",
  },
  frameGroup: {
    paddingHorizontal: 0,
    borderWidth: 1,
    borderRadius: Border.br_11xs,
    paddingVertical: Padding.p_base,
    borderColor: Color.sparklightGray,
    borderStyle: "solid",
    backgroundColor: Color.sparklightWhite,
    overflow: "hidden",
  },
  makePayment: {
    color: Color.sparklightWhite,
  },
  buttons: {
    backgroundColor: Color.colorMidnightblue,
  },
  makePayment1: {
    color: Color.colorMidnightblue,
  },
  buttons1: {
    marginTop: 16,
    width: '100%',
  },
  passwordSecurityEditInner: {
    paddingVertical: Padding.p_5xl,
    paddingBottom: Padding.p_base,
    paddingHorizontal: Padding.p_base,
    overflow: "hidden",
    marginBottom: 300
  },
  passwordSecurityEdit: {
    flex: 1,
    backgroundColor: Color.colorWhitesmoke_200,
  }, BtnContainer: {
    backgroundColor: colors.sparklight_purple_blue,
    justifyContent: "center",
  },
  Btn: {
    color: colors.snow_white,
    fontFamily: FontFamily.RadioCanadaRegular,
    textAlign: "center",
    padding: 16,
    fontSize: 16,
  },
});

export default PasswordSecurityEdit;
