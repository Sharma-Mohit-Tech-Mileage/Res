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
import SparkLightInput from "../common/customui/SparkLightInput";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { addPrimaryEmailRequest } from "../../redux/actions/NotificationActionSuite";
import AppStyles from "../utility/AppStyles";
const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .matches(emailRegex, "Invalid email address")
    .required("Email is required"),
});

const EmailNotifications = ({ navigation }) => {
  const dispatch = useDispatch();
  const [input, setInput] = useState("");
  const [enableButton, setEnableButton] = useState(false);
  const [keyboardHidden, setKeyboardHidden] = useState(true);
  const [textInputLayout, setTextInputLayout] = useState({});
  const scrollRef = useRef();
  const emailRef = useRef(null);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      email: "",
    },
  });

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

  const enableEmailNotifications = () => {
    dispatch(addPrimaryEmailRequest(input, "", navigation));
  };

  return (
    <View style={styles.container}>
      <ProfileSettingsHeader showIcon={false} title={"Notifications"} />
      <ScrollView
        ref={scrollRef}
        style={styles.inner}
        contentContainerStyle={styles.innerContent}
      >
        <>
          <View style={styles.headerTabView}>
            <View style={styles.headerTabOne} />
            <View style={styles.headerTabTwo} />
            <View style={styles.headerTabThree} />
          </View>
          <View
            style={[styles.viewContainer]}
            accessibilityLabel="Email notification setup section"
          >
            <View
              accessibilityRole="none"
              accessibilityLabel="Email notification options"
            >
              <View style={styles.headerIconViewContainer}>
                <View
                  style={styles.headerIconView}
                  accessibilityRole="text"
                  accessibilityLabel="Email notification icon"
                  accessible={true}
                >
                  <MailRingingIcon />
                </View>
              </View>
              <View
                style={styles.header}
                accessible={true}
                accessibilityRole="header" accessibilityLevel={2}
              >
                <Text
                  style={styles.headerText}
                  accessibilityRole="text"
                  accessibilityLabel="Turn on Email Notifications"
                >
                  Turn on Email Notifications
                </Text>
              </View>
              <View style={styles.subHeader} >
                <Text
                  style={styles.subHeaderText}
                  accessibilityRole="text"
                  accessible={true}
                  accessibilityLabel="Receive email alerts related to your account, updates and more from Sparklight"
                >
                  Receive email alerts related to your account, updates and more
                  from Sparklight.
                </Text>

                <Text
                  style={[AppStyles.requiredField, { textAlign: "center" }]}
                  accessibilityRole="text"
                  accessible={true}
                  accessibilityLabel="Fields marked with an asterisk are required"
                >
                  {" "}
                  Fields marked with * are required.
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
                <Text
                  style={styles.fieldLabel}
                  accessible={true}
                  accessibilityRole="text"
                  accessibilityLabel="Email Address required"
                >
                  Email Address *
                </Text>
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <SparkLightInput
                      ref={emailRef}
                      placeholder="Email Address"
                      onBlur={onBlur}
                      onChangeText={(text) => {
                        onChangeText(text);
                        onChange(text);
                      }}
                      value={value ? value.toLowerCase() : ""}
                      error={errors.email?.message}
                      accessibilityLabel="Email address Required"
                      accessibilityHint={"required text field. double tap to edit"}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      textContentType="emailAddress"
                      style={styles.emailInput}
                    />
                  )}
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
              onPress={handleSubmit(enableEmailNotifications, (errors) => {
                if (errors.email) emailRef.current?.focus();
              })}
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
                    routes: [{ name: "MyTab"}],
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
        </>
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
    marginTop: 25,
    marginBottom: 20,
    flexDirection: "column",
    width: "85%",
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
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.openSansRegular,
  },
  bottomContainer: {
    height: 100,
  },
  textBottomHeight: {
    height: 200,
  },
  fieldLabel: {
    fontFamily: FontFamily.openSansRegular,
    color: Color.sparklightGray1,
    fontSize: FontSize.size_sm,
    marginBottom: 5,
    fontWeight: "600",
  },
});

export default EmailNotifications;
