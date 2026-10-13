import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, Text, Pressable, Keyboard, AccessibilityInfo } from "react-native";
import {
  Color,
  FontFamily,
  FontSize,
  Padding,
  Border,
} from "../../styles/GlobalStyles";
import ProfileSettingsHeader from "../common/ProfileSettingsHeader";
import MailRingingIcon from "../../res/svgIcons/MailRingingIcon";
import EntryInput from "./EntryInput";
import { PostApiRequest } from "../../network/RestApiClient";
import { getEndpoint,ENDPOINTS } from "../../network/apis/endpoints/Endpoints";
import { getUser } from "../../redux/utils/LocalStorage";
import AlertIcon from "../../res/svgIcons/AlertIcon";
import PrimaryButton from "../common/customui/PrimaryButton";
import {FieldTitle,HintText} from "../common/customui/Typography";
import { hp } from "../../utils/responsive";
import { ScreenScroll } from "../common/customui/Screen";

const EmailNotifications = ({ navigation }) => {
  const [input, setInput] = useState("");
  const [enableButton, setEnableButton] = useState(false);
  const [keyboardHidden, setKeyboardHidden] = useState(true);
  const [textInputLayout, setTextInputLayout] = useState({});
  const [error, setError] = useState("");
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const scrollRef = useRef();
  const emailInputRef = useRef(null);

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
    if (!keyboardHidden && textInputLayout.y) {
      scrollRef.current?.scrollTo({
        y: textInputLayout.y,
        animated: true,
      });
    }
  }, [keyboardHidden, textInputLayout]);

  const onChangeText = (text) => {
    setInput(text);
    // Do not set error here
    setEnableButton(text.length > 0);
    if (submitAttempted) setError(""); // Clear error if user edits after submit
  };

  const keyboardDismiss = () => {
    Keyboard.dismiss();
  };

  const enableEmailNotifications = async () => {
    setSubmitAttempted(true);
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(input)) {
      setError("Invalid email address.");
      setTimeout(() => {
        emailInputRef.current?.focus();
      }, 300);
      return;
    }
    setError("");
    try {
      const user = await getUser();
      const data = {
        account: user.userInfo.accountNumber,
        newEmail: input,
        oldEmail: "",
      };

      const request = getEndpoint(ENDPOINTS.UPDATE_EMAIL_ADD_PRIMARY);

      PostApiRequest(
        request,
        data,
        (res) => {
          navigation.reset({
            index: 0,
            routes: [{ name: "MyTab" }],
          });
        },
        (error) => {
          console.warn("Error updating email:", error);
          navigation.reset({
            index: 0,
            routes: [{ name: "MyTab" }],
          });
        }
      );
    } catch (error) {
      console.warn("Error enabling email notifications:", error);
      navigation.reset({
        index: 0,
        routes: [{ name: "MyTab" }],
      });
    }
  };

  const skipEmailNotifications = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "MyTab" }],
    });
  };

  return (
    <View style={styles.container}>
      <ProfileSettingsHeader showIcon={false} title={"Notifications"} />

        {/* <View style={styles.headerTabView}>
          <View style={styles.headerTabOne} />
          <View style={styles.headerTabTwo} />
          <View style={styles.headerTabThree} />
        </View> */}
      <ScreenScroll
        style={styles.inner}
        contentContainerStyle={styles.innerContent}
        ref={scrollRef}
      >
        <View style={styles.container}>

        <View style={styles.viewContainer}>    
          <View>
            <View style={styles.headerIconViewContainer}>
              <View style={styles.headerIconView}>
                <MailRingingIcon />
              </View>
            </View>
            <View style={styles.header}>
              <Text style={styles.headerText}>Turn on Email Notifications</Text>
            </View>
            <View style={styles.subHeader}>
              <Text style={styles.subHeaderText}>
                Receive email alerts related to your account, updates and more
                from Sparklight.
              </Text>
            </View>
            <HintText
              style={[{ textAlign: "center",marginTop: 20, }]}
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
            <FieldTitle style={styles.fieldLabel} accessible={true} accessibilityLabel="Email Address Required" accessibilityRole="text">
              Email Address *
            </FieldTitle>
            <EntryInput
              ref={emailInputRef}
              placeholder="Email Address"
              accessibilityHint={'required text field. double tap to edit.'}
              input={input}
              style={error && submitAttempted ? styles.errorInput : undefined}
              onChangeText={onChangeText}
              onSubmitText={keyboardDismiss}
              keyboardType="email-address"
            />
            {error && submitAttempted ? (
              <View style={styles.errorContainer}>
                <AlertIcon />
                <Text style={styles.errorText}> {error}</Text>
              </View>
            ) : null}
          </View>
        </View>

        

        <View style={styles.bottomBar}>
          <PrimaryButton
            disabled={!enableButton}
            accessible={true}
            buttonType="submit"
            accessibilityRole="button"
            accessibilityState={{ disabled: !enableButton }}
            accessibilityLabel="Enable Email Notifications"
            accessibilityHint="Taps to enable email notifications for your account."
            style={[
              styles.button,
              styles.buttonsLayout,
              !enableButton && styles.buttonDisabled,
            ]}
            onPress={enableEmailNotifications}
            title="Enable Email Notifications"
          >
            {/* <Text
              style={[
                styles.accept,
                !enableButton && styles.buttonDisabledText,
              ]}
            >
              Enable Email Notifications
            </Text> */}
          </PrimaryButton>

          <View style={styles.buttonsParent}>
            <PrimaryButton
              style={[styles.buttonDecline]}
              onPress={skipEmailNotifications}
              accessibilityLabel="Skip for now"
              accessibilityRole="button"
              buttonType="cancel"
              accessibilityHint="Skip Email Notifications"
              title="Skip for now"
            >
              
            </PrimaryButton>
          </View>
        </View>

        {!keyboardHidden && <View style={styles.textBottomHeight} />}
        
        </View>
      </ScreenScroll>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomBar: {
    marginHorizontal: 24,
    marginBottom: hp("15%"),
  },
  buttonDecline: {
    marginBottom: 50,
  },
  button: {
    backgroundColor: Color.colorMidnightblue,
    marginBottom: 20,
    width: "100%",
  },
  buttonsLayout: {
    paddingVertical: Padding.p_base,
    paddingHorizontal: 0,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Border.br_11xs,
    minHeight: 50,
  },
  buttonDisabled: {
    backgroundColor: Color.Gray300,
  },
  buttonDisabledText: {
    color: Color.sparklightGray1,
  },
  buttonsParent: {
    width: "100%",
  },
  accept: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.RadioCanadaRegular,
    textAlign: "center",
    color: Color.sparklightWhite,
  },
  decline: {
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
  },
  headerIconViewContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  headerIconView: {
    backgroundColor: Color.offWhite,
    padding: 20,
    borderRadius: 100,
    borderColor: Color.dividerLight,
    borderWidth: 1,
    shadowColor: Color.shadowDark,
    shadowOffset: { width: -2, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    marginBottom: 10,
  },
  header: {
    paddingTop: 10,
    marginHorizontal: Padding.p_5xl,
  },
  headerText: {
    fontFamily: FontFamily.RadioCanadaRegular,
    fontSize: 22,
    textAlign: "center",
    color: Color.colorGray_100,
  },
  subHeader: {
    paddingTop: 10,
    marginHorizontal: Padding.p_xs,
  },
  subHeaderText: {
    fontFamily: FontFamily.RadioCanadaRegular,
    fontSize: 16,
    lineHeight: 25,
    textAlign: "center",
    color: Color.sparklightGray1,
    marginTop: 10,
  },
  subInput: {
    marginVertical: Padding.p_5xl,
    flexDirection: "column",
  },
  fieldLabel: {
    marginBottom:8
  },
  viewContainer: {
     paddingVertical: 16,
     paddingHorizontal: 16,
     width: "100%",
     alignItems: "center",
     justifyContent: "center",
     flex: 1,
  },
  textBottomHeight: {
    height: 200,
     marginBottom: hp("15%"),
  },
  bottomContainer: {
    height: 10,
  },
  headerTabView: {
    flexDirection: "row",
    width: "100%",
    marginTop: 30,
    justifyContent: "center",
  },
  headerTabOne: {
    backgroundColor: Color.colorMidnightblue+"1A",
    width: 100,
    height: 5,
  },
  headerTabTwo: {
    backgroundColor: Color.colorMidnightblue+"1A",
    width: 100,
    height: 5,
    marginLeft: 10,
  },
  headerTabThree: {
    backgroundColor: Color.colorMidnightblue,
    width: 100,
    height: 5,
    marginLeft: 10,
  },
  errorContainer: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
  },
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
});

export default EmailNotifications;
