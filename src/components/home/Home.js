import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Platform, Dimensions, Pressable, ActivityIndicator, Linking, AccessibilityInfo } from "react-native";
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
import MyServicePlan from "../common/MyServicePlan";
import MyDataUsage from "../common/MyDataUsage";
import { getUser, getPushNotificationStatus, storePushNotificationStatus, storeUpgradeToken, } from "../../redux/utils/LocalStorage";
import { GetApiRequest, GetModemStatusApiRequest, } from "../../network/APIClient";
import moment from "moment";
import { Border, Color, FontFamily, FontSize } from "../../../GlobalStyles";
import CloseIcon from "../../res/svgIcons/CloseIcon";
import { getFcmToken, requestUserPermission, } from "../../firebase/FirebaseUtils";
import { updatePushNotifications, fetchPushNotifications, saveAccountServices } from "../../redux/actions/ProfileActionSuite";
import { useSelector, useDispatch } from "react-redux";
import { updateWalkThroughStep } from "../../redux/actions/DashboardAction";
import { Env } from "../../network/apis/account/Constants";
import { checkForMinorUpdate } from "../utility/constant";

const tabWidth = Number(Dimensions.get("window").width / 4);

const HomeScreen = ({ navigation }) => {
  const [isInternetDetails, setIsInternetDetails] = useState(false);
  const user = useSelector((state) => state.combinedReducers.user.userData);
  const home = useSelector((state) => state.combinedReducers.home);
  const profile = useSelector((state) => state.combinedReducers.profile || {});
  const dispatch = useDispatch();
  const [plans, setPlans] = useState([]);
  const [tvPlan, setTVPlan] = useState('');
  const [phonePlan, setPhonePlan] = useState([]);
  const [billAmt, setBillAmt] = useState(0);
  const [dueDate, setDueDate] = useState("");
  const [currentHealth, setCurrentHealth] = useState("Optimal");
  const [billPaid, setBillPaid] = useState(false);
  const [accountStatus, setAccountStatus] = useState("Active");
  const [hasOutage, setHasOutage] = useState(false);
  const [isOutageAlert, setIsOutageAlert] = useState(false);
  const [checkModemStatus, setCheckModemStatus] = useState(false);
  const [estimatedRestoreTime, setEstimatedRestoreTime] = useState("");
  const [walkThroughStep, setWalkThroughStep] = useState(0);
  const [showWalkThrough, setShowWalkThrough] = useState(false);
  const [internetHealths, setInternetHealths] = useState([]);
  const [updateStatus, setUpdateStatus] = useState({ isMinorUpdateAvailable: false, currentVersion: '', latestVersion: '' });
  const [screenReaderEnabled, setIsScreenReaderEnabled] = useState(false);

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
  }
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
    setTVPlan(res || '');
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
        } else if (user.userInfo.accountNumber === "133370775") {
          mac = "00:40:36:5f:cc:7f";
        } else if (user.userInfo.accountNumber === "133437285") {
          mac = "6c:cd:d6:6c:d0:1c";
        } else if (user.userInfo.accountNumber === "131684698") {
          mac = "28:7a:ee:97:4d:cc";
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
    const request = `api/modem/GetModemInfoAsync?mac=${macAddress}`;
    GetModemStatusApiRequest(
      request,
      (res) => {
        console.log("checkModemDetails", res);
        if (res) {
          if (res?.status) {
            if (res.status === 408) {
              setInternetHealths((oldArray) => [...oldArray, "Yellow"]);
              return;
            }
          }

          let temt = [];
          if (res.EquipmentType === "DOCSIS") {
            temt.push(res.UTxP_State);
            temt.push(res.URxL_State);
            temt.push(res.USNR_State);
            temt.push(res.DSNR_State);
            temt.push(res.DRxL_State);
            updateModemStatus(temt);
          } else if (res.EquipmentType === "ONU") {
            temt.push(res.ONUTP_State);
            temt.push(res.OLTRP_State);
            temt.push(res.ONURP_State);
            updateModemStatus(temt);
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
    getUser().then((res) => {
      const request = `account/api/account/${res.userInfo.accountNumber}`;
      GetApiRequest(
        request,
        (res) => {
          //console.log("getUserAccountDetails", res);
          if (res) {
            dispatch(saveAccountServices(res.services))
            if (res.currentCollectionStep == "Soft Disconnect") {
              setAccountStatus("Disconnect");
              setIsInternetDetails(true);
              setInternetHealths((oldArray) => [...oldArray, "Red"]);
            } else {
              updateInternetHealth(res.currentBalance, res.paymentDueDate);
            }
            let dueDate = moment(res.paymentDueDate).format("ll");
            setDueDate(dueDate);
            setBillAmt((Math.round(res.currentBalance * 100) / 100).toFixed(2));
            getTVServiceDetails();
            getInternetPlanDetails();
            getPhoneServiceDetails();
          }
        },
        onErrorBill
      );
    });
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
            case 'appointment':
              optOut = messageType.optOutFlag;
              break;
            case 'outage':
              outageOptOut = messageType.optOutFlag;
              break;
            case 'billing':
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
          console.log('FCM HOME WITH PERMISSION', token)
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
            status: 'accepted',
            date: new Date()
          };
          storePushNotificationStatus(localData);
          await dispatch(updatePushNotifications(data, null));
        } else {
          const token = await getFcmToken();
          console.log('FCM HOME WITHOUT PERMISSION', token)
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
            status: 'skip',
            date: new Date(),
            permanentSkip: true
          };
          await dispatch(updatePushNotifications(data, null));
          storePushNotificationStatus(localData);
        }
      }
    }
  };

  useEffect(() => {
    const fetchUpdateStatus = async () => {
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
    getUserAccountDetails();

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

  const changeWalkThroughStep = (step) => {
    if (step > 2) {
      dispatch(updateWalkThroughStep(null));
      setShowWalkThrough(false);
    } else {
      dispatch(updateWalkThroughStep(step));
      setWalkThroughStep(step);
    }
  };


  const walkthroughModal = () => {
    const walkThroughScreens = [
      {
        title: "Home",
        description:
          "View information related to your internet health, billing, service and more.",
        buttonText: "Next",
      },
      {
        title: "Support",
        description:
          "View our FAQ, check in on your modem or troubleshoot your issues.",
        buttonText: "Next",
      },
      {
        title: "Account",
        description:
          "Manage your profile settings, notifications, users and more.",
        buttonText: "Let's Go!",
      },
    ];

    const walkThrough = walkThroughScreens[walkThroughStep];
    const bottomCarotStyles = [styles.bottomCarot];

    if (walkThroughStep === 1) {
      bottomCarotStyles.push(styles.bottomCarotStep2);
    } else if (walkThroughStep === 2) {
      bottomCarotStyles.push(styles.bottomCarotStep3);
    }

    return (
      <>
        <View 
                accessibilityElementsHidden={!showWalkThrough}
                importantForAccessibility={showWalkThrough ? "yes" : "no-hide-descendants"}
        style={styles.walkThroughBubble} >
          <View >
            <View 
             accessible={true} 
             accessibilityLabel={walkThrough.title}     
            style={styles.title}>
              <Text style={styles.titleText}>{walkThrough.title}</Text>
            </View>
            <View 
             accessible={true} 
             accessibilityLabel={walkThrough.description}
            style={styles.description}>
              <Text style={styles.descriptionText}>
                {walkThrough.description}
              </Text>
            </View>
          </View>
          <View style={styles.walkThroughBottomArea} >
            <View style={styles.circlePaging}>
              <View style={styles.circle}></View>
              <View
                style={
                  walkThroughStep < 1
                    ? [styles.circle, styles.circleUnselected]
                    : styles.circle
                }
              ></View>
              <View
                style={
                  walkThroughStep < 2
                    ? [styles.circle, styles.circleUnselected]
                    : styles.circle
                }
              ></View>
            </View>
            <View style={styles.walkThroughButtons}>
              <View style={styles.walkThroughSubButtons}>
                {walkThroughStep > 0 && (
                  <Pressable
                    style={[styles.button, styles.buttonsLayout, styles.buttonPrevious,]}
                    onPress={() => changeWalkThroughStep(walkThroughStep - 1)}
                    accessibilityLabel="Previous Step"
                    accessibilityRole="button"
                  >
                    <Text style={styles.decline}>Previous</Text>
                  </Pressable>
                )}
                <Pressable
                  style={[styles.button, styles.buttonsLayout, styles.buttonNext,]}
                  onPress={() => changeWalkThroughStep(walkThroughStep + 1)}
                  accessibilityLabel={walkThroughStep < walkThroughScreens.length - 1 ? "Next Step" : "Finish Walkthrough"}
                  accessibilityRole="button"
                >
                  <Text style={styles.accept}>{walkThrough.buttonText}</Text>
                </Pressable>
              </View>
            </View>
          </View>
          <View>
            <Image
              style={bottomCarotStyles}
              tintColor={"#FFF"}
              source={require("../../../assets/polygon.png")}
            />
          </View>
        </View>
      </>
    );
  };


  const OutageAlert = ({ estimatedTime }) => {
    return (
      <View 
      accessibilityElementsHidden={showWalkThrough}
      importantForAccessibility= {showWalkThrough ? "no-hide-descendants" : 'no'}
      style={styles.errorBox}>
        <View 
         accessibilityElementsHidden={showWalkThrough}
         importantForAccessibility= {showWalkThrough ? "no-hide-descendants" : 'no'}
        style={{ flexDirection: "row", width: "90%" }}>
          <View style={{ backgroundColor: "#F88700", width: 4 }} />
          <View style={{ flexDirection: "column", padding: 10 }}>
            <View 
             accessibilityElementsHidden={showWalkThrough}
             importantForAccessibility= {showWalkThrough ? "no-hide-descendants" : 'no'}
            style={{ flexDirection: "row" }}>
              <Image
                style={{ alignSelf: "center" }}
                resizeMode="contain"
                tintColor={"#F88700"}
                source={require("../../../assets/info-circle.png")}
              />
              <Text style={styles.modemError1}>Outage Alert</Text>
            </View>
            <Text 
             accessibilityElementsHidden={showWalkThrough}
             importantForAccessibility= {showWalkThrough ? "no-hide-descendants" : 'no'}
            style={styles.modemError2}>
              Our systems show that you may be experiencing an outage related to
              your Internet service. We are working to restore service as soon
              as possible.
              <Text style={[styles.modemError2, { fontWeight: "700" }]}>
                Estimated Time to Restore: {estimatedTime}
              </Text>
            </Text>
          </View>

          <TouchableOpacity
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
            importantForAccessibility= {showWalkThrough ? "no-hide-descendants" : 'no'}
            style={styles.modemError2}>
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
                currentVersion: '',
                latestVersion: ''
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
      {showWalkThrough && walkthroughModal()}

      <SafeAreaView 
      accessibilityElementsHidden={showWalkThrough}
      importantForAccessibility= {showWalkThrough ? "no-hide-descendants" : 'no'}
      style={{ flex: 1 }}>
        <View
         accessibilityElementsHidden={showWalkThrough}
         importantForAccessibility= {showWalkThrough ? "no-hide-descendants" : 'no'}
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
        </View>
        <ScrollView style={{ height: "100%", paddingBottom: 100 }}>
          <View
            style={{
              backgroundColor: colors.backgound_blue,
              flex: 2,
              alignItems: "center",
              marginTop: 50,
            }}
          >
            {updateStatus.isMinorUpdateAvailable ? <AppUpdateAlert /> : null}
            {isOutageAlert ? (
              <OutageAlert estimatedTime={estimatedRestoreTime} />
            ) : (
              <></>
            )}
            <View style={[styles.card, styles.shadowProp, { marginTop: screenReaderEnabled ? 0 : -40 }]}>

              <Text
                accessible={true}
                accessibilityLabel={`Service Health`}
                style={styles.internetHealth}>Service Health</Text>

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
                accessibilityLabel={currentHealth != "Optimal"
                ? strings.internetStatusIssue
                : strings.internetStatus}
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
                accessabilityLabel={isInternetDetails ? strings.collapseTxt : strings.expandTxt}
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
              <MyInternetDetials plans={plans} billAmt={billAmt} dueDate={dueDate} navigation={navigation}/>
          
            <MyServicePlan plans={plans} tvPlan={tvPlan} phonePlan={phonePlan} navigation={navigation} />
            <MyDataUsage plans={plans} tvPlan={tvPlan} phonePlan={phonePlan} navigation={navigation} />
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
    left: tabWidth * 2,
  },
  bottomCarotStep3: {
    left: tabWidth * 3,
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
    width: '100%',
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
