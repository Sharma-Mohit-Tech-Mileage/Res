import * as React from "react";
import { Image, StyleSheet, Text, Pressable, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontFamily, Padding, Color, Border, FontSize } from "../../../GlobalStyles";
import ProfileSettingsHeader from '../common/ProfileSettingsHeader';
import SparkLightInput from '../common/customui/SparkLightInput';
import { ScrollView } from "react-native-gesture-handler";

const UserManagementEdit = () => {
  const navigation = useNavigation();

  return (
   
      <View style={styles.userManagementEdit}>
        <ProfileSettingsHeader
          title="Edit User"
          onPressBack={() => navigation.navigate('UserManagement')}
          accessibilityLabel="Go back to User Management"
          accessibilityRole="button"
          accessibilityHint="Navigates back to the User Management screen"
        />
      <ScrollView>
        <View style={[styles.userManagementEditInner]}>
          <View style={styles.frameParent}>
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
                        <Text style={[styles.firstName, styles.firstClr]}>
                          First Name
                        </Text>
                        <SparkLightInput
                          placeholder="Enter text here"
                          accessibilityLabel="First Name Input Field"
                          accessibilityHint="Input field for the First name"
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
                          Last Name
                        </Text>
                        <SparkLightInput
                          placeholder="Enter text here"
                          accessibilityLabel="Last Name Input Field"
                          accessibilityHint="Input field for the Last name"
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
                          Username
                        </Text>

                        <SparkLightInput
                          placeholder="Enter text here"
                          accessibilityLabel="User Name Input Field"
                          accessibilityHint="Input field for the User name"
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
                            style={styles.notificationsChild}
                            resizeMode="cover"
                            source={require("../../../assets/rectangle-5281.png")}
                          />
                          <View style={styles.bannerWarning}>
                            <View style={styles.rightActionableParent}>
                              <Image
                                style={styles.rightIconLayout}
                                resizeMode="cover"
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
                              resizeMode="cover"
                              source={require("../../../assets/right-actionable4.png")}
                            />
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                  <View
                    style={[styles.rectangleWrapper, styles.wrapperSpaceBlock]}
                  >
                    <View style={styles.frameChild} />
                  </View>
                  <View style={styles.frameParent1}>
                    <View style={styles.contactInformationWrapper}>
                      <Text style={[styles.generalInformation, styles.firstClr]}>
                        Contact Information
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.textinputWrapper,
                        styles.textinputWrapperSpaceBlock,
                      ]}
                    >
                      <View style={styles.textinput}>
                        <Text style={[styles.firstName, styles.firstClr]}>
                          Email
                        </Text>

                        <SparkLightInput
                          placeholder="Enter text here"
                          accessibilityLabel="Email Input Field"
                          accessibilityHint="Input field for the Email"
                        />
                      </View>
                    </View>
                  </View>
                  <View
                    style={[styles.rectangleWrapper, styles.wrapperSpaceBlock]}
                  >
                    <View style={styles.frameChild} />
                  </View>
                  <View style={styles.frameParent1}>
                    <View style={styles.contactInformationWrapper}>
                      <Text style={[styles.generalInformation, styles.firstClr]}>
                        Password
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.textinputWrapper,
                        styles.textinputWrapperSpaceBlock,
                      ]}
                    >
                      <View style={styles.textinput}>
                        <Text style={[styles.firstName, styles.firstClr]}>
                          New Password
                        </Text>

                        <SparkLightInput
                          placeholder="Enter text here"
                          accessibilityLabel="Email Input Field"
                          accessibilityHint="Input field for the Email"
                        />
                      </View>
                    </View>
                    <View
                      style={[
                        styles.itMustBeDifferentThanYourWrapper,
                        styles.wrapperSpaceBlock,
                      ]}
                    >
                      <Text
                        style={[styles.itMustBe, styles.firstClr]}
                      >{`It must be different than your user name.
It must contain 8 to 20 characters.
It must include an upper and lower case letter and a number.
You may include special characters %,&,_,?,#,=,-.
Your new password cannot have any spaces`}</Text>
                    </View>
                    <View
                      style={[
                        styles.textinputWrapper4,
                        styles.textinputWrapperSpaceBlock,
                      ]}
                    >
                      <View style={styles.textinput}>
                        <Text style={[styles.firstName, styles.firstClr]}>
                          Password Reset Question
                        </Text>
                        <View
                          style={[
                            styles.favoriteAuthorParent,
                            styles.wrapperBorder,
                          ]}
                        >
                          <Text
                            style={[styles.favoriteAuthor, styles.taylorTypo]}
                          >
                            Favorite Author
                          </Text>
                          <Image
                            style={[
                              styles.chevronDownIcon,
                              styles.chevronIconLayout,
                            ]}
                            resizeMode="cover"
                            source={require("../../../assets/chevrondown.png")}
                          />
                        </View>
                      </View>
                    </View>
                    <View
                      style={[
                        styles.textinputWrapper4,
                        styles.textinputWrapperSpaceBlock,
                      ]}
                    >
                      <View style={styles.textinput}>
                        <Text style={[styles.firstName, styles.firstClr]}>
                          Password Reset Answer
                        </Text>
                        <View
                          style={[styles.taylorWrapper, styles.wrapperBorder]}
                        >
                          <Text style={[styles.taylor, styles.taylorTypo]}>
                            Someone
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  <View
                    style={[styles.rectangleWrapper, styles.wrapperSpaceBlock]}
                  >
                    <View style={styles.frameChild} />
                  </View>
                  <View style={styles.frameParent1}>
                    <View style={styles.contactInformationWrapper}>
                      <Text style={[styles.generalInformation, styles.firstClr]}>
                        Security Question
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.textinputWrapper,
                        styles.textinputWrapperSpaceBlock,
                      ]}
                    >
                      <View style={styles.textinput}>
                        <Text style={[styles.firstName, styles.firstClr]}>
                          Password Reset Question
                        </Text>
                        <View
                          style={[
                            styles.favoriteAuthorParent,
                            styles.wrapperBorder,
                          ]}
                        >
                          <Text
                            style={[styles.favoriteAuthor, styles.taylorTypo]}
                          >
                            Favorite Author
                          </Text>
                          <Image
                            style={[
                              styles.chevronDownIcon,
                              styles.chevronIconLayout,
                            ]}
                            resizeMode="cover"
                            source={require("../../../assets/chevrondown.png")}
                          />
                        </View>
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
                          Password Reset Answer
                        </Text>
                        <View
                          style={[styles.taylorWrapper, styles.wrapperBorder]}
                        >
                          <Text style={[styles.taylor, styles.taylorTypo]}>
                            Someone
                          </Text>
                        </View>
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
                  onPress={() => {/* Add your save logic here */ }}
                  accessibilityLabel="Save changes"
                  accessibilityRole="button"
                  accessibilityHint="Saves the changes made to the user's profile"
                >
                  <Text style={[styles.makePayment1, styles.makeTypo]}>Save</Text>
                </Pressable>
              </View>
              <Pressable
                style={[styles.buttons2, styles.buttonsLayout]}
                onPress={() => navigation.navigate("UserManagement")}
                accessibilityLabel="Cancel"
                accessibilityRole="button"
                accessibilityHint="Cancels the edit and returns to the User Management screen"
              >
                <Text style={[styles.makePayment2, styles.makeTypo]}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
    </ScrollView>
      </View>
  );
};

const styles = StyleSheet.create({
  firstTypo: {
    fontFamily: FontFamily.openSansSemiBold,
    fontWeight: "600",
  },
  chevronIconLayout: {
    height: 24,
    width: 24,
  },
  textinputWrapperSpaceBlock: {
    paddingVertical: Padding.p_base,
    alignSelf: "stretch",
  },
  firstClr: {
    color: Color.colorDimgray,
    textAlign: "left",
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
  frameChild1SpaceBlock: {
    marginTop: 24,
    alignSelf: "stretch",
  },
  rightFlexBox: {
    paddingTop: Padding.p_5xs,
    alignItems: "center",
    alignSelf: "stretch",
    flex: 1,
  },
  generalInformation: {
    fontSize: FontSize.size_3xl,
    textAlign: "left",
    fontFamily: FontFamily.openSansRegular,
    lineHeight: 28,
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
    width: 98,
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
  notificationsChild: {
    width: 3,
    alignSelf: "stretch",
    maxHeight: "100%",
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
    fontSize: FontSize.textSmSemibold_size,
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
    borderColor: Color.colorGainsboro_100,
    borderStyle: "solid",
    borderRadius: Border.br_11xs,
    alignSelf: "stretch",
  },
  frameWrapper: {
    alignSelf: "stretch",
  },
  frameChild: {
    height: 1,
    backgroundColor: Color.colorGainsboro_100,
    alignSelf: "stretch",
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
  taylor123gmailcomWrapper: {
    marginTop: -7,
    marginLeft: -167,
    width: 334,
    justifyContent: "center",
    left: "50%",
    top: "50%",
    position: "absolute",
  },
  
  eyeIcon: {
    width: 16,
    height: 16,
    overflow: "hidden",
  },
  show: {
    marginLeft: 6,
    color: Color.colorMidnightblue,
    fontSize: FontSize.textSmSemibold_size,
    textAlign: "left",
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
  itMustBe: {
    lineHeight: 19,
    fontSize: FontSize.size_xs,
    textAlign: "left",
    fontFamily: FontFamily.openSansRegular,
    flex: 1,
  },
  itMustBeDifferentThanYourWrapper: {
    alignItems: "center",
    flexDirection: "row",
  },
  firstName6: {
    fontSize: FontSize.textXsSemibold_size,
    textAlign: "left",
    fontFamily: FontFamily.openSansSemiBold,
    fontWeight: "600",
    alignSelf: "stretch",
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
    borderColor: Color.colorGainsboro_100,
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
    top: 100,
    paddingTop: Padding.p_5xl,
    paddingBottom: Padding.p_base,
    paddingHorizontal: Padding.p_base,
    marginBottom:200
  },

  userManagementEdit: {
  
    flex: 1,
    backgroundColor: Color.colorWhitesmoke_200,
  },
});

export default UserManagementEdit;
