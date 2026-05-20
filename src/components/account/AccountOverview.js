import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  ScrollView,
  Platform,
} from "react-native";
import Touchable from "../common/customui/Touchable";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useAnnouncement } from '../../hooks/useAnnouncement';
import {
  Color,
  FontFamily,
  FontSize,
  Padding,
  Border,
} from "../../../GlobalStyles";
import LinearGradient from "react-native-linear-gradient";
import { A11Y } from "../../styles/theme";

import ProfileSettingsIcon from "../../../assets/svgs/Rightactionable15";
import PasswordSecurityIcon from "../../../assets/svgs/Rightactionable16";
import NotificationsIcon from "../../../assets/svgs/Rightactinable17";
import UserManagementIcon from "../../../assets/svgs/Rightactionable18";
import Feedbackicon from "../../../assets/svgs/Messagealertcircle";
import ProfileSettingsHeader from "../common/ProfileSettingsHeader";
import { useDispatch, useSelector } from "react-redux";
import {
  getSsoToken,
  cleanUserData,
  storeSsoToken,
  storeUser,
} from "../../redux/utils/LocalStorage";
import { fetchProfileDetails } from "../../redux/actions/ProfileActionSuite";
import { logout } from "react-native-app-auth";
import { getUser } from "../../redux/utils/LocalStorage";
import { saveUserInfo, logoutApp } from "../../redux/actions/UserAction";
import VersionCheck from "react-native-version-check";
import Config from "react-native-config";
import { card } from "../../styles/utilities";
import UserIconWhite from "../../res/svgIcons/UserIconWhite";
import moment from "moment";
import analytics from "@react-native-firebase/analytics";
import RightIcon from "../../../assets/svgs/Chevonright";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import ZendeskChatIcon from "../utility/ZendeskChatIcon";
const config = { issuer: Config.SSO_LOGIN, iosPrefersEphemeralSession: true };

import {
  logoutZendesk,
} from "../utility/RNZendeskChat";
import { clearAuthCookies } from "../utility/NativeCookieManager";

const logoutConfirmationPopup = (dispatch, navigation) => {
  Alert.alert(
    "Confirm Logout",
    "Are you sure you want to logout?",
    [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel",
      },
      {
        text: "OK",
        style: "cancel",
        onPress: () => {
          logoutAction(dispatch, navigation);
        },
        style: "default", // ok button (right)
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
      try {
        analytics().setUserId(null);
        await analytics().setUserProperty("Sparklight_user_id", null);
      } catch (error) {
        console.warn("Error clearing analytics user ID:", error);
      }
      navigation.reset({
        index: 0,
        routes: [{ name: "Splash", params: { isLogout: true } }],
      });
      clearAuthCookies();
      storeUser({});
      storeSsoToken({});
      dispatch(saveUserInfo({}));
      dispatch(logoutApp());
      cleanUserData();
      logoutZendesk();
    });
  });
};

const AccountOverview = () => {
  const navigation = useNavigation();
  const { triggerOnScreenEntry } = useAnnouncement();

  useFocusEffect(
    useCallback(() => {
      triggerOnScreenEntry('AccountStackScreen');
    }, [triggerOnScreenEntry])
  );
  const [fullName, setFullName] = useState("");
  const [initials, setInitials] = useState("");
  const [menues, setMenues] = useState([]);
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profile || {});
  const profileDetails = profile.profileDetails || {};
  useEffect(() => {
    dispatch(fetchProfileDetails());

    getUser().then((res) => {
      if (res.userInfo?.accountNumber.toString().length >= 16) {
        setMenues(menuItems1);
      } else {
        setMenues(menuItems);
      }
    });
  }, []);

  const menuItems = [
    {
      name: "Profile",
      onPress: () => navigation.navigate("ProfileSettings"),
      icon: ProfileSettingsIcon,
      accessibilityLabel: "Navigate to profile",
      includeInMenu: true,
    },
    {
      name: "Password & Security",
      onPress: () => navigation.navigate("PasswordSecurity"),
      icon: PasswordSecurityIcon,
      accessibilityLabel: "Navigate to password and security settings",
      includeInMenu: true,
    },
    {
      name: "Notifications",
      onPress: () => navigation.navigate("Notifications"),
      icon: NotificationsIcon,
      accessibilityLabel: "Navigate to notifications settings",
      includeInMenu: true,
    },
    {
      name: "User Management",
      onPress: () => navigation.navigate("UserManagement"),
      icon: UserManagementIcon,
      accessibilityLabel: "Navigate to user management settings",
      includeInMenu: true,
    },
    {
      name: "App Feedback",
      onPress: () => navigation.navigate("Feedback"),
      icon: Feedbackicon,
      accessibilityLabel: "Navigate to user management settings",
      includeInMenu: true,
    },
  ];

  const menuItems1 = [
    {
      name: "Profile",
      onPress: () => navigation.navigate("ProfileSettings"),
      icon: ProfileSettingsIcon,
      accessibilityLabel: "Navigate to profile",
      includeInMenu: true,
    },

    {
      name: "Password & Security",
      onPress: () => navigation.navigate("PasswordSecurity"),
      icon: PasswordSecurityIcon,
      accessibilityLabel: "Navigate to password and security settings",
      includeInMenu: true,
    },
    {
      name: "Notifications",
      onPress: () => navigation.navigate("Notifications"),
      icon: NotificationsIcon,
      accessibilityLabel: "Navigate to notifications settings",
      includeInMenu: true,
    },

    {
      name: "App Feedback",
      onPress: () => navigation.navigate("Feedback"),
      icon: Feedbackicon,
      accessibilityLabel: "Navigate to user management settings",
      includeInMenu: true,
    },
  ];

  useFocusEffect(
    useCallback(() => {
      const formatName = (name = "") =>
        name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

      setFullName(
        `${formatName(profileDetails?.firstName)} ${formatName(
          profileDetails?.lastName
        )}`.trim()
      );
    }, [profileDetails])
  );

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
        colors={["rgba(53, 48, 145, 1)", "rgba(141, 59, 144, 1)"]}
        useAngle={true}
        angle={90}
      />
      <View style={{ position: "absolute", top: 60, right: 10, zIndex: 1 }}>
      <ZendeskChatIcon />
      </View>
      <View style={[styles.frameParent]}>
        <View style={styles.rightActionableParent}>
          <View style={styles.rightActionable}>
            <UserIconWhite width={28} height={26} />
          </View>
          {/* Full name for profile */}
          <Text style={styles.melissaSmith} accessible={true} accessibilityLabel={`Profile for ${fullName}`} accessibilityRole="Header" accessibilityLevel={1} accessibilityHint="Header" >{fullName}</Text>
        </View>
        <ScrollView style={{ flex: 1 }}>
          <View style={{ marginBottom: "30%" }}>
            <View style={styles.frameGroup}>
              <View style={card.elevated}>
                {/* Mapping through menu items */}
                {menues.map(
                  (item, index) =>
                    item.includeInMenu && (
                      <React.Fragment key={item.name}>
                        <Touchable
                          minSize={0}
                          style={[
                            styles.rightActionableGroup,
                            styles.tabsFlexBox,
                          ]}
                          onPress={item.onPress}
                          accessibilityLabel={item.name}
                          accessibilityHint={`Navigates to ${item.name}`}
                          accessibilityRole="button"
                        >
                          {/* Menu item icon */}
                          {typeof item.icon === "function" ? (
                            <View style={{ alignSelf: "center" }}>
                              <item.icon width={24} height={24} />
                            </View>
                          ) : (
                            <View
                              accessible={true}
                              accessibilityLabel={`${item.name} icon`}
                              style={styles.rightIconLayout}
                            >
                              <item.icon />
                            </View>
                          )}
                          {/* Menu item text */}
                          <Text
                            style={[
                              styles.profileSettings,
                              styles.makePaymentTypo,
                            ]}
                          >
                            {" " + item.name}
                          </Text>
                          {/* Chevron/Arrow icon */}
                          <View
                            style={[{ marginLeft: 10 }, styles.rightIconLayout]}
                          >
                            <RightIcon />
                          </View>
                        </Touchable>
                        {/* Divider, if not the last item */}
                        {item.includeInMenu && index < menuItems.length - 1 && (
                          <View style={styles.frameChild} />
                        )}
                      </React.Fragment>
                    )
                )}
              </View>
              <View style={styles.buttonContainer}>
                <Touchable
                  minSize={0}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="Logout"
                  style={[styles.button, styles.buttonsLayout]}
                  onPress={() => {
                    logoutConfirmationPopup(dispatch, navigation);
                  }}
                >
                  <Text style={[styles.accept]}>Logout</Text>
                </Touchable>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  ...styles.buttonsSpaceBlock,
                  ...styles.buttons,
                  ...styles.buttonsSpaceBlock,
                }}
              >
                <Touchable
                  accessible={true}
                  accessibilityRole="link"
                  hitSlop={A11Y.hitSlop}
                  style={styles.footerLink}
                  onPress={() =>
                    navigation.navigate("ArticleWindowUtility", {
                      url: "https://www.sparklight.com/legal/mobile-app-privacy-policy",
                      name: "Privacy Policy",
                    })
                  }
                >
                  <Text
                    accessibilityLabel="Privacy Policy"
                    style={styles.linkStyle}
                  >
                    Privacy Policy
                  </Text>
                </Touchable>

                <Text style={styles.linkStyle} accessible={false} importantForAccessibility="no"> | </Text>

                <Touchable
                  accessible={true}
                  accessibilityRole="link"
                  hitSlop={A11Y.hitSlop}
                  style={styles.footerLink}
                  onPress={() =>
                    navigation.navigate("ArticleWindowUtility", {
                      url: "https://www.sparklight.com/legal/mobile-app-terms-and-conditions?isMobile=true",
                      name: "Terms & Conditions",
                    })
                  }
                >
                  <Text
                    accessibilityLabel="Terms & Conditions"
                    style={styles.linkStyle}
                  >
                    Terms & Conditions
                  </Text>
                </Touchable>
              </View>
            </View>
            <Touchable
              onPress={() =>
                navigation.navigate("ArticleWindowUtility", {
                  url: "https://support.sparklight.com/hc/en-us/articles/30080605597079-MySparklight-App-Release-Notes?isMobile=true",
                  name: "App Release Notes",
                })
              }
              accessibilityLabel={"Version " + VersionCheck.getCurrentVersion()+" Opens release notes"}
              accessibilityRole="link"
              hitSlop={A11Y.hitSlop}
              style={styles.footerLink}
            >
              <Text
                style={{
                  color: Color.colorMidnightblue,
                  alignSelf: "center",
                  textDecorationLine: "underline",
                }}
              >
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
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 150,
  },
  buttonsSpaceBlock: {
    paddingVertical: Padding.p_base,
    alignItems: "center",
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
    alignSelf: "center",
    fontWeight: "600",
    textDecorationLine: "underline", // added underscore for linkStyle
  },
  footerLink: {
    paddingHorizontal: Padding.p_5xs,
  },
  makePaymentTypo: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.openSansRegular,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    paddingTop: Padding.p_5xl,
  },

  rightIconLayout: {
    height: 24,
    width: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 5,
  },
  title: {
    marginLeft: -35,
    fontSize: FontSize.size_lg,
  },
  button: {
    backgroundColor: Color.colorMidnightblue,
    width: "100%",
  },
  buttonsLayout: {
    paddingVertical: Padding.p_base,
    paddingHorizontal: 0,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Border.br_11xs,
    minHeight: 50,
  },
  rightActionable: {
    borderColor: Color.colorWhitesmoke_200,
    borderWidth: 4,
    width: 72,
    height: 72,
    backgroundColor: Color.colorMidnightblue,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
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
    overflow: "hidden",
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
    width: "100%",
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
    alignSelf: "stretch",
  },
  copyright: {
    marginTop: wp("25%"),
    fontFamily: FontFamily.openSansRegular,
    fontSize: 14,
    textAlign: "center",
    fontWeight: "400",
    color: Color.colorMidnightblue,
    alignSelf: "center",
    paddingHorizontal: wp("3%"),
  },
  account: {
    flex: 1,
    backgroundColor: Color.colorWhitesmoke_200,
    width: "100%",
  },
});

export default AccountOverview;
