import * as React from "react";
import { Image, StyleSheet, Text, Pressable, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontFamily, Padding, Color, FontSize, Border } from "../../../GlobalStyles";
import { ScrollView } from "react-native-gesture-handler";
import SparkLightInput from '../common/customui/SparkLightInput';
import SparkLightDropdown from '../common/customui/SparkLightDropdown';
import ProfileSettingsHeader from '../common/ProfileSettingsHeader';
const securityQuestions = [
  "What was your childhood nickname?",
  "What is the name of your favorite childhood friend?",
  "In what city or town did your mother and father meet?",
  "What is the middle name of your oldest child?",
  "What is your favorite team?"
];
const PasswordSecurityEdit = () => {
  const navigation = useNavigation();

  return (
    
      <View style={styles.passwordSecurityEdit}>
        <ProfileSettingsHeader
          title="Edit Password & Security"
          onPressBack={() => navigation.navigate('PasswordSecurity')}
          accessibilityLabel="Edit Password & Security Header"
          accessibilityHint="Navigate back to Password & Security settings"
        />
      <ScrollView accessibilityLabel="Scroll view for Password and Security Edit">
        <View style={styles.passwordSecurityEditInner}>
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
                        <View style={styles.eyeParent}>
                          <Image
                            style={styles.eyeIcon}
                            resizeMode="cover"
                            source={require("../../../assets/eye.png")}
                            accessibilityRole="image"
                            accessibilityLabel="Eye Icon for password visibility"
                            accessibilityHint="Toggle password visibility"
                          />
                          <Text style={[styles.show, styles.firstTypo]}>
                            Show
                          </Text>
                        </View>
                      </View>
                      <SparkLightInput
                        placeholder="Enter text here"
                        accessibilityLabel="New Password Input Field"
                        accessibilityHint="Input field for the new password"
                      />
                    </View>
                  </View>
                  <View style={[styles.itMustBeDifferentThanYourWrapper, styles.wrapperSpaceBlock]}>
                  <View style={styles.passwordFlexBox}>
                    {[
                      "It must be different than your user name.",
                      "It must contain 8 to 20 characters.",
                      "It must include an upper and lower case letter and a number.",
                      "You may include special characters %,&,_,?,#,=,-.",
                      "Your new password cannot have any spaces."
                    ].map((point, index) => (
                      <View key={`point-${index}`} style={styles.bulletPointContainer}>
                        <Text style={styles.bulletPoint}>•</Text>
                        <Text style={styles.itMustBe}>{point}</Text>
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
                    <Text style={[styles.password, styles.passwordFlexBox]} accessibilityRole="header">
                      Security Question
                    </Text>
                  </View>
                  <View style={[styles.textinputWrapper, styles.wrapperSpaceBlock1]}>
                    <View style={styles.textinput}>
                      <Text style={[styles.firstName1, styles.firstTypo]} accessibilityRole="header">
                      Password Reset Question
                      </Text>
                      <SparkLightDropdown
                        items={securityQuestions}
                        accessibilityLabel="Security Question Dropdown"
                        accessibilityHint="Dropdown for selecting a security question"
                      />
                    </View>
                  </View>
                  <View style={[styles.textinputWrapper, styles.wrapperSpaceBlock1]}>
                    <View style={styles.textinput}>
                      <Text style={[styles.firstName1, styles.firstTypo]} accessibilityRole="header">
                        Password Reset Answer
                      </Text>
                      <SparkLightInput
                        placeholder="Enter text here"
                        accessibilityLabel="Password Reset Answer Input Field"
                        accessibilityHint="Input the answer for your security question"
                      />
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.frameParent1}>
              <Pressable
                style={[styles.buttons, styles.buttonsLayout]}
                onPress={() => navigation.navigate("Account")}
                accessibilityRole="button"
                accessibilityLabel="Save Button"
                accessibilityHint="Save the edited details and navigate to Account"
              >
                <Text style={[styles.makePayment, styles.makeTypo]}>
                  Save
                </Text>
              </Pressable>
              <Pressable
                style={[styles.buttons1, styles.buttonsLayout]}
                onPress={() => navigation.navigate("PasswordSecurity")}
                accessibilityRole="button"
                accessibilityLabel="Cancel Button"
                accessibilityHint="Cancel editing and navigate back to Password & Security settings"
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
  },
  passwordFlexBox: {
    textAlign: "left",
    fontFamily: FontFamily.openSansRegular,
    color: Color.sparklightDarkGray,
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
    color: Color.colorDimgray,
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
    fontSize: FontSize.textXsSemibold_size,
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
    backgroundColor: Color.colorGainsboro_100,
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
    color: Color.colorDimgray,
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
    backgroundColor: Color.sparkLightPurple,
  },
  makePayment1: {
    color: Color.sparkLightPurple,
  },
  buttons1: {
    marginTop: 16,
    width: '100%',
  },
  passwordSecurityEditInner: {
    top: 100,
    paddingTop: Padding.p_base,
    paddingBottom: Padding.p_base,
    paddingHorizontal: Padding.p_base,
    overflow: "hidden",
    marginBottom:200
  },
  passwordSecurityEdit: {
    flex: 1,
    backgroundColor: Color.sparklightBlue,
  },
});

export default PasswordSecurityEdit;
