import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, ScrollView, Platform } from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import LinearGradient from "react-native-linear-gradient";
import moment from "moment";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector, useDispatch } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import colors from "../../res/Colors";
import { Color, Padding } from "../../../GlobalStyles";
import WalkthroughOverlay from "../walkthrough/WalkthroughOverlay";
import { fetchACPUserAccountDetails } from "../../redux/actions/ProfileActionSuite";
import { checkForMinorUpdate, getPrimaryEmail } from "../utility/constant";
import { AlertUtils } from "../utility/AlertUtils";
import { Env } from "../../network/apis/account/Constants";
import WelcomeCard from "../ACPDashboard/WelcomeCard";
import MenuGrid from "../ACPDashboard/MenuGrid";
import PromoBanner from "../ACPDashboard/PromoBanner";
import FeatureCard from "../ACPDashboard/FeatureCard";
import InfoBanner from "../ACPDashboard/InfoBanner";
import { GetApiRequest, PostApiRequest } from "../../network/APIClient";
import { getUser } from "../../redux/utils/LocalStorage";
import { useMaintenance } from "../maintenance/MaintenanceContext";
import MaintenanceBanner from "../maintenance/MaintenanceBanner";
import DisconnectedBanner from "../ACPDashboard/DisconnectedBanner";
import { isAccountDisconnected } from "../utility/disconnectHelpers";
import { updatePushNotificationsv2 } from "../../redux/actions/ProfileActionSuite";
import {
  storePushNotificationStatus,
  getPushNotificationStatus,
} from "../../redux/utils/LocalStorage";
import {
  getFcmToken,
  requestUserPermission,
  notifyPermission
} from "../../firebase/FirebaseUtils";
import Logo from "../../res/images/SpalshLogo";
const NewBillerHome = ({ navigation }) => {
  const [isOutageAlert, setIsOutageAlert] = useState(false);
  const [estimatedRestoreTime, setEstimatedRestoreTime] = useState("");
  const [showWalkThrough, setShowWalkThrough] = useState(false);
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

  // Redux selectors
  //const user = useSelector((state) => state.combinedReducers.user.userData);
  //const profile = useSelector((state) => state.combinedReducers.profile || {});
  const home = useSelector((state) => state.combinedReducers?.home);
  const accountDetails = useSelector(
    (state) => state.combinedReducers?.profile?.accountDetails
  );
  const dispatch = useDispatch();
  const paperlessStatusAcp = useSelector(
    (state) => state.combinedReducers?.profile?.paperlessStatusAcp
  );
  const paperlessLoading = useSelector(
    (state) => state.combinedReducers?.profile?.isPaperLessStatusLoading
  );
  const userInfo = useSelector(
    (state) => state.combinedReducers?.user?.userData?.userInfo
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
      const request = `api/outage/GetOutages/?accountNumber=${res.userInfo.accountNumber}`;
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
          dispatch(fetchACPUserAccountDetails());
          getStatus();
          getInAppNotificationsData();
        } catch (error) {
          console.error("Error refreshing data on focus", error);
        }
      };
      refreshData();
    }, [dispatch])
  );

  useEffect(() => {
    if (home?.walkThroughStep !== null && home?.walkThroughStep !== undefined) {
      setShowWalkThrough(true);
    }
  }, [home?.walkThroughStep]);

  useEffect(() => {
    if (isNotificationEnable) {
      checkNotifications();
    }
  }, [isNotificationEnable]);

  const checkNotifications = async () => {
    const pushNotification = await getPushNotificationStatus();
    let askNotification = false;
    if (pushNotification === null) {
      askNotification = true;
    } else {
      if (pushNotification.permanentSkip) {
        askNotification = false;
      } else {
        if (pushNotification.status === "skip") {
          const now = moment();
          const days = now.diff(pushNotification.date, "days");

          if (days >= 15) {
            askNotification = true;
          } else {
            askNotification = false;
          }
        }else{
          askNotification = true;
        }
      }
    }

    if (askNotification) {
      const enabledPermission = await requestUserPermission();
      if (enabledPermission) {
        const token = await getFcmToken();
        console.log("FCM HOME WITH PERMISSION", token);
        const localData = {
          status: "accepted",
          date: new Date(),
        };
        storePushNotificationStatus(localData);
        //await dispatch(updatePushNotifications(data, null));
      }else {
        console.log("FCM HOME DENIED");
            await notifyPermission();
      }
    }
  };

  useEffect(() => {
    if (accountDetails) {
      setDefaultPaymentDetails({
        dueDate: accountDetails.payment_due_date,
        billAmount: accountDetails.payment_due_amount,
        pastPaymentDue: accountDetails.past_due_amount,
        email: getPrimaryEmail(accountDetails),
      });
    }
  }, [accountDetails]);

  const getInAppNotificationsData = () => {
    getUser().then((res1) => {
      let requestUrl = `api/mobilenotificationpreferences/${res1.userInfo?.userName}/mobilepreferences/${res1.userInfo?.accountNumber}`;
      GetApiRequest(
        requestUrl,
        (res) => {
          console.log("getInAppNotificationsData res", JSON.stringify(res));
          if (res) {
            const pushMessageType = res[0]?.pushMessageType;
            if (pushMessageType && Array.isArray(pushMessageType)) {
              for (let i = 0; i < pushMessageType.length; i++) {
                if (!pushMessageType[i]?.optOutFlag) {
                  setIsNotificationEnable(true);
                  break;
                }
              }
            }
          }
        },
        (error) => {
          console.error("Error on retrying getInAppNotificationsData", error);
        }
      );
    });
  };

  

  const renderHeader = () => (
    <View
      accessibilityElementsHidden={showWalkThrough}
      importantForAccessibility={showWalkThrough ? "no-hide-descendants" : "no"}
      accessibilityLabel="SparkLight"
      style={styles.headerContainer}
    >
      <Logo width={120} height={33.32} />
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
        <MenuGrid />
        <PromoBanner
          title="Auto Pay + Paperless is a Winning Combination!"
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
      {showWalkThrough && <View style={styles.shadowFullScreen} />}
      {showWalkThrough && (
        <WalkthroughOverlay onFinish={() => setShowWalkThrough(false)} />
      )}
      <View
        accessibilityElementsHidden={showWalkThrough}
        importantForAccessibility={
          showWalkThrough ? "no-hide-descendants" : "auto"
        }
        style={{ flex: 1 }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          {renderHeader()}
          <ScrollView style={styles.scrollContainer}>
            <View style={styles.mainContentContainer}>
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
              {renderWelcomeCard()}
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
  shadowFullScreen: {
    backgroundColor: "black",
    height: "100%",
    width: "100%",
    position: "absolute",
    top: 0,
    zIndex: 5,
    opacity: 0.7,
  },
  contentWrapper: {
    flex: 1,
    backgroundColor: Color.sparklightWhite,
    paddingHorizontal: Padding.p_5xl,
    paddingTop: 8,
  },
});

export default NewBillerHome;
