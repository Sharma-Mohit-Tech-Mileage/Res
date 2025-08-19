import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Image,
  StyleSheet,
  Text,
  Pressable,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import CheckBox from "@react-native-community/checkbox";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRoute } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { updateTextNotification } from "../../../redux/actions/ProfileActionSuite";
import SparkLightInput from "../../common/customui/SparkLightInput";
import ProfileSettingsHeader from "../../common/ProfileSettingsHeader";
import NotificationAlert from "../../common/customui/NotificationAlert";
import {
  Color,
  FontFamily,
  FontSize,
  Padding,
  Border,
} from "../../../../GlobalStyles";

import Toggle from "../../common/Toggle";
import AlertIcon from "../../../../assets/svgs/Alerttriangle";
import { widthPercentageToDP } from "react-native-responsive-screen";

// Define your validation schema
const validationSchema = yup.object().shape({
  phoneNumber: yup
    .string()
    .matches(
      /^(?:(\+1|1)?\s*(?:\([2-9]\d{2}\)\ ?|[2-9]\d{2}[- ]?)[2-9]\d{2}[- ]?\d{4}(?:\s*(?:ext|x)\s*\d{2,6})?)?$/,
      "Invalid mobile phone number."
    )
    .required("Phone number is required"),
  optOut: yup.boolean(),
  outageOptOut: yup.boolean(),
  billingOptOutStatus: yup.boolean(),
});
const TextNotifications = ({ navigation }) => {
  const scrollViewRef = useRef(null);
  const route = useRoute();
  const dispatch = useDispatch();
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorText, setErrorText] = useState(false);
  const formatedData = route.params?.additionalData;
  const [isCheckboxVisible, setIsCheckboxVisible] = useState(false);
  const [toggleCheckBoxTerm, setToggleCheckBoxTerm] = useState(false);
  const [isTermRequired, setIsTermRequired]= useState(false)
  const [message1, setMessage1] = useState('You are subscribing to text message alerts. Reply STOP to cancel at any time. Call 1-800-123-4567 for support. Message and data rates may apply.')
  const [message,setMessage]=useState('Please enter your mobile phone number below and then select the type of message you would like to receive.')
  console.log("pass data", route.params?.additionalData);
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      phoneNumber: formatedData?.phoneNumber || "",
      optOut: formatedData?.optOut || false,
      outageOptOut: formatedData?.outageOptOut || false,
      billingOptOutStatus: formatedData?.billingOptOutStatus || false,
      accountNumber: "",
    },
  });

  const handleCheckboxToggle = useCallback(() => {
    setToggleCheckBoxTerm(!toggleCheckBoxTerm);
  }, [toggleCheckBoxTerm]);

  const handleTermsLinkPress = useCallback(
    (event) => {
      event.stopPropagation();
      navigation.navigate("ArticalWindowUtility", {
        url: "https://www.sparklight.com/legal/text-messaging-terms-and-conditions",
        name: "Terms & Conditions",
      });
    },
    [navigation]
  );

  useEffect(() => {
    if (formatedData?.phoneNumber) {
      setIsCheckboxVisible(false);
      setMessage('Please enter the mobile phone number you would like to receive all future customer communications. You may opt out at any time.')
      setMessage1('You are subscribed to text message alerts. Reply STOP to cancel at any time. Call 1-800-123-4567 for support. Message and data rates may apply.')
    } else {
      setIsCheckboxVisible(true);
    }

  }, []);

  useEffect(() => {
    if (route.params?.updateFailed) {
      setErrorText("Something went wrong. Please try again.");
      setShowErrorAlert(true);
      scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
      navigation.setParams({ updateFailed: undefined });
    }
  }, [route.params?.updateFailed, navigation, dispatch]);

  const handleValidationError = () => {
    scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
    setErrorText("Please enter valid information to continue.");
    //setShowErrorAlert(true);
  };

  const onSubmit = (data) => {
    if(isCheckboxVisible ){
        if(!toggleCheckBoxTerm){
            setIsTermRequired(true);
            return;
        }
     if(data.billingOptOutStatus ||data.outageOptOut||data.optOut){
        dispatch(updateTextNotification(data, navigation));
     }else{
        setErrorText("Please select the type of messages you would like to receive.");
        setShowErrorAlert(true);
        scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
     }
    }else{
        dispatch(updateTextNotification(data, navigation));
    }
    //console.log('data',data)
    //dispatch(updateTextNotification(data, navigation));
  };

  return (
    <View style={{ flex: 1, backgroundColor: Color.colorWhitesmoke_200 }}>
      <ProfileSettingsHeader
        title={
          formatedData?.phoneNumber
            ? "Edit Text Notifications"
            : "Add Text Notifications"
        }
        onPressBack={() => navigation.navigate("Notifications")}
      />
      <ScrollView ref={scrollViewRef}>
        <View style={styles.textNotificationsInner}>
          <View style={[styles.navigationBorder]}>
            <View style={styles.frameGroup}>
             <View style={{ width: "100%" }}>    
              <NotificationAlert
                type="error"
                title="Error"
                message={
                  errorText ? errorText : "Notifications updated failed."
                }
                showCloseIcon={true}
                isVisible={showErrorAlert}
                onClose={() => setShowErrorAlert(false)}
              />
              </View>
              <View style={{ width: "100%" }}>
                <NotificationAlert
                  type="warning"
                  title={""}
                  message={
                    message1
                  }
                  showCloseIcon={false}
                  isVisible={true}
                  accessibilityLabel={message1}
                  accessibilityLiveRegion="polite"
                  accessibilityRole="alert"
                  customStyle={styles.warningAlert}
                />
              </View>
            </View>

            
            <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
              {/* <Text style={[styles.mobilePhoneTypo]}>
                Edit Mobile Phone Number
                </Text> */}
              <Text style={[styles.mobilePhoneTypo, { marginTop: 10 }]}>
                {message}
              </Text>
            </View>
            
            <View style={styles.frameGroup}>
              <View style={[styles.frameParent3]}>
                <Text style={styles.mobilePhoneTypo}>Mobile Phone</Text>
                <View style={{ paddingVertical: 4 , width:widthPercentageToDP('80%')}}>
                  <Controller
                    control={control}
                    name="phoneNumber"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <SparkLightInput
                        placeholder="Mobile Number"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        error={errors.phoneNumber?.message}
                      />
                    )}
                  />
                </View>
                
              </View>
            </View>
            <View style={styles.frameChild} />
            <View style={styles.frameGroup}>
              <View style={styles.frameWrapper2}>
                <View style={styles.frameParent3}>
                  <View style={styles.frameParent4}>
                    <Text style={[{ flex: 1 }, styles.mobilePhoneTypo]}>
                      Appointments
                    </Text>
                    <View>
                      <Controller
                        control={control}
                        name="optOut"
                        render={({ field: { onChange, value } }) => (
                          <Toggle
                            label="Appointments"
                            onToggle={() => {
                                onChange(!value)
                                if(!value){
                                    setIsTermRequired(false)
                                }
                            }
                        }
                            initialValue={formatedData?.optOut}
                          />
                        )}
                      />
                    </View>
                  </View>
                  <Text
                    style={[
                      styles.receiveTextNotifications1,
                      styles.containerTypo,
                    ]}
                  >
                    Receive text notifications when your appointments have
                    updates.
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.frameChild} />
            <View style={styles.frameGroup}>
              <View style={styles.frameWrapper2}>
                <View style={styles.frameParent3}>
                  <View style={styles.frameParent4}>
                    <Text style={[{ flex: 1 }, styles.mobilePhoneTypo]}>
                      Outage Alerts
                    </Text>
                    <View>
                      <Controller
                        control={control}
                        name="outageOptOut"
                        render={({ field: { onChange, value } }) => (
                          <Toggle
                            label="Outage Alerts"
                            onToggle={() => {onChange(!value)
                                if(!value){
                                    setIsTermRequired(false)
                                }
                            }}
                            initialValue={formatedData?.outageOptOut}
                          />
                        )}
                      />
                    </View>
                  </View>
                  <Text
                    style={[
                      styles.receiveTextNotifications1,
                      styles.containerTypo,
                    ]}
                  >
                    Receive text notifications when outage occur.
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.frameChild} />
            <View style={styles.frameGroup}>
              <View style={styles.frameWrapper2}>
                <View style={styles.frameParent3}>
                  <View style={styles.frameParent4}>
                    <Text style={[{ flex: 1 }, styles.mobilePhoneTypo]}>
                      Billing
                    </Text>
                    <View>
                      <Controller
                        control={control}
                        name="billingOptOutStatus"
                        render={({ field: { onChange, value } }) => (
                          <Toggle
                            label="Billing"
                            onToggle={() => {onChange(!value)
                            if(!value){
                                    setIsTermRequired(false)
                                }
                        }}
                            initialValue={formatedData?.billingOptOutStatus}
                          />
                        )}
                      />
                    </View>
                  </View>
                  <Text
                    style={[
                      styles.receiveTextNotifications1,
                      styles.containerTypo,
                    ]}
                  >
                    Receive text notifications for billing.
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.frameChild} />
            {isCheckboxVisible && (
              <View style={{ paddingVertical: 16, marginHorizontal: 16 }}>
                <View style={styles.checkBoxArea}>
                  <TouchableOpacity
                    style={styles.checkboxTouchable}
                    onPress={handleCheckboxToggle}
                    accessibilityRole="checkbox"
                    accessibilityLabel="I agree to Text Messaging Terms and Conditions"
                    accessibilityState={{ checked: toggleCheckBoxTerm }}
                  >
                    <View style={styles.checkboxContainer}>
                      <CheckBox
                        disabled={true}
                        value={toggleCheckBoxTerm}
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
                { isTermRequired && <View style={{ paddingTop: 8 }}>
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
                </View> }
              </View>
            )}
          </View>
          <View style={[{ alignSelf: "stretch" }]}>
            <Pressable
              accessible={true}
              accessibilityLabel="Save"
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.buttons,
                styles.buttonsLayout,
                { opacity: pressed ? 0.7 : 1 },
              ]}
              onPress={handleSubmit(onSubmit, handleValidationError)}
            >
              <Text style={[styles.makePayment, styles.makeTypo]}>Save</Text>
            </Pressable>
            <View style={{ padding: 8 }}></View>
            <Pressable
              accessible={true}
              accessibilityLabel="Cancel"
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.buttonsLayout,
                { opacity: pressed ? 0.7 : 1 },
              ]}
              onPress={() => navigation.navigate("Notifications")}
            >
              <Text style={[styles.accountClr, styles.makeTypo]}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  navigationBorder: {
    borderColor: Color.sparklightWhite,
    justifyContent: "center",
    alignItems: "center",
    borderStyle: "solid",
    backgroundColor: Color.sparklightWhite,
  },
  containerTypo: {
    textAlign: "left",
    fontFamily: FontFamily.openSansRegular,
  },
  mobilePhoneTypo: {
    color: Color.colorblack_100,
    fontSize: FontSize.size_base,
    lineHeight: 22,
    fontWeight: "400",
    textAlign: "left",
    fontFamily: FontFamily.openSansRegular,
  },
  buttonsLayout: {
    width: "100%",
    paddingVertical: Padding.p_base,
    paddingHorizontal: 0,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Border.br_11xs,
    height: 56,
  },
  ErrorToggle: {
    color: Color.sparkLightRed,
    fontFamily: FontFamily.openSansSemiBold,
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 4,
  },
  makeTypo: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.openSansRegular,
  },
  accountClr: {
    color: Color.colorMidnightblue,
    textAlign: "center",
  },
  infoCircleIcon: {
    width: 16,
    height: 16,
    overflow: "hidden",
  },
  infoCircleWrapper: {
    paddingVertical: Padding.p_5xs,
    flexDirection: "row",
  },
  youAreSubscribed: {
    lineHeight: 22,
  },
  youAreSubscribedContainer: {
    marginLeft: 8,
    color: Color.colorGray_200,
    textAlign: "left",
    fontFamily: FontFamily.openSansRegular,
    fontSize: FontSize.size_sm,
    flex: 1,
  },
  frameView: {
    borderRadius: 8,
    backgroundColor: Color.colorWhitesmoke_100,
    paddingHorizontal: Padding.p_base,
    paddingVertical: 6,
    flexDirection: "row",
  },
  warningAlert: {
    borderLeftWidth: 4,
    borderLeftColor: "#FF9800",
    marginBottom: 0,
    borderRadius: 0,
  },
  frameChild: {
    height: 1,
    backgroundColor: Color.sparklightGray,
    alignSelf: "stretch",
  },
  text: {
    fontSize: FontSize.size_base,
    lineHeight: 22,
    textAlign: "left",
    color: Color.colorGray_200,
    fontFamily: FontFamily.openSansRegular,
  },
  frameParent3: {
    justifyContent: "center",
    flex: 1,
  },
  frameParent4: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "stretch",
  },
  frameWrapper2: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  receiveTextNotifications1: {
    color: Color.sparklightDarkGray,
    lineHeight: 22,
    fontWeight: "400",
    fontFamily: FontFamily.openSansRegular,
    textAlign: "left",
    alignSelf: "stretch",
    fontSize: FontSize.size_sm,
  },
  byOptingInContainer: {
    fontSize: FontSize.textXsSemibold_size,
    color: Color.sparklightDarkGray,
    fontFamily: FontFamily.openSansRegular,
    textAlign: "left",
    alignSelf: "stretch",
  },
  frameWrapper10: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Color.sparklightWhite,
    alignSelf: "stretch",
  },
  frameGroup: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
    paddingVertical: Padding.p_base,
    paddingHorizontal: Padding.p_base,
  },
  makePayment: {
    textAlign: "center",
    color: Color.sparklightWhite,
  },
  buttons: {
    marginTop: 16,
    backgroundColor: Color.colorMidnightblue,
  },
  textNotificationsInner: {
    paddingTop: Padding.p_5xl,
    flex: 1,
    paddingHorizontal: Padding.p_base,
    marginBottom: 200,
  },
  checkBox: {
    width: 12,
    height: 12,
    marginRight: Platform.OS === "ios" ? 2 : 16,
    backgroundColor: Color.colorWhitesmoke_100,
  },
  checkBoxArea: {
    flexDirection: "row",
  },
  checkboxTouchable: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 0,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkBoxAreaViewText: {
    fontSize: 14,
    fontFamily: FontFamily.openSansRegular,
    color: Color.colorGray_200,
  },
});

export default TextNotifications;
