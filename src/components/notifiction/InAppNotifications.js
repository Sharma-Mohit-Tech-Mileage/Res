import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, Pressable, View, ScrollView ,Platform} from "react-native";
import { Color, FontSize, FontFamily, Padding, Border } from "../../../GlobalStyles";
import ProfileSettingsHeader from '../common/ProfileSettingsHeader';
import { useRoute, useIsFocused } from "@react-navigation/native";
import { useDispatch } from 'react-redux';
import { transformToUserPreferences } from '../utility/constant';
import NotificationAlert from "../common/customui/NotificationAlert";
import { updatePushNotificationsv2 } from '../../redux/actions/ProfileActionSuite';
import moment from 'moment';
import Toggle from '../common/Toggle';
import { getFcmToken, notifyPermission } from '../../firebase/FirebaseUtils';
const InAppNotifications = ({ navigation }) => {
  const [initialize, setInitializeSettings] = useState({});
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const route = useRoute(); // Use the useRoute hook
  const additionalData = route.params?.additionalData;
  const dispatch = useDispatch();
  const scrollViewRef = useRef(null);
  const isFocused = useIsFocused(); // Hook to determine if the screen is focused

  useEffect(() => {
    // Check if the screen is focused
    if (isFocused) {
      const initializedSettings = transformToUserPreferences(additionalData);
      setInitializeSettings(initializedSettings);
    }

    // Cleanup function
    return () => {
      if (isFocused) {
        setInitializeSettings({}); // Reset state when leaving the screen
      }
    };
  }, [isFocused, additionalData]); // Depend on isFocused and additionalData
  const handleToggleChange = (e) => {
    const { name, value } = e.target;
    setInitializeSettings(initialize => {
      const updatedSettings = {
        ...initialize,
        [name]: !value
      };
      return updatedSettings;
    });
  };


  useEffect(() => {
    if (route.params?.updateFailed) {
      setShowErrorAlert(true);
      scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
      navigation.setParams({ updateFailed: undefined });
    }
  }, [route.params?.updateFailed, navigation, dispatch]);

  const handleSave = async () => {  // Mark the function as async
    const enabledPermission = await notifyPermission();
      const token = await getFcmToken();
      initialize.deviceToken = token;  // Replace 'token' with your actual token variable
      initialize.deviceTokenTimestamp = moment().format();  // Assuming 'moment' is imported and available
      initialize.isAndroid = Platform.OS === "android"
      await dispatch(updatePushNotificationsv2(initialize, navigation));

  }
    return (
      <View style={styles.inAppNotifications} accessible accessibilityLabel="In-App Notifications">
        <ProfileSettingsHeader
          title="Edit In-App Notifications"
          onPressBack={() => navigation.navigate('Notifications')}
        />
        <ScrollView>
          <View style={styles.inAppNotificationsInner}>

            <View style={styles.frameParent} accessible >
              
              <View style={[styles.frameGroup, styles.frameBorder]}>
                <View style={styles.infoWrapper}><NotificationAlert
                  type="error"
                  title="Failed"
                  message="Notifications updated failed."
                  showCloseIcon={true}
                  isVisible={showErrorAlert}
                  onClose={() => setShowErrorAlert(false)}
                /></View>
                <NotificationSetting
                  title="Appointments"
                  name='optOut'
                  value={!initialize.optOut}
                  description="Receive app notifications when your appointments have updates."
                  onChange={handleToggleChange}
                />
                <NotificationSetting
                  title="Outage Alerts"
                  name='outageOptOut'
                  value={!initialize.outageOptOut}
                  description="Receive app notifications when outages occur."
                  onChange={handleToggleChange}
                />
                <NotificationSetting
                  title="Billing"
                  name='billingOptOutStatus'
                  value={!initialize.billingOptOutStatus}
                  description="Receive app notifications for billing."
                  onChange={handleToggleChange}
                />
              </View>
              <View style={styles.buttonsParent} accessible >
                <Pressable
                  style={[styles.buttons, styles.buttonsLayout]}
                  onPress={handleSave}
                >
                  <Text style={[styles.makePayment, styles.makeTypo]}>Save</Text>
                </Pressable>
                <Pressable
                  style={[styles.buttons1, styles.buttonsLayout]}
                  onPress={() => navigation.navigate("Notifications")}
                >
                  <Text style={[styles.makePayment1, styles.makeTypo]}>Cancel</Text>
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
        <View style={[styles.frameParent1, styles.tabsParentFlexBox]}>
          <View style={styles.appointmentsParent} accessible accessibilityRole="switch" accessibilityLabel={title} accessibilityHint={`Toggle ${title.toLowerCase()} notifications`}>
            <Text style={styles.appointments}>{title}</Text>
            <View>
              <Toggle
                name={name}
                initialValue={value}
                onToggle={onChange} />
            </View>
          </View>
          <Text style={[styles.receiveAppNotifications1, styles.receiveTypo,]}>
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
    receiveTypo: {
      fontSize: FontSize.textXsSemibold_size,
      color: Color.sparklightaddGray,
      textAlign: "left",
      fontFamily: FontFamily.openSansRegular,
      alignSelf: "stretch",
    },
    buttonsLayout: {
      paddingHorizontal: 0,
      width: '100%',
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
    homeTypo: {
      fontSize: FontSize.size_xs,
      textAlign: "center",
      fontWeight: "600",
      lineHeight: 18,
    },
    rightParentFlexBox: {
      paddingTop: Padding.p_5xs,
      alignItems: "center",
      alignSelf: "stretch",
      flex: 1,
    },
    appointments: {
      color: Color.colorGray_100,
      textAlign: "left",
      fontFamily: FontFamily.openSansRegular,
      fontSize: FontSize.size_base,
      lineHeight: 28,
      flex: 1,
    },
    buttonIcon: {
      width: 21,
      height: 20,
    },
    appointmentsParent: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "stretch",
    },
    receiveAppNotifications: {
      lineHeight: 28,
    },
    haveUpdates: {
      lineHeight: 24,
    },
    receiveAppNotificationsContainer: {
      color: Color.colorGray_100,
    },
    frameParent1: {
      justifyContent: "center",
    },
    frameView: {
      paddingVertical: Padding.p_base,
      flexDirection: "row",
      alignItems: "center",
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
      lineHeight: 28,
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
    frameParent: {
      alignSelf: "stretch",
    },
    makePayment: {
      color: Color.sparklightWhite,
    },
    buttons: {
      backgroundColor: Color.colorMidnightblue,
    },
    makePayment1: {
      color: Color.colorMidnightblue,
    },
    infoWrapper: {
      paddingHorizontal: Padding.p_5xl,
      alignSelf: "stretch",
      paddingTop:Padding.p_base
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
      width: '100%',
      overflow: "hidden",
    },
    inAppNotifications: {
      flex: 1,
      backgroundColor: Color.colorWhitesmoke_200,
    },
  });

  export default InAppNotifications;
