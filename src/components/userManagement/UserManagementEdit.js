import React, { useEffect, useState, useRef } from "react";
import {
  Image,
  StyleSheet,
  Text,
  Pressable,
  View,
  ScrollView,
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
import { passwordSchema,userSchema } from "../utility/validationSchema";
import { addNewUser } from "../../redux/actions/ProfileActionSuite";
import {
  validatePassword,
  securityQuestions,
  passwordTerms,
} from "../utility/constant";

const UserManagementEdit = ({ route }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  var user = route.params?.User;
  if(user==undefined){
    user={ 
        accountNumber: "902878578", 
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
        securityQuestion: "" 
    }
  }
  
  
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [isCustomQuestionSelected, setIsCustomQuestionSelected] =
    useState(false);
  const [customSecurityQuestion, setCustomSecurityQuestion] = useState("");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [userName, setUserName] = useState(user?.userName || "");


  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showValidationAlert, setShowValidationAlert] = useState(false);

  
  const [profileDetails, setProfileDetails] = useState(user);
  const scrollViewRef = useRef(null);

  // Handler for when the security question dropdown value changes
  const handleSecurityQuestionChange = (itemValue) => {
    setProfileDetails({
      ...user,
      securityQuestion: itemValue === "Add your own question" ? "" : itemValue,
    });
    setCustomSecurityQuestion(itemValue);
    setIsCustomQuestionSelected(itemValue === "Add your own question");
    console.log(itemValue)
  };

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(userSchema(isCustomQuestionSelected)),
    defaultValues: profileDetails,
  });

  const handleSave = (formData) => {
    console.log('Save dataa',formData)
    dispatch(addNewUser(formData, navigation)); // Dispatch with formData
  };

  const handleValidationError = () => {
    scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
    setShowValidationAlert(true);
  };

  useEffect(() => {
    // Reset the form with the updated profile details
   // reset(profileDetails);
   console.log(profileDetails)
  }, [profileDetails, reset]);

  useEffect(() => {
    const storedSecurityQuestion = profileDetails?.securityQuestion;
    const isCustomQuestion =
      storedSecurityQuestion &&
      !securityQuestions.includes(storedSecurityQuestion);
    setIsCustomQuestionSelected(isCustomQuestion);
    if (isCustomQuestion) {
      setCustomSecurityQuestion("Add your own question");
    } else {
      setCustomSecurityQuestion(storedSecurityQuestion);
    }
  }, []);

  return (
    <View style={styles.userManagementEdit}>
      <ProfileSettingsHeader
        title={route.params === undefined ? "Add User" : "Edit User"}
        onPressBack={() => navigation.navigate("UserManagement")}
        accessibilityLabel="Go back to User Management"
        accessibilityRole="button"
        accessibilityHint="Navigates back to the User Management screen"
      />
      <ScrollView>
        <View style={[styles.userManagementEditInner]}>
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
                            <View style={styles.creditCardWillExpireSoonParent}>
                              <Text style={styles.creditCardWill}>Admin</Text>
                              <Text
                                style={[
                                  styles.yourSavedCard,
                                  styles.taylorTypo,
                                ]}
                              >
                                Users added here will have full access to My
                                Account, which includes the power to add, edit
                                and delete accounts.
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
                              placeholder="New Password"
                              onBlur={onBlur}
                              label={"New Password"}
                              onChangeText={onChange}
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
                                  <Text style={styles.bulletPoiint}>
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
                          onValueChange={handleSecurityQuestionChange}
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
  },frameParent: {
    alignSelf: "stretch",
  },bullet: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginRight: 10, 
  },
});

export default UserManagementEdit;
