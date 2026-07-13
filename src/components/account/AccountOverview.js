import React, { useEffect, useState,useCallback} from "react";
import {  StyleSheet, Text, View, Alert, ScrollView,Platform } from "react-native";
import Touchable from "../common/customui/Touchable";
import { useNavigation , useFocusEffect} from "@react-navigation/native";
import { Color, FontFamily, FontSize, Padding, Border } from "../../../GlobalStyles";
import { A11Y } from "../../styles/theme";
import { useAnnouncement } from '../../hooks/useAnnouncement';
import LinearGradient from "react-native-linear-gradient";
import RightIcon from '../../../assets/svgs/Chevonright';
import ProfileSettingsIcon from '../../../assets/svgs/Rightactionable15';
import PasswordSecurityIcon from '../../../assets/svgs/Rightactionable16';
import NotificationsIcon from '../../../assets/svgs/Rightactinable17';
import Feedbackicon from '../../../assets/svgs/Messagealertcircle';
import ProfileSettingsHeader from '../common/ProfileSettingsHeader';
import { useDispatch, useSelector } from 'react-redux';
import { getSsoToken, cleanUserData, storeSsoToken, storeUser } from "../../redux/utils/LocalStorage";
import { clearAuthCookies } from "../utility/NativeCookieManager";
import { fetchProfileDetails } from '../../redux/actions/ProfileActionSuite'
import { logout } from 'react-native-app-auth';
import { saveUserInfo, logoutApp } from "../../redux/actions/UserAction";
import VersionCheck from 'react-native-version-check';
import Config from "react-native-config";
import { MenuText, HeadingH1 } from "../common/customui/Typography";
import AppStyles from "../../styles/AppStyles";

import PrimaryButton from "../common/customui/PrimaryButton";
import UserIconWhite from "../../res/svgIcons/UserIconWhite";
import moment from "moment";
import analytics from '@react-native-firebase/analytics';
import ZendeskChatIcon from "../utility/ZendeskChatIcon";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import {
  logoutZendesk,
  clearChatData
} from "../utility/RNZendeskChat";


const config = { issuer: Config.SSO_LOGIN, iosPrefersEphemeralSession: true, };

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
    let token = res.idToken;
    logout(config, {
      idToken: token,
      postLogoutRedirectUrl: Platform.OS === "ios" ? Config.SSO_REDIRECT_URL_IOS : Config.SSO_REDIRECT_URL_ANDROID,
    }).then(async (result) => {
      // Zendesk.logout();
      try {
        await analytics().setUserId(null);
        await analytics().setUserProperty('Sparklight_user_id', null);
      } catch (error) {
        console.warn('Error clearing analytics user ID:', error);
      }
      navigation.reset({
        index: 0,
        routes: [{ name: 'Splash', params: { isLogout: true } }],
      });
      clearAuthCookies();
      storeSsoToken({});
      storeUser({});
      dispatch(saveUserInfo({}))
      dispatch(logoutApp());
      cleanUserData();
      clearChatData();
      logoutZendesk();
    });
  });
};



const AccountOverview = () => {
  const navigation = useNavigation();
  const [menues, setMenues] = useState([]);
  const dispatch = useDispatch();
  const [fullName, setFullName] = useState('');

  const profile = useSelector((state) => state.profile || {});
  const profileDetails = profile.profileDetails || {};
 const { triggerOnScreenEntry } = useAnnouncement();

  useFocusEffect(
    useCallback(() => {
      triggerOnScreenEntry('AccountStackScreen');
    }, [triggerOnScreenEntry])
  );

  const [initials, setInitials] = useState("");

  useEffect(() => {
    dispatch(fetchProfileDetails());
    setMenues(menuItems1);
  }, []);


  useFocusEffect(
    useCallback(() => {
      const formatName = (name = "") => {
        if (typeof name !== 'string') return '';
        const trimmed = name.trim();
        if (trimmed.length === 0) return '';
        return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
      };

      const firstName = profileDetails?.firstName ?? "";
      const lastName = profileDetails?.lastName ?? "";
      const fallbackFullName = profileDetails?.fullName ?? "";
      const formattedName = `${formatName(firstName)} ${formatName(lastName)}`.trim();

      setFullName(formattedName || fallbackFullName.trim());
      console.log("Profile Details Updated:", profileDetails);
    }, [profileDetails])
  );
  

  const menuItems1 = [
    {
      name: 'Profile',
      onPress: () => navigation.navigate('ProfileSettings'),
      icon: ProfileSettingsIcon,
      accessibilityLabel: 'Navigate to profile',
      includeInMenu: true,
    },
    {
      name: 'Password & Security',
      onPress: () => navigation.navigate('PasswordSecurity'),
      icon: PasswordSecurityIcon,
      accessibilityLabel: 'Navigate to password and security settings',
      includeInMenu: true,
    },
    {
      name: 'Notifications',
      onPress: () => navigation.navigate('Notifications'),
      icon: NotificationsIcon,
      accessibilityLabel: 'Navigate to notifications settings',
      includeInMenu: true,
    },
    {
      name: 'App Feedback',
      onPress: () => navigation.navigate('Feedback'),
      icon: Feedbackicon,
      accessibilityLabel: 'Navigate to user management settings',
      includeInMenu: true,
    }
  ];


  
  return (
    <View style={styles.account} accessibilityLabel="Account screen">
      <ProfileSettingsHeader
        title=""
        iconAlignment="right"
        showIcon={false}
      />
      <LinearGradient
        style={styles.linearGradientStyle}
        locations={[0, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0.5 }}
        colors={["rgba(141, 59, 144, 1)", "rgba(53, 48, 145, 1)"]}
        useAngle={true}
        angle={90}
      />
      <View style={{ position: "absolute", top: 60, right: 10, zIndex: 1 }}>
        <ZendeskChatIcon />
      </View>
      <View style={[styles.frameParent]}>
        <View style={styles.rightActionableParent}>
          <View style={styles.rightActionable}>
            <UserIconWhite width={28} height={26}/>
          </View>
          {/* Full name for profile */}
          <HeadingH1 style={styles.melissaSmith} accessible={true} accessibilityLabel={`Profile for ${profileDetails?.fullname}`} accessibilityRole="text">
            {fullName}
          </HeadingH1>
        </View>
        <ScrollView style={{ flex: 1 }}>
          <View style={{ marginBottom: '30%' }}>
            <View style={styles.frameGroup}>
              <View style={AppStyles.card}>
                {/* Mapping through menu items */}
                {menues.map((item, index) => (
                  item.includeInMenu && (<React.Fragment key={item.name}>
                    <Touchable
                      minSize={0}
                      style={[styles.rightActionableGroup, styles.tabsFlexBox]}
                      onPress={item.onPress}
                      accessibilityLabel={`${item.name} Button`}
                      accessibilityHint={`Navigates to ${item.name}`}
                      accessibilityRole="button"
                    >
                      {/* Menu item icon */}
                     {/* <View accessible={true} accessibilityLabel={`${item.name} icon`}
                          style={{alignSelf:'center'}}>
                            <item.icon width={24} height={24}/>
                          </View> */}
                      {/* Menu item text */}
                      <MenuText style={[styles.profileSettings]}>
                        {item.name}
                      </MenuText>
                      {/* Chevron/Arrow icon */}
                      <View style={[{ marginLeft: 10 }, styles.rightIconLayout]}>
                          <RightIcon />
                          </View>
                    </Touchable>
                    {/* Divider, if not the last item */}
                    {item.includeInMenu && index < menuItems1.length - 1 && <View style={styles.frameChild} />}
                  </React.Fragment>
                  )))}
              </View>
              <View style={{paddingTop: Padding.p_5xl}}>
                <PrimaryButton
                  title="Logout"
                  buttonType={'submit'}
                  textStyle={{ fontSize: FontSize.size_lg }}
                  onPress={() => { logoutConfirmationPopup(dispatch, navigation) }}
                />
              </View>

              <View style={{ flexDirection: 'row', ...styles.buttonsSpaceBlock, ...styles.buttons, ...styles.buttonsSpaceBlock }}>
                <Touchable
                  minSize={0}
                  accessible={true}
                  accessibilityRole="link"
                  hitSlop={A11Y.hitSlop}
                  style={styles.footerLink}
                  onPress={() => navigation.navigate('ArticleWindowUtility', { url: 'https://business.sparklight.com/legal/mobile-app-privacy-policy', name: 'Privacy Policy' })}
                >
                  <Text accessibilityLabel="Privacy Policy" style={styles.linkStyle}>
                    Privacy Policy
                  </Text>
                </Touchable>

                <Text style={styles.separator} accessible={false}> | </Text>

                <Touchable
                  minSize={0}
                  accessible={true}
                  accessibilityRole="link"
                  hitSlop={A11Y.hitSlop}
                  style={styles.footerLink}
                  onPress={() => navigation.navigate('ArticleWindowUtility', { url: 'https://business.sparklight.com/legal/mobile-app-terms-and-conditions', name: 'Terms & Conditions' })}
                >
                  <Text accessibilityLabel="Terms & Conditions" style={styles.linkStyle}>
                    Terms & Conditions
                  </Text>
                </Touchable>
              </View>

            </View>
              <Touchable
              minSize={0}
              onPress={() => navigation.navigate('ArticleWindowUtility', { url: 'https://support.sparklight.com/hc/en-us/articles/30298585161879-MySparklight-Business-App-Release-Notes?isMobile=true', name: 'App Release Notes' })}
              accessibilityLabel={'Version '+VersionCheck.getCurrentVersion()}
              accessibilityRole="link"
              hitSlop={A11Y.hitSlop}
              style={styles.footerLink}
            >
              <Text style={{ color: Color.sparklightBrightPurple, alignSelf: 'center', textDecorationLine: 'underline',fontWeight: '600' }}>
                Version:{VersionCheck.getCurrentVersion()}
              </Text>
            </Touchable>
            <Text style={styles.copyright}>
                {`©${moment().year()} Cable One, Inc. All rights reserved.`}
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
  }, copyright: {
    marginTop:wp("25%"),
    fontFamily: FontFamily.openSansRegular,
    fontSize: 14,
    textAlign: "center",
    fontWeight: "400",
    color: Color.colorMidnightblue,
    alignSelf: "center",
    paddingHorizontal: wp("3%"),
  },
  tabsFlexBox: {
    flexDirection: "row",
    alignSelf: "stretch",
  },
  footerLink: {
    paddingHorizontal: Padding.p_5xs,
  },
  linkStyle: {
    color: Color.sparklightBrightPurple,
    textDecorationLine: 'underline',
    alignSelf: 'center',
    fontWeight: '600'
  },
  separator: {
    color: Color.sparklightBrightPurple,
    alignSelf: 'center',
    fontWeight: '600'
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
    marginTop:12
  },
  leftIconLayout: {
    height: 28,
    width: 28,
    marginRight: 5,
    
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
    width: 210,
    lineHeight: 28,
    paddingBottom: Padding.p_5xs,
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
    marginLeft: 2,
    lineHeight: 28,
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
