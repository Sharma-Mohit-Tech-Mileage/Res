import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  Pressable,
  View,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  Color,
  Padding,
  FontSize,
  FontFamily,
  Border,
} from "../../../GlobalStyles";
import ProfileSettingsHeader from "../common/ProfileSettingsHeader";
import { useDispatch, useSelector } from "react-redux";
import NotificationAlert from "../common/customui/NotificationAlert";
import { fetchProfileDetails } from "../../redux/actions/ProfileActionSuite";
import useAccessibilityFocus from "../../../src/hooks/useAccessibilityFocus";
const PasswordSecurity = () => {
  const navigation = useNavigation();
  const route = useRoute(); // Use the useRoute hook
  const dispatch = useDispatch();
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const profile = useSelector((state) => state.profile || {});
  const profileDetails = profile.profileDetails || {}; // Defaulting to an empty array if userList is undefined
  const [messageRef] = useAccessibilityFocus();
  const message =(route.params?.isPassword)?"Your password has been updated successfully.":"Your security question has been updated successfully."

      // No extra programmatic focus here.
      // `NotificationAlert` handles focusing the success icon on Android.
  
  
  
  useEffect(() => {
    if (route.params?.updateSuccess) {
      setShowSuccessAlert(true);
      dispatch(fetchProfileDetails());
      navigation.setParams({ updateSuccess: undefined });
    }
  }, [route.params?.updateSuccess, navigation, dispatch]);
  useEffect(() => {
    if (profileDetails) {
      dispatch(fetchProfileDetails());
    }
  }, []);

  return (
    <View style={styles.passwordSecurity}>
      <ProfileSettingsHeader
        title="Password & Security"
        onPressBack={() => navigation.navigate("Account")}
        accessibilityHint="Go back to Account"
      />
      <View style={[styles.passwordSecurityInner, styles.securitySpaceBlock]}>
        <View style={[styles.frameParent, styles.navigationBorder]}>
          <View
            style={styles.infoWrapper}
            ref={messageRef}
            importantForAccessibility="yes"
          >
            <NotificationAlert
              type="success"
              title="Success"
              message={message}
              showCloseIcon={true}
              isVisible={showSuccessAlert}
              onClose={() => setShowSuccessAlert(false)}
              autoFocusTitle={false}
            />
          </View>
          {/* Keep main content accessible even when success banner is visible.
              Only the header/back is hidden during the banner to prevent focus snapping there. */}
          <View>
            <View style={[styles.passwordParent, styles.tabsFlexBox]}>
              <Text
                style={[styles.password, styles.passwordFlexBox]}
                accessibilityRole="header"
                accessibilityLevel={2}
              >
                Password
              </Text>
              <Pressable
                accessible={true}
                accessibilityLabel="Edit Password"
                accessibilityRole="button"
                accessibilityHint="Double click to open edit password screen"
                style={[styles.buttons, styles.buttonsBg]}
                onPress={() => navigation.navigate("PasswordEdit")}
              >
                <Text style={[styles.makePayment, styles.titleFlexBox]}>Edit</Text>
              </Pressable>
            </View>
            <View style={styles.frameGroup}>
              <View style={styles.passwordGroup}>
                <Text style={[styles.passwordFlexBox]}>Password</Text>
                <Text
                  style={[styles.text, styles.passwordFlexBox]}
                  accessibilityRole="text"
                  accessibilityLabel="Password: hidden."
                >
                  **********
                </Text>
              </View>
              <View
                style={[styles.rectangleWrapper, styles.frameContainerSpaceBlock]}
              >
                <View style={styles.frameChild} />
              </View>
              <View style={styles.frameContainerSpaceBlock}>
                <View
                  style={[styles.securityQuestionWrapper, styles.tabsFlexBox]}
                >
                  <Text
                    style={[styles.password, styles.passwordFlexBox]}
                    accessibilityRole="header"
                    accessibilityLevel={2}
                  >
                    Security Question
                  </Text>
                  <Pressable
                    accessible={true}
                    accessibilityLabel="Edit Security Question"
                    accessibilityRole="button"
                    style={[styles.buttons, styles.buttonsBg]}
                    onPress={() => navigation.navigate("PasswordSecurityEdit")}
                  >
                    <Text style={[styles.makePayment, styles.titleFlexBox]}>
                      Edit
                    </Text>
                  </Pressable>
                </View>
                <View style={styles.passwordGroup}>
                  <View style={styles.nameOfYourFirstPetParent}>
                    <Text style={[styles.passwordFlexBox]}>
                      {profileDetails.securityQuestion}
                    </Text>
                    <Text
                      style={[styles.text, styles.passwordFlexBox]}
                      accessibilityRole="text"
                      accessibilityLabel="Security Answer: hidden."
                    >
                      ******
                    </Text>
                  </View>
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
    color: Color.sparklightGray1,
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
    marginTop: Padding.p_base,
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
  infoWrapper: {
    paddingHorizontal: Padding.p_5xl,
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
