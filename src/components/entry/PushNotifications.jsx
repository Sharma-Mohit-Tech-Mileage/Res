import React from "react";
import { View, StyleSheet, Text, Platform } from "react-native";
import { Color, FontFamily, FontSize, Padding, Border, } from "../../../GlobalStyles";
import ProfileSettingsHeader from "../common/ProfileSettingsHeader";
import Touchable from "../common/customui/Touchable";
import BellRingingIcon from "../../res/svgIcons/BellRingingIcon";
import { getFcmToken, requestUserPermission, } from "../../firebase/FirebaseUtils";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { updatePushNotificationsv2 } from "../../redux/actions/ProfileActionSuite";
import { storePushNotificationStatus } from "../../redux/utils/LocalStorage";
import NavigationUtils from "./NavigationUtils";
import PrimaryButton from "../common/customui/PrimaryButton";
import { hp } from "../../utils/responsive";
import { ScreenScroll } from "../common/customui/Screen";

const PushNotifications = ({ navigation }) => {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profile || {});
  const user = useSelector((state) => state.user.userData);
  const accountNumber = user?.userInfo?.accountNumber || "";

  const enableNotifications = async () => {
    const enabledPermission = await requestUserPermission();
    if (enabledPermission) {
      const token = await getFcmToken();
      // literal flags: false = subscribed
      const data = {
        accountNumber: user.userInfo?.accountNumber,
        deviceToken: token,
        deviceTokenTimestamp: moment().format(),
        optOut: false,
        outageOptOut: false,
        billingOptOutStatus: false,
        userName: user.userInfo.userName,
        isAndroid: Platform.OS == "android",
      };
      const localData = {
        status: "accepted",
        date: new Date(),
        permanentSkip: false,
      };
      storePushNotificationStatus(localData);
      await dispatch(updatePushNotificationsv2(data, null));
      await NavigationUtils.navigateToNext(
        navigation,
        "EntryPushNotifications",
        profile,
        accountNumber
      );
    } else {
      const token = await getFcmToken();
      // permission denied: register the device but opted out (true = opting out)
      const dataWithoutPermission = {
        accountNumber: user.userInfo.accountNumber,
        deviceToken: token,
        deviceTokenTimestamp: moment().format(),
        optOut: true,
        outageOptOut: true,
        billingOptOutStatus: true,
        userName: user.userInfo.userName,
        isAndroid: Platform.OS == "android",
      };
      const localData = {
        status: "skip",
        date: new Date(),
        permanentSkip: true,
      };
      storePushNotificationStatus(localData);
      await dispatch(updatePushNotificationsv2(dataWithoutPermission, null));     
      await NavigationUtils.navigateToNext(
        navigation,
        "EntryPushNotifications",
        profile,
        accountNumber
      );
    }
  };

  const skipNotifications = async () => {
    const data = {
      status: "skip",
      date: new Date(),
      permanentSkip: false,
    };
    storePushNotificationStatus(data);
    await NavigationUtils.navigateToNext(
      navigation,
      "EntryPushNotifications",
      profile,
      accountNumber
    );
  };

  return (
    <View style={styles.inner}>
      <ProfileSettingsHeader showIcon={false} title={"Notifications"} />

        {/* <View style={styles.headerTabView}>
          <View style={styles.headerTabOne} />
          <View style={styles.headerTabTwo} />
          <View style={styles.headerTabThree} />
        </View> */}
    <ScreenScroll
      style={styles.inner}
      contentContainerStyle={styles.innerContent}
    >
      
       
        <View style={styles.container}>

          <View style={styles.viewContainer}>
            <View>
              <View style={styles.headerIconViewContainer}>
                <View style={styles.headerIconView}>
                  <BellRingingIcon />
                </View>
              </View>
              <View style={styles.header}>
                <Text style={styles.headerText}>Turn on App Notifications</Text>
              </View>
              <View style={styles.subHeader}>
                <Text style={styles.subHeaderText}>
                  Receive app alerts related to your account, updates and more
                  from Sparklight.
                </Text>
              </View>
            </View>
          </View>
      
        <View style={styles.bottomBar}>
          <PrimaryButton
            accessibilityLabel="Allow Notifications Button"
            accessibilityRole="button"
            accessibilityHint="Allow Notifications"
            buttonType="submit"
            title="Allow Notifications"
            onPress={() => enableNotifications()}
          ></PrimaryButton>

          <PrimaryButton
            buttonType="cancel"
            onPress={() => skipNotifications()}
            accessibilityLabel="Skip Button"
            accessibilityRole="button"
            title="Skip for now"
            accessibilityHint="Skip Push Notifications"
          ></PrimaryButton>
        </View>
        </View>
      
    </ScreenScroll>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomBar: {
    marginHorizontal: 24,
    marginBottom: hp("5%"),
    
  },
  buttonDecline: {
    marginBottom: 50,
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
    paddingBottom: hp("15%"),
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
    marginTop: 20,
    flexDirection: "row",
    width: "100%",
  
    justifyContent: "center",
  },
  headerTabOne: {
    backgroundColor: Color.sparklightSecondaryPurple,
    width: 100,
    height: 5,
  },
  headerTabTwo: {
    backgroundColor: Color.sparklightSecondaryPurple + "1A",
    width: 100,
    height: 5,
    marginLeft: 10,
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
  subHeader: {
    paddingTop: 10,
  },
  subHeaderText: {
    fontFamily: FontFamily.RadioCanadaRegular,
    fontSize: 16,
    lineHeight: 25,
    textAlign: 'center',
    
    color: Color.colorGray_100,
    paddingHorizontal: 0,
  },
  viewContainer: {
     paddingVertical: 16,
     paddingHorizontal: 16,
     width: "100%",
     alignItems: "center",
     justifyContent: "center",
     flex: 1,
   
  },
});

export default PushNotifications;
