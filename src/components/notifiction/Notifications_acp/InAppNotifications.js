import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  Pressable,
  View,
  ScrollView,
  Platform,
} from "react-native";
import {
  Color,
  FontSize,
  FontFamily,
  Padding,
  Border,
} from "../../../../GlobalStyles";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import ProfileSettingsHeader from "../../common/ProfileSettingsHeader";
import { useRoute, useIsFocused } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { transformToUserPreferences } from "../../utility/constant";
import NotificationAlert from "../../common/customui/NotificationAlert";
import { updatePushNotificationsv2 } from "../../../redux/actions/ProfileActionSuite";
import moment from "moment";
import Toggle from "../../common/Toggle";
import { initializeSettings } from '../../utility/constant';
import {
  getFcmToken,
  notifyPermission,
  requestUserPermission,
} from "../../../firebase/FirebaseUtils";
import { getPushNotificationStatus } from "../../../redux/utils/LocalStorage";

// Define your validation schema
const validationSchema = yup.object().shape({
    phoneNumber: yup.string()
        .matches(/^(?:(\+1|1)?\s*(?:\([2-9]\d{2}\)\ ?|[2-9]\d{2}[- ]?)[2-9]\d{2}[- ]?\d{4}(?:\s*(?:ext|x)\s*\d{2,6})?)?$/, 'Invalid mobile phone number.')
        .required('Phone number is required'),
    optOut: yup.boolean(),
    outageOptOut: yup.boolean(),
    billingOptOutStatus: yup.boolean(),
});

const InAppNotifications = ({ navigation }) => {
  const route = useRoute();
  const [initialize, setInitializeSettings] = useState(route.params?.additionalData);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const additionalData = route.params?.additionalData;
  const dispatch = useDispatch();
  const scrollViewRef = useRef(null);
  const isFocused = useIsFocused();
  const formatedData = (route.params?.additionalData);
    const { control, handleSubmit, setValue, getValues, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            phoneNumber: formatedData?.phoneNumber || '',
            optOut: formatedData?.optOut || false,
            outageOptOut: formatedData?.outageOptOut || false,
            billingOptOutStatus: formatedData?.billingOptOutStatus || false,
            accountNumber: ''
        }
    });

  useEffect(() => {
    if (isFocused) {
      const initializedSettings = (additionalData);
      setInitializeSettings(initializedSettings);
    }

    return () => {
      if (isFocused) {
        setInitializeSettings({});
      }
    };
  }, [isFocused, additionalData]);

  const handleToggleChange = (e) => {
    const { name, value } = e.target;
    formatedData[name]=value
    // setInitializeSettings((initialize) => {
    //   const updatedSettings = {
    //     ...initialize,
    //     [name]: !value,
    //   };
    //   return updatedSettings;
    // });
  };

  useEffect(() => {
    if (route.params?.updateFailed) {
      setShowErrorAlert(true);
      scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
      navigation.setParams({ updateFailed: undefined });
    }
  }, [route.params?.updateFailed, navigation, dispatch]);

  const handleSave = async () => {
    const pushNotification = await getPushNotificationStatus();
    if (pushNotification?.permanentSkip) {
      await notifyPermission();
    } else {
      await requestUserPermission();
    }
    const token = await getFcmToken();
    formatedData.deviceToken = token;
    formatedData.deviceTokenTimestamp = moment().format();
    formatedData.isAndroid = Platform.OS === "android";
    console.log('Request data',formatedData)
    await dispatch(updatePushNotificationsv2(formatedData, navigation));
  };
  return (
    <View style={styles.inAppNotifications}>
      <ProfileSettingsHeader
        title="Edit In-App Notifications"
        onPressBack={() => navigation.navigate("Notifications")}
      />
      <ScrollView>
        <View style={styles.inAppNotificationsInner}>
          <View style={{ alignSelf: "stretch" }}>
            <View style={[styles.frameGroup, styles.frameBorder]}>
        

              <View style={styles.infoWrapper}>
                <NotificationAlert
                  type="error"
                  title="Error"
                  message="Notifications updated failed."
                  showCloseIcon={true}
                  isVisible={showErrorAlert}
                  onClose={() => setShowErrorAlert(false)}
                />
              </View>
              <NotificationSetting
                title="Appointments"
                name="optOut"
                value={formatedData.optOut}
                description="Receive app notifications when your appointments have updates."
                onChange={handleToggleChange}
              />
              <NotificationSetting
                title="Outage Alerts"
                name="outageOptOut"
                value={formatedData.outageOptOut}
                description="Receive app notifications when outage occur."
                onChange={handleToggleChange}
              />
              <NotificationSetting
                title="Billing"
                name="billingOptOutStatus"
                value={formatedData.billingOptOutStatus}
                description="Receive app notifications for billing."
                onChange={handleToggleChange}
              />
            </View>

            <View style={styles.buttonsParent}>
              <Pressable
                accessible={true}
                accessibilityLabel="Save"
                accessibilityRole="button"
                style={({ pressed }) => [
                  {
                    backgroundColor: Color.colorMidnightblue,
                    opacity: pressed ? 0.7 : 1.0,
                  }, // Changes opacity based on press state
                  styles.buttonsLayout,
                ]}
                onPress={handleSave}
              >
                <Text
                  style={[{ color: Color.sparklightWhite }, styles.makeTypo]}
                >
                  Save
                </Text>
              </Pressable>
              <Pressable
                accessible={true}
                accessibilityLabel="Cancel"
                accessibilityRole="button"
                style={({ pressed }) => [
                  styles.buttons1,
                  styles.buttonsLayout,
                  { opacity: pressed ? 0.7 : 1.0 },
                ]}
                onPress={() => navigation.navigate("Notifications")}
              >
                <Text
                  style={[{ color: Color.colorMidnightblue }, styles.makeTypo]}
                >
                  Cancel
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const NotificationSetting = ({ name, value, title, description, onChange }) => (
  <View style={[styles.frameContainer, styles.frameBorder]}>
    <View style={styles.frameView}>
      <View style={[{ justifyContent: "center" }, styles.tabsParentFlexBox]}>
        <View style={styles.appointmentsParent}>
          <Text style={styles.appointments}>{title}</Text>
          <View>
            <Toggle
              name={name}
              initialValue={value}
              label={title}
              onToggle={onChange}
            />
          </View>
        </View>
        <Text style={[styles.receiveAppNotifications1, styles.receiveTypo]}>
          {description}
        </Text>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  frameBorder: {
    borderColor: Color.sparklightGray,
    backgroundColor: Color.sparklightWhite,
    alignItems: "center",
    borderStyle: "solid",
  },
  tabsParentFlexBox: {
    flex: 1,
    justifyContent: "center",
  },
  frameParent3: {
    justifyContent: "center",
    flex: 1,
  },
  mobilePhoneTypo: {
    color: Color.sparklightGray1,
    fontSize: FontSize.size_base,
    lineHeight: 22,
    textAlign: "left",
    fontFamily: FontFamily.openSansRegular,
  },
  receiveTypo: {
    fontSize: FontSize.textXsSemibold_size,
    color: Color.sparklightaddGray,
    textAlign: "left",
    fontFamily: FontFamily.openSansRegular,
    alignSelf: "stretch",
  },
  buttonsLayout: {
    paddingHorizontal: 0,
    width: "100%",
    paddingVertical: Padding.p_base,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Border.br_11xs,
    height: 56,
  },
  makeTypo: {
    width: 282,
    fontFamily: FontFamily.openSansRegular,
    fontSize: FontSize.size_base,
    textAlign: "center",
  },
  appointments: {
    color: Color.colorGray_100,
    textAlign: "left",
    fontFamily: FontFamily.openSansRegular,
    fontSize: FontSize.size_base,
    lineHeight: 22,
    flex: 1,
  },
  appointmentsParent: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "stretch",
  },
  frameView: {
    paddingVertical: Padding.p_base,
    flexDirection: "row",
    //alignItems: "center",
    paddingHorizontal: Padding.p_5xl,
    flex: 1,
  },
  frameContainer: {
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "stretch",
  },
  receiveAppNotifications1: {
    color: Color.colorGray_100,
    lineHeight: 22,
  },
  frameGroup: {
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Border.br_11xs,
    backgroundColor: Color.sparklightWhite,
    alignSelf: "stretch",
    overflow: "hidden",
  },
  infoWrapper: {
    paddingHorizontal: Padding.p_5xl,
    alignSelf: "stretch",
    paddingTop: Padding.p_base,
  },
  buttons1: {
    marginTop: 16,
    backgroundColor: Color.colorWhitesmoke_200,
    paddingHorizontal: 0,
  },
  buttonsParent: {
    marginTop: 16,
    alignSelf: "stretch",
  },
  inAppNotificationsInner: {
    paddingTop: Padding.p_5xl,
    paddingBottom: Padding.p_base,
    paddingHorizontal: Padding.p_base,
    width: "100%",
    overflow: "hidden",
  },
  inAppNotifications: {
    flex: 1,
    backgroundColor: Color.colorWhitesmoke_200,
  },
  infoCircleIcon: {
    width: 16,
    height: 16,
    overflow: "hidden",
  },
  infoCircleWrapper: {
    paddingVertical: Padding.p_8xs,
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
  containerTypo: {
    textAlign: "left",
    fontFamily: FontFamily.openSansRegular,
  },
  receiveTextNotifications1: {
    color: Color.sparklightaddGray,
    lineHeight: 22,
    fontFamily: FontFamily.openSansRegular,
    textAlign: "left",
    alignSelf: "stretch",
    fontSize: FontSize.size_sm,
  },
  frameChild: {
    height: 1,
    backgroundColor: Color.sparklightGray,
    alignSelf: "stretch",
  },
});

export default InAppNotifications;
