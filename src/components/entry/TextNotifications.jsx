import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Keyboard,
  Pressable,
  Platform,
  TouchableOpacity,
  Linking,
  AccessibilityInfo,
} from "react-native";
import {
  Color,
  FontFamily,
  FontSize,
  Padding,
  Border,
} from "../../../GlobalStyles";
import ProfileSettingsHeader from "../common/ProfileSettingsHeader";
import PhoneRingingIcon from "../../res/svgIcons/PhoneRingingIcon";
import EntryInput from "./EntryInput";
import SparklightCheckBox from "../common/customui/SparklightCheckBox";
import { useSelector, useDispatch } from "react-redux";
import { updateTextNotification } from "../../redux/actions/ProfileActionSuite";
import AlertIcon from "../../res/svgIcons/AlertIcon";
import NavigationUtils from "./NavigationUtils";
import { requiredField } from "../../styles/utilities";
import { FieldTitle, Hyperlink, HintText } from "../common/customui/Typography";
import Touchable from "../common/customui/Touchable";
import { A11Y } from "../../styles/theme";
import PrimaryButton from "../common/customui/PrimaryButton";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

const TextNotifications = ({ navigation }) => {
  const dispatch = useDispatch();
  const [input, setInput] = useState("");
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [enableButton, setEnableButton] = useState(false);
  const [keyboardHidden, setKeyboardHidden] = useState(true);
  const [textInputLayout, setTextInputLayout] = useState({});
  const [isTermRequired, setIsTermRequired] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const didSubmit = useRef(false);
  const scrollRef = useRef();
  const phoneInputRef = useRef(null);

  const user = useSelector((state) => state.user.userData);
  const profile = useSelector((state) => state.profile || {});
  const accountNumber = user?.userInfo?.accountNumber || "";

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardHidden(false);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHidden(true);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  useEffect(() => {
    if (profile.smsSubscription?.length > 0) {
      const phoneNum = profile.smsSubscription[0].phoneNum;
      if (phoneNum) {
        setInput(phoneNum.startsWith("1") ? phoneNum.substring(1) : phoneNum);
      }
    } else if (user?.userInfo?.phone) {
      setInput(user.userInfo.phone);
    }
  }, [profile, user]);

  useEffect(() => {
    if (!keyboardHidden && textInputLayout.y) {
      scrollRef.current?.scrollTo({
        y: textInputLayout.y,
        animated: true,
      });
    }
  }, [keyboardHidden, textInputLayout]);

  const onChangeText = (text) => {
    setInput(text);
    // Remove validation from here
    setError("");
    setEnableButton(toggleCheckBox && text.length > 0);
  };

  const onCheckBox = (value) => {
    setToggleCheckBox(value);
    setIsTermRequired(false);
    setEnableButton(value && input.length > 0);
  };

  const handleTermsLinkPress = useCallback(
    async (event) => {
      event?.stopPropagation();
      const url =
        "https://www.sparklight.com/legal/text-messaging-terms-and-conditions";

      try {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
          await Linking.openURL(url);
        } else {
          // Fallback to in-app webview if the device can't open the external URL
          navigation.navigate("ArticleWindowUtility", {
            url,
            name: "Terms & Conditions",
          });
        }
      } catch (err) {
        // On error, fallback to in-app webview
        navigation.navigate("ArticleWindowUtility", {
          url,
          name: "Terms & Conditions",
        });
      }
    },
    [navigation],
  );

  const keyboardDismiss = () => {
    Keyboard.dismiss();
  };

  const handleSkip = async () => {
    await NavigationUtils.navigateToNext(
      navigation,
      "EntryTextNotifications",
      profile,
      accountNumber
    );
    
  };

  const enableTextNotifications = async () => {
    if (loading || didSubmit.current) return; // Prevent double submission
    if (!toggleCheckBox) {
      setIsTermRequired(true);
      return;
    }

    // Phone validation on submit
    const phoneRegex = /^(?:\+?\d{10,11})$/;
    if (input.length === 0 || !phoneRegex.test(input)) {
      setError("Invalid mobile phone number.");
      setEnableButton(false);
      AccessibilityInfo.announceForAccessibility(
        "Invalid mobile phone number.",
      );
      setTimeout(() => {
        phoneInputRef.current?.focus();
      }, 300);
      return;
    }
    setError("");
    setEnableButton(true);

    setLoading(true); // Start loading

    const data = {
      accountNumber: accountNumber,
      billingOptOutStatus: false,
      optOut: false,
      outageOptOut: false,
      phoneNumber: input,
    };

    await dispatch(updateTextNotification(data, null));

    didSubmit.current = true; // Mark as submitted before navigation

    await NavigationUtils.navigateToNext(
      navigation,
      "EntryTextNotifications",
      profile,
      accountNumber,
    );

    // Only set loading to false if still on this screen
    if (!didSubmit.current) {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Reset didSubmit when component mounts
    didSubmit.current = false;
  }, []);

  return (
    <View style={styles.container}>
      <ProfileSettingsHeader showIcon={false} title={"Notifications"} />

      {/* <View style={styles.headerTabView}>
          <View style={styles.headerTabOne} />
          <View style={styles.headerTabTwo} />
          <View style={styles.headerTabThree} />
        </View> */}
      <ScrollView
        style={styles.inner}
        contentContainerStyle={styles.innerContent}
        ref={scrollRef}
      >
        <View style={styles.viewContainer}>
          <View>
            <View style={styles.headerIconViewContainer}>
              <View style={styles.headerIconView}>
                <PhoneRingingIcon />
              </View>
            </View>
            <View style={styles.header}>
              <Text style={styles.headerText}>Turn on Text Notifications</Text>
            </View>
            <View style={styles.subHeader}>
              <Text style={styles.subHeaderText}>
                Receive text alerts related to your account, updates and more
                from Sparklight.
              </Text>
            </View>
            <HintText
              style={[ { textAlign: "center", marginBottom: 8,marginTop: 20, }]}
              accessible={true}
              accessibilityRole="text"
              accessibilityLabel="Fields marked with asterisk are required."
            >
              Fields marked with * are required.
            </HintText>
          </View>

          <View
            style={styles.subInput}
            onLayout={(event) => {
              setTextInputLayout(event.nativeEvent.layout);
            }}
          >
            <FieldTitle
              style={{ marginBottom: 8 }}
              accessible={true}
              accessibilityLabel="Mobile Number Required"
              accessibilityRole="text"
            >
              Mobile Number *
            </FieldTitle>
            <EntryInput
              ref={phoneInputRef}
              name="phone"
              placeholder="Phone number"
              accessibilityHint={"required text field. double tap to edit."}
              input={input}
              style={error ? styles.errorInput : undefined}
              onChangeText={onChangeText}
              onSubmitText={keyboardDismiss}
              keyboardType="number-pad"
            />
            {error ? (
              <View style={styles.errorContainer}>
                <AlertIcon />
                <Text style={styles.errorText}> {error}</Text>
              </View>
            ) : null}
          </View>
        </View>

        

        <View style={styles.bottomBar}>
           
      <View style={[styles.checkboxSection]}>
          <View style={styles.checkBoxArea}>
            <Touchable
              style={styles.checkboxTouchable}
              onPress={() => onCheckBox(!toggleCheckBox)}
              accessibilityRole="checkbox"
              accessibilityLabel="I agree to Text Messaging Terms and Conditions"
              accessibilityState={{ checked: toggleCheckBox }}
              minSize={0}
            >
              <SparklightCheckBox
                disabled={true}
                value={toggleCheckBox}
                boxStyle={styles.checkBox}
                accessible={false}
                importantForAccessibility="no"
              />
            </Touchable>
            <Text
              style={[styles.checkBoxAreaViewText, styles.checkBoxTextWrapper]}
              allowFontScaling={true}
              maxFontSizeMultiplier={1}
            >
              I agree to{' '}
              <Hyperlink
                onPress={handleTermsLinkPress}
                accessibilityRole="link"
                accessibilityLabel="View Text Messaging Terms and Conditions"
                allowFontScaling={true}
                maxFontSizeMultiplier={1}
              >
                Text Messaging Terms & Conditions
              </Hyperlink>
            </Text>
          </View>

          {/* Add error message display */}
          {isTermRequired && (
            <View
              style={styles.errorContainer}
              accessible={true}
              accessibilityRole="alert"
              accessibilityLiveRegion="assertive"
              accessibilityLabel="Error: Please agree to the Terms and Conditions to proceed"
            >
              <AlertIcon />
              <Text style={styles.errorText} importantForAccessibility="no">
                Please agree to the Terms & Conditions to proceed.
              </Text>
            </View>
          )}
        </View>


          <PrimaryButton
            disabled={!enableButton || loading}
            accessibilityRole="button"
            buttonType="submit"
            title="Enable Text Notifications"
            accessibilityState={{ disabled: !enableButton || loading }}
            accessibilityLabel="Enable Text Notifications"
            accessibilityHint="Activates text message notifications for your account."
            style={[
              styles.button,
              (!enableButton || loading) && styles.buttonDisabled,
            ]}
            onPress={enableTextNotifications}
          >
            {/* <Text
              style={[
                styles.accept,
                (!enableButton || loading) && styles.buttonDisabledText,
              ]}
            >
              Enable Text Notifications
            </Text> */}
          </PrimaryButton>

          <View style={styles.buttonsParent}>
            <PrimaryButton
              style={[styles.buttonDecline]}
              onPress={handleSkip}
              buttonType="cancel"
              title="Skip for now"
              accessibilityLabel="Skip Button"
              accessibilityRole="button"
              accessibilityHint="Skip Text Notifications"
            ></PrimaryButton>
          </View>
        </View>

        {!keyboardHidden && <View style={styles.textBottomHeight} />}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomBar: {
    marginHorizontal: 24,
    marginBottom: hp("15%"),
  },
  bottomContainer: {
    height: 40,
  },
  buttonDecline: {
    marginBottom: hp("5%"),
  },
  button: {
    width: "90%",
  },
  buttonDisabled: {
    backgroundColor: Color.colorWhitesmoke_300,
  },
  buttonDisabledText: {
    color: Color.sparklightaddGray,
  },
  buttonsLayout: {
    paddingVertical: Padding.p_base,
    paddingHorizontal: 0,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Border.br_11xs,
    minHeight: 50,
  },
  buttonsParent: {
    width: "100%",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkBox: {
    width: 16,
    height: 16,
    marginTop: 0,
    marginRight: Platform.OS === "ios" ? 8 : 8,
  },
  checkBoxArea: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    width: "100%",
    minHeight: A11Y.minTouch,
    paddingVertical: Padding.p_5xs,
  },
  checkBoxTextWrapper: {
    flex: 1,
    flexWrap: "wrap",
    marginLeft: 8,
  },
  termsLinkText: {
    color: Color.sparklightBrightPurple,
    textDecorationLine: "underline",
  },
  checkboxSection: {
    paddingHorizontal: 16,
    alignSelf: "flex-start",
    justifyContent: 'flex-start',
    width: "95%",
    marginTop: Padding.p_base,
  },
 checkboxTouchable: {
    flexDirection: "row",
    marginRight: 0,
    paddingVertical: Padding.p_9xs,
    marginLeft: 8,
  },
  termsLinkTouchable: {
    minHeight: A11Y.minTouch,
    justifyContent: "center",
    paddingVertical: Padding.p_5xs,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    flexWrap: "wrap",
    
  },
  checkBoxAreaViewText: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.RadioCanadaRegular,
    color: Color.sparklightGray1,
    flexShrink: 1,
    flexWrap: "wrap",
  },
    errorContainer: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  errorContent: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  errorToggle: {
    color: Color.sparkLightRed,
    fontFamily: FontFamily.RadioCanadaSemiBold,
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 4,
  },
  accept: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.RadioCanadaRegular,
    textAlign: "center",
    color: Color.sparklightWhite,
  },
  decline: {
    fontSize: FontSize.size_sm,
    fontFamily: FontFamily.RadioCanadaRegular,
    color: Color.colorMidnightblue,
    textAlign: "center",
  },
  inner: {
    flex: 1,
    backgroundColor: Color.sparklightWhite,
  },
  innerContent: {
    flexGrow: 1,
    backgroundColor: Color.sparklightWhite,
    justifyContent: "space-between",
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: Color.sparklightWhite,
  },
  headerIconViewContainer: {
    alignItems: "center",
  },
  headerIconView: {
    backgroundColor: "#FEFEFE",
    padding: 20,
    borderRadius: 100,
    borderColor: "#EEE",
    borderWidth: 1,
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    marginBottom: 10,
  },
  headerTabView: {
    flexDirection: "row",
    width: "100%",
    marginTop: 30,
    justifyContent: "center",
  },
  headerTabOne: {
    backgroundColor: Color.sparklightSecondaryPurple + "1A",
    width: 100,
    height: 5,
  },
  headerTabTwo: {
    backgroundColor: Color.sparklightSecondaryPurple,
    width: 100,
    height: 5,
    marginLeft: 10,
  },
  fieldLabel: {
    fontFamily: FontFamily.RadioCanadaRegular,
    color: Color.sparklightGray1,
    fontSize: FontSize.size_sm,
    fontWeight: "600",
    marginBottom: 8,
  },
  headerTabThree: {
    backgroundColor: Color.sparklightSecondaryPurple + "1A",
    width: 100,
    height: 5,
    marginLeft: 10,
  },
  header: {
    paddingTop: 10,
  },
  headerText: {
    fontFamily: FontFamily.RadioCanadaRegular,
    fontSize: 22,
    textAlign: "center",
    color: Color.colorGray_100,
  },
  subHeader: { paddingTop: 10 },
  subHeaderText: {
    fontFamily: FontFamily.RadioCanadaRegular,
    fontSize: 16,
    lineHeight: 25,
    textAlign: "center",
    color: Color.colorGray_100,
    paddingHorizontal: 0,
  },
  subInput: {
    marginTop: 10,
    flexDirection: "column",
  },
  viewContainer: {
     paddingVertical: 16,
     paddingHorizontal: 16,
     width: "100%",
     alignItems: "center",
     justifyContent: "center",
     flex: 1,
  },
  textBottomHeight: { height: 200, marginBottom: hp("15%"), },
  errorInput: {
    borderColor: "red",
    borderWidth: 1,
  },
  errorText: {
    marginLeft: 8,
    color: "red",
    fontSize: 14,
    lineHeight: 20,
  },
  requiredField: {
    marginTop: 20,
    fontFamily: FontFamily.RadioCanadaRegular,
    fontWeight: "400",
    fontSize: FontSize.size_sm,
    color: Color.sparklightGray1,
  },
});

export default TextNotifications;
