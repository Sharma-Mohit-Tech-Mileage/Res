import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import LinearGradient from "react-native-linear-gradient";
import moment from "moment";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector, useDispatch } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import colors from "../../res/Colors";
import { Color, Padding } from "../../../GlobalStyles";
import { fetchACPUserAccountDetails } from "../../redux/actions/ProfileActionSuite";
import { checkForMinorUpdate, getPrimaryEmail } from "../utility/constant";
import { AlertUtils } from "../utility/AlertUtils";
import { Env } from "../../network/apis/account/Constants";
import WelcomeCard from "../ACPDashboard/WelcomeCard";
import PromoBanner from "../ACPDashboard/PromoBanner";
import FeatureCard from "../ACPDashboard/FeatureCard";
import InfoBanner from "../ACPDashboard/InfoBanner";
import { GetApiRequest, PostApiRequest } from "../../network/APIClient";
import { getUser } from "../../redux/utils/LocalStorage";
import { useMaintenance } from "../maintenance/MaintenanceContext";
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
import sign from "jwt-encode"; // npm method for signing JWT
import ChatIcon from "../../res/svgIcons/ChatIcon";
import VersionCheck from "react-native-version-check";
import DeviceInfo from "react-native-device-info";

import {
  startChatWithConfig,
  initChat,
  startChat,
  logoutZendesk,
  loginWithJWT,
  setConversationalFields,
} from "../utility/RNZendeskChat";

const NewBillerHome = ({ navigation }) => {
  const [isOutageAlert, setIsOutageAlert] = useState(false);
  const [estimatedRestoreTime, setEstimatedRestoreTime] = useState("");
  const [isNotificationEnable, setIsNotificationEnable] = useState(false);
  const [isAutoPayStatus, setIsAutoPayStatus] = useState(false);
  const [loadingAutoPay, setloadingAutoPay] = useState(false);
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
  const paperlessLoading = useSelector(
    (state) => state.profile?.isPaperLessStatusLoading
  );
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

  /* Function to check outage status */
  const checOutagStatus = () => {
    getUser().then((res) => {
      const request = `api/outage/GetOutages?accountNumber=${res.userInfo.accountNumber}`;
      PostApiRequest(
        request,
        {},
        (response) => {
          console.log("checOutagStatus response", response);
          if (response?.error == false && response?.outageStatus) {
            console.log("its outage");
            setIsOutageAlert(true);
            setEstimatedRestoreTime(moment(response?.restoredBy).format("LT"));
          } else {
            setIsOutageAlert(false);
          }
         // hardcode for testing
          if(res.userInfo.accountNumber=="8160110010005227"){
            setIsOutageAlert(true);
            setEstimatedRestoreTime(moment().add(2, 'hours').format("LT"));
          }

        },
        (errorCode) => {
          console.log("error in checOutagStatus", errorCode);
        }
      );
    });
  };

  const getStatus = () => {
    setloadingAutoPay(true);
    getUser().then((res) => {
      const accountNumber = res.userInfo.accountNumber;
      GetApiRequest(
        `api/Accounts/${accountNumber}/easypay`,
        (res) => {
          setIsAutoPayStatus(res?.isEasyPay);
          setloadingAutoPay(false);
        },
        (error) => {
          console.log("error", error);
          setloadingAutoPay(false);
        }
      );
    });
  };

  useFocusEffect(
    useCallback(() => {
      const refreshData = async () => {
        try {
          checOutagStatus();
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
          //getInAppNotificationsData();
          setIsNotificationEnable(true);
        } catch (error) {
          console.error("Error refreshing data on focus", error);
        }
      };

      
      
     
      refreshData();
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
        // iOS: "Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143"
        // tvOS: not available
        // Android: "Mozilla/5.0 (Linux; Android 12; sdk_gphone64_arm64 Build/SE1A.220630.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/91.0.4472.114 Mobile Safari/537.36"
        // Windows: ?
        //getZendeskChatToken(userAgent);
        loginWithToken(userAgent);
      });
    }
  }, [accountDetails]);

  const getInAppNotificationsData = () => {
    getUser().then((res1) => {
      let requestUrl = `api/mobilenotificationpreferences/${res1.userInfo?.userName}/mobilepreferences/${res1.userInfo?.accountNumber}`;
      GetApiRequest(
        requestUrl,
        (res) => {
          if (res) {
            res[0]?.pushMessageType.forEach((value, index) => {
              if (!value?.optOutFlag) {
                setIsNotificationEnable(true);
              }
            });
          }
        },
        (error) => {
          console.error("Error on retrying getInAppNotificationsData", error);
        }
      );
    });
  };

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
      //await dispatch(updatePushNotificationsv2(data, null));
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
      //await dispatch(updatePushNotificationsv2(dataWithoutPermission, null));
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
      console.error("Error fetching IP address:", error);
      return null;
    }
  };

  // zendesk chat login

  const loginWithToken = async (userAgent, firstName, lastName) => {
    const user = await getUser();
    //   const secret ="0DE686CBBBF20A367D096D466BC5A895D8F62223CCB36C00A198E64F148E0D84"
    //   // const secret =
    //   //   (Platform.OS=='ios')?"JQ8sVOU9Hl3fnUf1gyt9xfRn9XVMZ44ilfSo5e3SnrutkSCXDmMVSdTOCVQMduayJwptKtfPrMNaUDz3LfzLxQ":"Rcmym7uJfKq-hqjXyhlC9y09AyPyw0K6Pt6cvqvBmR335YCChrSBS6rnSdEUT-9-YIIkSYS_AYU36ETkuCxnYA"
    //   //data payload
    //   const data = {
    //     scope: "user",
    //     external_id: user?.userInfo.accountNumber,
    //     //email: defaultPaymentDetails.email || "",
    //     //name: `${firstName} ${lastName}` || "",
    //     //email_verified: true, // optional
    //     // exp: new Date().getTime() + 3600 * 1000,
    //   };
    //   // header ID
    //   const options = {
    //     alg: "HS256",
    //     typ: "JWT",
    //     //kid: (Platform.OS=='ios')? "app_683930d35c8351994c5bff40":"app_683933455c8351994c6542b3",
    //   };
    //   const jwttoken = sign(data, secret, options);
    //   console.log("request data for jwt", data);
    //   console.log("request options for jwt", options);
    //   console.log("Loggin jwt", jwttoken);
    //  // loginWithJWT(jwttoken);
    //   //loginWithJWT("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZSI6InVzZXIiLCJleHRlcm5hbF9pZCI6IjEyODM4NzI2MyJ9.5d8kzoZS4Jp_9KDdvAPmqj_mETDFfI7C2C3VU3ZrDRA")

    let requestData = {
      accountNumber: user?.userInfo.accountNumber,
      userName: user?.userInfo.userName,
    };

    PostApiRequest(
      `api/Zendesk/TokenAuth`,
      requestData,
      (response) => {
        console.log("JWT reponse for zendesk login", response);
        if (response) {
          let jwtToken = response.jwt;

          const fields = {
            userAgent: userAgent,
            appVersion: VersionCheck.getCurrentVersion(),
            timezoneOffsetId: new Date().getTimezoneOffset().toString(),
            platform: Platform.OS,
            locationHrefId: Env.URL,
            ipAddress: getIPAddress(),
            accountNumber: user?.userInfo.accountNumber,
            email: defaultPaymentDetails.email || "",
            firstName: firstName || "",
            lastName: lastName || "",
            name: `${firstName} ${lastName}` || "",
            phone: "3",
            accountNumber: user?.userInfo.accountNumber,
            userName: user?.userInfo.userName,
            customerType: user?.userInfo.customerType,
            authLevel: user?.userInfo.authLevel,
            mobileApp: "mobileApp",
            jwtId: jwtToken,
          };

          loginWithJWT(jwtToken)
            .then(() => {
              console.log("Logged in to Zendesk Chat with JWT");
              // Now set conversational fields
              setConversationalFields(fields);
            })
            .catch((error) => {
              console.error("Error logging in to Zendesk Chat:", error);
            });
        }
      },
      (error) => {
        console.log("error in fetching JWT reponse for zendesk", error);
      }
    );

    // setTimeout(() => {
    //   //console.log("Setting conversational fields", fields);
    //   setConversationalFields(fields);
    // }, 1000);
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

      {true && <TouchableOpacity
        onPress={() => {
          if (Platform.OS === "ios") {
            startChat();
          } else {
            startChatWithConfig({});
          }
        }}
      >
        <ChatIcon />
      </TouchableOpacity>}
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
    <View style={[styles.card, styles.shadowProp, styles.welcomeCard]}>
      <View style={styles.contentWrapper}>
        {showDisconnectedBanner ? (
          <DisconnectedBanner navigation={navigation} />
        ) : (
          <WelcomeCard />
        )}
        {/* <MenuGrid /> */}
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
              url: `${Env.URL}/billing`,
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
        <InfoBanner
          message="We are working diligently to enhance your experience"
          icon="megaphone"
        />
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
      <View style={{ flex: 1 }}>
        <SafeAreaView
          style={{ flex: 1 }}
          importantForAccessibility={
            isWalkthroughActive ? "no-hide-descendants" : "auto"
          }
          accessibilityElementsHidden={isWalkthroughActive}
        >
          {renderHeader()} 
           {/* <View
            accessibilityLabel="SparkLight"
            style={styles.headerContainer}
            importantForAccessibility={
              isWalkthroughActive ? "no-hide-descendants" : "auto"
            }
            accessibilityElementsHidden={isWalkthroughActive}
          >
            <Logo width={120} height={33.32} />
          </View>  */}
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
                      { paddingHorizontal: Padding.p_base },
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
