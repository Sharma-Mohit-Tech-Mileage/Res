import React from "react";
import { Image, StyleSheet, Text, Pressable, View, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Padding, Color, Border, FontSize, FontFamily } from "../../../GlobalStyles";
import ProfileSettingsHeader from '../common/ProfileSettingsHeader';

const Notifications = () => {
  const navigation = useNavigation();

  return (

    <View style={styles.notifications}>
      <ProfileSettingsHeader
        title="Notifications"
        onPressBack={() => navigation.navigate('Account')}
      />
      <ScrollView accessibilityLabel="Main Scroll View">
        <View style={[styles.notificationsInner]}>
          {/* Text Notifications Section */}
          <NotificationSection
            title="Text Notifications"
            infoText={`Text alerts are sent to `}
            number="433-839-2398"
            navigationTarget="TextNotifications"
            additionalSettings={[
              { type: 'Appointments', status: 'Off' },
              { type: 'Outage', status: 'Off' },
              { type: 'Billing', status: 'On' },
            ]}
          />
          <View style={{ marginBottom: Padding.p_base }} />
          {/* Email Notifications Section */}
          <NotificationSection
            title="Email Notifications"
            infoText={`Emails are sent to `}
            email="Melissa@gmail.com"
            navigationTarget="EmailNotifications"
            additionalSettings={[
              { type: 'Paperless Billing', status: 'Off' },
            ]}
          />
          <View style={{ marginBottom: Padding.p_base }} />
          {/* In-App Notifications Section */}
          <NotificationSection
            title="In-App Notifications"
            infoText="Notifications sent from your application."
            navigationTarget="InAppNotifications"
            additionalSettings={[
              { type: 'Appointments', status: 'On' },
              { type: 'Outage', status: 'On' },
              { type: 'Billing', status: 'On' },
            ]}
          />
        </View>

      </ScrollView>
    </View>
  );
};

const NotificationSection = ({
  title,
  infoText,
  number,
  email,
  navigationTarget,
  additionalSettings = [],
}) => {
  const navigation = useNavigation();
  return (
    <View style={[styles.frameParent2, styles.frameBorder]}>
      <View style={[styles.textNotificationsParent, styles.parentSpaceBlock]}>
        <Text style={styles.textNotifications}>{title}</Text>
        <Pressable
          style={[styles.buttons, styles.buttonsBg]}
          onPress={() => navigation.navigate(navigationTarget)}
          accessibilityRole="button"
          accessibilityLabel={`Edit ${title}`}
        >
          <Text style={styles.makePayment}>Edit</Text>
        </Pressable>
      </View>
      <View style={styles.frameWrapper}>
        <View style={styles.frameView}>
          <View style={styles.infoCircleWrapper}>
            <Image
              style={styles.infoCircleIcon}
              resizeMode="stretch"
              source={require("../../../assets/infocircle.png")}
              accessible={true}
              accessibilityLabel="Information Icon"
            />
          </View>
          <Text style={[styles.notificationsSentFrom, styles.notificationsSentFromTypo]}>
            {infoText}
            {number && (
              <Text style={[styles.text]} accessibilityLabel={`Phone Number: ${number}`}>
                {number}
              </Text>
            )}
            {email && (
              <Text style={styles.text} accessibilityLabel={`Email Address: ${email}`}>
                {email}
              </Text>
            )}
          </Text>
        </View>
      </View>
      {additionalSettings.map((setting, index) => (
        <NotificationType key={index} type={setting.type} status={setting.status} />
      ))}
    </View>
  );
};

const NotificationType = ({ type, status }) => {
  let displayStatus;
  let imageSource;

  switch (status) {
    case 'On':
    case 'Subscribed':
      displayStatus = status;
      imageSource = require("../../../assets/checkcircle.png");
      break;
    case 'Off':
    case 'Unsubscribed':
      displayStatus = status;
      imageSource = require("../../../assets/checkcircle1.png");
      break;
    default:
      // Handle unexpected status values
      displayStatus = 'Unknown';
      imageSource = require("../../../assets/checkcircle1.png");
      break;
  }

  return (
    <View style={styles.frameWrapperBorder}>
      <View style={[styles.parentSpaceBlock]}>
        <Text style={[styles.appointments, styles.subscribedTypo]}>{type}</Text>
        <View style={[styles.checkCircleParent]}>
          <Image
            style={styles.infoCircleIcon}
            resizeMode="cover"
            source={imageSource}
          />
          <Text style={[styles.subscribed, styles.subscribedTypo]}>{displayStatus}</Text>
        </View>
      </View>
    </View>
  );
};




const styles = StyleSheet.create({
  frameBorder: {
    borderWidth: 1,
    justifyContent: "center",
    borderColor: Color.sparklightGray,
    borderStyle: "solid",
    backgroundColor: Color.sparklightWhite,
    borderRadius: Border.br_11xs,
    alignSelf: "stretch",
    overflow: "hidden",
    paddingTop: Padding.p_base
  },
  parentSpaceBlock: {
    paddingVertical: Padding.p_base,
    paddingHorizontal: Padding.p_base,
    alignItems: "center",
    flexDirection: "row",
  },
  notificationsSentFromTypo: {
    color: Color.colorGray_200,
    marginLeft: 8,
    fontSize: FontSize.textXsSemibold_size,
    textAlign: "left",
    lineHeight: 28,
    flex: 1,
  },
  frameWrapperBorder: {
    borderBottomWidth: 1,
    borderColor: Color.sparklightGray,
    borderStyle: "solid",
    alignSelf: "stretch",
    alignItems: "center",
    flexDirection: "row",
  },
  subscribedTypo: {
    fontSize: FontSize.size_base,
    color: Color.colorGray_200,
    textAlign: "left",
    fontFamily: FontFamily.openSansRegular,
    lineHeight: 28,
    fontWeight: '400'
  },
  textNotifications: {
    fontSize: FontSize.size_3xl,
    color: Color.sparklightGray1,
    textAlign: "left",
    lineHeight: 28,
    fontFamily: FontFamily.openSansRegular,
    flex: 1,
    fontWeight: '400'
  },
  makePayment: {
    fontSize: FontSize.size_xs,
    fontFamily: FontFamily.openSansRegular,
    textAlign: "center",
    color: Color.sparklightWhite,
  },
  textNotificationsParent: {
    alignSelf: "stretch",
  },
  infoCircleIcon: {
    width: 16,
    height: 16,
    overflow: "hidden",
  },
  infoCircleWrapper: {
    paddingHorizontal: 0,
    paddingVertical: Padding.p_5xs,
    flexDirection: "row",
  },
  text: {
    color: Color.colorGray_100,
    fontWeight: "600",
    fontSize: 14
  },
  frameView: {
    borderRadius: Border.br_5xs,
    backgroundColor: Color.colorWhitesmoke_100,
    paddingHorizontal: Padding.p_base,
    paddingVertical: Padding.p_7xs,
    flexDirection: "row",
    alignSelf: "stretch",
  },
  frameWrapper: {
    width: 382,
    paddingBottom: Padding.p_base,
    paddingHorizontal: Padding.p_5xl,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderColor: Color.sparklightGray,
  },
  appointments: {
    flex: 1,
  },
  subscribed: {
    marginLeft: 10,
  },
  checkCircleParent: {
    alignItems: "center",
    flexDirection: "row",
  },
  frameParent2: {
    alignItems: "center",
  },
  notificationsSentFrom: {
    marginLeft: 8,
    color: Color.colorGray_100,
    fontWeight: '400',

  },
  notificationsInner: {
    paddingVertical: Padding.p_5xl,
    paddingHorizontal: Padding.p_base,
    marginBottom: 200
  },
  buttonsBg: {
    paddingHorizontal: Padding.p_base,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Border.br_11xs,
  },
  buttons: {
    marginLeft: 10,
    backgroundColor: Color.colorMidnightblue,
  },
  notifications: {
    backgroundColor: Color.colorWhitesmoke_200,
  },
});

export default Notifications;
