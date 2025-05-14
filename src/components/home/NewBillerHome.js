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
import { GetApiRequest,PostApiRequest } from "../../network/APIClient";
import { getUser } from "../../redux/utils/LocalStorage";
import ChatIcon from "../../res/svgIcons/ChatIcon";
import sign from "jwt-encode"; // npm method for signing JWT
import VersionCheck from 'react-native-version-check';
import DeviceInfo from "react-native-device-info";

import {
  startChatWithConfig,
  initChat,
  startChat,
  loginWithJWT,
  setConversationalFields,
} from "../utility/RNZendeskChat";
import { use } from "react";

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
  const user = useSelector(state => state.combinedReducers.user.userData);
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
    DeviceInfo.getUserAgent().then((userAgent) => {
      // iOS: "Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143"
      // tvOS: not available
      // Android: "Mozilla/5.0 (Linux; Android 12; sdk_gphone64_arm64 Build/SE1A.220630.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/91.0.4472.114 Mobile Safari/537.36"
      // Windows: ?
      getZendeskChatToken(userAgent);
    });
    
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
      console.log('accountDetails', JSON.stringify(user));
      
    }
  }, [accountDetails]);

//  get zendesk chat token
const getZendeskChatToken = async(userAgent) => {
  const user1 = await getUser();
  
  console.log("getZendeskChatToken",JSON.stringify(accountDetails));
  const accountNumber = user.userInfo.accountNumber;
  const url = `/api/zendesk/TokenAuth`;
  console.log("url", url);
  const body={
    "legacy_account_number": null,
    "UserName": user?.userInfo.userName,
    "AccountNumber": accountNumber,
    "email": defaultPaymentDetails.email || "",
    "external_id": accountNumber,
    "FirstName": accountDetails?.first_name,
    "LastName": accountDetails?.last_name,
    "name": accountDetails?.first_name + " " + accountDetails?.last_name,
    "UserIPAddress": await getIPAddress(),
    "CustomerType": "RES",
    "AuthLevel": accountDetails?.auth_level,
    "AcctStatus": "Active",                    
    "LegacyCompany": "Cable One",
    "BusinessName": "",
    "email_verified": true,
    "exp": new Date().getTime() + 3600 * 1000,
    "scope":"user",
}
console.log("data", body);
  PostApiRequest(
    url,
    body,
    (res) => {
      console.log("res", res.jwtToken);
      if (res) {

        const fields={
          userAgent:userAgent,
          appVersion:VersionCheck.getCurrentVersion(),
          timezoneOffsetId:new Date().getTimezoneOffset().toString(),
          platform: Platform.OS,
          locationHrefId:Env.URL,
          ipAddress: body.UserIPAddress,
          email: defaultPaymentDetails.email || "",
          firstName: accountDetails?.first_name || '',
          lastName: accountDetails?.last_name || '',
          name: accountDetails?.first_name + " " + accountDetails?.last_name,
          phone: '3',
          accountNumber: accountNumber,
          userName: user?.userInfo.userName,
          customerType:user?.userInfo.customerType,
          authLevel: user?.userInfo.authLevel,
          jwtId: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5MDA2OTA1MzgiLCJqdGkiOiJiZDg5NDBjZS1kOGM1LTQ2YjMtODBlMS03ZTk5YzRiNmRjZmQiLCJpYXQiOjE3NDYyMDU4MzQsIm5hbWUiOiJUZXN0IEVsQ2FtcG8xIiwiZW1haWwiOiJTVU1BTlRILlRIQU5FRVJVMUBTUEFSS0xJR0hULkJJWiIsImV4dGVybmFsX2lkIjoiOTAwNjkwNTM4IiwibmJmIjoxNzQ2MjA1ODMzLCJleHAiOjE3NDYyMTMwMzMsImlzcyI6IldOV0VCU1ZDVTAxIiwiYXVkIjoiMTAuMTQwLjM2LjI4In0.qkTTZIuhKTLgUmRPvHsEPMJdhczDlR3dcz5Vp0lKOcg',
        }
        loginWithToken();
        //setConversationalFields(fields);
        
      }
    },
    (error) => {
      console.log("error", error);
    }
  );
}

// get IP address

const getIPAddress = async () => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    if (!response.ok) {
      throw new Error('Failed to fetch IP address');
    }

    const data = await response.json();
    return data.ip; // The IP address
  } catch (error) {
    console.error('Error fetching IP address:', error);
    return null;
  }
}

 // zendesk chat login

 
 const loginWithToken= async () => {
  const user = await getUser();
  const secret = '2pibLgH2LymoLJUmqQ3A94noQR6MD8RUZ4feDkFrU4VvGGxrhrXeQuRPGP-lBVzdaEZLzifgtGzKoN6XPzoQXg';
  //data payload 
  const data = {
        scope: "user",
        external_id: user?.userInfo.accountNumber,
        //email: defaultPaymentDetails.email || "",
        name: accountDetails?.first_name + " " + accountDetails?.last_name,
        //email_verified: true, // optional
       // exp: new Date().getTime() + 3600 * 1000,
    };
    // header ID
    const options = {
        "alg": "HS256",
        "typ": "JWT",
        "kid": "app_681cd7b6f85f7c21e70c5e06"
    }
    const jwt = sign(data, secret, options);
    console.log("request data for jwt",data);
    console.log("Loggin jwt",jwt);
    loginWithJWT(jwt);
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