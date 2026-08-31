import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, ScrollView, Platform, } from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import LinearGradient from "react-native-linear-gradient";
import moment from "moment";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector, useDispatch } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { useAnnouncement } from '../../hooks/useAnnouncement';

import { Color, Padding } from "../../../GlobalStyles";
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
import { loginWithJWT, setConversationalFields, } from "../utility/RNZendeskChat";
import { useFeatureFlag } from "../../contexts/Featureflagscontext";
import FeatureFlags from "../../config/Featureflags";
import AppStyles from "../../styles/AppStyles";

import {
  getAnalytics,
  setAnalyticsCollectionEnabled,
} from '@react-native-firebase/analytics';

const analytics = getAnalytics();

setAnalyticsCollectionEnabled(analytics, true)
  .then(() => {
    console.log('Analytics collection enabled');
  })
  .catch(error => {
    console.error('Failed to enable Analytics:', error);
  });

const NewBillerHome = ({ navigation }) => {
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
          console.warn("error", error);
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
          console.warn("Error refreshing data on focus", error);
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
          console.error("Error on retrying getTextNotificationsData", error);
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
      console.warn("Error fetching IP address:", error);
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
        console.warn("error in fetching JWT reponse for zendesk", error);
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
        <Logo width={120} height={33.32} />
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
    <View style={[styles.card, styles.shadowProp]}>
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
        </View>
      </View>
    </View>
  );

  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 1.3, y: 0 }}
      colors={["rgba(141, 59, 144, 1))", "rgba(53, 48, 145, 1)"]}
      style={styles.container}
    >
      {showChatIcon && (
        <View style={{ position: "absolute", top: 60, right: 10, zIndex: 1 }}>
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
          <ScrollView style={styles.scrollContainer}>
            <View
              style={styles.mainContentContainer}
              importantForAccessibility={
                isWalkthroughActive ? "no-hide-descendants" : "auto"
              }
              accessibilityElementsHidden={isWalkthroughActive}
            >
              <View style={styles.overlayStack}>
                {hasAnyAlert && <View style={{ height: alertsHeight }} />}
                {isMobilePilotEnabled ? (
                  <View style={[AppStyles.card,{ margin:16 , overflow: "hidden", flexDirection:'column',flex:1, alignItems:'center', justifyContent:'center'}]}>
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
          </ScrollView>
        </SafeAreaView>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.sparklightPrimaryPurple,
    marginBottom: 30,
  },
  headerContainer: {
    height: Platform.OS === "ios" ? 60 : 50,
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginTop: Platform.OS === "ios" ? 0 : 20,
  },
  scrollContainer: {
    height: "100%",
    paddingBottom: 100,
  },
  mainContentContainer: {
    backgroundColor: Color.Gray300,
    flex: 2,
    alignItems: "center",
    marginTop: 50,
    paddingBottom: 50,
  },
  overlayStack: {
    width: "100%",
    alignItems: "center",
    marginTop: -40,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 2,
    width: wp("92%"),
  },
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  contentWrapper: {
    flex: 1,
    backgroundColor: Color.sparklightWhite,
    paddingHorizontal: Padding.p_5xl,
  },
  featuresWrapper: {
    paddingTop: 8,
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
  },
  alertWrapper: {
    width: wp("92%"),
  },
});

export default NewBillerHome;
