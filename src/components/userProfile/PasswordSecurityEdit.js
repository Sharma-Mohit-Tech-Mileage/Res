import React, { useState, useEffect, useRef } from "react";
import { Image, StyleSheet, Text, Pressable, View, ScrollView } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { FontFamily, Padding, Color, FontSize, Border } from "../../../GlobalStyles";
import { validatePassword, securityQuestions, passwordTerms } from "../utility/constant";
import SparkLightInput from '../common/customui/SparkLightInput';
import SparkLightDropdown from '../common/customui/SparkLightDropdown';
import ProfileSettingsHeader from '../common/ProfileSettingsHeader';
import { useDispatch, useSelector } from 'react-redux';
import NotificationAlert from '../common/customui/NotificationAlert';
import { updateProfileSecurity } from '../../redux/actions/ProfileActionSuite';
const PasswordSecurityEdit = () => {

  const navigation = useNavigation();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isCustomQuestionSelected, setIsCustomQuestionSelected] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const route = useRoute(); // Use the useRoute hook
  const dispatch = useDispatch();
  const profile = useSelector(state => state.combinedReducers.profile || {});
  const profileDetailsfromStore = profile.profileDetails || {}; // Defaulting to an empty array if userList is undefined
  const [profileDetails, setLocalProfile] = useState(profileDetailsfromStore);
  const scrollViewRef = useRef(null);
  const handleChange = (e) => {
    setLocalProfile({ ...profileDetails, [e.target.name]: e.target.value });
  };

  // Handler for when the security question dropdown value changes
  const handleSecurityQuestionChange = (itemValue) => {
    console.log("securityQuestion", itemValue)
    setLocalProfile({ ...profileDetails, securityQuestion: itemValue });
    setIsCustomQuestionSelected(itemValue === "Add your own question");
  };

  const handleSave = () => {
    dispatch(updateProfileSecurity(profileDetails, navigation));
  };

  useEffect(() => {
    if (route.params?.updateFailed) {
      setShowErrorAlert(true);
      scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
      // Reset the parameter so subsequent navigations are detected
      navigation.setParams({ updateFailed: undefined });
    }
  }, [route.params?.updateFailed, navigation, dispatch]);

  return (
    <View style={styles.passwordSecurityEdit}>
      <ProfileSettingsHeader
        title="Edit Password & Security"
        onPressBack={() => navigation.navigate('PasswordSecurity')}
      />
      <ScrollView ref={scrollViewRef}>
        <View style={styles.passwordSecurityEditInner}>
          <NotificationAlert
            type="error"
            title="Failed"
            message="Your password and security update failed."
            showCloseIcon={true}
            isVisible={showErrorAlert}
            onClose={() => setShowErrorAlert(false)}
          />
          <View style={styles.frameParent}>
            <View style={[styles.frameGroup, styles.wrapperSpaceBlock1]}>
              <View style={[styles.passwordWrapper, styles.wrapperSpaceBlock1]}>
                <Text style={[styles.password, styles.passwordFlexBox]} accessibilityRole="header">
                  Password
                </Text>
              </View>
              <View style={styles.frameParent}>
                <View style={[styles.textinputWrapper, styles.wrapperSpaceBlock1]}>
                  <View style={styles.textinput}>
                    <View style={styles.firstNameParent}>
                      <Text style={[styles.firstName, styles.firstTypo]} accessibilityRole="header">
                        New Password
                      </Text>
                      <Pressable onPress={() => setPasswordVisible(!passwordVisible)}>
                        <View style={styles.eyeParent}>
                          {!passwordVisible ? <Image
                            style={styles.eyeIcon}
                            resizeMode="stretch"
                            source={require("../../../assets/eye.png")}
                          /> : <Image
                            style={styles.eyeIcon}
                            resizeMode="stretch"
                            source={require("../../../assets/HidePassword-01.png")}
                          />}
                          <Text style={[styles.show, styles.firstTypo]}>
                            {passwordVisible ? 'Hide' : 'Show'}
                          </Text>
                        </View>
                      </Pressable>
                    </View>
                    <SparkLightInput
                      name="newPassword"
                      value={profileDetails.newPassword}
                      onChangeText={handleChange}
                      secure={!passwordVisible} // Toggle visibility
                    />
                  </View>
                </View>
                <View style={[styles.itMustBeDifferentThanYourWrapper, styles.wrapperSpaceBlock]}>
                  <View style={styles.passwordFlexBox}>
                    {validatePassword(profileDetails.newPassword, profileDetails.userName).map((isValid, index) => (
                      <View key={`point-${index}`} style={styles.bulletPointContainer}>
                        <Text style={[styles.bulletPoint, { color: isValid ? Color.sparklightGreen : Color.colorGray_200 }]}>•</Text>
                        <Text style={[styles.itMustBe, { color: Color.sparklightGray1, fontWeight: '400' }]}>
                          {passwordTerms[index]}
                        </Text>
                      </View>
                    ))}
                  </View>

                </View>
              </View>
              <View style={[styles.rectangleWrapper, styles.wrapperSpaceBlock]}>
                <View style={styles.frameChild} />
              </View>
              <View style={styles.frameParent1}>
                <View style={styles.securityQuestionWrapper}>
                  <Text style={[styles.password, styles.passwordFlexBox]} >
                    Security Question
                  </Text>
                </View>
                <View style={[styles.textinputWrapper, styles.wrapperSpaceBlock1]}>
                  <View style={styles.textinput}>
                    <Text style={[styles.firstName1, styles.firstTypo]} >
                      Password Reset Question
                    </Text>
                    <SparkLightDropdown
                      items={securityQuestions}
                      selectedValue={profileDetails.securityQuestion}
                      onValueChange={handleSecurityQuestionChange}
                    />
                  </View>
                </View>
                {isCustomQuestionSelected && (
                  <View style={[styles.textinputWrapper, styles.wrapperSpaceBlock1]}>
                    <View style={styles.textinput}>
                      <Text style={[styles.firstName1, styles.firstTypo]} >
                        Type your Question
                      </Text>
                      <SparkLightInput
                        placeholder="Enter text here"
                        value={profileDetails.customSecurityQuestion || ''}
                        onChangeText={(text) => setLocalProfile({ ...profileDetails, customSecurityQuestion: text })}
                      />
                    </View>
                  </View>
                )}
                {/* <View style={[styles.textinputWrapper, styles.wrapperSpaceBlock1]}>
                  <View style={styles.textinput}>
                    <Text style={[styles.firstName1, styles.firstTypo]} >
                      Type your Question
                    </Text>
                    <SparkLightInput
                      placeholder="Enter text here"
                      value={profileDetails.customSecurityQuestion || ''}
                      onChangeText={(text) => setLocalProfile({ ...profileDetails, customSecurityQuestion: text })}
                    />
                  </View>
                </View> */}
                <View style={[styles.textinputWrapper, styles.wrapperSpaceBlock1]}>
                  <View style={styles.textinput}>
                    <Text style={[styles.firstName1, styles.firstTypo]} >
                      Password Reset Answer
                    </Text>
                    <SparkLightInput
                      name="securityAnswer"
                      value={profileDetails.securityAnswer}
                      onChangeText={handleChange}
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.frameParent1}>
            <Pressable
              style={[styles.buttons, styles.buttonsLayout]}
              onPress={handleSave}
            >
              <Text style={[styles.makePayment, styles.makeTypo]}>
                Save
              </Text>
            </Pressable>
            <Pressable
              style={[styles.buttons1, styles.buttonsLayout]}
              onPress={() => navigation.navigate("PasswordSecurity")}
            >
              <Text style={[styles.makePayment1, styles.makeTypo]}>
                Cancel
              </Text>
            </Pressable>
          </View>
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
  bulletPointContainer: {
    flexDirection: 'row', // Align bullet and text horizontally
    alignItems: 'flex-start', // Align items to the start of the flex container
    marginBottom: 5, // Space between bullet points
  },
  bulletPoint: {
    marginRight: 10, // Space between bullet and text
    fontSize: 15
  },
  passwordFlexBox: {
    textAlign: "left",
    fontFamily: FontFamily.openSansRegular,
    color: Color.sparklightGray1,
    flex: 1,
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
  textWrapper: {
    justifyContent: "center",
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
  itMustBeDifferentThanYourWrapper: {
    alignItems: "center",
    flexDirection: "row",
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
    marginTop: 16,
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
    marginBottom: 200
  },
  passwordSecurityEdit: {
    flex: 1,
    backgroundColor: Color.colorWhitesmoke_200,
  },
});

export default PasswordSecurityEdit;
