import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
  Dimensions,
  Pressable,
  ActivityIndicator,
  Linking,
  AccessibilityInfo,
} from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import LinearGradient from "react-native-linear-gradient";
import colors from "../../res/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import InternetHealthChart from "../common/InternetHealthChart";
import InfoIcon from "../../res/svgIcons/InfoIcon";
import DownArrow from "../../res/svgIcons/DownArrow";
import UpArrow from "../../res/svgIcons/UpArrow";
import NetworkDetails from "../common/NetworkDetails";
import strings from "../../res/Strings";
import MyInternetDetials from "../common/MyInternetDetails";
import {
  getUser,
  getPushNotificationStatus,
  storePushNotificationStatus,
  storeUpgradeToken,
} from "../../redux/utils/LocalStorage";
import {
  GetApiRequest,
  GetModemStatusApiRequest,
} from "../../network/APIClient";
import moment from "moment";
import { Border, Color, FontFamily, FontSize } from "../../../GlobalStyles";
import CloseIcon from "../../res/svgIcons/CloseIcon";
import {
  getFcmToken,
  requestUserPermission,
} from "../../firebase/FirebaseUtils";
import {
  updatePushNotifications,
  fetchPushNotifications,
  saveAccountServices,
} from "../../redux/actions/ProfileActionSuite";
import { useSelector, useDispatch } from "react-redux";
import { Env } from "../../network/apis/account/Constants";
import { checkForMinorUpdate } from "../utility/constant";
import PromotionCard from "../common/PromotionCard/PromotionCard";
import { useFocusEffect } from "@react-navigation/native";
import WalkthroughOverlay from "../common/WalkthroughOverlay";
import ChatIcon from "../../res/svgIcons/ChatIcon";
import DeviceInfo from "react-native-device-info";
import VersionCheck from "react-native-version-check";
import sign from "jwt-encode";
//var jwt = require("jsonwebtoken")

const tabWidth = Number(Dimensions.get("window").width / 4);
import {
  startChatWithConfig,
  initChat,
  startChat,
  loginWithJWT,
  setConversationalFields,
} from "../utility/RNZendeskChat";

const HomeScreen = ({ navigation }) => {
  const [isInternetDetails, setIsInternetDetails] = useState(false);
  const user = useSelector((state) => state.combinedReducers.user.userData);
  const home = useSelector((state) => state.combinedReducers.home);
  const profile = useSelector((state) => state.combinedReducers.profile || {});
  const dispatch = useDispatch();
  const [plans, setPlans] = useState([]);
  const [tvPlan, setTVPlan] = useState("");
  const [phonePlan, setPhonePlan] = useState([]);
  const [billAmt, setBillAmt] = useState(undefined);
  const [dueDate, setDueDate] = useState("");
  const [currentHealth, setCurrentHealth] = useState("Optimal");
  const [billPaid, setBillPaid] = useState(false);
  const [accountStatus, setAccountStatus] = useState("Active");
  const [hasOutage, setHasOutage] = useState(false);
  const [isOutageAlert, setIsOutageAlert] = useState(false);
  const [checkModemStatus, setCheckModemStatus] = useState(false);
  const [estimatedRestoreTime, setEstimatedRestoreTime] = useState("");
  const [showWalkThrough, setShowWalkThrough] = useState(false);
  const [internetHealths, setInternetHealths] = useState([]);
  const [updateStatus, setUpdateStatus] = useState({
    isMinorUpdateAvailable: false,
    currentVersion: "",
    latestVersion: "",
  });
  const [defaultPaymentDetails, setDefaultPaymentDetails] = useState({
    dueDate: null,
    billAmount: 0,
    pastPaymentDue: 0,
    email: null,
  });
  const [screenReaderEnabled, setIsScreenReaderEnabled] = useState(false);
  const [hasEeroDevice, setHasEeroDevice] = useState(false);
  const [networkId, setNetworkId] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  useEffect(() => {
    async function getAccessibility() {
      try {
        const accessibility = await AccessibilityInfo.isScreenReaderEnabled();
        setIsScreenReaderEnabled(accessibility);
      } catch (error) {
        console.log(
          "There has been a problem with AccessibilityInfo.isScreenReaderEnabled(): " +
            error.message
        );
        setIsScreenReaderEnabled(false);
      }
    }
    getAccessibility();
    const reduceMotionChangedSubscription = AccessibilityInfo.addEventListener(
      "screenReaderChanged",
      (isScreenReaderEnabled) => {
        setIsScreenReaderEnabled(isScreenReaderEnabled);
      }
    );
    return () => {
      reduceMotionChangedSubscription.remove();
    };
  }, [screenReaderEnabled]);
  const getInternetHealth = (type) => {
    var currentHealth = { Offline: 20, Poor: 50, Optimal: 80, default: 80 };
    return currentHealth[type] || currentHealth["default"];
  };

  const getInternetPlanDetails = () => {
    getUser().then((res) => {
      const request = `internet/api/internet/${res.userInfo.accountNumber}/plan`;
      GetApiRequest(request, onSuccessPlan, onError);
    });
  };

  function getPhoneServiceDetails() {
    getUser().then((res) => {
      const request = `phone/api/phones/${res.userInfo.accountNumber}/phonelines`;
      GetApiRequest(request, onSuccessPhonePlan, onError);
    });
  }
  function getPhoneServicePlans(tgcCode) {
    getUser().then((res) => {
      const request = `phone/api/Plans/${tgcCode}`;
      GetApiRequest(request, onFetchedPlan, onError);
    });
  }
  const onFetchedPlan = (res) => {
    setPhonePlan(res);
  };
  const onSuccessPhonePlan = (res) => {
    if (res.length && res[0].tcgCode) {
      getPhoneServicePlans(res[0].tcgCode);
    }
  };

  const getTVServiceDetails = () => {
    getUser().then((res) => {
      const request = `sparklighttv/api/sparklighttv/${res.userInfo.accountNumber}/plan`;
      GetApiRequest(request, onSuccessTVPlan, onErrorInPlanTV);
    });
  };

  const onSuccessTVPlan = (res) => {
    setTVPlan(res || "");
  };

  const onErrorInPlanTV = (error) => {
    console.log("onErrorInPlanTV", error);
  };

  const getUpgradeToken = async () => {
    const url = Env.API_SHOPPING_CART_BASEURL + "/api/UpgradeOrder/token";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "password",
        username: "upgr4d3s0rd3rus3r",
        password: "upgr4d3s0rd3rp4ssw0rd",
      }).toString(),
    });

    let json = {};

    if (response !== undefined) {
      json = response.json();
    }
    return json;
  };

  const checkModemOutagStatus = () => {
    getUser().then((res) => {
      const request = `mobile/api/Outage/GetOutageStatus?accountnumber=${res.userInfo.accountNumber}`;
      GetApiRequest(
        request,
        (response) => {
          console.log("checkModemOutagStatus", response);
          if (response != undefined) {
            if (response.hasOutage === true) {
              let time = moment(response.estimatedTimeOfResolution).format(
                "LT"
              );
              setEstimatedRestoreTime(time);
              setAccountStatus("Disconnect");
              setIsInternetDetails(true);
              setHasOutage(true);
              setIsOutageAlert(true);
              setInternetHealths((oldArray) => [...oldArray, "Red"]);
            } else {
              setInternetHealths((oldArray) => [...oldArray, "Green"]);
            }
          }
        },
        (errorCode) => {
          console.log("checkModemOutagStatus erro", errorCode);
          if (errorCode == 204) {
            setInternetHealths((oldArray) => [...oldArray, "Green"]);
          }
        }
      );
    });
  };

  const onSuccessPlan = (res) => {
    console.log("getInternetPlanDetails", res);
    if (res) {
      setPlans(res);
      if (res.length > 0) {
        let macAddress = res[0].macAddress;
        var mac = macAddress;
        if (user.userInfo.accountNumber === "128387263") {
          mac = "bc:3e:07:38:56:d0";
        } else if (user.userInfo.accountNumber === "131684698") {
          mac = "00:40:36:7b:29:5a";
        } else if (user.userInfo.accountNumber === "133777029") {
          mac = "74:9b:e8:33:47:40";
        } else if (user.userInfo.accountNumber === "902880079") {
          mac = "00:40:36:5f:cc:7f";
        } else if (user.userInfo.accountNumber === "136885142") {
          mac = "20:73:55:89:c7:00";
        }
        checkModemDetails(mac);
      }
    }
  };
  const onError = (error) => {
    console.log("error", error);
  };

  const checkModemDetails = (macAddress) => {
    const request = `Mobile/api/modem/getmodemdetails?macId=${macAddress}`;
    GetModemStatusApiRequest(
      request,
      (res) => {
        if (res) {
          if (res?.status) {
            if (res.status === 408) {
              setInternetHealths((oldArray) => [...oldArray, "Yellow"]);
              return;
            }
          }

          let temt = [];
          console.log("checkModemDetails==", res);
          if (res.equipmentType == "DOCSIS") {
            temt.push(res.uTxP_State);
            temt.push(res.uRxL_State);
            temt.push(res.usnR_State);
            temt.push(res.dsnR_State);
            temt.push(res.dRxL_State);
            updateModemStatus(temt);
          } else if (res.equipmentType === "ONU") {
            temt.push(res.onutP_State);
            temt.push(res.oltrP_State);
            temt.push(res.onurP_State);
            updateModemStatus(temt);
          } else {
            setInternetHealths((oldArray) => [...oldArray, "Red"]);
          }
        }
      },
      (errorCode) => {
        console.log("Modem details on Error", errorCode);
        if (errorCode === 404) {
          setInternetHealths((oldArray) => [...oldArray, "Red"]);
        } else if (
          errorCode === 400 ||
          errorCode === 500 ||
          errorCode === 504
        ) {
          setInternetHealths((oldArray) => [...oldArray, "Yellow"]);
        } else {
          setInternetHealths((oldArray) => [...oldArray, "Red"]);
        }
      }
    );
  };

  const updateModemStatus = (temt) => {
    console.log("modem status before check", temt);
    const allGreen = temt.every((v) => v === "Green");
    console.log("modem status", allGreen);
    if (!allGreen) {
      const checkYellow = temt.includes("Yellow");
      const checkRed = temt.includes("Red");
      if (checkRed) {
        console.log("modem status", "Red");
        setInternetHealths((oldArray) => [...oldArray, "Red"]);
      } else if (checkYellow) {
        console.log("modem status", "Yellow");
        setInternetHealths((oldArray) => [...oldArray, "Yellow"]);
      } else {
        setInternetHealths((oldArray) => [...oldArray, "Red"]);
      }
    } else {
      setInternetHealths((oldArray) => [...oldArray, "Green"]);
    }
  };

  const refreshInternetHealth = () => {
    const checkYellow = internetHealths.includes("Yellow");
    const checkRed = internetHealths.includes("Red");
    const checkGreen = internetHealths.includes("Green");
    if (checkRed) {
      console.log("Internet Health is Red");
      setCurrentHealth("Offline");
      setIsInternetDetails(true);
    } else if (checkYellow) {
      console.log("Internet Health is Yellow");
      setCurrentHealth("Poor");
      setIsInternetDetails(true);
    } else {
      console.log("Internet Health is Green");
      setCurrentHealth("Optimal");
      setIsInternetDetails(false);
    }
  };

  const getUserAccountDetails = () => {
    setBillAmt(undefined);
    getUser().then((res) => {
      const request = `account/api/account/${res.userInfo.accountNumber}`;
      GetApiRequest(
        request,
        (res) => {
          if (res) {
            console.log("getUserAccountDetails", res);
            dispatch(saveAccountServices(res.services));
            if (res.currentCollectionStep == "Soft Disconnect") {
              setAccountStatus("Disconnect");
              setIsInternetDetails(true);
              setInternetHealths((oldArray) => [...oldArray, "Red"]);
            } else {
              updateInternetHealth(res.currentBalance, res.paymentDueDate);
            }
            setBillAmt((Math.round(res.currentBalance * 100) / 100).toFixed(2));
            let dueDate =
              res.pastDueAmount != 0
                ? "Immediately"
                : moment(res.paymentDueDate).format("ll");
            setDueDate(dueDate);
            function getFirstEmail(emailArray) {
              return emailArray && emailArray.length > 0 && emailArray[0]
                ? emailArray[0]
                : null;
            }
            let paymentDetails = { ...defaultPaymentDetails };
            paymentDetails.dueDate = res.paymentDueDate;
            paymentDetails.billAmount = (
              Math.round(res.currentBalance * 100) / 100
            ).toFixed(2);
            paymentDetails.pastPaymentDue = res.pastDueAmount;
            paymentDetails.email = getFirstEmail(res.email);
            setDefaultPaymentDetails(paymentDetails);
            getTVServiceDetails();
            getInternetPlanDetails();
            getPhoneServiceDetails();
            setFirstName(res.firstName || "");
            setLastName(res.lastName || "");
            DeviceInfo.getUserAgent().then((userAgent) => {
              // iOS: "Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143"
              // tvOS: not available
              // Android: "Mozilla/5.0 (Linux; Android 12; sdk_gphone64_arm64 Build/SE1A.220630.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/91.0.4472.114 Mobile Safari/537.36"
              // Windows: ?
              //getZendeskChatToken(userAgent);
              loginWithToken(userAgent,res.firstName || "",res.lastName || "");
            });
          }
        },
        onErrorBill
      );
    });
  };

  const loginWithToken = async (userAgent,firstName,lastName) => {
    const user = await getUser();
    const secret =
      (Platform.OS=='ios')?"JQ8sVOU9Hl3fnUf1gyt9xfRn9XVMZ44ilfSo5e3SnrutkSCXDmMVSdTOCVQMduayJwptKtfPrMNaUDz3LfzLxQ":"Rcmym7uJfKq-hqjXyhlC9y09AyPyw0K6Pt6cvqvBmR335YCChrSBS6rnSdEUT-9-YIIkSYS_AYU36ETkuCxnYA"
    //data payload
    const data = {
      scope: "user",
      external_id: user?.userInfo.accountNumber,
      //email: defaultPaymentDetails.email || "",
      name: `${firstName} ${lastName}` || "",
      //email_verified: true, // optional
      // exp: new Date().getTime() + 3600 * 1000,
    };
    // header ID
    const options = {
      alg: "HS256",
      typ: "JWT",
      kid: (Platform.OS=='ios')? "app_683930d35c8351994c5bff40":"app_683933455c8351994c6542b3",
    };
    const jwttoken = sign(data, secret, options);
    console.log("request data for jwt", data);
    console.log("request options for jwt", options);
    console.log("Loggin jwt", jwttoken);
    //loginWithJWT(jwttoken);
    loginWithJWT("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjgzODcyNjMiLCJqdGkiOiI3MDI0MGU3MS0xZjc2LTRjNWUtYTJiMC1jMWNhOGU2NDQzNTkiLCJpYXQiOjE3NDg2MjI1NjMsIm5hbWUiOiJXRUJURUFNIEFMTFRIUkVFIiwiZW1haWwiOiJTVU1BTlRILlRIQU5FRVJVQFNQQVJLTElHSFQuQklaIiwiZXh0ZXJuYWxfaWQiOiIxMjgzODcyNjMiLCJuYmYiOjE3NDg2MjI1NjIsImV4cCI6MTc0ODYyOTc2MiwiaXNzIjoiQk4wMFRFQ0gwMDEiLCJhdWQiOiJodHRwczovL2N1c3RvbWVyLnNwYXJrbGlnaHQuY29tIn0.ExRq4C4e-Fsj1csJbOZPNsTUnbJjas97xmiWZGaI43w")

    const fields = {
      userAgent: userAgent,
      appVersion: VersionCheck.getCurrentVersion(),
      timezoneOffsetId: new Date().getTimezoneOffset().toString(),
      platform: Platform.OS,
      locationHrefId: Env.URL,
      ipAddress: await getIPAddress(),
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
      jwtId:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjgzODcyNjMiLCJqdGkiOiI3MDI0MGU3MS0xZjc2LTRjNWUtYTJiMC1jMWNhOGU2NDQzNTkiLCJpYXQiOjE3NDg2MjI1NjMsIm5hbWUiOiJXRUJURUFNIEFMTFRIUkVFIiwiZW1haWwiOiJTVU1BTlRILlRIQU5FRVJVQFNQQVJLTElHSFQuQklaIiwiZXh0ZXJuYWxfaWQiOiIxMjgzODcyNjMiLCJuYmYiOjE3NDg2MjI1NjIsImV4cCI6MTc0ODYyOTc2MiwiaXNzIjoiQk4wMFRFQ0gwMDEiLCJhdWQiOiJodHRwczovL2N1c3RvbWVyLnNwYXJrbGlnaHQuY29tIn0.ExRq4C4e-Fsj1csJbOZPNsTUnbJjas97xmiWZGaI43w",
    //jwtId: jwttoken,
    };
    setTimeout(() => {
      console.log("Setting conversational fields", fields);
      setConversationalFields(fields);
    }, 1000);
  };

  const updateInternetHealth = (dueAmount, dueDate) => {
    if (moment(dueDate).isAfter()) {
      setBillPaid(true);
      setInternetHealths((oldArray) => [...oldArray, "Green"]);
    } else if (dueAmount <= 0) {
      setBillPaid(true);
      setInternetHealths((oldArray) => [...oldArray, "Green"]);
    } else {
      setInternetHealths((oldArray) => [...oldArray, "Yellow"]);
    }
  };

  const onErrorBill = (error) => {
    console.log("error", error);
  };

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
        }
      }
    }

    if (askNotification) {
      let optOut = false;
      let outageOptOut = false;
      let billingOptOutStatus = false;

      let enabledNotification = false;

      if (profile?.pushNotifications?.length > 0) {
        let optOutCountPushNotification = 0;
        enabledNotification = true;
        const messageTypes = profile.pushNotifications[0].pushMessageType;
        messageTypes.forEach((messageType) => {
          switch (messageType.messageType) {
            case "appointment":
              optOut = messageType.optOutFlag;
              break;
            case "outage":
              outageOptOut = messageType.optOutFlag;
              break;
            case "billing":
              billingOptOutStatus = messageType.optOutFlag;
              break;
          }
          if (messageType.optOutFlag) {
            optOutCountPushNotification += 1;
          }
        });
      }

      if (enabledNotification) {
        const enabledPermission = await requestUserPermission();

        if (enabledPermission) {
          const token = await getFcmToken();
          console.log("FCM HOME WITH PERMISSION", token);
          const data = {
            accountNumber: user.userInfo.accountNumber,
            deviceToken: token,
            deviceTokenTimestamp: moment().format(),
            optOut: optOut,
            outageOptOut: outageOptOut,
            billingOptOutStatus: billingOptOutStatus,
            userName: user.userInfo.userName,
            isAndroid: Platform.OS == "android",
          };
          const localData = {
            status: "accepted",
            date: new Date(),
          };
          storePushNotificationStatus(localData);
          await dispatch(updatePushNotifications(data, null));
        } else {
          const token = await getFcmToken();
          console.log("FCM HOME WITHOUT PERMISSION", token);
          const data = {
            accountNumber: user.userInfo.accountNumber,
            deviceToken: token,
            deviceTokenTimestamp: moment().format(),
            optOut: optOut,
            outageOptOut: outageOptOut,
            billingOptOutStatus: billingOptOutStatus,
            userName: user.userInfo.userName,
            isAndroid: Platform.OS == "android",
          };
          const localData = {
            status: "skip",
            date: new Date(),
            permanentSkip: true,
          };
          await dispatch(updatePushNotifications(data, null));
          storePushNotificationStatus(localData);
        }
      }
    }
  };
  const checkEeroDevice = () => {
    getUser().then((res) => {
      const request = `/mobile/api/Eero/GetEeroAccountDetails?accountnumber=${res.userInfo.accountNumber}`;
      GetApiRequest(
        request,
        (response) => {
          const networkId = response.data?.networks[0]?.split("/").pop();
          if (networkId) {
            setHasEeroDevice(true);
            setNetworkId(networkId);
          } else {
            setHasEeroDevice(false);
          }
        },
        (error) => {
          console.log("error", error);
          setHasEeroDevice(false);
        }
      );
    });
  };
  useFocusEffect(
    useCallback(() => {
      getUserAccountDetails();
    }, [])
  );
  useEffect(() => {
    const fetchUpdateStatus = async () => {
      checkEeroDevice();
      const status = await checkForMinorUpdate();
      setUpdateStatus(status);
    };
    fetchUpdateStatus();
  }, []);

  useEffect(() => {
    if (internetHealths.length >= 3) {
      setCheckModemStatus(true);
      refreshInternetHealth();
    }
  }, [internetHealths]);

  useEffect(() => {
    checkModemOutagStatus();

    const fetchData = async () => {
      try {
        const result = await getUpgradeToken();
        console.log("getUpgradeTokenResult: ", JSON.stringify(result));
        storeUpgradeToken(result);
      } catch (error) {
        console.error("Error fetching data", error);
      }
      if (home.walkThroughStep !== null && home.walkThroughStep !== undefined) {
        setShowWalkThrough(true);
      }
    };
    fetchData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const fetchUpdateStatus = async () => {
        const status = await checkForMinorUpdate();
        setUpdateStatus(status);
      };

      fetchUpdateStatus();
      getUserAccountDetails();
      checkModemOutagStatus();
    }, [])
  );

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(fetchPushNotifications());
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, [dispatch]);
  useEffect(() => {
    if (profile?.pushNotifications?.length > 0 && user.userInfo !== undefined) {
      checkNotifications();
    }
  }, [profile, user]);

  const OutageAlert = ({ estimatedTime }) => {
    const alertMessage = `Our systems show that you may be experiencing an outage related to your Internet service. We are working to restore service as soon as possible. Estimated Time to Restore: ${estimatedTime}`;
    return (
      <View
        style={styles.errorBox}
        accessibilityElementsHidden={showWalkThrough}
        importantForAccessibility={
          showWalkThrough ? "no-hide-descendants" : "yes"
        }
      >
        <View style={{ flexDirection: "row", width: "90%" }}>
          <View
            accessible={false}
            style={{ backgroundColor: "#F88700", width: 4 }}
          />
          <View style={{ flexDirection: "column", padding: 10 }}>
            <View style={{ flexDirection: "row" }}>
              <Image
                accessible={false}
                style={{ alignSelf: "center" }}
                resizeMode="contain"
                tintColor={"#F88700"}
                source={require("../../../assets/info-circle.png")}
              />
              <Text
                accessible={true}
                accessibilityRole="header"
                style={styles.modemError1}
              >
                Outage Alert
              </Text>
            </View>
            <Text
              accessible={true}
              accessibilityRole="text"
              accessibilityLabel={alertMessage}
              style={styles.modemError2}
            >
              Our systems show that you may be experiencing an outage related to
              your Internet service. We are working to restore service as soon
              as possible.
              <Text style={[styles.modemError2, { fontWeight: "700" }]}>
                {" "}
                Estimated Time to Restore: {estimatedTime}
              </Text>
            </Text>
          </View>

          <TouchableOpacity
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Close outage alert"
            style={{ marginTop: 10 }}
            onPress={() => {
              setIsOutageAlert(false);
            }}
          >
            <CloseIcon />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const AppUpdateAlert = () => {
    return (
      <View style={styles.errorBox}>
        <View style={{ flexDirection: "row", width: "90%" }}>
          <View style={{ backgroundColor: Color.sparklightGreen, width: 4 }} />
          <View style={{ flexDirection: "column", padding: 10 }}>
            <View style={{ flexDirection: "row" }}>
              <Image
                style={{ alignSelf: "center" }}
                resizeMode="contain"
                tintColor={Color.sparklightGreen}
                source={require("../../../assets/info-circle.png")}
              />
              <Text
                style={[styles.modemError1, { color: Color.sparklightGreen }]}
              >
                What's New
              </Text>
            </View>
            <Text
              accessible={!showWalkThrough}
              accessibilityElementsHidden={showWalkThrough}
              importantForAccessibility={
                showWalkThrough ? "no-hide-descendants" : "no"
              }
              style={styles.modemError2}
            >
              Enhance your app experience with the latest version.
              <Text
                accessible={!showWalkThrough}
                style={styles.updateNow}
                onPress={() => {
                  if (Platform.OS === "android") {
                    Linking.openURL(
                      "https://play.google.com/store/apps/details?id=com.sparklight"
                    );
                  } else {
                    Linking.openURL(
                      "https://apps.apple.com/us/app/mysparklight/6469003880"
                    );
                  }
                }}
              >
                {" "}
                Update Now{" "}
              </Text>
              and keep your app running smoothly.
            </Text>
          </View>

          <TouchableOpacity
            style={{ marginTop: 10 }}
            onPress={() => {
              setUpdateStatus({
                isMinorUpdateAvailable: false,
                currentVersion: "",
                latestVersion: "",
              });
            }}
          >
            <CloseIcon />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

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

      <SafeAreaView
        accessibilityElementsHidden={showWalkThrough}
        importantForAccessibility={
          showWalkThrough ? "no-hide-descendants" : "no"
        }
        style={{ flex: 1 }}
      >
        <View
          accessibilityElementsHidden={showWalkThrough}
          importantForAccessibility={
            showWalkThrough ? "no-hide-descendants" : "no"
          }
          accessibilityLabel={`SparkLight`}
          style={{
            height: Platform.OS == "ios" ? 60 : 50,
            flexDirection: "row",
            justifyContent: "space-between",
            marginHorizontal: 20,
            marginTop: Platform.OS == "ios" ? 0 : 20,
          }}
        >
          <Image
            accessible={!showWalkThrough}
            accessibilityLabel={`SparkLight`}
            resizeMode="contain"
            style={{ width: 120, height: 30.324, flexShrink: 0 }}
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
        <ScrollView style={{ height: "100%", paddingBottom: 100 }}>
          <View
            style={{
              backgroundColor: colors.backgound_blue,
              flex: 2,
              alignItems: "center",
              marginTop: 50,
              paddingBottom: 50,
            }}
          >
            {updateStatus.isMinorUpdateAvailable ? <AppUpdateAlert /> : null}
            {isOutageAlert ? (
              <OutageAlert estimatedTime={estimatedRestoreTime} />
            ) : (
              <></>
            )}
            <View
              style={[
                styles.card,
                styles.shadowProp,
                { marginTop: screenReaderEnabled ? 0 : -40 },
              ]}
            >
              <Text
                accessible={true}
                accessibilityLabel={`Service Health`}
                style={styles.internetHealth}
              >
                Service Health
              </Text>
              {checkModemStatus ? (
                <InternetHealthChart
                  currentValue={getInternetHealth(currentHealth)}
                  key={currentHealth}
                />
              ) : (
                <ActivityIndicator
                  size="large"
                  color={Color.colorGainsboro_200}
                />
              )}
              <View
                style={styles.internetStatusSection}
                accessible={true}
                accessibilityRole="text"
                accessibilityLabel={
                  currentHealth != "Optimal"
                    ? strings.internetStatusIssue
                    : strings.internetStatus
                }
              >
                <View style={{ marginTop: 5 }}>
                  <InfoIcon />
                </View>
                <Text style={styles.internetStatusTxt}>
                  {" "}
                  {currentHealth != "Optimal"
                    ? strings.internetStatusIssue
                    : strings.internetStatus}
                </Text>
              </View>

              <View
                style={{ backgroundColor: "#F4F4F5", height: 1, marginTop: 20 }}
              />
              <TouchableOpacity
                onPress={() => {
                  setIsInternetDetails(!isInternetDetails);
                }}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  padding: 5,
                  marginVertical: 5,
                  marginHorizontal: 25,
                }}
                accessible={true}
                accessibilityRole="button"
                accessabilityLabel={
                  isInternetDetails ? strings.collapseTxt : strings.expandTxt
                }
              >
                <Text style={styles.hideShowDetails}>
                  {isInternetDetails ? strings.collapseTxt : strings.expandTxt}
                </Text>
                <View style={{ marginTop: 15 }}>
                  {isInternetDetails ? (
                    <View style={{ marginTop: -10 }}>
                      <UpArrow />
                    </View>
                  ) : (
                    <DownArrow />
                  )}
                </View>
              </TouchableOpacity>
              {isInternetDetails ? (
                <NetworkDetails
                  billPaid={billPaid}
                  hasOutage={hasOutage}
                  currentHealth={currentHealth}
                  navigation={navigation}
                  accountStatus={accountStatus}
                />
              ) : (
                <></>
              )}
            </View>
            <PromotionCard />
            <MyInternetDetials
              plans={plans}
              billAmt={billAmt}
              dueDate={dueDate}
              paymentDetails={defaultPaymentDetails}
              navigation={navigation}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  accept: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.openSansRegular,
    textAlign: "center",
    color: Color.sparklightWhite,
  },
  bottomCarot: {
    width: 18,
    height: 13,
    position: "absolute",
    top: 20,
  },
  bottomCarotStep2: {
    left: (tabWidth - 30) * 1,
  },
  bottomCarotStep3: {
    left: (tabWidth - 25) * 2,
  },
  bottomCarotStep4: {
    left: (tabWidth - 25) * 3,
  },
  bottomCarotStep5: {
    left: (tabWidth - 22) * 4,
  },
  circle: {
    width: 8,
    height: 8,
    backgroundColor: Color.colorMidnightblue,
    borderRadius: 8,
    marginLeft: 10,
  },
  circleUnselected: {
    backgroundColor: "#D9D9D9",
  },
  circlePaging: {
    width: 100,
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 16,
  },
  walkThroughBottomArea: {
    flexDirection: "row",
    flex: 1,
  },
  walkThroughButtons: {
    justifyContent: "space-between",
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  walkThroughSubButtons: {
    width: 195,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  title: {
    marginBottom: 5,
  },
  titleText: {
    color: Color.sparklightGray1,
    fontSize: FontSize.size_lg,
    fontFamily: FontFamily.openSansSemiBold,
  },
  description: {},
  descriptionText: {
    color: Color.sparklightGray1,
    fontSize: FontSize.size_sm,
    fontFamily: FontFamily.openSansRegular,
    lineHeight: 24,
  },
  decline: {
    fontSize: FontSize.size_sm,
    fontFamily: FontFamily.openSansRegular,
    color: Color.colorMidnightblue,
    textAlign: "center",
  },
  button: {
    backgroundColor: Color.colorMidnightblue,
  },
  buttonDisabled: {
    backgroundColor: Color.colorWhitesmoke_300,
    color: Color.colorGray_200,
  },
  buttonDisabledText: {
    color: Color.sparklightaddGray,
  },
  buttonNext: {
    justifyContent: "flex-end",
    marginLeft: 10,
  },
  buttonPrevious: {
    backgroundColor: Color.colorWhitesmoke_200,
  },
  buttonsLayout: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Border.br_11xs,
    minHeight: 32,
    textAlign: "center",
  },
  container: {
    flex: 1,
    backgroundColor: colors.splash_bg,
    marginBottom: 30,
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
  shadowFullScreen: {
    backgroundColor: "black",
    height: "100%",
    width: "100%",
    position: "absolute",
    top: 0,
    zIndex: 5,
    opacity: 0.7,
  },
  walkThroughBubble: {
    backgroundColor: "white",
    position: "absolute",
    bottom: 90,
    height: 180,
    width: Dimensions.get("window").width - 40,
    left: 20,
    opacity: 1,
    zIndex: 10,
    borderRadius: 10,
    justifyContent: "space-between",
    padding: 20,
  },
  internetHealth: {
    color: colors.darkest_grey,
    fontSize: 22,
    fontFamily: FontFamily.openSansRegular,
    fontStyle: "normal",
    fontWeight: "400",
    width: "100%",
    paddingVertical: 15,
    paddingHorizontal: 25,
  },
  internetStatusSection: {
    backgroundColor: "#EBEEF180",
    borderRadius: 10,
    padding: 10,
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "center",
    marginHorizontal: 25,
  },
  internetStatusTxt: {
    color: colors.darkest_grey,
    fontFamily: FontFamily.openSansRegular,
    textAlign: "center",
    alignSelf: "center",
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: 28,
    paddingHorizontal: 5,
  },
  hideShowDetails: {
    fontFamily: FontFamily.openSansRegular,
    fontSize: 16,
    marginVertical: 5,
    color: colors.sparklight_purple_blue,
    lineHeight: 20,
    fontWeight: "600",
  },
  modemError1: {
    color: "#000",
    fontFamily: FontFamily.textXsSemibold,
    fontSize: 15,
    fontStyle: "normal",
    fontWeight: "700",
    marginLeft: 5,
    marginRight: 5,
  },
  modemError2: {
    color: Color.colorGray_200,
    fontFamily: FontFamily.openSansRegular,
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: "400",
    marginLeft: 20,
    marginTop: 7,
    marginRight: 5,
  },
  updateNow: {
    color: Color.colorMidnightblue,
    fontFamily: FontFamily.openSansRegular,
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: "700",
    marginLeft: 20,
    marginTop: 7,
    marginRight: 5,
  },
  errorBox: {
    flexDirection: "column",
    marginHorizontal: 20,
    marginVertical: 20,
    borderColor: Color.sparklightGray,
    backgroundColor: Color.sparklightWhite,
    borderRadius: Border.br_11xs,
    borderWidth: 1,
    marginBottom: wp("15%"),
    marginTop: wp("-10%"),
  },
});

export default HomeScreen;
