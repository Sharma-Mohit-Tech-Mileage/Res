import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View, Pressable, StatusBar, Alert,ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Color, FontFamily, Padding, FontSize, Border } from "../../../GlobalStyles";
import LinearGradient from "react-native-linear-gradient";
import chevronRightIcon from '../../../assets/chevronright.png';
import profileSettingsIcon from '../../../assets/right-actionable15.png';
import passwordSecurityIcon from '../../../assets/right-actionable16.png';
import notificationsIcon from '../../../assets/right-actionable17.png';
import userManagementIcon from '../../../assets/right-actionable18.png';
import feedbackicon from '../../../assets/message-alert-circle.png';
import ProfileSettingsHeader from '../common/ProfileSettingsHeader';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from "../../redux/utils/LocalStorage";
import { fetchProfileDetails } from '../../redux/actions/ProfileActionSuite'
import { logout } from 'react-native-app-auth';
import { cleanUserData } from "../../redux/utils/LocalStorage";
import * as Zendesk from 'react-native-zendesk-messaging';

const config = {
  issuer: 'https://login.uat.cableone.net/auth/realms/external-sso-realm',
};

const logoutConfirmationPopuo=(navigation)=>{
  Alert.alert(
    'Confirm Logout',
    'Are you sure you want to Logout the app?',
    [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      {
        text: 'Logout',
        onPress: () => {
          cleanUserData();
          Zendesk.logout()
          navigation.reset({
            index: 0,
            routes: [{ name: 'Splash' }]}) 
          // let re = getSsoToken().then((res) => {
          // let token=res.idToken;
          // console.log('Logout',token) 
          // });
        },
      },
    ],
    { cancelable: true }
  );
  
}

const AccountOverview = () => {
  const navigation = useNavigation();
  const [fullName, setFullName] = useState('');
  const [initials, setInitials] = useState('');
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchProfileDetails());
  }, [dispatch]);
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
    {
      name: 'Feedback',
      onPress: () => navigation.navigate('Feedback'),
      icon: feedbackicon,
      accessibilityLabel: 'Navigate to user management settings',
    }
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await getUser();
      if (data) {
        // Extracting fullName and initials
        const firstName = data.userInfo?.firstName || '';
        const lastName = data.userInfo?.lastName || '';

        let initials = '';
        if (firstName.length > 0) {
          initials += firstName.charAt(0).toUpperCase();
        }
        if (lastName.length > 0) {
          initials += lastName.charAt(0).toUpperCase();
        }
        // Camel Case Full Name
        const fullNameCamelCase = [firstName, lastName]
          .map(name => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase())
          .join(' ');
        setFullName(fullNameCamelCase);
        setInitials(initials);
      }
    };
    fetchUserData();
  }, []);

  return (
    <View style={{ flex: 1 }} accessibilityLabel="Account screen">
      <ProfileSettingsHeader
        title="Account"
        iconAlignment="right"
        showIcon={false} // New prop to control icon visibility
      />
      <ScrollView>
        <View style={[styles.frameParent, styles.buttonsSpaceBlock]}>
          <LinearGradient
            style={styles.linearGradientStyle}
            locations={[0, 1]}
            colors={["rgba(53, 48, 145, 1)", "rgba(141, 59, 144, 1)"]}
            useAngle={true}
            angle={90}
          />

          <View style={styles.rightActionableParent}>
            <View style={styles.rightActionable}>
              <Text style={styles.text}>
                {initials}
              </Text>
            </View>
            {/* Full name for profile */}
            <Text style={styles.melissaSmith} >
              {fullName}
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

            <Pressable
              accessible={true}
              style={[styles.buttons, styles.buttonsSpaceBlock]}
              onPress={()=>{logoutConfirmationPopuo(navigation)}}
            >
              <Text style={[styles.makePayment, styles.makePaymentTypo]}>
                Logout
              </Text>
            </Pressable>
            <Pressable
              style={[styles.buttons, styles.buttonsSpaceBlock1]}
              onPress={() => { navigation.navigate('ArticalWindowUtility', { url: 'https://www.sparklight.com/legal/privacy-policy', name: 'Privacy Policy' }) }}
            >
              <Text style={[{ fontStyle: 'italic', color: Color.gray600 }]}>
                View our Privacy Policy and Terms & Condition
              </Text>
            </Pressable>
            {/* Logout button */}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  linearGradientStyle: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: '95.5%',
  },
  buttonsSpaceBlock: {
    paddingVertical: Padding.p_base,
    alignItems: "center",
  },
  buttonsSpaceBlock1: {
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
  title: {
    marginLeft: -35,
    fontSize: FontSize.size_lg,
  },
  rightActionable: {
    borderColor: Color.colorWhitesmoke_200,
    borderWidth: 4,
    width: 72,
    height: 72,
    backgroundColor: Color.colorMidnightblue,
    borderRadius: 36, // Make sure this is always half of the width and height to create a circle
    alignItems: 'center', // Center children horizontally
    justifyContent: 'center', // Center children vertically
  },

  text: {
    fontSize: 24,
    fontWeight: "600",
    color: Color.sparklightWhite,
    fontFamily: FontFamily.openSansSemiBold,
  },

  melissaSmith: {
    fontSize: FontSize.size_3xl,
    width: 210,
    fontFamily: FontFamily.openSansRegular,
    color: Color.colorGray_200,
    lineHeight: 28,
    textAlign: "center",
  },
  rightActionableParent: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
  },
  profileSettings: {
    textAlign: "left",
    marginLeft: 10,
    color: Color.colorGray_100,
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
    paddingHorizontal: Padding.p_5xl,
    height: 1,
    backgroundColor: Color.sparklightGray,
  },
  makePayment: {
    width: 282,
    color: Color.colorMidnightblue,
    textAlign: "center",
  },
  buttons: {
    width: '100%',
    paddingHorizontal: 0,
    justifyContent: "center",
    paddingVertical: Padding.p_base,
  },
  frameGroup: {
    marginTop: Padding.p_5xl,
    alignSelf: "stretch",
  },
  frameParent: {
    paddingHorizontal: Padding.p_5xl,
    paddingVertical: Padding.p_base,
    width: '100%',
    left: 0,
    marginBottom: "20%",
    zIndex: 9
  }
});

export default AccountOverview;
