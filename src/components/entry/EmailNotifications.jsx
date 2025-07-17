import React, { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Pressable,
  Keyboard,
} from "react-native";
import {
  Color,
  FontFamily,
  FontSize,
  Padding,
  Border,
} from "../../../GlobalStyles";
import ProfileSettingsHeader from "../common/ProfileSettingsHeader";
import MailRingingIcon from "../../res/svgIcons/MailRingingIcon";
import EntryInput from "./EntryInput";
import { useSelector, useDispatch } from "react-redux";
import { addPrimaryEmailRequest } from "../../redux/actions/NotificationActionSuite";

const EmailNotifications = ({ navigation }) => {
  const dispatch = useDispatch();
  const [input, setInput] = useState("");
  const profile = useSelector((state) => state.combinedReducers.profile || {});
  const [enableButton, setEnableButton] = useState(false);
  const [keyboardHidden, setKeyboardHidden] = useState(true);
  const [textInputLayout, setTextInputLayout] = useState({});
  const scrollRef = useRef();
  
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
    if (
      profile.profileDetails &&
      profile.profileDetails.svEmailAddress &&
      profile.profileDetails.svEmailAddress !== "Multiple Emails" &&
      profile.profileDetails.svEmailAddress?.length > 0
    ) {
      setInput(profile.profileDetails.svEmailAddress);
      setEnableButton(true);
    }
  }, []);

  useEffect(() => {
    if (!keyboardHidden) {
      scrollRef.current?.scrollTo({
        y: textInputLayout.y,
        animated: true,
      });
    }
  }, [keyboardHidden]);

  const onChangeText = (text) => {
    setInput(text);
    setEnableButton(text?.length > 0);
  };

  const keyboardDismiss = () => {
    Keyboard.dismiss();
  };

  const enableEmailNotifications = () => {
    dispatch(addPrimaryEmailRequest(input, "", navigation));
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        style={styles.inner}
        contentContainerStyle={styles.innerContent}
      >
        <ProfileSettingsHeader showIcon={false} title={"Notifications"} />
        
        <View
          style={[styles.viewContainer, { marginTop: 90 }]}
          accessibilityLabel="Email notification setup section"
        >
          <View
            accessibilityRole="none"
            accessibilityLabel="Email notification options"
          >
            <View style={styles.headerIconViewContainer}>
              <View
                style={styles.headerIconView}
                accessibilityRole="image"
                accessibilityLabel="Email notification icon"
                accessible={true}
              >
                <MailRingingIcon />
              </View>
            </View>
            <View
              style={styles.header}
              accessible={true}
              accessibilityRole="header"
            >
              <Text
                style={styles.headerText}
                accessibilityRole="text"
                accessibilityLabel="Turn on Email Notifications"
              >
                Turn on Email Notifications
              </Text>
            </View>
            <View style={styles.subHeader} accessible={true}>
              <Text
                style={styles.subHeaderText}
                accessibilityRole="text"
                accessible={true}
                accessibilityLabel="Receive email alerts related to your account, updates and more from Sparklight"
              >
                Receive email alerts related to your account, updates and more
                from Sparklight.
              </Text>
            </View>
          </View>
          <>
            <View
              style={styles.subInput}
              onLayout={(event) => {
                setTextInputLayout(event.nativeEvent.layout);
              }}
              accessibilityRole="none"
              accessibilityLabel="Email address input section"
            >
              <EntryInput
                iconImage={require("../../../assets/mail.png")}
                placeholder="Email Address"
                input={input}
                onChangeText={onChangeText}
                onSubmitText={keyboardDismiss}
                keyboardType="email-address"
                accessibilityRole="search"
                accessibilityLabel="Email address input field"
                accessibilityHint="Double tap to enter your email address for notifications"
              />
            </View>
          </>
        </View>
        <View style={styles.bottomContainer} />
        <View style={styles.bottomBar}>
          <Pressable
            disabled={!enableButton}
            style={
              enableButton
                ? [styles.button, styles.buttonsLayout]
                : [styles.button, styles.buttonsLayout, styles.buttonDisabled]
            }
            onPress={enableEmailNotifications}
            accessibilityRole="button"
            accessibilityLabel={
              enableButton
                ? "Enable Email Notifications"
                : "Enable Email Notifications (disabled)"
            }
          >
            <Text
              style={
                enableButton
                  ? styles.accept
                  : [styles.accept, styles.buttonDisabledText]
              }
            >
              Enable Email Notifications
            </Text>
          </Pressable>
          <View style={styles.buttonsParent}>
            <Pressable
              style={[styles.buttonDecline, styles.buttonsLayout]}
              onPress={() => {
                navigation.reset({
                  index: 0,
                  routes: [{ name: "MyTab" }],
                });
              }}
              accessibilityRole="button"
              accessibilityLabel="Skip for now"
            >
              <Text style={styles.decline}>Skip for now</Text>
            </Pressable>
          </View>
        </View>
        {!keyboardHidden && <View style={styles.textBottomHeight} />}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    alignContent: "center",
    justifyContent: "center",
    height: "100%",
  },
  inner: {
    flex: 1,
  },
  innerContent: {
    justifyContent: "space-around",
  },
  headerTabView: {
    flexDirection: "row",
    width: "100%",
    marginTop: 30,
    justifyContent: "center",
  },
  headerTabOne: {
    backgroundColor: Color.colorMidnightblue,
    width: 100,
    height: 5,
  },
  headerTabTwo: {
    backgroundColor: Color.colorMidnightblue,
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
  header: {
    paddingTop: 16,
  },
  headerText: {
    fontFamily: FontFamily.openSansRegular,
    fontSize: 22,
    textAlign: "center",
    color: Color.colorGray_100,
  },
  subHeader: {
    paddingTop: 10,
  },
  subHeaderText: {
    fontFamily: FontFamily.openSansRegular,
    fontSize: 16,
    lineHeight: 25,
    textAlign: "center",
    color: Color.colorGray_100,
    marginHorizontal: 20,
    marginTop: 10,
  },
  subInput: {
    marginTop: 20,
    marginBottom: 20,
  },
  viewContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    marginTop: 50,
  },
  notificationAlert: {
    paddingTop: Padding.p_base,
    paddingHorizontal: Padding.p_5xl,
    alignSelf: "stretch",
  },
  bottomBar: {
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: Color.colorMidnightblue,
    marginBottom: 20,
    width: "90%",
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
    backgroundColor: Color.colorWhitesmoke_300,
    color: Color.colorGray_200,
  },
  buttonDisabledText: {
    color: Color.sparklightaddGray,
  },
  buttonsParent: {
    width: "90%",
  },
  accept: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.openSansRegular,
    textAlign: "center",
    color: Color.sparklightWhite,
  },
  decline: {
    color: Color.colorMidnightblue,
    textAlign: "center",
  },
  bottomContainer: {
    height: 170,
  },
  textBottomHeight: {
    height: 200,
  },
});

export default EmailNotifications;
