import React, { useState, useEffect, useRef } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  AccessibilityInfo,
} from "react-native";
import KeyboardAwareScrollView from "../common/customui/KeyboardAwareScrollView";
import { ScreenScroll } from "../common/customui/Screen";
import Touchable from "../common/customui/Touchable";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  FontFamily,
  Padding,
  Color,
  FontSize,
  Border,
} from "../../../GlobalStyles";
import {
  validatePassword,
  passwordTerms,
  securityQuestions,
  getPasswordPriorityHint,
} from "../utility/constant";
import SparkLightInput from "../common/customui/SparkLightInput";
import ProfileSettingsHeader from "../common/ProfileSettingsHeader";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../../redux/utils/LocalStorage";
import NotificationAlert from "../common/customui/NotificationAlert";
import { GetApiRequest, PutApiRequest , PostApiRequest} from "../../network/RestApiClient";
import { getEndpoint,ENDPOINTS } from "../../network/apis/endpoints/Endpoints";
import LoadingOverlay from "../common/customui/LoadingOverlay";
import { passwordSchema } from "../utility/validationSchema"; 
import PrimaryButton from "../common/customui/PrimaryButton";
import AppStyles from '../../styles/AppStyles';
import { SectionTitle,HintText } from "../common/customui/Typography";
const ChangePassword = () => {
  const navigation = useNavigation();
  const [isCustomQuestionSelected, setIsCustomQuestionSelected] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingTxt, setLoadingTxt] = useState("Please wait...");
  const [customSecurityQuestion, setCustomSecurityQuestion] = useState("");
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showValidationAlert, setShowValidationAlert] = useState(false);
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [securityQuestionsNew, setSecurityQuestionsNew] =
    useState(securityQuestions);
  const route = useRoute();
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profile || {});
  const profileDetailsfromStore = profile.profileDetails || {}; // Defaulting to an empty array if userList is undefined
  const [profileDetails, setLocalProfile] = useState(profileDetailsfromStore);
  const scrollViewRef = useRef(null);
  const passwordInputRef = useRef(null);
  const [accessibilityLabelInput, setAccessibilityLabelInput] = useState(undefined);

  const handleSavePass = (formData) => {
    setLoading(true);
    if (formData?.newPassword) {
      updateUserPassword(formData.newPassword);
    }
  };

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(passwordSchema(isCustomQuestionSelected)),
    defaultValues: profileDetails,
  });

  // Use useWatch within the component body to subscribe to changes
  const newPassword = useWatch({
    control,
    name: "newPassword",
  });

  const handleValidationError = (errors) => {
    scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
    if (errors?.newPassword) {
      passwordInputRef.current?.focus();
    }
  };

  const getSecurityQuestions = async () => {
    const storedUser = await getUser();
    const userName =
      profileDetails?.userName ||
      storedUser?.userInfo?.userName ||
      storedUser?.userName ||
      "";

    if (!userName.trim()) {
      console.warn("Skipping security questions API call: userName is missing");
      return;
    }

    const endpointUrl = getEndpoint(ENDPOINTS.SECURITY_QUESTIONS, { userName });
    GetApiRequest(
      endpointUrl,
      (res) => {
        if (res) {
          setSecurityQuestionsNew(res);
          checkCustomSecurityQuestion(res);
        }
      },
      (error) => {
        console.warn(error);
      }
    );
  };

  const updateUserPassword = async (newPassword) => {
    try {
      const user = await getUser();

      // Construct the request URL based on the user's billing type
      const endpointUrl = getEndpoint(ENDPOINTS.RESET_PASSWORD, {
        accountNumber: user.userInfo?.accountNumber,
        userName: user.userInfo?.userName || user.userName,
      });

      const body = { newPass:newPassword,confirmNewPass:newPassword };

      setLoading(true);

      // Call the PUT API request
      PostApiRequest(
        endpointUrl,
        body,
        (res) => {
          setLoading(false);
          if(res.code=="204" || res.code=="200" ){
          navigation.navigate("PasswordSecurity", {
            updateSuccess: true,
            isPassword: true,
          });
        } else if(res===true  ){
         navigation.navigate("PasswordSecurity", {
            updateSuccess: true,
            isPassword: true,
          });
        }else{
          setShowErrorAlert(true); // Show an error alert if the response code is not 200 or 204  
        }
      },
        (error) => {
          setLoading(false);
           console.warn("Error updating password", error);

          // Handle specific errors, such as '204 No Content' or others
          if (error.code == "204") {
            navigation.navigate("PasswordSecurity", {
              updateSuccess: true,
              isPassword: true,
            });
          } else {
            setShowErrorAlert(true); // Show an error alert for other errors
          }
        }
      );
    } catch (err) {
      setLoading(false);
      console.warn("Error retrieving user information", err);
      setShowErrorAlert(true); // Show an error alert if getUser fails
    }
  };

  useEffect(() => {
    setLoading(false);
  }, [profileDetails, reset]);

  const checkCustomSecurityQuestion = (securityQuestions) => {
    const storedSecurityQuestion = profileDetails.securityQuestion;
    const isCustomQuestion =
      storedSecurityQuestion &&
      !securityQuestionsNew.includes(storedSecurityQuestion);
    setIsCustomQuestionSelected(isCustomQuestion);
    if (isCustomQuestion) {
      setCustomSecurityQuestion("Add your own question");
    } else {
      setCustomSecurityQuestion(storedSecurityQuestion);
    }
  };

  useEffect(() => {
    getSecurityQuestions();
  }, []);

  useEffect(() => {
    if (route.params?.updateFailed) {
      setShowErrorAlert(true);
      scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
      navigation.setParams({ updateFailed: undefined });
    }
  }, [route.params?.updateFailed, navigation, dispatch]);

  return (
    <View
      style={styles.passwordSecurityEdit}
      accessibilityElementsHidden={isDropDownOpen}
      importantForAccessibility={isDropDownOpen ? "no-hide-descendants" : "no"}
    >
      <ProfileSettingsHeader
        accessibilityElementsHidden={isDropDownOpen}
        importantForAccessibility={
          isDropDownOpen ? "no-hide-descendants" : "no"
        }
        title="Edit Password"
        onPressBack={() => navigation.navigate("PasswordSecurity")}
      />
      <ScreenScroll ScrollComponent={KeyboardAwareScrollView} ref={scrollViewRef}>
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
                />
                <NotificationAlert
                  type="error"
                  title="Error"
                  message="Please enter valid information to continue."
                  showCloseIcon={true}
                  isVisible={showValidationAlert}
                  onClose={() => setShowValidationAlert(false)}
                />
              </View>
              <View style={[styles.passwordWrapper, styles.wrapperSpaceBlock1]}>
                <View style={{ flexDirection: "column" }}>
                  <SectionTitle
                    accessibilityRole="header"
                    accessibilityLevel={2}
                  >
                    Password
                  </SectionTitle>
                  <HintText
                    style={[{ marginTop: 10, marginVertical: 5}]}
                    accessible={true}
                    importantForAccessibility="yes"
                    accessibilityRole="text"
                    accessibilityLabel="Fields marked with asterisk are required"
                  >
                    {" "}
                    Fields marked with * are required.
                  </HintText>
                </View>
              </View>
              <View
                style={styles.frameParent}
                accessibilityElementsHidden={isDropDownOpen}
                importantForAccessibility={
                  isDropDownOpen ? "no-hide-descendants" : "no"
                }
              >
                <View
                  style={[styles.textinputWrapper, styles.wrapperSpaceBlock1]}
                >
                  <Controller
                    control={control}
                    name="newPassword"
                    render={({
                      field: { onChange, onBlur, value },
                      fieldState: { error },
                    }) => (
                      <>
                        <SparkLightInput
                          ref={passwordInputRef}
                          placeholder="New Password"
                          onBlur={onBlur}
                          label={"New Password *"}
                          accessibilityHint="Enter your new password"
                          accessibilityLabel={"New Password"}
                          onChangeText={onChange}
                          value={value}
                          secure={true}
                          error={error?.message}
                          errorHint={getPasswordPriorityHint(value, profileDetails.userName)}
                        />
                        <View
                          accessible={true}
                          accessibilityRole="text"
                          accessibilityLabel={`Password requirements: ${passwordTerms.join('. ')}`}
                          style={[
                            styles.passwordFlexBox,
                            { marginTop: Padding.p_base },
                          ]}
                        >
                          {validatePassword(value, profileDetails.userName).map(
                            (isValid, index) => (
                              <View
                                key={`point-${index}`}
                                style={styles.bulletPointContainer}
                              >
                                <View style={{ marginTop: 7 }}>
                                  <View
                                    style={[
                                      styles.bullet,
                                      {
                                        backgroundColor: isValid
                                          ? Color.sparklightGreen
                                          : Color.colorGray_200,
                                      },
                                    ]}
                                  />
                                </View>
                                <Text
                                  style={styles.bulletPoiint}
                                >
                                  {passwordTerms[index]}
                                </Text>
                              </View>
                            )
                          )}
                        </View>
                      </>
                    )}
                  />
                </View>
              </View>
            </View>
          </View>
         <View
            style={styles.frameParent1}
            
          >
            <PrimaryButton
              buttonType={"submit"}
              title={"Save"}
             onPress={handleSubmit(handleSavePass, handleValidationError)}
              disabled={loading}
            />

            <PrimaryButton
              buttonType={"cancel"}
              title={"Cancel"}
              onPress={() => navigation.goBack()}
            />
          </View>

          <LoadingOverlay
            loading={loading}
            loadingTxt={loadingTxt}
            onRequestClose={() => {
              setLoading(false);
            }}
          />
        </View>
      </ScreenScroll>
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
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: 19,
  },
  bulletPointContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 5,
    marginRight: 24,
  },
  passwordFlexBox: {
    textAlign: "left",
    fontFamily: FontFamily.RadioCanadaRegular,
    color: Color.sparklightGray1,
  },
  buttonsLayout: {
    width: "100%",
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
  textinputWrapper: {
    justifyContent: "center",
    paddingHorizontal: Padding.p_5xl,
  },
  frameParent: {
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
    width: "100%",
  },
  passwordSecurityEditInner: {
    paddingVertical: Padding.p_5xl,
    paddingBottom: Padding.p_base,
    paddingHorizontal: Padding.p_base,
    overflow: "hidden",
    marginBottom: 300,
  },
  passwordSecurityEdit: {
    flex: 1,
    backgroundColor: Color.Gray300,
  },
});

export default ChangePassword;
