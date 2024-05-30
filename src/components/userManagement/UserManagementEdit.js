import React, { useEffect, useState, useRef } from "react";
import {
  Image,
  StyleSheet,
  Text,
  Pressable,
  View,
  ScrollView,
  Modal,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  FontFamily,
  Padding,
  Color,
  Border,
  FontSize,
} from "../../../GlobalStyles";
import ProfileSettingsHeader from "../common/ProfileSettingsHeader";
import SparkLightInput from "../common/customui/SparkLightInput";
import SparkLightDropdown from "../common/customui/SparkLightDropdown";
import { useDispatch } from "react-redux";
import { getUserType } from "../utility/constant";
import { userSchema,userSchemaNoPass } from "../utility/validationSchema";

import {
  addNewUser,
  editNewUser,
} from "../../redux/actions/ProfileActionSuite";
import {
  validatePassword,
  securityQuestions,
  passwordTerms,
} from "../utility/constant";
import NotificationError from "../common/customui/NotificationError";

const UserManagementEdit = ({ route }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
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
  } else {
    isnewUser = false;
  }

  //console.log('NN',(user?.securityQuestion === "Add your own question"))

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [isCustomQuestionSelected, setIsCustomQuestionSelected] =
    useState(false);
  const [customSecurityQuestion, setCustomSecurityQuestion] = useState("");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [userName, setUserName] = useState(user?.userName || "");
  const [showError, setShowError] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showValidationAlert, setShowValidationAlert] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [profileDetails, setProfileDetails] = useState(user);
  const [loading, setLoading] = useState(false);
  const [pass,setPass]=useState('')
  const scrollViewRef = useRef(null);
  // Handler for when the security question dropdown value changes
  const handleSecurityQuestionChange = (itemValue,onChange) => {
    setProfileDetails({
      ...profileDetails,
      securityQuestion: itemValue === "Add your own question" ? "" : itemValue,
    });
    setCustomSecurityQuestion(itemValue);
    setIsCustomQuestionSelected(itemValue === "Add your own question");
    //onChange(itemValue)
  };

  const {
    control,
    handleSubmit,
    setValue,
    setError,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver((isnewUser || pass?.target?.value.length>0 )?userSchema(isCustomQuestionSelected):userSchemaNoPass(isCustomQuestionSelected)),
    defaultValues: profileDetails,
  });
 // console.log('Password',(isnewUser || pass?.target?.value.length>0 ))
  //setValue('newPassword', 'value', { shouldValidate: false })
  const handleSave = (formData) => {
    //console.log('Request',formData)
    setLoading(true);
    if (route.params?.User != undefined) {

      console.log('Custom',customSecurityQuestion)
      console.log('CustomF',formData.securityQuestion)
      console.log('Ise',securityQuestions.includes(customSecurityQuestion))
      formData['securityQuestion']= isCustomQuestionSelected ? formData.securityQuestion :customSecurityQuestion
      dispatch(
        editNewUser(formData, (isSuccess) => {
          if (!isSuccess) {
            setLoading(false);
          } else {
            setLoading(false);
            setTimeout(()=>{
              navigation.navigate('UserManagement', { isSuccess: true });
              //navigation.reset({
                //index: 0,
                //routes: [{ name: "UserManagement" }],
              //});
            },1000)
          }
        })
      ); // Dispatch with formData// Dispatch with formData
    } else {
      formData['securityQuestion']=customSecurityQuestion

      console.log('request',formData)
      dispatch(
        addNewUser(formData, (isSuccess, msg) => {
          if (!isSuccess) {
            setLoading(false);
            setErrorMsg(msg?.error);
            scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: false });
          } else {
            setLoading(false);
            setTimeout(()=>{
              navigation.navigate('UserManagement', { isSuccess: true });
              //navigation.reset({
                //index: 0,
                //routes: [{ name: "UserManagement" }],
              //});
            },1000)
          }
        })
      ); 
    }
  };

  const handleOnChangeText = (
    value,
    onChange
  ) => {
    onChange(value);
    setPass(value);
  };

  const handleValidationError = () => {
    scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
    setShowValidationAlert(true);
  };

  useEffect(() => {
    // Reset the form with the updated profile details
    // reset(profileDetails);
    //console.log(profileDetails);
  }, [profileDetails, reset]);

  useEffect(() => {
    if (errorMsg != "") {
      setShowError(true);
    }
  }, [errorMsg]);

  useEffect(() => {

    const storedSecurityQuestion = profileDetails?.securityQuestion;
    console.log('custom Question',storedSecurityQuestion)
    const isCustomQuestion =securityQuestions.includes(storedSecurityQuestion);
      console.log('iscutom',isCustomQuestion),
    setIsCustomQuestionSelected(!isCustomQuestion);
    if (!isCustomQuestion) {
      setCustomSecurityQuestion("Add your own question");
      
    } else {
      setCustomSecurityQuestion(storedSecurityQuestion);
    }
  }, []);

  const LoadingOverlay = () => {
    return (
      <Modal
        visible={loading}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setLoading(false);
        }}
      >
        <View style={styles.overlay}>
          <View style={styles.alertContainer}>
            <ActivityIndicator size="large" color={Color.colorGainsboro_200} />
            <Text style={styles.loadingTxt}>Saving Data..</Text>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.userManagementEdit}>
      <ProfileSettingsHeader
        title={isnewUser ? "Add Admin User" : "Edit User"}
        onPressBack={() => navigation.navigate("UserManagement")}
        accessibilityLabel="Go back to User Management"
        accessibilityRole="button"
        accessibilityHint="Navigates back to the User Management screen"
      />
      <ScrollView ref={scrollViewRef}>
        <View style={[styles.userManagementEditInner]}>
         <NotificationError
            type="error"
            title={"Error"}
            message={errorMsg}
            showCloseIcon={true}
            isVisible={showError}
            onClose={() => {
              setShowError(false);
            }}
          /> 
          {isnewUser && (
            <>
              <Text
                style={[
                  styles.yourSavedCard,
                  styles.taylorTypo,
                  { fontWeight: "800" },
                ]}
              >
                Admin
              </Text>
              <Text
                style={[
                  styles.yourSavedCard,
                  styles.taylorTypo,
                  { paddingBottom: 15 },
                ]}
              >
                An admin can manage this account but is not the primary contact
                for this account.
              </Text>
            </>
          )}
          <View style={styles.frameWrapper}>
            <View
              style={[styles.frameGroup, styles.textinputWrapperSpaceBlock]}
            >
              <View style={styles.generalInformationWrapper}>
                <Text style={[styles.generalInformation, styles.firstClr]}>
                  General Information
                </Text>
              </View>
              <View style={styles.frameWrapper}>
                <View style={styles.frameWrapper}>
                  <View
                    style={[
                      styles.textinputWrapper,
                      styles.textinputWrapperSpaceBlock,
                    ]}
                  >
                    <View style={styles.textinput}>
                      <Controller
                        control={control}
                        name="firstName"
                        render={({
                          field: { onChange, onBlur, value },
                          fieldState: { error },
                        }) => (
                          <>
                            <SparkLightInput
                              onBlur={onBlur}
                              label={"First Name"}
                              placeholder={"Enter your First Name"}
                              onChangeText={onChange}
                              value={value}
                              error={error?.message}
                            />
                          </>
                        )}
                      />
                    </View>
                  </View>
                  <View
                    style={[
                      styles.textinputWrapper,
                      styles.textinputWrapperSpaceBlock,
                    ]}
                  >
                    <View style={styles.textinput}>
                      <Controller
                        control={control}
                        name="lastName"
                        render={({
                          field: { onChange, onBlur, value },
                          fieldState: { error },
                        }) => (
                          <>
                            <SparkLightInput
                              onBlur={onBlur}
                              label={"Last Name"}
                              placeholder={"Enter your Last Name"}
                              onChangeText={onChange}
                              value={value}
                              error={error?.message}
                            />
                          </>
                        )}
                      />
                    </View>
                  </View>
                  <View
                    style={[
                      styles.textinputWrapper,
                      styles.textinputWrapperSpaceBlock,
                    ]}
                  >
                    <View style={styles.textinput}>
                      <Controller
                        control={control}
                        name="userName"
                        render={({
                          field: { onChange, onBlur, value },
                          fieldState: { error },
                        }) => (
                          <>
                            <SparkLightInput
                              onBlur={onBlur}
                              label={"User Name"}
                              placeholder={"Enter your User Name"}
                              onChangeText={onChange}
                              editable={isnewUser}
                              value={value}
                              error={error?.message}
                            />
                          </>
                        )}
                      />
                    </View>
                  </View>
                  {!isnewUser && (
                    <View
                      style={[
                        styles.textinputWrapper,
                        styles.textinputWrapperSpaceBlock,
                      ]}
                    >
                      <View style={styles.textinput}>
                        <Text style={[styles.firstName, styles.firstClr]}>
                          Member Type
                        </Text>
                        <View style={styles.notifications}>
                          <Image
                            style={{ height: "100%" }}
                            resizeMode="stretch"
                            source={require("../../../assets/rectangle-5281.png")}
                          />
                          <View style={styles.bannerWarning}>
                            <View style={styles.rightActionableParent}>
                              <Image
                                style={styles.rightIconLayout}
                                resizeMode="stretch"
                                source={require("../../../assets/right-actionable3.png")}
                              />

                              <View
                                style={styles.creditCardWillExpireSoonParent}
                              >
                                <Text style={styles.creditCardWill}>
                                  {getUserType(profileDetails?.memberType)}
                                </Text>
                                <Text
                                  style={[
                                    styles.yourSavedCard,
                                    styles.taylorTypo,
                                  ]}
                                >
                                  {getUserType(profileDetails?.memberType) ==
                                  "PRIMARY ADMIN"
                                    ? "As the primary admin, you are the main contact and have full control over this account."
                                    : "As an admin, you can manage this account, but you are not the primary contact for this account."}
                                </Text>
                                <View style={styles.buttons}>
                                  <Text style={styles.makePayment}>
                                    Change Primary Admin
                                  </Text>
                                </View>
                              </View>
                            </View>
                            <Image
                              style={[
                                styles.rightActionableIcon1,
                                styles.rightIconLayout,
                              ]}
                              resizeMode="stretch"
                              source={require("../../../assets/right-actionable4.png")}
                            />
                          </View>
                        </View>
                      </View>
                    </View>
                  )}
                </View>

                <View style={styles.frameParent1}>
                  <View style={styles.contactInformationWrapper}>
                    <Text style={[styles.generalInformation, styles.firstClr]}>
                      Password
                    </Text>
                  </View>

                  <View style={styles.frameParent}>
                    <View
                      style={[
                        styles.textinputWrapper,
                        styles.wrapperSpaceBlock1,
                      ]}
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
                              placeholder= "New Password"
                              onBlur={onBlur}
                              label={isnewUser?"New Password":"New Password(Optional)"}
                              //onChangeText={onChange}
                              onChangeText={(value)=>{handleOnChangeText(value,onChange)}}
                              value={value}
                              secure={true}
                              error={error?.message}
                            />
                            <View
                              style={[
                                styles.passwordFlexBox,
                                { marginTop: Padding.p_base },
                              ]}
                            >
                              {validatePassword(
                                value,
                                profileDetails.userName
                              ).map((isValid, index) => (
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
                                  <Text style={styles.bulletPoint}>
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

                  <View style={styles.frameParent1}>
                    <View style={styles.securityQuestionWrapper}>
                      <Text
                        style={[styles.generalInformation, styles.firstClr]}
                      >
                        Security Questions
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.textinputWrapper,
                        styles.wrapperSpaceBlock1,
                      ]}
                    >
                      <View style={styles.textinput}>
                        <Text style={[styles.firstName1, styles.firstTypo]}>
                          {" "}
                          Password Reset Question
                        </Text>
                        <SparkLightDropdown
                          items={securityQuestions}
                          selectedValue={customSecurityQuestion}
                          onValueChange={(value)=>{handleSecurityQuestionChange(value)}}
                          
                        />
                      </View>
                    </View>
                    {isCustomQuestionSelected && (
                      <View
                        style={[
                          styles.textinputWrapper,
                          styles.wrapperSpaceBlock1,
                        ]}
                      >
                        <View style={styles.textinput}>
                          <Controller
                            control={control}
                            name="securityQuestion"
                            render={({
                              field: { onChange, onBlur, value },
                              fieldState: { error },
                            }) => (
                              <>
                                <SparkLightInput
                                  onBlur={onBlur}
                                  label={"Type your Question"}
                                  onChangeText={onChange}
                                  value={value}
                                  error={error?.message}
                                />
                              </>
                            )}
                          />
                        </View>
                      </View>
                    )}
                    <View
                      style={[
                        styles.textinputWrapper,
                        styles.wrapperSpaceBlock1,
                      ]}
                    >
                      <Controller
                        control={control}
                        name="securityAnswer"
                        render={({
                          field: { onChange, onBlur, value },
                          fieldState: { error },
                        }) => (
                          <>
                            <SparkLightInput
                              onBlur={onBlur}
                              onChangeText={onChange}
                              label={"Password Reset Answer"}
                              value={value}
                              error={error?.message}
                            />
                          </>
                        )}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.frameChild1SpaceBlock}>
            <View style={[styles.buttons1, styles.buttonsLayout]}>
              <Pressable
                style={[styles.buttons1, styles.buttonsLayout]}
                onPress={handleSubmit(handleSave, handleValidationError)}
              >
                <Text style={[styles.makePayment1, styles.makeTypo]}>Save</Text>
              </Pressable>
            </View>
            <Pressable
              style={[styles.buttons2, styles.buttonsLayout]}
              onPress={() => navigation.navigate("UserManagement")}
            >
              <Text style={[styles.makePayment2, styles.makeTypo]}>Cancel</Text>
            </Pressable>
          </View>
          <LoadingOverlay />
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
    flexDirection: "row", // Align bullet and text horizontally
    alignItems: "flex-start", // Align items to the start of the flex container
    marginBottom: 5, // Space between bullet points
  },
  bulletPoint: {
    marginRight: 10, // Space between bullet and text
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
});

export default UserManagementEdit;
