import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, AccessibilityInfo, Platform } from "react-native";
import Touchable from "../common/customui/Touchable";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  Color,
  Padding,
  FontSize,
  FontFamily,
  Border,
} from "../../../GlobalStyles";
import ProfileSettingsHeader from "../common/ProfileSettingsHeader";
import AppStyles from '../../styles/AppStyles'
import { useDispatch, useSelector } from "react-redux";
import NotificationAlert from "../common/customui/NotificationAlert";
import { fetchProfileDetails } from "../../redux/actions/ProfileActionSuite";
import useAccessibilityFocus from "../../hooks/useAccessibilityFocus";
import { SectionTitle, FieldTitle, FieldContent } from "../common/customui/Typography";
import EditActionButton from '../common/customui/EditActionButton'
import { A11y } from "react-native-a11y-order";
const PasswordSecurity = () => {
  const navigation = useNavigation();
  const route = useRoute(); // Use the useRoute hook
  const dispatch = useDispatch();
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const profile = useSelector((state) => state.profile || {});
  const [successAlertRef, setSuccessAlertFocus] = useAccessibilityFocus();
  const profileDetails = profile.profileDetails || {}; // Defaulting to an empty array if userList is undefined
  const [screenReaderEnabled, setScreenReaderEnabled] = useState(false);
  const [reduceMotionEnabled, setReduceMotionEnabled] = useState(false);
  const [suppressBackgroundA11y, setSuppressBackgroundA11y] = useState(false);
  const message =(route.params?.isPassword)?"Your password has been updated successfully.":"Your security question has been updated successfully."
  useEffect(() => {
      AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotionEnabled);
      AccessibilityInfo.isScreenReaderEnabled().then(setScreenReaderEnabled);
    }, []);

  // Announce error message if screen reader is enabled
    useEffect(() => {
      if (showSuccessAlert && screenReaderEnabled && Platform.OS === "ios") {
       
        const t = setTimeout(() => {
          try {
            setSuccessAlertFocus();
            AccessibilityInfo.announceForAccessibility(message);
          } catch (e) {
            console.warn("Accessibility focus error:", e);
          }
        }, 600);
  
        return () => clearTimeout(t);
      }
    }, [showSuccessAlert, screenReaderEnabled]);

    // Android/TalkBack: temporarily hide background so alert can reliably take focus.
    useEffect(() => {
      if (Platform.OS !== "android" || !screenReaderEnabled) {
        if (suppressBackgroundA11y) setSuppressBackgroundA11y(false);
        return;
      }

      if (!showSuccessAlert) {
        if (suppressBackgroundA11y) setSuppressBackgroundA11y(false);
        return;
      }

      setSuppressBackgroundA11y(true);
      const t = setTimeout(() => {
        setSuppressBackgroundA11y(false);
      }, 1600);
      return () => clearTimeout(t);
    }, [showSuccessAlert, screenReaderEnabled]);

    const hideBackgroundA11y = suppressBackgroundA11y;
  
  
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
      <View importantForAccessibility={hideBackgroundA11y ? "no-hide-descendants" : "auto"}>
        <ProfileSettingsHeader
          title="Password & Security"
          onPressBack={() => navigation.navigate("Account")}
          accessibilityHint="Go back to Account"
        />
      </View>
      <View style={[styles.passwordSecurityInner, styles.securitySpaceBlock]}>
        <View style={[AppStyles.card, styles.navigationBorder]}>
          <View style={styles.infoWrapper} ref={successAlertRef}>
            <NotificationAlert
              type="success"
              title="Success"
              message={message}
              showCloseIcon={true}
              isVisible={showSuccessAlert}
              onClose={() => setShowSuccessAlert(false)}
            />
          </View>
          <A11y.Order importantForAccessibility={hideBackgroundA11y ? "no-hide-descendants" : "auto"}>
            <A11y.View style={[styles.passwordParent, styles.tabsFlexBox]} >
              <A11y.Index index={0}>
              <SectionTitle style={[styles.password, styles.passwordFlexBox]} accessibilityRole="header" accessibilityLevel={2} accessibilityLabel="Password">
                Password
              </SectionTitle>
              </A11y.Index>
              <A11y.Index index={3} >
              <EditActionButton
                onPress={() => navigation.navigate("PasswordEdit")}
                accessibilityLabel="Edit Password"
                accessibilityHint="Double click to open edit password screen"
              />
              </A11y.Index>
            </A11y.View>
            <View style={styles.frameGroup}>
              <A11y.Index index={1}>
              <View style={styles.passwordGroup}>
                <FieldTitle style={[styles.passwordFlexBox]}>Password</FieldTitle>
                <Text
                  style={[styles.text, styles.passwordFlexBox,{color: Color.sparklightGray1}]}
                  accessibilityRole="text"
                  accessibilityLabel="Password: hidden"
                  accessible={true}
                >
                  **********
                </Text>
              </View>
              </A11y.Index>
              <View
                style={[styles.rectangleWrapper, styles.frameContainerSpaceBlock]}
              >
                <View style={styles.frameChild} />
              </View>
              <View style={styles.frameContainerSpaceBlock}>
                <View
                  style={[styles.securityQuestionWrapper, styles.tabsFlexBox]}
                >
                  <A11y.Index index={4}>
                  <SectionTitle style={[styles.password, styles.passwordFlexBox]} accessibilityRole="header" accessibilityLevel={2} accessibilityLabel="Security Question">
                    Security Question
                  </SectionTitle>
                  </A11y.Index>
                  <A11y.Index index={6}>
                  <EditActionButton
                    onPress={() => navigation.navigate("PasswordSecurityEdit")}
                    accessibilityLabel="Edit Security Question"
                    accessibilityHint="Double click to open edit security question screen"
                  />
                  </A11y.Index>
                 
                </View>
                <View style={styles.passwordGroup}>
                  <A11y.Index index={5}>
                  
                  <View style={styles.nameOfYourFirstPetParent}>
                    <FieldTitle style={[styles.passwordFlexBox]}>
                      {profileDetails.securityQuestion}
                    </FieldTitle>
                    <Text style={[styles.text, styles.passwordFlexBox,{color: Color.sparklightGray1,paddingBottom: Padding.p_5xl}]}
                    accessibilityRole="text"
                    accessibilityLabel="Answer hidden."
                    accessible={true}>
                      ******
                    </Text>
                  </View>
                  </A11y.Index>
                </View>
              </View>
            </View>
          </A11y.Order>
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
    alignItems: "center",
    justifyContent: "space-between",
  },
  passwordFlexBox: {
    textAlign: "left",
    lineHeight: 28,

  },
  buttonsBg: {
    paddingVertical: Padding.p_7xs,
    paddingHorizontal: Padding.p_base,
    borderRadius: Border.br_11xs,
    minWidth: 70,
    alignItems: "center",
  },
  frameContainerSpaceBlock: {
    marginTop: Padding.p_base,
    alignSelf: "stretch",
  },
  password: {
    flex: 1,
  },
  makePayment: {
    textAlign: "center",
    fontSize: FontSize.size_sm,
    fontFamily: FontFamily.RadioCanadaRegular,
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
    fontFamily: FontFamily.RadioCanadaRegular,
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
    paddingHorizontal: 0,
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
    ...AppStyles.headerCardSpacing,
  },
  passwordSecurity: {
    backgroundColor: Color.Gray300,
    flex: 1,
  },
});

export default PasswordSecurity;
