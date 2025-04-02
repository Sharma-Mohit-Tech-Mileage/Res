import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, Image, ScrollView, Platform,TouchableOpacity } from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import LinearGradient from "react-native-linear-gradient";
import moment from "moment";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector, useDispatch } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import colors from "../../res/Colors";
import { Color, Padding } from "../../../GlobalStyles";
import WalkthroughOverlay from "../common/WalkthroughOverlay";
import { fetchACPUserAccountDetails, getPaperlessStatus } from "../../redux/actions/ProfileActionSuite";
import { checkForMinorUpdate, getPrimaryEmail } from "../utility/constant";
import { AlertUtils } from "../utility/AlertUtils";
import { Env,config } from "../../network/apis/account/Constants";
import WelcomeCard from "../ACPDashboard/WelcomeCard";
import MenuGrid from "../ACPDashboard/MenuGrid";
import PromoBanner from "../ACPDashboard/PromoBanner";
import FeatureCard from "../ACPDashboard/FeatureCard";
import InfoBanner from "../ACPDashboard/InfoBanner";
import { GetApiRequest } from "../../network/APIClient";
import { getUser } from "../../redux/utils/LocalStorage";
import ChatIcon from "../../res/svgIcons/ChatIcon";
//import {jwt} from 'jsonwebtoken';

import {
  startChatWithConfig,
  initChat,
  startChat,
  loginWithJWT,
} from "../utility/RNZendeskChat";

const CHANNEL_KEY = config.CHANNEL_KEY;

const NewBillerHome = ({ navigation }) => {
  // State definitions
  const [billAmt, setBillAmt] = useState(undefined);
  const [dueDate, setDueDate] = useState("");
  const [isOutageAlert, setIsOutageAlert] = useState(false);
  const [checkModemStatus, setCheckModemStatus] = useState(false);
  const [estimatedRestoreTime, setEstimatedRestoreTime] = useState("");
  const [showWalkThrough, setShowWalkThrough] = useState(false);
  const [internetHealths, setInternetHealths] = useState([]);
  const [isAutoPayStatus, setIsAutoPayStatus] = useState(false);
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
  const home = useSelector((state) => state.combinedReducers.home);
  const accountDetails = useSelector(
    (state) => state.combinedReducers.profile?.accountDetails
  );
  const dispatch = useDispatch();
const paperlessStatusAcp = useSelector(
      (state) => state.combinedReducers.profile?.paperlessStatusAcp
    );

    const getStatus = () => {
        getUser().then((res) => {
          const accountNumber = res.userInfo.accountNumber;
          GetApiRequest(
            `api/Accounts/${accountNumber}/easypay`,
            (res) => {
              console.log("res-------------------------------------------------------------------------------", res);
              setIsAutoPayStatus(res?.isEasyPay);
            },
            (error) => { console.log("error", error);}
          );
        });
      };
  // Refresh data when the screen is focused
  useFocusEffect(
    useCallback(() => {
      const refreshData = async () => {
        try {
          const status = await checkForMinorUpdate();
          setUpdateStatus(status);
          dispatch(fetchACPUserAccountDetails());
          getStatus();
        } catch (error) {
          console.error("Error refreshing data on focus", error);
        }
      };

      refreshData();
    }, [dispatch])
  );

  // Show walkthrough overlay if applicable
  useEffect(() => {
    if (home.walkThroughStep !== null && home.walkThroughStep !== undefined) {
      setShowWalkThrough(true);
    }
  }, [home.walkThroughStep]);

  // Update paperless status whenever the email changes
  useEffect(() => {
    if (defaultPaymentDetails.email) {
      dispatch(getPaperlessStatus(defaultPaymentDetails.email));
    }
  }, [defaultPaymentDetails.email, dispatch]);

  // Check modem status based on internet health count
  useEffect(() => {
    if (internetHealths.length >= 3) {
      setCheckModemStatus(true);
    }
  }, [internetHealths]);

  // Update local state when account details are received
  useEffect(() => {
    if (accountDetails) {
      const userBillAmt =
        accountDetails.past_due_amount <= 0
          ? accountDetails.current_balance
          : accountDetails.past_due_amount;
      setBillAmt(userBillAmt?.toFixed(2));
      const formattedDueDate =
        accountDetails.past_due_amount !== 0
          ? "Immediately"
          : moment(accountDetails.payment_due_date).format("ll");
      setDueDate(formattedDueDate);
      setDefaultPaymentDetails({
        dueDate: accountDetails.payment_due_date,
        billAmount: accountDetails.payment_due_amount,
        pastPaymentDue: accountDetails.past_due_amount,
        email: getPrimaryEmail(accountDetails),
      });
      console.log('accountDetails', accountDetails);
      //loginToZendesk();
    }
  }, [accountDetails]);

 // zendesk chat login

 const loginToZendesk = async() => {
  
  const payload = {
    sub: defaultPaymentDetails.email, // Unique identifier (email or user ID)
    name: 'John Doe',
  };


  
  //const token = jwt.sign(user.token, 'YT98N5WsTZbSAvs24O8jjtfeSx_B1AV70YpK62h_tepWExIp8y643H80BYmHNOC3qtgwfYvJrnvbuJcCuWrUXA', { algorithm: 'HS256' });
  //const jwtToken = user.jwtToken;
  
 }

  const renderHeader = () => (
    <View
      accessibilityElementsHidden={showWalkThrough}
      importantForAccessibility={showWalkThrough ? "no-hide-descendants" : "no"}
      accessibilityLabel="SparkLight"
      style={styles.headerContainer}
    >
      <Image
        accessible={!showWalkThrough}
        accessibilityLabel="SparkLight"
        resizeMode="contain"
        style={styles.logoImage}
        source={require("../../../assets/SparklightEntryLogo.png")}
      />
      <TouchableOpacity
              onPress={() => {
                if (Platform.OS === "ios") {
                  startChat();
                } else {
                  startChatWithConfig({});
                }
              }}
            >
              <ChatIcon />
            </TouchableOpacity>
    </View>
  );

  const renderOutageAlert = () =>
    AlertUtils.createOutageAlert(estimatedRestoreTime, () => setIsOutageAlert(false));

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
        <WelcomeCard />
        <MenuGrid />
        <PromoBanner
          title="Auto Pay + Paperless is a Winning Combination!"
          showBonus={true}
        />
        <FeatureCard
          title="Auto Pay"
          features={["Convenient", "Timely Payments", "Peace of Mind"]}
          buttonText={isAutoPayStatus ? "Active" : "Activate Auto Pay"}
          buttonVariant={isAutoPayStatus ? "success" : "primary"}
          isActive={isAutoPayStatus}
          onButtonPress={() => {
            navigation.navigate("AutoPayPCIConnector", {
              url: `${Env.URL}/billing`,
              name: isAutoPayStatus?"Manage Auto Pay":"Setup Auto Pay",
              useNewPayment: true,
              status: isAutoPayStatus,
              paymentDetails: defaultPaymentDetails,
            });
          }}
        />
        <FeatureCard
          title="Paperless Billing"
          features={["Keeps you Organized", "Cost Effective", "Eco-Friendly"]}
          buttonText={paperlessStatusAcp ? "Active" : "Go Paperless Today"}
          buttonVariant={paperlessStatusAcp ? "success" : "primary"}
          isActive={paperlessStatusAcp}
          onButtonPress={() => navigation.navigate("account", {screen: "Notifications"})}
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
      colors={["rgba(53, 48, 145, 0.78)", "rgba(141, 59, 144, 0.9)"]}
      style={styles.container}
    >

      {showWalkThrough && <View style={styles.shadowFullScreen} />}
      {showWalkThrough && (
        <WalkthroughOverlay onFinish={() => setShowWalkThrough(false)} />
      )}
      <View
  accessibilityElementsHidden={showWalkThrough}
  importantForAccessibility={showWalkThrough ? "no-hide-descendants" : "auto"}
  style={{ flex: 1 }}
>
      <SafeAreaView style={{ flex: 1 }}>
        {renderHeader()}
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.mainContentContainer}>
            {updateStatus.isMinorUpdateAvailable && renderAppUpdateAlert()}
            {isOutageAlert && renderOutageAlert()}
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
  logoImage: {
    width: 120,
    height: 30.324,
    flexShrink: 0,
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