import React from "react";
import { SafeAreaView,Image, StyleSheet, Text, Pressable, View, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Padding, Color, Border, FontSize, FontFamily } from "../../../GlobalStyles";
import  ProfileSettingsHeader  from '../common/ProfileSettingsHeader';

const Notifications = () => {
  const navigation = useNavigation();

  return (
    
   <View style={styles.notifications}>
          <ProfileSettingsHeader
            title="Text Notifications"
            onPressBack={() => navigation.navigate('Account')}
          />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView accessibilityLabel="Main Scroll View">
          <View style={[styles.notificationsInner]}>
            {/* Text Notifications Section */}
            <NotificationSection
              title="Text Notifications"
              infoText={`Text alerts are sent to `}
              number="433-839-2398"
              navigationTarget="TextNotifications"
              //types={['Appointments', 'Outage', 'Billing']}
              additionalSettings={[
                { type: 'Appointments', status: 'Unsubscribe' },
                { type: 'Outage', status: 'Unsubscribe' },
                { type: 'Billing', status: 'Subscribe' },
              ]}
            />
            {/* Email Notifications Section */}
            <NotificationSection
              title="Email Notifications"
              infoText={`Emails are sent to `}
              email="Melissa@gmail.com"
              navigationTarget="EmailNotifications"
              //types={['Paperless Billing', 'Marketing']}
              additionalSettings={[
                { type: 'Paperless Billing', status: 'Off' },
                { type: 'Marketing', status: 'On' },
              ]}
            />
            {/* In-App Notifications Section */}
            <NotificationSection
              title="In-App Notifications"
              infoText="Notifications sent from your application."
              navigationTarget="InAppNotifications"
              //types={['Appointments', 'Outage', 'Billing']}
              additionalSettings={[
                { type: 'Appointments', status: 'On' },
                { type: 'Outage', status: 'On' },
                { type: 'Billing', status: 'On' },
              ]}
            />
          </View>
          
      </ScrollView>
    </SafeAreaView>
  </View>
  );
};

const NotificationSection = ({
  title,
  infoText,
  number,
  email,
  navigationTarget,
  types,
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
      <View style={styles.frameParent3}>
        <View style={styles.frameWrapper7}>
          <View style={styles.frameWrapper}>
            <View style={styles.frameView}>
              <View style={styles.infoCircleWrapper}>
                <Image
                  style={styles.infoCircleIcon}
                  resizeMode="cover"
                  source={require("../../../assets/infocircle.png")}
                  accessible={true}
                  accessibilityLabel="Information Icon"
                />
              </View>
              <Text
                style={[
                  styles.notificationsSentFrom,
                  styles.notificationsSentFromTypo,
                ]}
              >
                {infoText}
                {number && (
                  <Text style={styles.text} accessibilityLabel={`Phone Number: ${number}`}>
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
        </View>
        {/* {(types||[]).map((type, index) => (
          <NotificationType key={index} type={type} status="Subscribed" />
        ))} */}
        {additionalSettings.map((setting, index) => (
          <NotificationType key={index} type={setting.type} status={setting.status} />
        ))}
      </View>
    </View>
  );
};

const NotificationType = ({ type, status }) => {
  let displayStatus;
  let imageSource;

  switch (status) {
    case 'On':
    case 'Subscribe':
      displayStatus = status;
      imageSource = require("../../../assets/checkcircle.png");
      break;
    case 'Off':
    case 'Unsubscribe':
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
      <View style={[styles.appointmentsParent, styles.parentSpaceBlock]}>
        <Text style={[styles.appointments, styles.subscribedTypo]}>{type}</Text>
        <View style={styles.checkCircleParent}>
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
    paddingTop: Padding.p_base,
    borderWidth: 1,
    justifyContent: "center",
    borderColor: Color.colorGainsboro_100,
    borderStyle: "solid",
    backgroundColor: Color.sparklightWhite,
    borderRadius: Border.br_11xs,
    alignSelf: "stretch",
    overflow: "hidden",
  },
  parentSpaceBlock: {
    paddingVertical: Padding.p_base,
    paddingHorizontal: Padding.p_5xl,
    alignItems: "center",
    flexDirection: "row",
  },
  notificationsSentFromTypo: {
    color: Color.colorGray_100,
    marginLeft: 8,
    fontSize: FontSize.textXsSemibold_size,
    textAlign: "left",
    lineHeight: 28,
    flex: 1,
  },
  frameWrapperBorder: {
    borderBottomWidth: 1,
    alignItems: "center",
    flexDirection: "row",
    borderColor: Color.colorGainsboro_100,
    borderStyle: "solid",
    alignSelf: "stretch",
  },
  subscribedTypo: {
    fontSize: FontSize.size_base,
    color: Color.sparklightDarkGray,
    textAlign: "left",
    fontFamily: FontFamily.openSansRegular,
    lineHeight: 28,
  },
  textNotifications: {
    fontSize: FontSize.size_3xl,
    color: Color.colorDimgray,
    textAlign: "left",
    lineHeight: 28,
    fontFamily: FontFamily.openSansRegular,
    flex: 1,
  },
  makePayment: {
    fontSize: FontSize.textXsSemibold_size,
    fontFamily: FontFamily.openSansRegular,
    textAlign: "center",
    color: Color.sparklightWhite,
  },
  buttons: {
    padding: Padding.p_base,
    marginLeft: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Border.br_11xs,
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
  textAlertsAre: {
    fontFamily: FontFamily.openSansRegular,
  },
  text: {
    fontFamily: FontFamily.openSansSemiBold,
    fontWeight: "600",
  },
  textAlertsAreContainer: {
    marginLeft: 8,
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
    paddingVertical: 0,
    paddingHorizontal: Padding.p_5xl,
    alignItems: "center",
    justifyContent: "center",
  },
  appointments: {
    flex: 1,
  },
  subscribed: {
    marginLeft: 8,
  },
  checkCircleParent: {
    alignItems: "center",
    flexDirection: "row",
  },
  appointmentsParent: {
    flex: 1,
  },
  frameWrapper1: {
    borderTopWidth: 1,
  },
  frameParent1: {
    marginTop: 16,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "stretch",
  },
  frameContainer: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "stretch",
  },
  frameGroup: {
    alignItems: "flex-end",
  },
  frameChild: {
    height: 1,
    backgroundColor: Color.colorGainsboro_100,
    alignSelf: "stretch",
  },
  rectangleWrapper: {
    width: '100%',
    marginTop: 16,
  },
  frameParent3: {
    alignItems: "center",
    alignSelf: "stretch",
  },
  frameParent2: {
    marginTop: 16,
    alignItems: "center",
  },
  notificationsSentFrom: {
    marginLeft: 8,
    fontFamily: FontFamily.openSansRegular,
  },
  frameWrapper7: {
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "stretch",
  },
  frameParent8: {
    marginTop: 16,
    marginBottom: 16,
    alignItems: "center",
    alignSelf: "stretch",
  },
  frameParent: {
    height: '100%',
    paddingBottom: 36,
    alignSelf: "stretch",
  },
  notificationsInner: {
    top: 100,
    height: '100%',
    padding: Padding.p_base,
    marginBottom:250
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
    backgroundColor: Color.sparkLightPurple,
  },
  notifications: {
    backgroundColor: Color.colorWhitesmoke_200,
    minHeight: 932,
    overflow: "hidden",
    width: '100%',
  },
});

export default Notifications;
