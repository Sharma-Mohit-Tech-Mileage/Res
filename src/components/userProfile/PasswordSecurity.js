import * as React from "react";
import { Image, StyleSheet, Text, Pressable, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Color, Padding, FontSize, FontFamily, Border } from "../../../GlobalStyles";
import ProfileSettingsHeader from "../common/ProfileSettingsHeader";
const PasswordSecurity = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.passwordSecurity}>
      <ProfileSettingsHeader
        title="Password & Security"
        onPressBack={() => navigation.navigate('Account')}
        accessibilityHint="Go back to Account"
      />
      <View style={[styles.passwordSecurityInner, styles.securitySpaceBlock]}>
        <View style={[styles.frameParent, styles.navigationBorder]}>
          <View style={[styles.passwordParent, styles.tabsFlexBox]}>
            <Text style={[styles.password, styles.passwordFlexBox]} accessibilityRole="header">
              Password
            </Text>
            <Pressable
              style={[styles.buttons, styles.buttonsBg]}
              onPress={() => navigation.navigate("PasswordSecurityEdit")}
            >
              <Text style={[styles.makePayment, styles.titleFlexBox]}>
                Edit
              </Text>
            </Pressable>
          </View>
          <View style={styles.frameGroup}>
            <View style={styles.passwordGroup}>
              <Text style={[styles.passwordFlexBox]}>
                Password
              </Text>
              <Text style={[styles.text, styles.passwordFlexBox]} accessibilityRole="text">
                **********
              </Text>
            </View>
            <View style={[styles.rectangleWrapper, styles.frameContainerSpaceBlock]}>
              <View style={styles.frameChild} />
            </View>
            <View style={styles.frameContainerSpaceBlock}>
              <View style={[styles.securityQuestionWrapper, styles.tabsFlexBox]}>
                <Text style={[styles.password, styles.passwordFlexBox]}>
                  Security Question
                </Text>
              </View>
              <View style={styles.passwordGroup}>
                <View style={styles.nameOfYourFirstPetParent}>
                  <Text style={[styles.passwordFlexBox]}>
                    Name of your first pet?
                  </Text>
                  <Text style={[styles.text, styles.passwordFlexBox]}>
                    ******
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  titleFlexBox: {
    textAlign: "center",
    color: Color.sparklightWhite,
  },
  securitySpaceBlock: {
    paddingBottom: Padding.p_base,
    paddingHorizontal: Padding.p_base,
  },
  navigationBorder: {
    borderColor: Color.sparklightGray,
    backgroundColor: Color.sparklightWhite,
    borderStyle: "solid",
  },
  tabsFlexBox: {
    flexDirection: "row",
    alignSelf: "stretch",
  },
  passwordFlexBox: {
    textAlign: "left",
    color: Color.sparklightaddGray,
    lineHeight: 28,
  },
  buttonsBg: {
    paddingHorizontal: Padding.p_base,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Border.br_11xs,
  },
  frameContainerSpaceBlock: {
    marginTop: 16,
    alignSelf: "stretch",
  },
  password: {
    fontSize: FontSize.size_3xl,
    fontFamily: FontFamily.openSansRegular,
    flex: 1,
  },
  makePayment: {
    textAlign: "center",
    fontSize: FontSize.size_sm,
    fontFamily: FontFamily.openSansRegular,
  },
  buttons: {
    marginLeft: 10,
    backgroundColor: Color.colorMidnightblue,
  },
  passwordParent: {
    alignItems: "center",
    paddingVertical: Padding.p_base,
    paddingHorizontal: Padding.p_5xl,
  },
  text: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.openSansRegular,
  },
  passwordGroup: {
    paddingVertical: Padding.p_5xs,
    justifyContent: "center",
    paddingHorizontal: Padding.p_5xl,
    alignSelf: "stretch",
  },
  frameGroup: {
    alignSelf: "stretch",
  },
  frameChild: {
    height: 1,
    backgroundColor: Color.sparklightGray,
    alignSelf: "stretch",
  },
  rectangleWrapper: {
    paddingVertical: 0,
    paddingHorizontal: Padding.p_5xl,
  },
  securityQuestionWrapper: {
    alignItems: "center",
    paddingBottom: Padding.p_base,
    paddingHorizontal: Padding.p_5xl,
  },
  nameOfYourFirstPetParent: {
    justifyContent: "center",
  },
  frameParent: {
    borderWidth: 1,
    paddingHorizontal: 0,
    paddingVertical: Padding.p_base,
    borderRadius: Border.br_11xs,
    alignSelf: "stretch",
    overflow: "hidden",
  },
  passwordSecurityInner: {
    paddingTop: Padding.p_5xl,
  },
  passwordSecurity: {
    backgroundColor: Color.colorWhitesmoke_200,
    flex: 1,
  },
});

export default PasswordSecurity;
