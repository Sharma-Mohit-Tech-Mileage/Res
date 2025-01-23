import React, { useEffect, useState, useRef } from "react";
import { Image, StyleSheet, Text, Pressable, View, ScrollView, Modal, ActivityIndicator, AccessibilityInfo } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FontFamily, Padding, Color, Border, FontSize } from "../../../GlobalStyles";
import ProfileSettingsHeader from "../common/ProfileSettingsHeader";
import SparkLightInput from "../common/customui/SparkLightInput";
import SparkLightDropdown from "../common/customui/SparkLightDropdown";
import { useDispatch } from "react-redux";
import { getUserType } from "../utility/constant";
import { userSchema, userSchemaNoPass } from "../utility/validationSchema";
import { addNewUser, editNewUser } from "../../redux/actions/ProfileActionSuite";
import { validatePassword, securityQuestions, passwordTerms } from "../utility/constant";
import NotificationError from "../common/customui/NotificationError";
import WarningIcon from "../../../assets/alert-triangle.png";
import colors from "../../res/Colors";

const announceForAccessibility = (message) => {
  AccessibilityInfo.announceForAccessibility(message);
};

const UserManagementEdit = ({ route }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const scrollViewRef = useRef(null);
  const mainContentRef = useRef(null);

  var user = route.params?.User;
  var isnewUser = false;

  if (user == undefined) {
    user = {
      accountNumber: route.params?.acno,
      portalAdminRole: "None",
      billingRole: "None",
      paymentsRole: "None",
      ticketsRole: "None",
      userName: "",
      firstName: "",
      lastName: "",
      memberType: "Admin",
      securityAnswer: "",
      newPassword: "",
      securityQuestion: "",
    };
    isnewUser = true;
  }

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [isCustomQuestionSelected, setIsCustomQuestionSelected] = useState(false);
  const [customSecurityQuestion, setCustomSecurityQuestion] = useState("");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [userName, setUserName] = useState(user?.userName || "");
  const [showError, setShowError] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showValidationAlert, setShowValidationAlert] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [profileDetails, setProfileDetails] = useState(user);
  const [loading, setLoading] = useState(false);
  const [pass, setPass] = useState('');
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [dropdownFocused, setDropdownFocused] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver((isnewUser || pass?.target?.value.length > 0) ? 
      userSchema(isCustomQuestionSelected) : 
      userSchemaNoPass(isCustomQuestionSelected)),
    defaultValues: profileDetails,
  });

  const handleSecurityQuestionChange = (itemValue) => {
    setProfileDetails({
      ...profileDetails,
      securityQuestion: itemValue === "Add your own question" ? "" : itemValue,
    });
    setCustomSecurityQuestion(itemValue);
    setIsDropDownOpen(false);
    setDropdownFocused(false);
    setIsCustomQuestionSelected(itemValue === "Add your own question");
    
    announceForAccessibility(`Selected security question: ${itemValue}`);
  };

  const handleDropdownStateChange = (isOpen) => {
    setIsDropDownOpen(isOpen);
    setDropdownFocused(isOpen);
    
    announceForAccessibility(isOpen ? 
      "Security question dropdown opened" : "Security question dropdown closed"
    );
  };

  const handleSave = (formData) => {
    setLoading(true);
    formData.securityQuestion = isCustomQuestionSelected ? 
      formData.securityQuestion : 
      customSecurityQuestion;

    const saveCallback = (isSuccess, msg) => {
      setLoading(false);
      if (!isSuccess) {
        setErrorMsg(msg?.error);
        scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: false });
        announceForAccessibility("Save failed. Please check the error message.");
      } else {
        announceForAccessibility("Changes saved successfully");
        setTimeout(() => {
          navigation.navigate('UserManagement', { isSuccess: true });
        }, 1000);
      }
    };

    if (route.params?.User) {
      dispatch(editNewUser(formData, saveCallback));
    } else {
      dispatch(addNewUser(formData, saveCallback));
    }
  };

  const handleOnChangeText = (value, onChange) => {
    onChange(value);
    setPass(value);
  };

  const handleValidationError = () => {
    scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
    setShowValidationAlert(true);
    announceForAccessibility("Please fix the validation errors before saving");
  };

  useEffect(() => {
    if (errorMsg) {
      setShowError(true);
    }
  }, [errorMsg]);

  useEffect(() => {
    if (!isnewUser) {
      const storedSecurityQuestion = profileDetails?.securityQuestion;
      const isCustomQuestion = securityQuestions.includes(storedSecurityQuestion);
      setIsCustomQuestionSelected(!isCustomQuestion);
      setCustomSecurityQuestion(!isCustomQuestion ? "Add your own question" : storedSecurityQuestion);
    }
  }, []);

  const LoadingOverlay = () => (
    <Modal
      visible={loading}
      transparent
      animationType="fade"
      onRequestClose={() => setLoading(false)}
      accessible={true}
      accessibilityLabel="Loading overlay"
    >
      <View style={styles.overlay}>
        <View style={styles.alertContainer}>
          <ActivityIndicator size="large" color={Color.colorGainsboro_200} />
          <Text style={styles.loadingTxt}>Saving Data..</Text>
        </View>
      </View>
    </Modal>
  );

  return (
    <View 
      style={styles.userManagementEdit}
      ref={mainContentRef}
      accessible={false}
    >
      <View accessibilityRole="header" accessible={true}>
        <ProfileSettingsHeader
          title={isnewUser ? "Add Admin User" : "Edit User"}
          onPressBack={() => navigation.navigate("UserManagement")}
          accessibilityLabel={`${isnewUser ? "Add Admin User" : "Edit User"} screen header`}
          accessibilityRole="header"
          accessible={true}
          importantForAccessibility="yes"
        />
      </View>

      <ScrollView ref={scrollViewRef}>
        <View style={styles.userManagementEditInner} accessible={false}>
          <NotificationError
            type="error"
            title="Error"
            message={errorMsg}
            showCloseIcon={true}
            isVisible={showError}
            onClose={() => setShowError(false)}
            accessible={true}
          />

          {false && (
            <View accessible={false}>
              <Text
                style={[styles.yourSavedCard, styles.taylorTypo, { fontWeight: "800" }]}
                accessible={true}
                accessibilityRole="header"
                accessibilityLabel="Admin"
              >
                Admin
              </Text>
              <Text
                style={[styles.yourSavedCard, styles.taylorTypo, { paddingBottom: 15 }]}
                accessible={true}
                accessibilityLabel="Admin role description: An admin can manage this account but is not the primary contact for this account."
              >
                An admin can manage this account but is not the primary contact for this account.
              </Text>
            </View>
          )}

          <View style={styles.frameWrapper} accessible={false}>
            <View style={[styles.frameGroup, styles.textinputWrapperSpaceBlock]} accessible={false}>
              <View style={styles.generalInformationWrapper} accessible={false}>
                <Text 
                  style={[styles.generalInformation, styles.firstClr]}
                  accessible={true}
                  accessibilityRole="header"
                >
                  General Information
                </Text>
              </View>

              <View style={styles.frameWrapper} accessible={false}>
                <View style={styles.frameWrapper} accessible={false}>
                  <View style={[styles.textinputWrapper, styles.textinputWrapperSpaceBlock]} accessible={false}>
                    <View style={styles.textinput} accessible={false}>
                      <Controller
                        control={control}
                        name="firstName"
                        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                          <SparkLightInput
                            onBlur={onBlur}
                            label="First Name"
                            placeholder="Enter your First Name"
                            onChangeText={onChange}
                            value={value}
                            error={error?.message}
                            accessibilityLabel="First name input"
                            accessible={true}
                          />
                        )}
                      />
                    </View>
                  </View>

                  <View style={[styles.textinputWrapper, styles.textinputWrapperSpaceBlock]} accessible={false}>
                    <View style={styles.textinput} accessible={false}>
                      <Controller
                        control={control}
                        name="lastName"
                        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                          <SparkLightInput
                            onBlur={onBlur}
                            label="Last Name"
                            placeholder="Enter your Last Name"
                            onChangeText={onChange}
                            value={value}
                            error={error?.message}
                            accessibilityLabel="Last name input"
                            accessible={true}
                          />
                        )}
                      />
                    </View>
                  </View>

                  <View style={[styles.textinputWrapper, styles.textinputWrapperSpaceBlock]} accessible={false}>
                    <View style={styles.textinput} accessible={false}>
                      <Controller
                        control={control}
                        name="userName"
                        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                          <SparkLightInput
                            onBlur={onBlur}
                            label="Username"
                            placeholder={!isnewUser ? "" : "Enter your Username"}
                            onChangeText={onChange}
                            editable={isnewUser}
                            value={value}
                            error={error?.message}
                            accessibilityLabel="Username input"
                            accessible={true}
                          />
                        )}
                      />
                    </View>
                  </View>

                  <View style={styles.frameParent1} accessible={false}>
                    <View style={styles.contactInformationWrapper} accessible={false}>
                      <Text 
                        style={[styles.generalInformation, styles.firstClr]}
                        accessible={true}
                        accessibilityRole="header"
                      >
                        Password
                      </Text>
                    </View>

                    <View style={styles.frameParent} accessible={false}>
                      <View style={[styles.textinputWrapper, styles.wrapperSpaceBlock1]} accessible={false}>
                        <Controller
                          control={control}
                          name="newPassword"
                          render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                            <>
                              <SparkLightInput
                                placeholder="New Password"
                                onBlur={onBlur}
                                label={isnewUser ? "New Password" : "New Password (Optional)"}
                                onChangeText={(value) => handleOnChangeText(value, onChange)}
                                value={value}
                                secure={true}
                                error={error?.message}
                                accessibilityLabel="Password input"
                                accessible={true}
                              />
                              <View 
                                style={[styles.passwordFlexBox, { marginTop: Padding.p_base }]}
                                accessibilityLabel="Password requirements"
                              >
                                {validatePassword(value, profileDetails.userName).map((isValid, index) => (
                                  <View key={`point-${index}`} style={styles.bulletPointContainer} accessible={true}>
                                    <View style={{ marginTop: 7 }} >
                                      <View
                                        style={[styles.bullet, {
                                          backgroundColor: isValid ? 
                                            Color.sparklightGreen : 
                                            Color.colorGray_200,
                                        }]}
                                      />
                                    </View>
                                    <Text 
                                      style={styles.bulletPoint}
                                      accessibilityLabel={`${passwordTerms[index]} ${isValid ? 'met' : 'not met'}`}
                                    >
                                      {passwordTerms[index]}
                                    </Text>
                                  </View>
                                ))}
                              </View>
                            </>
                          )}
                        />
                      </View>
                    </View>

                    <View style={styles.frameParent1} accessible={false}>
                      <View style={styles.securityQuestionWrapper} accessible={false}>
                        <Text
                          style={[styles.generalInformation, styles.firstClr]}
                          accessible={true}
                          accessibilityRole="header"
                        >
                          Security Question
                        </Text>
                      </View>

                      <View style={[styles.textinputWrapper, styles.wrapperSpaceBlock1]} accessible={false}>
                        <View style={styles.textinput} accessible={false}>
                          <Text 
                            style={[styles.firstName1, styles.firstTypo, { 
                              color: (showValidationAlert && customSecurityQuestion.length == 0) ? 
                                colors.sparklight_red : Color.sparklightGray1,
                              fontWeight: (showValidationAlert && customSecurityQuestion.length == 0) ? 
                                '700' : '400' 
                            }]}
                            accessible={true}
                          >
                            Password Reset Question
                          </Text>
                          <SparkLightDropdown
                            items={securityQuestions}
                            selectedValue={customSecurityQuestion}
                            onValueChange={handleSecurityQuestionChange}
                            isDropDownOpen={handleDropdownStateChange}
                            accessibilityLabel="Select security question"
                            accessibilityHint="Double tap to open dropdown"
                            accessibilityRole="button"
                            accessible={true}
                            importantForAccessibility="yes"
                          />
                          {(showValidationAlert && customSecurityQuestion.length == 0) && (
                            <View 
                              style={styles.errorContainer}
                              accessible={true}
                              accessibilityLabel="Error: Password Reset Question is required"
                            >
                              <Image source={WarningIcon}style={styles.errorIcon} 
                              accessible={false}
                            />
                            <Text style={styles.errorText}>
                              Password Reset Question is required
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>

                    {isCustomQuestionSelected && (
                      <View style={[styles.textinputWrapper, styles.wrapperSpaceBlock1]} accessible={false}>
                        <View style={styles.textinput} accessible={false}>
                          <Controller
                            control={control}
                            name="securityQuestion"
                            render={({
                              field: { onChange, onBlur, value },
                              fieldState: { error },
                            }) => (
                              <SparkLightInput
                                onBlur={onBlur}
                                label="Type your Question"
                                onChangeText={onChange}
                                value={value}
                                error={error?.message}
                                accessibilityLabel="Custom security question input"
                                accessibilityHint="Enter your custom security question"
                                accessible={true}
                              />
                            )}
                          />
                        </View>
                      </View>
                    )}

                    <View style={[styles.textinputWrapper, styles.wrapperSpaceBlock1]} accessible={false}>
                      <Controller
                        control={control}
                        name="securityAnswer"
                        render={({
                          field: { onChange, onBlur, value },
                          fieldState: { error },
                        }) => (
                          <SparkLightInput
                            onBlur={onBlur}
                            onChangeText={onChange}
                            label="Password Reset Answer"
                            value={value}
                            error={error?.message}
                            accessibilityLabel="Security answer input"
                            accessibilityHint="Enter your answer to the security question"
                            accessible={true}
                          />
                        )}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.frameChild1SpaceBlock} accessible={false}>
            <Pressable
              style={[styles.buttons1, styles.buttonsLayout]}
              onPress={handleSubmit(handleSave, handleValidationError)}
              accessibilityLabel="Save changes"
              accessibilityRole="button"
              accessible={true}
              importantForAccessibility="yes"
            >
              <Text style={[styles.makePayment1, styles.makeTypo]} accessibilityElementsHidden={true}>Save</Text>
            </Pressable>

            <Pressable
              style={[styles.buttons2, styles.buttonsLayout]}
              onPress={() => navigation.navigate("UserManagement")}
              accessibilityLabel="Cancel changes"
              accessibilityRole="button"
              accessible={true}
              importantForAccessibility="yes"
            >
              <Text style={[styles.makePayment2, styles.makeTypo]} accessibilityElementsHidden={true}>Cancel</Text>
            </Pressable>
          </View>
          <LoadingOverlay />
        </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  textinputWrapperSpaceBlock: {
    paddingVertical: Padding.p_base,
    alignSelf: "stretch",
  },
  firstClr: {
    color: Color.sparklightGray1,
    textAlign: "left",
  },
  firstName1: {
    color: Color.sparklightGray1,
    fontSize: FontSize.textXsSemibold_size,
    alignSelf: "stretch",
  },
  bulletPointContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 5,
  },
  bulletPoint: {
    marginRight: 10,
    color: Color.sparklightGray1,
    fontWeight: "400",
  },
  wrapperBorder: {
    paddingVertical: Padding.p_5xs,
    paddingHorizontal: Padding.p_xs,
    height: 40,
    borderColor: Color.colorGray_100,
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: Border.br_11xs,
  },
  taylorTypo: {
    color: Color.colorGray_200,
    fontFamily: FontFamily.openSansRegular,
    textAlign: "left",
  },
  passwordFlexBox: {
    textAlign: "left",
    fontFamily: FontFamily.openSansRegular,
    color: Color.sparklightDarkGray,
    flex: 1,
  },
  rightIconLayout: {
    height: 18,
    width: 18,
    overflow: "hidden",
  },
  wrapperSpaceBlock: {
    paddingVertical: 0,
    paddingHorizontal: Padding.p_5xl,
    alignSelf: "stretch",
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
    fontFamily: FontFamily.openSansRegular,
    textAlign: "center",
  },
  frameChild1SpaceBlock: {
    marginTop: 24,
    alignSelf: "stretch",
  },
  securityQuestionWrapper: {
    paddingBottom: Padding.p_5xs,
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: Padding.p_5xl,
    alignSelf: "stretch",
  },
  makeTypo: {
    width: 282,
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.openSansRegular,
    textAlign: "center",
  },
  frameParent1: {
    marginTop: 16,
    alignSelf: "stretch",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  alertContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 5,
    width: "40%",
  },
  loadingTxt: {
    color: Color.sparklightGray1,
    textAlign: "center",
    fontFamily: FontFamily.openSansRegular,
    fontSize: 22,
    fontStyle: "normal",
    fontWeight: "400",
  },
  generalInformation: {
    fontSize: FontSize.size_3xl,
    textAlign: "left",
    fontFamily: FontFamily.openSansRegular,
    lineHeight: 28,
    fontWeight: "400",
    flex: 1,
  },
  generalInformationWrapper: {
    paddingTop: Padding.p_base,
    paddingBottom: Padding.p_5xs,
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: Padding.p_5xl,
    alignSelf: "stretch",
  },
  firstName: {
    fontSize: FontSize.textXsSemibold_size,
    textAlign: "left",
    fontFamily: FontFamily.openSansSemiBold,
    fontWeight: "600",
  },
  taylor: {
    fontSize: FontSize.size_base,
    color: Color.colorGray_200,
  },
  taylorWrapper: {
    marginTop: 8,
    justifyContent: "center",
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
  creditCardWill: {
    fontWeight: "700",
    fontFamily: FontFamily.interBold,
    color: Color.sparklightBrightPurple,
    fontSize: FontSize.textXsSemibold_size,
    textAlign: "left",
  },
  yourSavedCard: {
    marginTop: 8,
    fontSize: FontSize.textXsSemibold_size,
    alignSelf: "stretch",
  },
  makePayment: {
    color: Color.colorMidnightblue,
    fontSize: FontSize.textXsSemibold_size,
    fontFamily: FontFamily.openSansRegular,
    textAlign: "center",
  },
  buttons: {
    padding: Padding.p_base,
    marginTop: 8,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Border.br_11xs,
    height: 32,
    display: "none",
    backgroundColor: Color.colorWhitesmoke_200,
  },
  creditCardWillExpireSoonParent: {
    marginLeft: 10,
    flex: 1,
  },
  rightActionableParent: {
    flexDirection: "row",
    flex: 1,
  },
  rightActionableIcon1: {
    marginLeft: 10,
    display: "none",
  },
  bannerWarning: {
    borderTopRightRadius: Border.br_11xs,
    borderBottomRightRadius: Border.br_11xs,
    padding: Padding.p_3xs,
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: Color.sparklightWhite,
    flex: 1,
  },
  notifications: {
    marginTop: 8,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: Color.sparklightGray,
    borderStyle: "solid",
    borderRadius: Border.br_11xs,
    alignSelf: "stretch",
  },
  frameWrapper: {
    alignSelf: "stretch",
  },
  frameChild: {
    height: 1,
    backgroundColor: Color.sparklightGray,
    alignSelf: "stretch",
    marginBottom: Padding.p_base,
  },
  rectangleWrapper: {
    marginTop: 16,
  },
  contactInformationWrapper: {
    paddingBottom: Padding.p_5xs,
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: Padding.p_5xl,
    alignSelf: "stretch",
  },
  itMustBe: {
    lineHeight: 19,
    fontSize: FontSize.textXsSemibold_size,
  },
  itMustBeDifferentThanYourWrapper: {
    alignItems: "center",
    flexDirection: "row",
  },
  favoriteAuthor: {
    fontSize: FontSize.size_base,
    color: Color.colorGray_200,
    flex: 1,
  },
  chevronDownIcon: {
    marginLeft: 10,
    overflow: "hidden",
  },
  favoriteAuthorParent: {
    marginTop: 8,
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "stretch",
  },
  textinputWrapper4: {
    justifyContent: "center",
    paddingHorizontal: Padding.p_5xl,
    display: "none",
  },
  frameGroup: {
    paddingHorizontal: 0,
    paddingVertical: Padding.p_base,
    borderWidth: 1,
    borderColor: Color.sparklightGray,
    borderStyle: "solid",
    backgroundColor: Color.sparklightWhite,
    borderRadius: Border.br_11xs,
    overflow: "hidden",
  },
  makePayment1: {
    color: Color.sparklightWhite,
  },
  buttons1: {
    backgroundColor: Color.colorMidnightblue,
  },
  makePayment2: {
    color: Color.colorMidnightblue,
  },
  buttons2: {
    marginTop: 16,
    backgroundColor: Color.colorWhitesmoke_200,
  },
  userManagementEditInner: {
    padding: Padding.p_base,
    marginBottom: 200,
  },
  userManagementEdit: {
    flex: 1,
    backgroundColor: Color.colorWhitesmoke_200,
  },
  wrapperSpaceBlock1: {
    paddingVertical: Padding.p_base,
    alignSelf: "stretch",
  },
  frameParent: {
    alignSelf: "stretch",
  },
  bullet: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginRight: 10,
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
  },
});

export default UserManagementEdit;