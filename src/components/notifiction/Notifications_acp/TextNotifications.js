import React, { useState, useEffect, useRef } from "react";
import {
  Image,
  StyleSheet,
  Text,
  Pressable,
  View,
  ScrollView,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
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
import { initializeSettings } from "../../utility/constant";
import Toggle from "../../common/Toggle";
import Infocircle from "../../../../assets/svgs/Infocircle";

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
    dispatch(updateTextNotification(data, navigation));
  };

  return (
    <View style={{ flex: 1, backgroundColor: Color.colorWhitesmoke_200 }}>
      <ProfileSettingsHeader
        title="Edit Text Notifications"
        onPressBack={() => navigation.navigate("Notifications")}
      />
      <ScrollView ref={scrollViewRef}>
        <View style={styles.textNotificationsInner}>
          <View style={[styles.navigationBorder]}>
            <View style={styles.frameGroup}>
              <NotificationAlert
                type="error"
                title="Failed"
                message={
                  errorText ? errorText : "Notifications updated failed."
                }
                showCloseIcon={true}
                isVisible={showErrorAlert}
                onClose={() => setShowErrorAlert(false)}
              />
              <View style={{ width: "100%" }}>
                <NotificationAlert
                  type="warning"
                  title={""}
                  message={
                    "You are subscribed to text message alerts. Reply STOP to cancel at any time. Call 1-800-123-4567 for support. Message and data rates may apply."
                  }
                  showCloseIcon={false}
                  isVisible={true}
                  accessibilityLabel="You are subscribed to text message alerts. Reply STOP to cancel at any time. Call 1-800-123-4567 for support. Message and data rates may apply."
                  accessibilityLiveRegion="polite"
                  accessibilityRole="alert"
                  customStyle={styles.warningAlert}
                />
              </View>
            </View>

            <View style={styles.frameChild} />
             <View style={{marginHorizontal:20, marginVertical:10}}>
                <Text style={[styles.mobilePhoneTypo]}>
                Edit Mobile Phone Number
                </Text>
                <Text style={[styles.mobilePhoneTypo,{marginTop:10}]}>
                    Please enter the mobile phone number you would like to receive all future customer communications. You may opt out at any time.
                </Text>
             </View>
            <View style={styles.frameChild} />
            <View style={styles.frameGroup}>
              <View style={[styles.frameParent3]}>
                <Text style={styles.mobilePhoneTypo}>Mobile Phone</Text>
                <View style={{ paddingVertical: 4 }}>
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
                <Text
                  style={[
                    styles.receiveTextNotifications1,
                    styles.containerTypo,
                  ]}
                >
                  Message and data rates may apply. Message frequency may vary.
                  Text STOP to opt out or HELP for help.
                </Text>
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
                            onToggle={() => onChange(!value)}
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
                            onToggle={() => onChange(!value)}
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
                            onToggle={() => onChange(!value)}
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
    color: Color.sparklightGray1,
    fontSize: FontSize.size_base,
    lineHeight: 22,
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
    color: Color.sparklightaddGray,
    lineHeight: 22,
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
});

export default TextNotifications;
