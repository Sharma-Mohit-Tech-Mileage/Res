import React, { useEffect, useState,useCallback} from "react";
import { StyleSheet, Text, View, Alert, Platform } from "react-native";
import Touchable from "../common/customui/Touchable";
import { useNavigation , useFocusEffect} from "@react-navigation/native";
import { Color, FontFamily, FontSize, Padding } from "../../styles/GlobalStyles";
import { A11Y } from "../../styles/theme";
import { useAnnouncement } from '../../hooks/useAnnouncement';
import RightIcon from '../../../assets/svgs/Chevonright';
import ProfileSettingsIcon from '../../../assets/svgs/Rightactionable15';
import PasswordSecurityIcon from '../../../assets/svgs/Rightactionable16';
import NotificationsIcon from '../../../assets/svgs/Rightactinable17';
import Feedbackicon from '../../../assets/svgs/Messagealertcircle';
import TabRootHeader from "../common/TabRootHeader";
import { useDispatch, useSelector } from 'react-redux';
import { getSsoToken, cleanUserData, storeSsoToken, storeUser } from "../../redux/utils/LocalStorage";
import { clearAuthCookies } from "../utility/NativeCookieManager";
import { fetchProfileDetails } from '../../redux/actions/ProfileActionSuite'
import { logout } from 'react-native-app-auth';
import { saveUserInfo, logoutApp } from "../../redux/actions/UserAction";
import VersionCheck from 'react-native-version-check';
import Config from "react-native-config";
import { MenuText, Hyperlink } from "../common/customui/Typography";
import AppStyles from "../../styles/AppStyles";

import PrimaryButton from "../common/customui/PrimaryButton";
import UserIconWhite from "../../res/svgIcons/UserIconWhite";
import moment from "moment";
import { getAnalytics, setUserId, setUserProperty } from '@react-native-firebase/analytics';
import { wp } from "../../utils/responsive";
import { ScreenScroll } from "../common/customui/Screen";

import {
  logoutZendesk,
  clearChatData
} from "../utility/RNZendeskChat";
import { logWarn } from "../../utils/logger";

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
      // Finish resetting the chat identity before another account can sign in.
      clearChatData();
      await logoutZendesk();
      try {
        await setUserId(getAnalytics(), null);
        await setUserProperty(getAnalytics(), 'Sparklight_user_id', null);
      } catch (error) {
        logWarn('Error clearing analytics user ID:', error);
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
      name: 'Change Username',
      onPress: () => navigation.navigate('ProfileSettingsEdit'),
      icon: ProfileSettingsIcon,
      accessibilityLabel: 'Change Username',
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
      <TabRootHeader
        chatScreenName="Account Overview"
        icon={<UserIconWhite width={28} height={26} />}
        title={fullName}
        titleProps={{ accessible: true, accessibilityLabel: `Profile for ${profileDetails?.fullname}`, accessibilityRole: "text" }}
      />
      <View style={[styles.frameParent]}>
        <ScreenScroll framed style={{ flex: 1 }}>
          <View>
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
                        <View style={styles.rightIconLayout}>
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
                  style={[styles.footerLink, styles.buttonsSpaceBlock]}
                  onPress={() => navigation.navigate('ArticleWindowUtility', { url: 'https://www.sparklight.com/legal/mobile-app-privacy-policy', name: 'Privacy Policy' })}
                >
                  <Hyperlink accessibilityLabel="Privacy Policy" >
                    Privacy Policy
                  </Hyperlink>
                </Touchable>

                <Text style={styles.separator} accessible={false}> | </Text>

                <Touchable
                  minSize={0}
                  accessible={true}
                  accessibilityRole="link"
                  hitSlop={A11Y.hitSlop}
                  style={[styles.footerLink, styles.buttonsSpaceBlock]}
                  onPress={() => navigation.navigate('ArticleWindowUtility', { url: 'https://business.sparklight.com/legal/mobile-app-terms-and-conditions', name: 'Terms & Conditions' })}
                >
                  <Hyperlink accessibilityLabel="Terms & Conditions" >
                    Terms & Conditions
                  </Hyperlink>
                </Touchable>
              </View>

            </View>
              <Touchable
              minSize={0}
              onPress={() => navigation.navigate('ArticleWindowUtility', { url: 'https://support.sparklight.com/hc/en-us/articles/30080605597079-MySparklight-App-Release-Notes?isMobile=true', name: 'App Release Notes' })}
              accessibilityLabel={'Version '+VersionCheck.getCurrentVersion()}
              accessibilityRole="link"
              hitSlop={A11Y.hitSlop}
                style={[styles.footerLink, styles.buttonsSpaceBlock]}
            >
              <Hyperlink >
                Version: {VersionCheck.getCurrentVersion()}
              </Hyperlink>
            </Touchable>
            <Text style={styles.copyright}>
                {`©${moment().year()} Cable One, Inc. All rights reserved.`}
            </Text>
          </View>
        </ScreenScroll>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonsSpaceBlock: {
    paddingVertical: Padding.p_base,
    alignItems: "center",
  },
  copyright: {
    marginTop:wp("25%"),
    fontFamily: FontFamily.RadioCanadaRegular,
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
  separator: {
    color: Color.sparklightPrimaryPurple,
    alignSelf: 'center',
    fontFamily: FontFamily.RadioCanadaBold,
    fontWeight: '600'
  },
  rightIconLayout: {
    height: 24,
    width: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  profileSettings: {
    textAlign: "left",
    marginLeft: 2,
    // No fixed lineHeight: on a flex:1 Text it makes Android measure an extra line at some densities, pushing the row out of line.
    flex: 1,
  },
  rightActionableGroup: {
    paddingVertical: Padding.p_base,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Padding.p_5xl,
  },
  frameChild: {
    paddingHorizontal: Padding.p_5xl,
    height: 1,
    backgroundColor: Color.sparklightGray,
  },
  buttons: {
    width: '100%',
    paddingHorizontal: 0,
    justifyContent: "center",
    paddingVertical: Padding.p_base,
  },
  frameGroup: {
    alignSelf: "stretch",
  },
  frameParent: {
    flex: 1,
    // Top spacing now comes from TabRootHeader.
    paddingBottom: Padding.p_base,
    alignSelf: 'stretch',
  },
  account: {
    flex: 1,
    backgroundColor: Color.Gray300,
    width: "100%",
  },

});

export default AccountOverview;
