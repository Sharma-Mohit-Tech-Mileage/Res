import React, { useEffect, useState, useCallback } from "react";
import { Image, StyleSheet, Text, View, Pressable, Alert, ScrollView } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Color, FontFamily, FontSize, Padding, Border } from "../../../GlobalStyles";
import LinearGradient from "react-native-linear-gradient";
import chevronRightIcon from '../../../assets/chevronright.png';
import profileSettingsIcon from '../../../assets/right-actionable15.png';
import passwordSecurityIcon from '../../../assets/right-actionable16.png';
import notificationsIcon from '../../../assets/right-actionable17.png';
import userManagementIcon from '../../../assets/right-actionable18.png';
import feedbackicon from '../../../assets/message-alert-circle.png';
import ProfileSettingsHeader from '../common/ProfileSettingsHeader';
import { useDispatch, useSelector } from 'react-redux';
import { getSsoToken, cleanUserData, storeSsoToken, storeUser } from "../../redux/utils/LocalStorage";
import { fetchProfileDetails } from '../../redux/actions/ProfileActionSuite'
import { logout } from 'react-native-app-auth';
import { getUser } from "../../redux/utils/LocalStorage";
import { saveUserInfo, logoutApp } from "../../redux/actions/UserAction";
import VersionCheck from 'react-native-version-check';
import { Env } from "../../network/apis/account/Constants";
import AppStyles from "../common/styles/AppStyles";
import UserIconWhite from "../../res/svgIcons/UserIconWhite";
import moment from "moment";
import analytics from '@react-native-firebase/analytics';

const config = {
  issuer: Env.SSO_LOGIN,
  iosPrefersEphemeralSession: true,
};

const logoutConfirmationPopup = (dispatch, navigation) => {
  Alert.alert(
    'Confirm Logout',
    'Are you sure you want to logout?',
    [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      {
        text: 'Ok',
        onPress: () => {
          logoutAction(dispatch, navigation);
        },
      },
    ],
    { cancelable: true }
  );
};


const logoutAction = (dispatch, navigation) => {
  getSsoToken().then((res) => {
    console.log('token', res);
    let token = res.idToken;
    console.log('idToken', token);
    logout(config, {
      idToken: token,
      postLogoutRedirectUrl: 'com.sparklight.customer.app.auth0://sparklight-customer.us.auth0.com/ios/com.sparklight.customer.app/callback',
    }).then(async(result) => {
     try {
        analytics().setUserId(null);
        await analytics().setUserProperty('Sparklight_user_id', null);
        console.log('Analytics User ID cleared on logout');
      } catch (error) {
        console.error('Error clearing analytics user ID:', error);
      }
      navigation.reset({
        index: 0,
        routes: [{ name: 'Splash', params: { isLogout: true } }],
      });
      storeUser({});
      storeSsoToken({});
      dispatch(saveUserInfo({}));
      dispatch(logoutApp());
      cleanUserData();
    });
  });
};

const AccountOverview = () => {
  const navigation = useNavigation();
  const [fullName, setFullName] = useState('');
  const [initials, setInitials] = useState('');
  const [menues, setMenues] = useState([]);
  const dispatch = useDispatch();
  const user = useSelector(state => state.combinedReducers.user.userData);
  const profile = useSelector(state => state.combinedReducers.profile || {});
  const profileDetails = profile.profileDetails || {};
  useEffect(() => {
    dispatch(fetchProfileDetails());

    getUser().then((res) => {
      if(res.userInfo?.accountNumber.toString().length>=16){
        setMenues(menuItems1)
      }else{
        setMenues(menuItems)
      }
    });
    
  }, []);

  const menuItems = [
    {
      name: 'Profile',
      onPress: () => navigation.navigate('ProfileSettings'),
      icon: profileSettingsIcon,
      accessibilityLabel: 'Navigate to profile',
      includeInMenu: true,
    },
    {
      name: 'Password & Security',
      onPress: () => navigation.navigate('PasswordSecurity'),
      icon: passwordSecurityIcon,
      accessibilityLabel: 'Navigate to password and security settings',
      includeInMenu: true,
    },
    {
      name: 'Notifications',
      onPress: () => navigation.navigate('Notifications'),
      icon: notificationsIcon,
      accessibilityLabel: 'Navigate to notifications settings',
      includeInMenu: true,
    },
    {
      name: 'User Management',
      onPress: () => navigation.navigate('UserManagement'),
      icon: userManagementIcon,
      accessibilityLabel: 'Navigate to user management settings',
      includeInMenu: true,
    },
    {
      name: 'App Feedback',
      onPress: () => navigation.navigate('Feedback'),
      icon: feedbackicon,
      accessibilityLabel: 'Navigate to user management settings',
      includeInMenu: true,
    }
  ];

  const menuItems1 = [
    {
      name: 'Profile',
      onPress: () => navigation.navigate('ProfileSettings'),
      icon: profileSettingsIcon,
      accessibilityLabel: 'Navigate to profile',
      includeInMenu: true,
    },

   
    {
      name: 'Password & Security',
      onPress: () => navigation.navigate('PasswordSecurity'),
      icon: passwordSecurityIcon,
      accessibilityLabel: 'Navigate to password and security settings',
      includeInMenu: true,
    },
    {
      name: 'Notifications',
      onPress: () => navigation.navigate('Notifications'),
      icon: notificationsIcon,
      accessibilityLabel: 'Navigate to notifications settings',
      includeInMenu: true,
    },
    
    {
      name: 'App Feedback',
      onPress: () => navigation.navigate('Feedback'),
      icon: feedbackicon,
      accessibilityLabel: 'Navigate to user management settings',
      includeInMenu: true,
    }
  ];


  useFocusEffect(
    useCallback(() => {
      const firstName = profileDetails?.firstName || '';
      const lastName = profileDetails?.lastName || '';

      let initials = '';
      if (firstName.length > 0) {
        initials += firstName.charAt(0).toUpperCase();
      }
      if (lastName.length > 0) {
        initials += lastName.charAt(0).toUpperCase();
      }

      const fullNameCamelCase = [firstName, lastName]
        .map(name => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase())
        .join(' ');

      setFullName(fullNameCamelCase);
      setInitials(initials);
      return () => {
      };
    }, [profileDetails]) 
  );

  return (
    <View style={styles.account} accessibilityLabel="Account screen">
      <ProfileSettingsHeader
        title="Account"
        iconAlignment="right"
        showIcon={false} 
      />
      <LinearGradient
        style={styles.linearGradientStyle}
        locations={[0, 1]}
        colors={["rgba(53, 48, 145, 1)", "rgba(141, 59, 144, 1)"]}
        useAngle={true}
        angle={90}
      />
      <View style={[styles.frameParent]}>
        <View style={styles.rightActionableParent}>
          <View style={styles.rightActionable}>
            <UserIconWhite width={28} height={26}/> 
          </View>
          {/* Full name for profile */}
          <Text style={styles.melissaSmith} >
            {fullName}
          </Text>
        </View>
        <ScrollView style={{ flex: 1 }}>
          <View style={{ marginBottom: '30%' }}>
            <View style={styles.frameGroup}>
              <View style={AppStyles.card}>
                {/* Mapping through menu items */}
                {menues.map((item, index) => (
                  item.includeInMenu && (<React.Fragment key={item.name}>
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
                        resizeMode='contain'
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
                        style={[{ marginLeft: 10 }, styles.rightIconLayout]}
                        resizeMode="cover"
                        source={chevronRightIcon}
                        accessible
                        accessibilityLabel="Arrow right"
                      />
                    </Pressable>
                    {/* Divider, if not the last item */}
                    {item.includeInMenu && index < menuItems.length - 1 && <View style={styles.frameChild} />}
                  </React.Fragment>
                  )))}
              </View>
              <View style={styles.buttonContainer}>
                <Pressable
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="Logout"
                  style={[styles.button, styles.buttonsLayout]}
                  onPress={() => { logoutConfirmationPopup(dispatch, navigation) }}
                >
                  <Text style={[styles.accept]}>
                    Logout
                  </Text>
                </Pressable>
              </View>

              <View style={{ flexDirection: 'row', ...styles.buttonsSpaceBlock, ...styles.buttons, ...styles.buttonsSpaceBlock }}>
                <Pressable
                  accessible={true}
                  accessibilityRole="link"
                  onPress={() => navigation.navigate('ArticalWindowUtility', { url: 'https://www.sparklight.com/legal/mobile-app-privacy-policy', name: 'Privacy Policy' })}
                >
                  <Text accessibilityLabel="Privacy Policy" style={styles.linkStyle}>
                    Privacy Policy
                  </Text>
                </Pressable>

                <Text style={styles.linkStyle}> | </Text>

                <Pressable
                  accessible={true}
                  accessibilityRole="link"
                  onPress={() => navigation.navigate('ArticalWindowUtility', { url: 'https://www.sparklight.com/legal/mobile-app-terms-and-conditions?isMobile=true', name: 'Terms & Conditions' })}
                >
                  <Text accessibilityLabel="Terms & Conditions" style={styles.linkStyle}>
                    Terms & Conditions
                  </Text>
                </Pressable>
              </View>

            </View>
            <Pressable
              onPress={() => navigation.navigate('ArticalWindowUtility', { url: 'https://support.sparklight.com/hc/en-us/articles/30080605597079-MySparklight-App-Release-Notes?isMobile=true', name: 'App Release Notes' })}
              accessibilityLabel={'Version '+VersionCheck.getCurrentVersion()}
              accessibilityRole="link"
            >
              <Text style={{ color: Color.colorMidnightblue, alignSelf: 'center', textDecorationLine: 'underline' }}>
                Version:{VersionCheck.getCurrentVersion()}
              </Text>
            </Pressable>

            <Text style={{ color: Color.colorMidnightblue, alignSelf:'center', fontSize:FontSize.size_sm,fontFamily:FontFamily.openSansRegular , marginTop:50,fontWeight:'400' }}>
                {`Copyright © ${moment().year()}, Sparklight ®, All Rights Reserved.`}
            </Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  linearGradientStyle: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 150,
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
  accept: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.openSansRegular,
    textAlign: "center",
    color: Color.sparklightWhite,
  },
  tabsFlexBox: {
    flexDirection: "row",
    alignSelf: "stretch",
  },
  linkStyle: {
    color: Color.colorMidnightblue,
    alignSelf: 'center',
    fontWeight: '600',
    textDecorationLine: 'underline', // added underscore for linkStyle
  },
  makePaymentTypo: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.openSansRegular,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%', 
    paddingTop: Padding.p_5xl,
  },

  rightIconLayout: {
    height: 24,
    width: 24,
    marginRight: 5
  },
  title: {
    marginLeft: -35,
    fontSize: FontSize.size_lg,
  },
  button: {
    backgroundColor: Color.colorMidnightblue,
    width: '100%',
  },
  buttonsLayout: {
    paddingVertical: Padding.p_base,
    paddingHorizontal: 0,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Border.br_11xs,
    minHeight: 50
  },
  rightActionable: {
    borderColor: Color.colorWhitesmoke_200,
    borderWidth: 4,
    width: 72,
    height: 72,
    backgroundColor: Color.colorMidnightblue,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
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
    overflow: 'hidden',
  },
  profileSettings: {
    textAlign: "left",
    marginLeft: 10,
    color: Color.colorGray_100,
    lineHeight: 28,
    fontSize: FontSize.size_base,
    flex: 1,
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
    paddingHorizontal: Padding.p_base,
    alignSelf: "stretch",
  },
  frameParent: {
    flex: 1,
    paddingVertical: Padding.p_base,
    alignSelf: 'stretch',
  },
  account: {
    flex: 1,
    backgroundColor: Color.colorWhitesmoke_200,
    width: "100%",
  },

});

export default AccountOverview;
