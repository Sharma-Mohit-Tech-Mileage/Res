import React from "react";
import { View, StyleSheet, Text, ScrollView, Pressable, Platform, } from "react-native";
import { Color, FontFamily, FontSize, Padding, Border, } from "../../../GlobalStyles";
import ProfileSettingsHeader from "../common/ProfileSettingsHeader";
import BellRingingIcon from "../../res/svgIcons/BellRingingIcon";
import { getFcmToken, requestUserPermission, } from "../../firebase/FirebaseUtils";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { updatePushNotificationsv2 } from "../../redux/actions/ProfileActionSuite";
import { storePushNotificationStatus } from "../../redux/utils/LocalStorage";
import NavigationUtils from "./NavigationUtils";

const PushNotifications = ({ navigation }) => {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profile || {});
  const user = useSelector((state) => state.user.userData);
  const accountNumber = user?.userInfo?.accountNumber || "";

  const enableNotifications = async () => {
    const enabledPermission = await requestUserPermission();
    if (enabledPermission) {
      const token = await getFcmToken();
      const data = {
        accountNumber: user.userInfo?.accountNumber,
        deviceToken: token,
        deviceTokenTimestamp: moment().format(),
        optOut: true,
        outageOptOut: true,
        billingOptOutStatus: true,
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
    <View style={styles.container}>
      <ProfileSettingsHeader showIcon={false} title={"Notifications"} />
      <ScrollView
        style={styles.inner}
        contentContainerStyle={styles.innerContent}
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
            <Pressable
              accessibilityLabel="Allow Notifications Button"
              accessibilityRole="button"
              //accessibilityHint="Allow Notifications"
              style={[styles.button, styles.buttonsLayout]}
              onPress={enableNotifications}
            >
              <Text style={styles.accept}>Allow Notifications</Text>
            </Pressable>
            <View
              style={styles.buttonsParent}
              accessibilityLabel="Buttons Section"
            >
              <Pressable
                style={[styles.buttonDecline, styles.buttonsLayout]}
                onPress={skipNotifications}
                accessibilityLabel="Skip for now"
                accessibilityRole="button"
                //accessibilityHint="Skip Push Notifications"
              >
                <Text style={styles.decline}>Skip for now</Text>
              </Pressable>
            </View>
          </View>
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
  buttonDecline: {
    marginBottom: 125, // was 100, reduce this value
  },
  button: {
    backgroundColor: Color.colorMidnightblue,
    marginBottom: 20, // was 20, reduce this value
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
  inner: {
    flex: 1,
  },
  innerContent: {
    justifyContent: "space-around",
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    alignContent: "center",
    justifyContent: "center",
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
    backgroundColor: Color.colorWhitesmoke_300,
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
  viewContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    marginTop: 50,
  },
});

export default PushNotifications;
