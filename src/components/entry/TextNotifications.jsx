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
  Linking
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
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import SparkLightInput from "../common/customui/SparkLightInput";
import CheckBox from "@react-native-community/checkbox";
import { useSelector, useDispatch } from "react-redux";
import { updateTextNotification } from "../../redux/actions/ProfileActionSuite";
import Phone from "../../res/svgIcons/Phone";
import AlertIcon from "../../res/svgIcons/AlertIcon";
import { getPrimaryEmail } from "../../components/utility/constant";
// Define your validation schema
  const validationSchema = yup.object().shape({
    phoneNumber: yup
      .string()
      .matches(
        /^(?:1)?\s*(?:\([2-9]\d{2}\)\s*|[2-9]\d{2}[- ]?)?[2-9]\d{2}[- ]?\d{4}(?:\s*(?:ext|x)\s*\d{2,6})?$/,
        "Invalid mobile phone number."
      )
      .required("Phone number is required"),
    
  });

const TextNotifications = ({ navigation }) => {
  const dispatch = useDispatch();
  const [input, setInput] = useState("");
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [enableButton, setEnableButton] = useState(false);
  const [nextScreen, setNextScreen] = useState("EntryEmailNotifications");
  const user = useSelector((state) => state.combinedReducers.user.userData);
  const profile = useSelector((state) => state.combinedReducers.profile || {});
  const [keyboardHidden, setKeyboardHidden] = useState(true);
  const [textInputLayout, setTextInputLayout] = useState({});
  const [isTermRequired, setIsTermRequired] = useState(false);
  const scrollRef = useRef();
  const [error, setError] = useState("");
  const accountDetails = useSelector(
    (state) => state.combinedReducers.profile?.accountDetails
  );
  
  const {
      control,
      handleSubmit,
      setValue,
      getValues,
      formState: { errors },
    } = useForm({
      resolver: yupResolver(validationSchema),
      defaultValues: {
        phoneNumber: "",
        
      },
    });
  

  //   useEffect(() => {
  //     const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
  //       setKeyboardHidden(false);
  //     });

  //     const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
  //       setKeyboardHidden(true);
  //     });

  //     return () => {
  //       showSubscription.remove();
  //       hideSubscription.remove();
  //     };
  //   }, []);

  //   useEffect(() => {
  //     if (!keyboardHidden) {
  //       scrollRef.current?.scrollTo({
  //         y: textInputLayout.y,
  //         animated: true,
  //       });
  //     }
  //   }, [keyboardHidden]);

  useEffect(() => {
    if (
      profile.paperLessInfo !== undefined &&
      profile.paperLessInfo.accountNumber !== undefined &&
      profile.paperLessInfo.accountNumber.length > 0 &&
      profile.paperLessInfo.paperlessStatus !== undefined &&
      (profile.paperLessInfo.paperlessStatus.toLowerCase() === "approved" ||
        profile.paperLessInfo.paperlessStatus.toLowerCase() === "active")
    ) {
      setNextScreen("MyTab");
    }
    console.log("Account Details in Text Notification: ", accountDetails);
    if (accountDetails) {
      const updatedPrimaryEmail = getPrimaryEmail(accountDetails);
      console.log("Updated Primary Email: ", updatedPrimaryEmail);
      if (updatedPrimaryEmail && updatedPrimaryEmail.length > 0) {
        setNextScreen("MyTab");
      }
    }
  }, []);

  //   useEffect(() => {
  //     if (profile.smsSubscription?.length > 0) {
  //       if (
  //         profile.smsSubscription[0].phoneNum !== undefined &&
  //         profile.smsSubscription[0].phoneNum.length > 0
  //       ) {
  //         setInput(profile.smsSubscription[0].phoneNum.substring(1));
  //       }
  //     } else {
  //       setInput(user.userInfo.phone);
  //     }
  //   }, []);

  const onChangeText = (text) => {
    setInput(text);
    if (toggleCheckBox && text.length > 0) {
      setEnableButton(true);
    } else {
      setEnableButton(false);
    }
    
  };
  const handleCheckboxToggle = useCallback(() => {
    setToggleCheckBox(!toggleCheckBox);
    console.log("toggleCheckBox", !toggleCheckBox, input);
    if (toggleCheckBox) {
      setEnableButton(true);
    } else {
      setEnableButton(false);
    }
  }, [toggleCheckBox]);

  const onCheckBox = (value) => {
    setToggleCheckBox(value);
    if (value && input !== undefined && input !== null && input.length > 0) {
      setEnableButton(true);
    } else {
      setEnableButton(false);
    }
  };

  const handleTermsLinkPress = useCallback(
    (event) => {
      event.stopPropagation();
    //   navigation.navigate("ArticalWindowUtility", {
    //     url: "https://www.sparklight.com/legal/text-messaging-terms-and-conditions",
    //     name: "Terms & Conditions",
    //   });
        Linking.openURL(
            "https://www.sparklight.com/legal/text-messaging-terms-and-conditions"
        );
    },
    [navigation]
  );

  const keyboardDismiss = () => {
    Keyboard.dismiss();
  };

  const enableTextNotifications = () => {
    const data = {
      accountNumber: user.userInfo.accountNumber,
      billingOptOutStatus: true,
      optOut: true,
      outageOptOut: true,
      phoneNumber: input,
    };
    console.log("enableTextNotifications: ", data);
    //{"accountNumber": "900690538", "billingOptOutStatus": false, "optOut": false, "outageOptOut": false, "phoneNumber": ""}
    if (toggleCheckBox && input.length > 0) {
      dispatch(updateTextNotification(data, null));
      navigation.reset({
        index: 0,
        routes: [{ name: nextScreen }],
      });
    } else {
      setIsTermRequired(true);
    }
  };

  return (
    <View style={styles.container}>
      <ProfileSettingsHeader showIcon={false} title={"Notifications"} />
      <ScrollView
        style={styles.inner}
        contentContainerStyle={styles.innerContent}
        ref={scrollRef}
        keyboardShouldPersistTaps="always"
      >
        <>
          <View style={styles.headerTabView}>
            <View style={styles.headerTabOne} />
            <View style={styles.headerTabTwo} />
            <View style={styles.headerTabThree} />
          </View>
          <View style={styles.viewContainer}>
            <View>
              <View style={styles.headerIconViewContainer}>
                <View style={styles.headerIconView}>
                  <PhoneRingingIcon />
                </View>
              </View>
              <View style={styles.header}>
                <Text style={styles.headerText}>
                  Turn on Text Notifications
                </Text>
              </View>
              <View style={styles.subHeader}>
                <Text style={styles.subHeaderText}>
                  Receive text alerts related to your account, updates and more
                  from Sparklight.
                </Text>
              </View>
            </View>
            <View
              style={[styles.subInput,{width: "85%"}]}
              onLayout={(event) => {
                //setTextInputLayout(event.nativeEvent.layout);
              }}
            >
              <Controller
                control={control}
                name="phoneNumber"
                render={({ field: { onChange, onBlur, value } }) => (
                  <SparkLightInput
                    placeholder="Mobile Number"
                    keyboardType="number-pad"
                    onBlur={onBlur}
                    onChangeText={(text) => {
                      onChangeText(text);
                      onChange(text);
                    }}
                    value={value}
                    error={errors.phoneNumber?.message}
                    maxLength={11}
                  />
                )}
              />
              {/* <EntryInput
                name="phone"
                placeholder="Phone number"
                input={input}
                style={error ? styles.errorInput : {}}
                onChangeText={onChangeText}
                onSubmitText={keyboardDismiss}
                keyboardType="number-pad"
              />
              {error ? <Text style={styles.errorText}>{error}</Text> : null} */}
            </View>
          </View>
          <View style={styles.bottomContainer}></View>

          <View
            style={{
              marginHorizontal: 20,
              marginVertical: 20,
              marginBottom: 50,
            }}
          >
            <View style={styles.checkBoxArea}>
              <TouchableOpacity
                style={styles.checkboxTouchable}
                onPress={onCheckBox.bind(null, !toggleCheckBox)}
                accessibilityRole="checkbox"
                accessibilityLabel="I agree to Text Messaging Terms and Conditions"
                accessibilityState={{ checked: toggleCheckBox }}
              >
                <View style={styles.checkboxContainer}>
                  <CheckBox
                    disabled={true}
                    value={toggleCheckBox}
                    onValueChange={onCheckBox.bind(null, !toggleCheckBox)}
                    style={styles.checkBox}
                    boxType="square"
                    tintColors={{
                      true: "#1B99FF",
                      false:
                        Platform.OS === "ios"
                          ? Color.colorWhitesmoke_300
                          : "#D0D5DD",
                    }}
                    accessible={false}
                  />
                  <Text
                    style={[styles.checkBoxAreaViewText, { marginLeft: 4 }]}
                    allowFontScaling={true}
                    maxFontSizeMultiplier={1}
                  >
                    I agree to{" "}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleTermsLinkPress}
                accessibilityRole="link"
                accessibilityLabel="View Text Messaging Terms and Conditions"
                accessibilityHint="Opens Text Messaging Terms and Conditions in a new window"
              >
                <Text
                  style={[
                    styles.checkBoxAreaViewText,
                    {
                      color: Color.sparklightBrightPurple,
                      textDecorationLine: "underline",
                    },
                  ]}
                  allowFontScaling={true}
                  maxFontSizeMultiplier={1}
                >
                  Text Messaging Terms & Conditions
                </Text>
              </TouchableOpacity>
            </View>
            {isTermRequired && (
              <View style={{ paddingTop: 8, flexDirection: "row" }}>
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    alignItems: "center",
                  }}
                >
                  <AlertIcon />
                  <Text style={styles.ErrorToggle}>
                    Please agree to the Terms & Conditions to proceed.
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* <View style={styles.checkBoxArea}>
                        <View style={Platform.OS == "ios" ? styles.checkBoxView : styles.checkBoxViewAndroid }>
                            <CheckBox
                                disabled={false}
                                value={toggleCheckBox}
                                onValueChange={onCheckBox}
                                style={Platform.OS == "ios" ? styles.checkBox : styles.checkBoxAndroid} 
                                boxType="square"
                                tintColors={{ true: Color.colorMidnightblue, false: Platform.OS == "ios" ? Color.colorWhitesmoke_300 : '#D0D5DD' }}
                            />   
                        </View>
                        <View style={styles.checkBoxAreaView}>
                            <Text style={styles.checkBoxAreaViewText}>I understand that message and data rates may apply. Message frequency may vary.</Text>
                        </View>             
                    </View>                                 */}
          <View style={styles.bottomBar}>
            <Pressable
              disabled={!enableButton}
              accessibilityRole="button"
              accessibilityState={{ disabled: !enableButton }}
              accessibilityLabel="Enable Text Notifications"
              accessibilityHint="Activates text message notifications for your account."
              style={
                enableButton
                  ? [styles.button, styles.buttonsLayout]
                  : [styles.button, styles.buttonsLayout, styles.buttonDisabled]
              }
              onPress={handleSubmit(enableTextNotifications)}
            >
              <Text
                style={
                  enableButton
                    ? styles.accept
                    : [styles.accept, styles.buttonDisabledText]
                }
              >
                Enable Text Notifications
              </Text>
            </Pressable>
            <View
              style={styles.buttonsParent}
              accessibilityLabel="Buttons Section"
            >
              <Pressable
                style={[styles.buttonDecline, styles.buttonsLayout]}
                onPress={() => {
                  navigation.reset({
                    index: 0,
                    routes: [{ name: nextScreen }],
                  });
                }}
                accessibilityLabel="Skip Button"
                accessibilityRole="button"
                accessibilityHint="Skip Terms and Conditions"
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
  bottomBar: {
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },
  bottomContainer: {
    height: 100,
  },
  buttonDecline: {
    marginBottom: 50,
  },
  button: {
    backgroundColor: Color.colorMidnightblue,
    marginBottom: 20,
    width: "90%",
  },
  buttonDisabled: {
    backgroundColor: Color.colorWhitesmoke_300,
    color: Color.colorGray_200,
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
    width: "90%",
  },
  checkBox: {
    marginLeft: 10,
    marginRight: 20,
    width: 12,
    height: 12,
    backgroundColor: Color.colorWhitesmoke_100,
  },
  checkBoxView: {
    width: 12,
    height: 12,
    marginRight: Platform.OS == "ios" ? 20 : 30,
    marginTop: 10,
    backgroundColor: Color.colorWhitesmoke_100,
  },
  checkBoxAndroid: {
    //marginLeft: 10,
    //marginRight: 20,
    //width: 12,
    //height: 12,
    //backgroundColor: Color.colorWhitesmoke_100
  },
  checkBoxViewAndroid: {
    //width: 20,
    //height: 20,
    //margin: 10,
    //backgroundColor: '#000',
    marginRight: 10,
    marginLeft: 10,
    // marginTop: 10,
    //backgroundColor: Color.colorWhitesmoke_100
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkBox: {
    width: 12,
    height: 12,
    marginRight: Platform.OS === "ios" ? 2 : 16,
    backgroundColor: Color.colorWhitesmoke_100,
  },
  checkBoxArea: {
    flexDirection: "row",
    marginLeft: 4,
    alignSelf: "center",
  },
  checkboxTouchable: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 0,
  },
  checkBoxAreaViewText: {
    fontSize: 14,
    fontFamily: FontFamily.openSansRegular,
    color: Color.colorGray_200,
  },
  accept: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.openSansRegular,
    textAlign: "center",
    color: Color.sparklightWhite,
  },
  decline: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.openSansRegular,
    color: Color.colorMidnightblue,
    textAlign: "center",
  },
  inner: {
    flex: 1,
  },
  innerContent: {
    justifyContent: "space-around",
    //flex: 1
  },
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    alignContent: "center",
    justifyContent: "center",
    height: "100%",
  },
  scrollViewContainer: {
    padding: 20,
    marginBottom: 0,
  },
  scrollViewContentContainer: {
    paddingBottom: 30,
  },
  sparklightImageView: {
    width: 100,
    height: 25,
    marginBottom: 10,
    marginTop: 10,
  },
  ErrorToggle: {
    color: Color.sparkLightRed,
    fontFamily: FontFamily.openSansSemiBold,
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 4,
  },
  sparklightImage: {
    tintColor: "#CCC",
    width: "100%",
    height: "100%",
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
    backgroundColor: Color.colorWhitesmoke_300,
    width: 100,
    height: 5,
    marginLeft: 10,
  },
  header: {
    paddingTop: 10,
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
    paddingHorizontal: 20,
  },
  subInput: {
    marginVertical: 20,
  },
  viewContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    marginTop: 50,
  },
  textBottomHeight: {
    height: 200,
  },
  errorInput: {
    borderColor: "red",
    borderWidth: 1,
  },
  errorText: {
    marginTop: 8,
    color: "red",
    fontSize: 14,
  },
});

export default TextNotifications;
