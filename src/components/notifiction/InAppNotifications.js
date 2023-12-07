import { useState } from "react"; 
import { Image, StyleSheet, Text, Pressable, View, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Color, FontSize, FontFamily, Padding, Border } from "../../../GlobalStyles";
import ProfileSettingsHeader from '../common/ProfileSettingsHeader';
import Toggle from '../common/Toggle'; 

const InAppNotifications = () => {
  const navigation = useNavigation();
  const [isToggleActive, setIsToggleActive] = useState(false);

  const handleToggle = (isActive) => {
    setIsToggleActive(isActive);
  };

  return (
    <View style={styles.inAppNotifications} accessible accessibilityLabel="In-App Notifications">
      <ProfileSettingsHeader
        title="Edit In-App Notifications"
        onPressBack={() => navigation.navigate('Notifications')}
        accessibilityLabel="Back to Account"
        accessibilityHint="Navigates back to the Notifications screen"
      />
      <ScrollView>
      <View style={styles.inAppNotificationsInner}>
        <View style={styles.frameParent} accessible >
          <View style={[styles.frameGroup, styles.frameBorder]}>
            <NotificationSetting
              title="Appointments"
              description="Receive app notifications when your appointments have updates."
              onToggle={handleToggle}
            />
            <NotificationSetting
              title="Outage Alerts"
              description="Receive app notifications when outages occur."
              onToggle={handleToggle}
            />
            <NotificationSetting
              title="Billing"
              description="Receive app notifications for billing."
              onToggle={handleToggle}
            />
          </View>
          <View style={styles.buttonsParent} accessible >
            <Pressable
              style={[styles.buttons, styles.buttonsLayout]}
              onPress={() => {/* Save function */ }}
              accessible
              accessibilityRole="button"
              accessibilityLabel="Save"
            >
              <Text style={[styles.makePayment, styles.makeTypo]}>Save</Text>
            </Pressable>
            <Pressable
              style={[styles.buttons1, styles.buttonsLayout]}
              onPress={() => navigation.navigate("Notifications")}
              accessible
              accessibilityRole="button"
              accessibilityLabel="Cancel"
              accessibilityHint="Cancels the action and returns to Notifications screen"
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

const NotificationSetting = ({ title, description, onToggle }) => (
  <View style={[styles.frameContainer, styles.frameBorder]}>
    <View style={styles.frameView}>
      <View style={[styles.frameParent1, styles.tabsParentFlexBox]}>
        <View style={styles.appointmentsParent} accessible accessibilityRole="switch" accessibilityLabel={title} accessibilityHint={`Toggle ${title.toLowerCase()} notifications`}>
          <Text style={styles.appointments}>{title}</Text>
          <View>
            <Toggle onToggle={onToggle} />
          </View>
        </View>
        <Text
          style={[
            styles.receiveAppNotifications1,
            styles.receiveTypo,
          ]}
          accessibilityRole="text"
        >
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
    width: '100',
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
