import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  AccessibilityInfo,
  InteractionManager,
  Platform,
  findNodeHandle,
} from "react-native";
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
import { divider, interaction } from "../../styles/utilities";
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
  const successIconRef = useRef(null);
  const [screenReaderEnabled, setScreenReaderEnabled] = useState(false);
  const message =(route.params?.isPassword)?"Your password has been updated successfully.":"Your security question has been updated successfully."

  useEffect(() => {
    AccessibilityInfo.isScreenReaderEnabled().then(setScreenReaderEnabled);
  }, []);

  useEffect(() => {
    // iOS focus can land on header/back when navigating here — move it to the success icon once the banner renders.
    if (!showSuccessAlert || !screenReaderEnabled) return;

    const focusSuccessIcon = () => {
      try {
        if (successIconRef.current) {
          const handle = findNodeHandle(successIconRef.current);
          if (handle) {
            AccessibilityInfo.setAccessibilityFocus(handle);
          }
        }
      } catch (e) {
        console.warn("Accessibility focus error:", e);
      }
    };

    // Aggressive retries to override navigation focus stealing; Android needs longer delays for TalkBack.
    const delays = Platform.OS === "ios"
      ? [100, 300, 600, 1000, 1500, 2000] 
      : [10, 50, 150, 300, 500, 800, 1200, 1800, 2500];
    const timers = [];

    const interaction = InteractionManager.runAfterInteractions(() => {
      timers.push(setTimeout(focusSuccessIcon, Platform.OS === "ios" ? 50 : 0));
    });

    delays.forEach((ms) => {
      timers.push(setTimeout(focusSuccessIcon, ms));
    });

    return () => {
      if (interaction && typeof interaction.cancel === "function") {
        interaction.cancel();
      }
      timers.forEach(clearTimeout);
    };
  }, [showSuccessAlert, screenReaderEnabled]);
  
  
  
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
              iconRef={successIconRef}
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
              <Touchable
                accessible={true}
                accessibilityLabel="Edit Password"
                accessibilityRole="button"
                accessibilityHint="Double click to open edit password screen"
                minSize={0}
                style={[styles.buttons, styles.buttonsBg]}
                onPress={() => navigation.navigate("PasswordEdit")}
              >
                <Text style={[styles.makePayment, styles.titleFlexBox]}>Edit</Text>
              </Touchable>
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
                  <Touchable
                    accessible={true}
                    accessibilityLabel="Edit Security Question"
                    accessibilityRole="button"
                    minSize={0}
                    style={[styles.buttons, styles.buttonsBg]}
                    onPress={() => navigation.navigate("PasswordSecurityEdit")}
                  >
                    <Text style={[styles.makePayment, styles.titleFlexBox]}>
                      Edit
                    </Text>
                  </Touchable>
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
  frameChild: divider,
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
