import React, { useState, useEffect, useRef } from "react";
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { StyleSheet, Text, Pressable, View, ScrollView, AccessibilityInfo } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { FontFamily, Padding, Color, FontSize, Border } from "../../../GlobalStyles";
import { securityQuestions } from "../utility/constant";
import SparkLightInput from '../common/customui/SparkLightInput';
import SparkLightDropdown from '../common/customui/SparkLightDropdown';
import ProfileSettingsHeader from '../common/ProfileSettingsHeader';
import { useDispatch, useSelector } from 'react-redux';
import NotificationAlert from '../common/customui/NotificationAlert';
import { updateProfileSecurity } from '../../redux/actions/ProfileActionSuite';
import { GetApiRequest} from "../../network/APIClient";
import LoadingOverlay from "../common/customui/CustomLoading";
import { securitySchema } from '../utility/validationSchema'; // Update the path as necessary
import colors from "../../res/Colors";
import AppStyles from "../common/styles/AppStyles";
const announceForAccessibility = (message) => {
  AccessibilityInfo.announceForAccessibility(message);
};
const PasswordSecurityEdit = () => {

  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const scrollViewRef = useRef(null);
  const mainContentRef = useRef(null);
  const [isCustomQuestionSelected, setIsCustomQuestionSelected] = useState(false);
  const [customSecurityQuestion, setCustomSecurityQuestion] = useState('');
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showValidationAlert, setShowValidationAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingTxt, setLoadingTxt] = useState("Please wait...");
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [dropdownFocused, setDropdownFocused] = useState(false);
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
    announceForAccessibility(isOpen ?
      "Security question dropdown opened. Select a question." :
      "Security question dropdown closed."
    );
  };
  const handleSecurityQuestionChange = (itemValue) => {
    setLocalProfile({
      ...profileDetails,
      securityQuestion: itemValue === "Add your own question" ? '' : itemValue
    });
    setCustomSecurityQuestion(itemValue);
    setIsDropDownOpen(false);
    setDropdownFocused(false);
    setIsCustomQuestionSelected(itemValue === "Add your own question");
    announceForAccessibility(`Selected security question: ${itemValue}`);
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





  const handleValidationError = () => {
    scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
    setShowValidationAlert(true);
    announceForAccessibility("Please fix validation errors before saving");
  };


  const getSecurityQuestions=()=>{
    const request = 'api/securityquestions/';
    GetApiRequest(
      request,
      (res) => {
        if (res) {
          setSecurityQuestionsNew(res);
          checkCustomSecurityQuestion(res);
        }

      },
      (error) => console.log(error)
    );
  };

  const checkCustomSecurityQuestion = (questions) => {
    const storedQuestion = profileDetails.securityQuestion;
     setCustomSecurityQuestion(storedQuestion);
  };

  useEffect(() => {
    // Reset the form with the updated profile details
    //reset(profileDetails);
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
      <ScrollView ref={scrollViewRef} >
        <View style={styles.passwordSecurityEditInner}>
          <View style={styles.frameParent}>
            <View style={[styles.frameGroup, styles.wrapperSpaceBlock1]}>
              <View style={styles.infoWrapper}>
                <NotificationAlert
                  type="error"
                  title="Error"
                  message="Password and security question update failed."
                  showCloseIcon={true}
                  isVisible={showErrorAlert}
                  onClose={() => setShowErrorAlert(false)}
                  accessible={!dropdownFocused}
                />
              </View>
              <View style={styles.frameParent1}>
                <View
                  style={styles.securityQuestionWrapper}
                  accessible={!dropdownFocused}
                  accessibilityElementsHidden={dropdownFocused}
                >
                  <View style={{flexDirection:'column'}}>
                  <Text
                    style={[styles.password, styles.passwordFlexBox]}
                    accessibilityRole="header"
                  >
                    Security Question
                  </Text>
                  <Text style={[AppStyles.requiredField]} accessible={true} accessibilityRole="text" accessibilityLabel="Required fields information. Fields marked with asterisk are required">
                  {" "}
                  Fields marked with * are required.
                </Text>
                </View>
                </View>

                <View style={[styles.textinputWrapper, styles.wrapperSpaceBlock1]}>
                  <View style={styles.textinput}>
                    <Text
                      style={[styles.firstName1, styles.firstTypo]}
                      accessible={!dropdownFocused}
                    >
                      Password Reset Question *
                    </Text>
                    <SparkLightDropdown
                      items={securityQuestionsNew}
                      selectedValue={customSecurityQuestion}
                      onValueChange={handleSecurityQuestionChange}
                      isDropDownOpen={handleDropdownStateChange}
                      accessibilityLabel="Select security question"
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
                  <Controller
                    control={control}
                    name="securityAnswer"
                    render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                      <SparkLightInput
                        onBlur={onBlur}
                        onChangeText={onChange}
                        label="Password Reset Answer *"
                        value={value}
                        error={error?.message}
                        accessibilityLabel="Security question answer input"
                        accessibilityHint="Enter your answer to the security question"
                      />
                    )}
                  />
                </View>
              </View>
            </View>
          </View>
          <View
            style={styles.frameParent1}
          >
            <Pressable
              style={[styles.buttons, styles.buttonsLayout]}
              onPress={handleSubmit(handleSave, handleValidationError)}
              accessibilityLabel="Save changes"
              accessibilityRole="button"
              accessible={!dropdownFocused}
            >
              <Text style={[styles.makePayment, styles.makeTypo]}> Save </Text>
            </Pressable>
            <Pressable
              style={[styles.buttons1, styles.buttonsLayout]}
              onPress={() => navigation.navigate("PasswordSecurity")}
              accessibilityLabel="Cancel and return"
              accessibilityRole="button"
              accessible={!dropdownFocused}
            >
              <Text style={[styles.makePayment1, styles.makeTypo]}> Cancel</Text>
            </Pressable>
          </View>

          <LoadingOverlay
            loading={loading}
            loadingTxt={loadingTxt}
            onRequestClose={() => setLoading(false)}
          />
        </View>
      </ScrollView>
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
    fontFamily: FontFamily.openSansRegular,
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
    fontFamily: FontFamily.openSansRegular,
    color: Color.sparklightGray1,
  },
  firstTypo: {
    fontSize: FontSize.textXsSemibold_size,
    textAlign: "left",
    fontFamily: FontFamily.openSansSemiBold,
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
    fontFamily: FontFamily.openSansRegular,
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
    fontSize: FontSize.textXsSemibold_size,
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
    fontSize: FontSize.textXsSemibold_size,
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
    fontFamily: FontFamily.openSansRegular,
    textAlign: "center",
    padding: 16,
    fontSize: 16,
  },
});

export default PasswordSecurityEdit;
