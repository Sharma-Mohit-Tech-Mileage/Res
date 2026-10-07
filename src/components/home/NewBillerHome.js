import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, Platform } from "react-native";
import { LAYOUT } from "../../utils/responsive";
import LinearGradient from "react-native-linear-gradient";
import moment from "moment";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector, useDispatch } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { useAnnouncement } from '../../hooks/useAnnouncement';

import { Color, Padding } from "../../styles/GlobalStyles";
import { fetchACPUserAccountDetails, updatePushNotificationsv2 } from "../../redux/actions/ProfileActionSuite";
import { checkForMinorUpdate, getPrimaryEmail } from "../utility/constant";
import Config from "react-native-config";
import WelcomeCard from "../ACPDashboard/WelcomeCard";
import PromoBanner from "../ACPDashboard/PromoBanner";
import FeatureCard from "../ACPDashboard/FeatureCard";
import NotificationAlert from "../common/customui/NotificationAlert";
import { GetApiRequest, PostApiReqZendeskToken } from "../../network/RestApiClient";
import { getEndpoint, ENDPOINTS } from "../../network/apis/endpoints/Endpoints";
import { getUser , storeZendeskData} from "../../redux/utils/LocalStorage";
import { useMaintenance } from "../maintenance/MaintenanceContext";
import { useOutageStatus } from "../services/hooks/useOutageStatus";
import DisconnectedBanner from "../ACPDashboard/DisconnectedBanner";
import { isAccountDisconnected } from "../utility/disconnectHelpers";
import { storePushNotificationStatus, getPushNotificationStatus } from "../../redux/utils/LocalStorage";
import MobilePilotLandingPage from "../../components/ACPDashboard/MobilePilotLandingPage";
import { getFcmToken, requestUserPermission, } from "../../firebase/FirebaseUtils";
import Logo from "../../res/images/SpalshLogo";
import VersionCheck from "react-native-version-check";
import DeviceInfo from "react-native-device-info";
import ZendeskChatIcon from "../utility/ZendeskChatIcon";
import { setConversationalFields } from "../utility/RNZendeskChat";
import { useFeatureFlag } from "../../contexts/Featureflagscontext";
import FeatureFlags from "../../config/Featureflags";
import AppStyles from "../../styles/AppStyles";
import { A11Y } from "../../styles/theme";
import { ScreenScroll } from "../common/customui/Screen";
import ResponsiveRow from "../common/customui/ResponsiveRow";
import { HEADER_GRADIENT } from "../common/ProfileSettingsHeader";

import {
  getAnalytics,
  setAnalyticsCollectionEnabled,
} from '@react-native-firebase/analytics';
import { logWarn, logError } from "../../utils/logger";

const analytics = getAnalytics();

setAnalyticsCollectionEnabled(analytics, true)
  .catch(error => {
    logError('Failed to enable Analytics:', error);
  });

const NewBillerHome = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { triggerOnScreenEntry } = useAnnouncement();
  const { outageData, checkStatus: checkOutageStatus } = useOutageStatus('dashboard');

  useFocusEffect(
    useCallback(() => {
      triggerOnScreenEntry('HomeStackScreen');
    }, [triggerOnScreenEntry])
  );

  const [isOutageAlert, setIsOutageAlert] = useState(false);
  const [estimatedRestoreTime, setEstimatedRestoreTime] = useState("");
  const [isNotificationEnable, setIsNotificationEnable] = useState(false);
  const [isAutoPayStatus, setIsAutoPayStatus] = useState(undefined);
  const [loadingAutoPay, setloadingAutoPay] = useState(true);
  const [alertsHeight, setAlertsHeight] = useState(0);
  const { showBanner, bannerConfig, dismissBanner } = useMaintenance();
  const [phoneNumber, setPhoneNumber] = useState(undefined);
  const [defaultPaymentDetails, setDefaultPaymentDetails] = useState({
    dueDate: null,
    billAmount: 0,
    pastPaymentDue: 0,
    email: null,
  });
  const [updateStatus, setUpdateStatus] = useState({
    isMinorUpdateAvailable: false,
    currentVersion: "",
    latestVersion: "",
  });
  const accountDetails = useSelector((state) => state.profile?.accountDetails);
  const home = useSelector((state) => state.home);
  const isWalkthroughActive =
    home.walkThroughStep !== null && home.walkThroughStep !== undefined;
  const dispatch = useDispatch();
  const paperlessStatusAcp = useSelector(
    (state) => state.profile?.paperlessStatusAcp
  );
  const paperlessLoadingFromStore = useSelector(
    (state) => state.profile?.isPaperLessStatusLoading
  );
  const paperlessLoading = paperlessLoadingFromStore || paperlessStatusAcp === undefined;
  const userInfo = useSelector((state) => state.user?.userData?.userInfo);
  const isMobilePilotEnabled = useSelector(
    (state) => state.user.userData?.userInfo?.pending_activation === true
  );
  const showChatIcon = useFeatureFlag(FeatureFlags.DASHBOARD_CHAT_ICON, true);

  const showDisconnectedBanner = userInfo
    ? isAccountDisconnected(
      userInfo.acctStatus,
      userInfo.daysSinceDisconnectDate
    )
    : false;

    const isForceBannerAccount =
    userInfo?.accountNumber === "8160116990081294" ||
    accountDetails?.accountNumber === "8160116990081294";

  const forcedMaintenanceBannerConfig = {
    title: "Service Error",
    message:
      "We are currently experiencing a service error. Our team is working to restore full functionality as soon as possible.",
    severity: "critical",
    dismissible: true,
  };

  useEffect(() => {
    if (outageData?.hasOutage || isForceBannerAccount) {
      setIsOutageAlert(true);
      setEstimatedRestoreTime(
        isForceBannerAccount ? "" : outageData.estimatedRestoreTime || ""
      );
    } else {
      setIsOutageAlert(false);
    }
  }, [outageData, userInfo?.accountNumber, isForceBannerAccount]);

  const getStatus = () => {
    setloadingAutoPay(true);
    getUser().then((res) => {
      const accountNumber = res.userInfo.accountNumber;
      const endpoint = getEndpoint(ENDPOINTS.ACCOUNTS_EASYPAY, { accountNumber });
      GetApiRequest(
        endpoint,
        (res) => {
          setIsAutoPayStatus(res?.isEasyPay);
          setloadingAutoPay(false);
        },
        (error) => {
          logWarn("error", error);
          setloadingAutoPay(false);
        }
      );
    });
  };

  useFocusEffect(
    useCallback(() => {
      const refreshData = async () => {
        try {
          checkOutageStatus();
          const status = await checkForMinorUpdate();
          setUpdateStatus(status);
          dispatch(fetchACPUserAccountDetails());
          getStatus();
          getTextNotificationsData();
          setIsNotificationEnable(true);
        } catch (error) {
          logWarn("Error refreshing data on focus", error);
        }
      };

      refreshData();

      return () => {
        setIsAutoPayStatus(undefined);
        setloadingAutoPay(true);
      };
    }, [dispatch])
  );

  useEffect(() => {
    if (isNotificationEnable) {
      enableNotifications();
    }
  }, [isNotificationEnable]);

  useEffect(() => {
    if (accountDetails) {
      setDefaultPaymentDetails({
        dueDate: accountDetails.payment_due_date,
        billAmount: accountDetails.payment_due_amount,
        pastPaymentDue: accountDetails.past_due_amount,
        email: getPrimaryEmail(accountDetails),
      });

      // Wait until phone resolution completes so Zendesk receives phone reliably.
      if (phoneNumber === undefined) {
        return;
      }

      const firstName = accountDetails.first_name || "";
      const lastName = accountDetails.last_name || "";
      DeviceInfo.getUserAgent().then((userAgent) => {
        loginWithToken(userAgent, firstName, lastName, phoneNumber || "");
      });
    }
  }, [accountDetails, phoneNumber]);

  const getTextNotificationsData = () => {

    getUser().then((res1) => {
      const endpointUrl = getEndpoint(ENDPOINTS.SMS_NOTIFICATION_PREFS, {
        accountNumber: res1.userInfo?.accountNumber,
      });

      GetApiRequest(
        endpointUrl,
        (res) => {
          if (res) {
            let phoneNum = res[0]?.phoneNum || "";
            setPhoneNumber(phoneNum);
          } else {
            setPhoneNumber("");
          }

        },
        (error) => {
          setPhoneNumber("");
          logError("Error on retrying getTextNotificationsData", error);
        },
      );
    });
  };


  const enableNotifications = async () => {
    if (!userInfo?.userName) return;
    // ask only when no decision was recorded yet (entry wizard or a prior visit owns it otherwise)
    const stored = await getPushNotificationStatus();
    if (stored) return;

    const enabledPermission = await requestUserPermission();
    const token = await getFcmToken();
    // literal flags: true = opting out (permission denied)
    const data = {
      accountNumber: userInfo?.accountNumber,
      deviceToken: token,
      deviceTokenTimestamp: moment().format(),
      optOut: !enabledPermission,
      outageOptOut: !enabledPermission,
      billingOptOutStatus: !enabledPermission,
      userName: userInfo.userName,
      isAndroid: Platform.OS == "android",
    };
    const localData = {
      status: enabledPermission ? "accepted" : "skip",
      date: new Date(),
      permanentSkip: !enabledPermission,
    };
    storePushNotificationStatus(localData);
    if (token) {
      await dispatch(updatePushNotificationsv2(data, null));
    }
  };

  // get IP address

  const getIPAddress = async () => {
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      if (!response.ok) {
        throw new Error("Failed to fetch IP address");
      }

      const data = await response.json();
      return data.ip; // The IP address
    } catch (error) {
      logWarn("Error fetching IP address:", error);
      return null;
    }
  };

  // zendesk chat login

  const loginWithToken = async (userAgent, firstName, lastName, zendeskPhone) => {
    const user = await getUser();
    let requestData = {
      accountNumber: user?.userInfo.accountNumber,
      userName: user?.userInfo.userName,
    };

    const IPAddress = await getIPAddress();

    PostApiReqZendeskToken(
      getEndpoint(ENDPOINTS.ZENDESK_TOKEN),
      requestData,
      (response) => {
        if (response) {
          let jwtToken = response.jwt;

          const fields = {
            isUAT: Config.ENV !== 'production',
            userAgent: userAgent,
            appVersion: VersionCheck.getCurrentVersion(),
            timezoneOffsetId: new Date().getTimezoneOffset().toString(),
            platform: Platform.OS,
            locationHrefId: "",
            ipAddress: IPAddress || "",
            accountNumber: user?.userInfo.accountNumber,
            email: defaultPaymentDetails.email || "",
            firstName: firstName || "",
            lastName: lastName || "",
            name: `${firstName || ""} ${lastName || ""}`.trim(),
            phone: zendeskPhone || "",
            accountNumber: user?.userInfo.accountNumber,
            userName: user?.userInfo.userName,
            customerType: user?.userInfo.customerType,
            authLevel: user?.userInfo.authLevel,
            mobileApp: "mobileApp",
            jwtId: jwtToken,
            source: "Mobile App",
            Initiation_Page: "Home Screen",
          };
          setConversationalFields(fields);
          storeZendeskData(fields);
        }
      },
      (error) => {
        logWarn("error in fetching JWT reponse for zendesk", error);
      }
    );
  };

  const renderHeader = () => (
    <View
      accessibilityElementsHidden={isWalkthroughActive}
      importantForAccessibility={
        isWalkthroughActive ? "no-hide-descendants" : "no"
      }
      accessibilityLabel="SparkLight"
      style={styles.headerContainer}
    >
      <View
        accessible={true}
        accessibilityRole="text"
        accessibilityLabel="SparkLight Logo"
      >
        <Logo width={120} height={LOGO_HEIGHT} />
      </View>


    </View>
  );

  const renderOutageAlert = () => {
    const baseMessage = "Our systems show that you may be experiencing an outage related to your internet service. We are working to restore service as soon as possible.";
    const restoreLine = estimatedRestoreTime
      ? `Estimated Time to Restore: ${estimatedRestoreTime}.`
      : null;
    return (
      <View style={styles.alertWrapper}>
        <NotificationAlert
          type="warning"
          title="Outage Notification"
          message={restoreLine ? `${baseMessage}\n${restoreLine}` : baseMessage}
          splitKey={restoreLine ? [{ text: restoreLine, bold: true }] : ""}
          showCloseIcon={true}
          onClose={() => setIsOutageAlert(false)}
        />
      </View>
    );
  };

  const renderAppUpdateAlert = () => {
    const storeUrl = Platform.OS === "android"
      ? "https://play.google.com/store/apps/details?id=com.sparklight"
      : "https://apps.apple.com/us/app/mysparklight/6469003880";
    return (
      <View style={styles.alertWrapper}>
        <NotificationAlert
          type="info"
          title="What's New"
          message={"Enhance your app experience with the latest version for improved performance and reliability.\nUpdate Now"}
          splitKey={[{ text: "Update Now", action: "url", value: storeUrl }]}
          showCloseIcon={true}
          onClose={() =>
            setUpdateStatus({
              isMinorUpdateAvailable: false,
              currentVersion: "",
              latestVersion: "",
            })
          }
        />
      </View>
    );
  };

  const renderMaintenanceAlert = () => {
    const effectiveBannerConfig =
      isForceBannerAccount ? forcedMaintenanceBannerConfig : bannerConfig;

    if (!effectiveBannerConfig) return null;
    const severityToType = { critical: "error", warning: "warning", info: "info" };
    const splitKeys = [];
    let messageText = effectiveBannerConfig.message || "";
    if (effectiveBannerConfig.link && effectiveBannerConfig.linkText) {
      messageText = `${messageText}\n${effectiveBannerConfig.linkText}`;
      splitKeys.push({ text: effectiveBannerConfig.linkText, action: "url", value: effectiveBannerConfig.link });
    }
    if (effectiveBannerConfig.showPhoneNumber && effectiveBannerConfig.phoneNumber) {
      messageText = `${messageText}\nCall ${effectiveBannerConfig.phoneNumber}`;
      splitKeys.push({ text: effectiveBannerConfig.phoneNumber, action: "call", value: effectiveBannerConfig.phoneNumber });
    }
    return (
      <View style={styles.alertWrapper}>
        <NotificationAlert
          type={severityToType[effectiveBannerConfig.severity] || "info"}
          title={effectiveBannerConfig.title}
          message={messageText}
          splitKey={splitKeys.length > 0 ? splitKeys : ""}
          showCloseIcon={!!effectiveBannerConfig.dismissible}
          onClose={effectiveBannerConfig.dismissible ? dismissBanner : undefined}
        />
      </View>
    );
  };

  const showWhatsNewAlert = updateStatus.isMinorUpdateAvailable || isForceBannerAccount;
  const showServiceErrorAlert = (isForceBannerAccount || (!!bannerConfig && showBanner)) && !showDisconnectedBanner;
  const hasAnyAlert = showWhatsNewAlert || isOutageAlert || showServiceErrorAlert;

  const renderWelcomeCard = () => (
    <View style={[AppStyles.card, styles.card]}>
      <View>
        {showDisconnectedBanner ? (
          <View style={styles.contentWrapper}>
            <DisconnectedBanner navigation={navigation} />
          </View>
        ) : (
          <WelcomeCard />
        )}
        <View style={[styles.contentWrapper, styles.featuresWrapper]}>
          <PromoBanner
            title="Sign up and save with Auto Pay and Paperless Billing"
            showBonus={true}
          />
          <ResponsiveRow>
            <FeatureCard
              title="Auto Pay"
              isLoading={loadingAutoPay}
              features={["Convenient", "Timely Payments", "Peace of Mind"]}
              buttonText={isAutoPayStatus ? "Active" : "Set Up Auto Pay"}
              buttonVariant={isAutoPayStatus ? "success" : "primary"}
              isActive={isAutoPayStatus}
              onButtonPress={() => {
                navigation.navigate("BillingTab", { screen: "AutoPay" });
              }}
            />
            <FeatureCard
              isLoading={paperlessLoading}
              title="Paperless Billing"
              features={["Keeps you Organized", "Cost Effective", "Eco-Friendly"]}
              buttonText={paperlessStatusAcp ? "Active" : "Go Paperless Today"}
              buttonVariant={paperlessStatusAcp ? "success" : "primary"}
              isActive={paperlessStatusAcp}
              onButtonPress={() =>
                navigation.navigate("account", { screen: "Notifications" })
              }
            />
          </ResponsiveRow>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Gradient is a band behind the header, not the page background, so capped tablet content sits on gray like phones. */}
      <LinearGradient
        {...HEADER_GRADIENT}
        style={[styles.gradientBand, { height: insets.top + HEADER_BAND_HEIGHT }]}
      />
      {showChatIcon && (
        <View style={[styles.chatIcon, { top: insets.top + CHAT_ICON_OFFSET }]}>
          <ZendeskChatIcon screenName={'Home Screen'} />
        </View>
      )}
      <View style={{ flex: 1 }}>
        <SafeAreaView
          style={{ flex: 1 }}
          importantForAccessibility={
            isWalkthroughActive ? "no-hide-descendants" : "auto"
          }
          accessibilityElementsHidden={isWalkthroughActive}
        >
          {renderHeader()}
          <ScreenScroll clearTabBar>
            <View
              style={[styles.mainContentContainer]}
              importantForAccessibility={
                isWalkthroughActive ? "no-hide-descendants" : "auto"
              }
              accessibilityElementsHidden={isWalkthroughActive}
            >
              <View style={styles.overlayStack}>
                {hasAnyAlert && <View style={{ height: alertsHeight }} />}
                {isMobilePilotEnabled ? (
                  <View style={[AppStyles.card,{ marginVertical: 16, overflow: "hidden", flexDirection:'column',flex:1, alignItems:'center', justifyContent:'center'}]}>
                    <View
                      style={[
                        
                        { paddingHorizontal: Padding.p_base},
                      ]}
                    >
                      <MobilePilotLandingPage />
                    </View>
                  </View>
                ) : (
                  renderWelcomeCard()
                )}
              </View>
            </View>
            {hasAnyAlert && (
              <View
                style={styles.alertsAbsolute}
                onLayout={(e) => setAlertsHeight(e.nativeEvent.layout.height)}
              >
                <View style={styles.alertsGroup}>
                  {(updateStatus.isMinorUpdateAvailable || isForceBannerAccount) && renderAppUpdateAlert()}
                  {isOutageAlert && renderOutageAlert()}
                  {(showBanner && bannerConfig) || isForceBannerAccount ? renderMaintenanceAlert() : null}
                </View>
              </View>
            )}
          </ScreenScroll>
        </SafeAreaView>
      </View>
    </View>
  );
};

// Header row (incl. Android top margin) plus the 50dp gradient strip the card overlaps; the gray content scrolls up over it.
const HEADER_BAND_HEIGHT = (Platform.OS === "ios" ? 60 : 70) + 50;
const LOGO_HEIGHT = 33.32;
// Centres the 48dp chat touch box on the logo's midline below the safe-area inset (was a fixed top: 60).
const CHAT_ICON_OFFSET = (Platform.OS === "ios" ? 0 : 20) + (LOGO_HEIGHT - A11Y.minTouch) / 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.Gray300,
  },
  chatIcon: {
    position: "absolute",
    // Same right edge as the chat icon in ProfileSettingsHeader.
    right: 8,
    zIndex: 1,
  },
  gradientBand: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
  },
  headerContainer: {
    height: Platform.OS === "ios" ? 60 : 50,
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginTop: Platform.OS === "ios" ? 0 : 20,
  },
  mainContentContainer: {
    backgroundColor: Color.Gray300,
    flex: 2,
    alignItems: "center",
    marginTop: 50,
  },
  overlayStack: {
    width: "100%",
    alignItems: "center",
    marginTop: -40,
    paddingHorizontal: LAYOUT.cardInset,
  },
  card: {
    // Width comes from the frame inset on overlayStack; look comes from AppStyles.card.
    alignSelf: "stretch",
  },
  contentWrapper: {
    flex: 1,
    backgroundColor: Color.sparklightWhite,
    paddingHorizontal: Padding.p_5xl,
  },
  featuresWrapper: {
    paddingTop: 8,
    // Space below the last feature card (cards no longer carry their own margin).
    paddingBottom: 16,
  },
  alertsGroup: {
    width: "100%",
    alignItems: "center",
  },
  alertsAbsolute: {
    position: "absolute",
    top: 10,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: LAYOUT.cardInset,
  },
  alertWrapper: {
    alignSelf: "stretch",
  },
});

export default NewBillerHome;
