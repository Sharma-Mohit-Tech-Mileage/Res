import * as React from "react";
import { Image, StyleSheet, Text, View, Pressable, StatusBar, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Color, FontFamily, Padding, FontSize, Border } from "../../../GlobalStyles";
import LinearGradient from "react-native-linear-gradient";
import chevronRightIcon from '../../../assets/chevronright.png';
import profileSettingsIcon from '../../../assets/right-actionable15.png';
import passwordSecurityIcon from '../../../assets/right-actionable16.png';
import notificationsIcon from '../../../assets/right-actionable17.png';
import userManagementIcon from '../../../assets/right-actionable18.png';

const Account = () => {
  const navigation = useNavigation();
  
  const menuItems = [
    {
      name: 'Profile Settings',
      onPress: () => navigation.navigate('ProfileSettings'),
      icon: profileSettingsIcon,
      accessibilityLabel: 'Navigate to profile settings',
    },
    {
      name: 'Password & Security',
      onPress: () => navigation.navigate('PasswordSecurity'),
      icon: passwordSecurityIcon,
      accessibilityLabel: 'Navigate to password and security settings',
    },
    {
      name: 'Notifications',
      onPress: () => navigation.navigate('Notifications'),
      icon: notificationsIcon,
      accessibilityLabel: 'Navigate to notifications settings',
    },
    {
      name: 'User Management',
      onPress: () => navigation.navigate('UserManagement'),
      icon: userManagementIcon,
      accessibilityLabel: 'Navigate to user management settings',
    },
  ];

  return (
    <View style={{ flex: 1 }} accessibilityLabel="Account screen">
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <LinearGradient
        style={[styles.accountChild]}
        locations={[0, 1]}
        colors={["rgba(53, 48, 145, 0.78)", "rgba(141, 59, 144, 0.9)"]}
        useAngle
        angle={90}
      />
      <View>
        <View style={styles.navBar}>
          {/* Screen header */}
          <Text style={[styles.title, styles.textTypo]} accessible={true} accessibilityRole="header">
            Account
          </Text>
        </View>
      </View>
      <View style={[styles.frameParent, styles.buttonsSpaceBlock]}>
        <View style={styles.rightActionableParent}>
          <View style={styles.rightActionable}>
            {/* Initials or profile picture alternative text */}
            <View />
            <Text style={[styles.text, styles.textTypo]} accessibilityLabel="Initials M S">
              MS
            </Text>
          </View>
          {/* Full name for profile */}
          <Text style={styles.melissaSmith} accessibilityLabel="Profile name: Melissa Smith">
            Melissa Smith
          </Text>
        </View>
        <View style={styles.frameGroup}>
          <View style={styles.navigationBorder}>
            {/* Mapping through menu items */}
            {menuItems.map((item, index) => (
              <React.Fragment key={item.name}>
                <Pressable
                  style={[styles.rightActionableGroup, styles.tabsFlexBox]}
                  onPress={item.onPress}
                  accessibilityLabel={item.name}
                  accessibilityHint={`Navigates to ${item.name}`}
                  accessibilityRole="button"
                >
                  {/* Menu item icon */}
                  <Image
                    style={styles.rightIconLayout}
                    resizeMode="cover"
                    source={item.icon}
                    accessible
                    accessibilityLabel={`${item.name} icon`}
                  />
                  {/* Menu item text */}
                  <Text style={[styles.profileSettings, styles.makePaymentTypo]}>
                    {item.name}
                  </Text>
                  {/* Chevron/Arrow icon */}
                  <Image
                    style={[styles.rightActionableIcon1, styles.rightIconLayout]}
                    resizeMode="cover"
                    source={chevronRightIcon}
                    accessible
                    accessibilityLabel="Arrow right"
                  />
                </Pressable>
                {/* Divider, if not the last item */}
                {index < menuItems.length - 1 && <View style={styles.frameChild} />}
              </React.Fragment>
            ))}
          </View>
          {/* Logout button */}
          <Pressable
            accessible={true}
            accessibilityLabel="Logout button"
            accessibilityRole="button"
            accessibilityHint="Logs you out of the account"
            style={[styles.buttons, styles.buttonsSpaceBlock]}
          >
            <Text style={[styles.makePayment, styles.makePaymentTypo]}>
              Logout
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textTypo: {
    color: Color.sparklightWhite,
    fontWeight: "600",
    top: "50%",
    textAlign: "center",
    fontFamily: FontFamily.openSansSemiBold,
    left: "50%",
    position: "absolute",
  },
  buttonsSpaceBlock: {
    paddingVertical: Padding.p_base,
    alignItems: "center",
  },
  navigationBorder: {
    borderColor: Color.sparklightGray,
    backgroundColor: Color.sparklightWhite,
    borderStyle: "solid",
    justifyContent: "center",
  },
  tabsFlexBox: {
    flexDirection: "row",
    alignSelf: "stretch",
  },
  makePaymentTypo: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.openSansRegular,
  },
  rightIconLayout: {
    height: 20,
    width: 20,
  },

  accountChild: {
    top: "0%",
    right: "0%",
    bottom: "82.23%",
    left: "0%",
    maxHeight: "100%",
    position: "absolute",
    maxWidth: "100%",
  },
  title: {
    marginLeft: -35,
    fontSize: FontSize.size_lg,
  },
  navBar: {
    top: 70,
    width: '100%',
  },
  text: {
    marginTop: -22,
    marginLeft: -24,
    fontSize: 24,
    lineHeight: 40,
    width: 48,
    textAlign: "center",
    fontWeight: "600",
    top: "50%",
  },
  rightActionable: {
    borderColor: Color.sparklightBlue,
    borderWidth: 4,
    width: 72,
    height: 72,
    borderStyle: "solid",
    backgroundColor: Color.sparkLightPurple,
    borderRadius: Border.br_381xl,
  },
  melissaSmith: {
    fontSize: 22,
    width: 210,
    fontFamily: FontFamily.openSansRegular,
    color: Color.sparklightDarkestGray,
    lineHeight: 28,
    textAlign: "center",
  },
  rightActionableParent: {
    paddingBottom: Padding.p_base,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
  },
  profileSettings: {
    textAlign: "left",
    marginLeft: 10,
    color: Color.sparklightDarkestGray,
    lineHeight: 28,
    fontSize: FontSize.size_base,
    flex: 1,
  },
  rightActionableIcon1: {
    marginLeft: 10,
  },
  rightActionableGroup: {
    paddingVertical: Padding.p_base,
    alignItems: "center",
    paddingHorizontal: Padding.p_5xl,
  },
  frameChild: {
    width: 358,
    height: 1,
    backgroundColor: Color.sparklightGray,
  },
  makePayment: {
    width: 282,
    color: Color.sparkLightPurple,
    textAlign: "center",
  },
  buttons: {
    width: '100%',
    paddingHorizontal: 0,
    marginTop: 16,
    borderRadius: Border.br_11xs,
    justifyContent: "center",
    height: 56,
    paddingVertical: Padding.p_base,
  },
  frameGroup: {
    marginTop: 10,
    alignSelf: "stretch",
  },
  frameParent: {
    top: 100,
    paddingHorizontal: Padding.p_5xl,
    paddingVertical: Padding.p_base,
    width: '100%',
    left: 0,
    zIndex:9
  }
});

export default Account;
