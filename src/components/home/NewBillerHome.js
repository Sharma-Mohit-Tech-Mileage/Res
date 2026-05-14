import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Platform,
} from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import LinearGradient from "react-native-linear-gradient";
import moment from "moment";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector, useDispatch } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { useAnnouncement } from '../../hooks/useAnnouncement';
import colors from "../../res/Colors";
import { Color, Padding } from "../../../GlobalStyles";
import { fetchACPUserAccountDetails } from "../../redux/actions/ProfileActionSuite";
import { checkForMinorUpdate, getPrimaryEmail } from "../utility/constant";
import { AlertUtils } from "../utility/AlertUtils";
import Config from "react-native-config";
import WelcomeCard from "../ACPDashboard/WelcomeCard";
import PromoBanner from "../ACPDashboard/PromoBanner";
import FeatureCard from "../ACPDashboard/FeatureCard";
import InfoBanner from "../ACPDashboard/InfoBanner";
import { GetApiRequest, PostApiReqZendeskToken } from "../../network/RestApiClient";
import { getEndpoint,ENDPOINTS } from "../../network/apis/endpoints/Endpoints";
import { getUser } from "../../redux/utils/LocalStorage";
import { useMaintenance } from "../maintenance/MaintenanceContext";
import { useOutageStatus } from "../services/hooks/useOutageStatus";
import MaintenanceBanner from "../maintenance/MaintenanceBanner";
import DisconnectedBanner from "../ACPDashboard/DisconnectedBanner";
import { isAccountDisconnected } from "../utility/disconnectHelpers";
import { storePushNotificationStatus } from "../../redux/utils/LocalStorage";
import MobilePilotLandingPage from "../../components/ACPDashboard/MobilePilotLandingPage";
import {
  getFcmToken,
  requestUserPermission,
} from "../../firebase/FirebaseUtils";
import Logo from "../../res/images/SpalshLogo";
import VersionCheck from "react-native-version-check";
import DeviceInfo from "react-native-device-info";
import ZendeskChatIcon from "../utility/ZendeskChatIcon";

import {
  loginWithJWT,
  setConversationalFields,
} from "../utility/RNZendeskChat";




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
  const { showBanner, bannerConfig, dismissBanner } = useMaintenance();
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

  const showDisconnectedBanner = userInfo
    ? isAccountDisconnected(
        userInfo.acctStatus,
        userInfo.daysSinceDisconnectDate
      )
    : false;

  

  // Sync outage banner with Redux outage state from servicesSaga.
  useEffect(() => {
    if (outageData?.hasOutage) {
      setIsOutageAlert(true);
      setEstimatedRestoreTime(outageData.estimatedRestoreTime || "");
    } else {
      setIsOutageAlert(false);
    }
    // hardcoded test override
    if (userInfo?.accountNumber === "8160110010005227") {
      setIsOutageAlert(true);
      setEstimatedRestoreTime(moment().add(2, 'hours').format("LT"));
    }
  }, [outageData, userInfo?.accountNumber]);

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
// hardcode for testing update app feature
          if(userInfo?.accountNumber=="8160110010005227"){
        setUpdateStatus({
          isMinorUpdateAvailable: true,
          
        });
      }
          dispatch(fetchACPUserAccountDetails());
          getStatus();
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
      DeviceInfo.getUserAgent().then((userAgent) => {
        // UA samples: iOS Safari Mobile / tvOS n/a / Android Chrome WebView / Windows ?
        loginWithToken(userAgent);
      });
    }
  }, [accountDetails]);

  const enableNotifications = async () => {
    const enabledPermission = await requestUserPermission();
    if (enabledPermission) {
      const token = await getFcmToken();
      const data = {
        accountNumber: userInfo?.accountNumber,
        deviceToken: token,
        deviceTokenTimestamp: moment().format(),
        optOut: true,
        outageOptOut: true,
        billingOptOutStatus: true,
        userName: userInfo.userName,
        isAndroid: Platform.OS == "android",
      };
      const localData = {
        status: "accepted",
        date: new Date(),
        permanentSkip: false,
      };
      storePushNotificationStatus(localData);
    } else {
      const token = await getFcmToken();
      const dataWithoutPermission = {
        accountNumber: userInfo.accountNumber,
        deviceToken: token,
        deviceTokenTimestamp: moment().format(),
        optOut: true,
        outageOptOut: true,
        billingOptOutStatus: true,
        userName: userInfo.userName,
        isAndroid: Platform.OS == "android",
      };
      const localData = {
        status: "skip",
        date: new Date(),
        permanentSkip: true,
      };
      storePushNotificationStatus(localData);
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

  const loginWithToken = async (userAgent, firstName, lastName) => {
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
            locationHrefId: Config.URL,
            ipAddress: IPAddress || "",
            accountNumber: user?.userInfo.accountNumber,
            email: defaultPaymentDetails.email || "",
            firstName: firstName || "",
            lastName: lastName || "",
            name: '',
            phone: "",
            accountNumber: user?.userInfo.accountNumber,
            userName: user?.userInfo.userName,
            customerType: user?.userInfo.customerType,
            authLevel: user?.userInfo.authLevel,
            mobileApp: "mobileApp",
            jwtId: jwtToken,
          };
        
          loginWithJWT(jwtToken)
            .then(() => {
              // Now set conversational fields
              setConversationalFields(fields);
            })
            .catch((error) => {
              setConversationalFields(fields);
              console.warn("Error logging in to Zendesk Chat:", error);
            });
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

  const renderOutageAlert = () =>
    AlertUtils.createOutageAlert(estimatedRestoreTime, () =>
      setIsOutageAlert(false)
    );

  const renderAppUpdateAlert = () =>
    AlertUtils.createAppUpdateAlert(() =>
      setUpdateStatus({
        isMinorUpdateAvailable: false,
        currentVersion: "",
        latestVersion: "",
      })
    );

  const renderWelcomeCard = () => (
    <View style={[styles.card, styles.shadowProp, styles.welcomeCard,{paddingTop:0}]}>
      <View >
        {showDisconnectedBanner ? (
          <View style={styles.contentWrapper}>
            <DisconnectedBanner navigation={navigation} />
          </View>
        ) : (
          <WelcomeCard />
        )}
         <View style={styles.contentWrapper}>
        <PromoBanner
          title="Sign up and save with Auto Pay and Paperless Billing"
          showBonus={true}
        />
        <FeatureCard
          title="Auto Pay"
          isLoading={loadingAutoPay}
          features={["Convenient", "Timely Payments", "Peace of Mind"]}
          buttonText={isAutoPayStatus ? "Active" : "Activate Auto Pay"}
          buttonVariant={isAutoPayStatus ? "success" : "primary"}
          isActive={isAutoPayStatus}
          onButtonPress={() => {
            navigation.navigate("AutoPayPCIConnector", {
              url: `${Config.URL}/billing`,
              name: isAutoPayStatus ? "Manage Auto Pay" : "Setup Auto Pay",
              useNewPayment: true,
              status: isAutoPayStatus,
              paymentDetails: defaultPaymentDetails,
            });
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
      end={{ x: 1, y: 0 }}
      colors={["rgba(53, 48, 145, 1)", "rgba(141, 59, 144, 1)"]}
      style={styles.container}
    >
      <View style={{ position: "absolute", top: 60, right: 10, zIndex: 1 }}>
      <ZendeskChatIcon />
      </View>
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
              {updateStatus.isMinorUpdateAvailable && renderAppUpdateAlert()}
              {isOutageAlert && renderOutageAlert()}
              {showBanner && bannerConfig && (
                <MaintenanceBanner
                  title={bannerConfig.title}
                  message={bannerConfig.message}
                  link={bannerConfig.link}
                  linkText={bannerConfig.linkText}
                  showPhoneNumber={bannerConfig.showPhoneNumber}
                  phoneNumber={bannerConfig.phoneNumber}
                  onDismiss={
                    bannerConfig.dismissible ? dismissBanner : undefined
                  }
                  severity={bannerConfig.severity || "info"}
                />
              )}
              {isMobilePilotEnabled ? (
                <View
                  style={[styles.card, styles.shadowProp, styles.welcomeCard]}
                >
                  <View
                    style={[
                      styles.contentWrapper,
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
          </ScrollView>
        </SafeAreaView>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.splash_bg,
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
    backgroundColor: colors.backgound_blue,
    flex: 2,
    alignItems: "center",
    marginTop: 50,
    paddingBottom: 50,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 2,
    paddingTop: 20,
    width: wp("92%"),
  },
  welcomeCard: {
    marginTop: -40,
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
    paddingTop: 8,
  },
});

export default NewBillerHome;
