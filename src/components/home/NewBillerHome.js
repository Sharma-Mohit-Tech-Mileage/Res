import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Platform, Dimensions, Linking, } from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import LinearGradient from "react-native-linear-gradient";
import colors from "../../res/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import DownArrow from "../../res/svgIcons/DownArrow";
import UpArrow from "../../res/svgIcons/UpArrow";
import { getUser, storeUpgradeToken } from "../../redux/utils/LocalStorage";
import { GetApiRequest } from "../../network/APIClient";
import moment from "moment";
import { Border, Color, FontFamily, FontSize } from "../../../GlobalStyles";
import CloseIcon from "../../res/svgIcons/CloseIcon";
import YoutubePlayer from "react-native-youtube-iframe";
import AccessibleYoutubePlayer from "../common/AccessibleYoutubePlayer";
import { saveAccountServices } from "../../redux/actions/ProfileActionSuite";
import { useSelector, useDispatch } from "react-redux";
import { updateWalkThroughStep } from "../../redux/actions/DashboardAction";
import { Env } from "../../network/apis/account/Constants";
import { checkForMinorUpdate } from "../utility/constant";
import MyInternetDetialsBiller from "../common/MyInternetDetailsBiller";
import { useFocusEffect } from "@react-navigation/native";
const tabWidth = Number(Dimensions.get("window").width / 4);
const NewBillerHome = ({ navigation }) => {
  const [playing, setPlaying] = useState(false);
  const [isImageDispaly, setIsImageDispaly] = useState(true);
  const user = useSelector((state) => state.combinedReducers.user.userData);
  const home = useSelector((state) => state.combinedReducers.home);
  const profile = useSelector((state) => state.combinedReducers.profile || {});
  const dispatch = useDispatch();
  const [phonePlan, setPhonePlan] = useState([]);
  const [billAmt, setBillAmt] = useState(undefined);
  const [dueDate, setDueDate] = useState("");
  const [pastPaymentDue, setPastPaymentDue] = useState(0.0);
  const [payStatus, setPayStatus] = useState({});
  const [hasOutage, setHasOutage] = useState(false);
  const [isOutageAlert, setIsOutageAlert] = useState(false);
  const [checkModemStatus, setCheckModemStatus] = useState(false);
  const [defaultPaymentDetails, setDefaultPaymentDetails] = useState({ dueDate: null, billAmount: 0, pastPaymentDue: 0, email: null });
  const [estimatedRestoreTime, setEstimatedRestoreTime] = useState("");
  const [walkThroughStep, setWalkThroughStep] = useState(0);
  const [showWalkThrough, setShowWalkThrough] = useState(false);
  const [internetHealths, setInternetHealths] = useState([]);

  const [updateStatus, setUpdateStatus] = useState({
    isMinorUpdateAvailable: false,
    currentVersion: "",
    latestVersion: "",
  });


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


  const getUserAccountDetails = () => {
    setBillAmt(undefined)
    getUser().then((res) => {
      const request = `accountsvc/api/Accounts/GetAccountDetailsByAccountNumber?accountNumber=${res.userInfo.accountNumber}`;
      GetApiRequest(
        request,
        (res) => {
          if (res) {
            dispatch(saveAccountServices(res.services));
            console.log("getUserAccountDetails **************************************************", res);
            let userBillAmt = (res.past_due_amount == 0) ? res.current_balance : res.past_due_amount
            setBillAmt(userBillAmt?.toFixed(2));

            let dueDate = (res.past_due_amount != 0) ? 'Immediately' : moment(res.payment_due_date).format("ll");
            setDueDate(dueDate);

            function getFirstEmail(emailArray) {
              return (emailArray && emailArray.length > 0 && emailArray[0].email_address)
                ? emailArray[0].email_address
                : null;
            }
            let paymentDetails = { ...defaultPaymentDetails };
            paymentDetails.dueDate = res.payment_due_date;
            paymentDetails.billAmount = res.payment_due_amount;
            paymentDetails.pastPaymentDue = res.past_due_amount;
            paymentDetails.email = getFirstEmail(res.email_details);
            setDefaultPaymentDetails(paymentDetails);
            //let billAmnt=(Math.round(res.payment_due_amount * 100) / 100).toFixed(2);
            setBillAmt(res.payment_due_amount.toFixed(2));
          }
        },
        onErrorBill
      );
    });
  };


  const onErrorBill = (error) => {
    console.log("error", error);
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
    }
  }, [internetHealths]);

  useEffect(() => {

    const fetchData = async () => {
      try {
        const result = await getUpgradeToken();
        console.log("getUpgradeTokenResult: ", JSON.stringify(result));
        storeUpgradeToken(result);
      } catch (error) {
        console.error("Error fetching data", error);
      }
      if (home.walkThroughStep !== null && home.walkThroughStep !== undefined) {
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
    }, [])
  );
  const changeWalkThroughStep = (step) => {
    if (step > 2) {
      dispatch(updateWalkThroughStep(null));
      setShowWalkThrough(false);
    } else {
      dispatch(updateWalkThroughStep(step));
      setWalkThroughStep(step);
    }
  };


  const OutageAlert = ({ estimatedTime }) => {
    return (
      <View style={styles.errorBox}>
        <View style={{ flexDirection: "row", width: "90%" }}>
          <View style={{ backgroundColor: "#F88700", width: 4 }} />
          <View style={{ flexDirection: "column", padding: 10 }}>
            <View style={{ flexDirection: "row" }}>
              <Image
                style={{ alignSelf: "center" }}
                resizeMode="contain"
                tintColor={"#F88700"}
                source={require("../../../assets/info-circle.png")}
              />
              <Text style={styles.modemError1}>Outage Alert</Text>
            </View>
            <Text style={styles.modemError2}>
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
            <Text style={styles.modemError2}>
              Enhance your app experience with the latest version.
              <Text
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

      <SafeAreaView style={{ flex: 1 }}>
        <View
          accessibilityElementsHidden={showWalkThrough}
          importantForAccessibility={showWalkThrough ? "no-hide-descendants" : 'no'}
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
          {/* <View>
            <BellIcon />
          </View> */}
        </View>
        <ScrollView style={{ height: "100%", paddingBottom: 100 }}>
          <View
            style={{
              backgroundColor: colors.backgound_blue,
              flex: 2,
              alignItems: "center",
              marginTop: 50,
              paddingBottom: 50
            }}
          >
            {updateStatus.isMinorUpdateAvailable ? <AppUpdateAlert /> : null}
            {isOutageAlert ? (
              <OutageAlert estimatedTime={estimatedRestoreTime} />
            ) : (
              <></>
            )}
            <Text style={[styles.descriptionText, { fontSize: FontSize.size_3xl, fontWeight: '400', zIndex: 100, width: wp("92%"), }]}>Welcome to Sparklight</Text>
            <View style={[styles.card, styles.shadowProp, { marginTop: -40 }]}>
              <View />
              <Text style={[styles.descriptionText, { fontSize: FontSize.size_3xl, fontWeight: '400', marginBottom: 20 }]}></Text>
              <View style={{ flexDirection: 'column' }}>
                <Text style={styles.descriptionText}>
                  We’re excited to connect with you!
                  Sparklight is dedicated to offering our customers a variety of
                  enhanced self-service options including online pay and Auto
                  Pay through the customer portal and MySparklight app.{"\n"}{"\n"}
                  As you navigate, please be aware that select features available to
                  current customers may not be immediately accessible to you. We
                  are working diligently to add new options and features to
                  enhance your Sparklight experience. Thank you for your
                  patience and understanding during this transition period.
                </Text>

                {isImageDispaly ? (
                  <View
                    style={styles.videoContainer} >
                    <AccessibleYoutubePlayer
                      videoId="R8SrD7NFJaA"
                      videoTitle="SparkLight Video"
                      height={230}
                      play={false}
                      onError={(e) => console.log(e)}
                      onPlaybackStateChange={(isPlaying) => console.log('Playing:', isPlaying)}
                    />

                  </View>

                ) : (
                  <></>
                )}

                <TouchableOpacity
                  accessible={true}
                  accessibilityLabel={isImageDispaly ? 'Collapse' : 'Expand'}
                  accessibilityRole="button"
                  onPress={() => {
                    setIsImageDispaly(!isImageDispaly);
                  }}
                  style={{
                    flexDirection: "row",
                    alignSelf: 'center',
                    padding: 5,
                    marginVertical: 5,
                    marginHorizontal: 25,
                  }}
                >
                  <Text style={styles.hideShowDetails}>
                    {isImageDispaly ? 'Collapse' : 'Expand'}
                  </Text>
                  <View style={{ marginTop: 5 }}>
                    {isImageDispaly ? (
                      <View style={{ marginTop: 2, marginLeft: 5 }}>
                        <UpArrow />
                      </View>
                    ) : (
                      <View style={{ marginTop: 7, marginLeft: 5 }}>
                        <DownArrow />
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <ScrollView horizontal={false}>
              <View>
                <MyInternetDetialsBiller
                  plans={payStatus}
                  billAmt={billAmt}
                  dueDate={dueDate}
                  pastPaymentDue={pastPaymentDue}
                  paymentDetails={defaultPaymentDetails}
                  navigation={navigation}
                />
              </View>
            </ScrollView>
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
    color: Color.colorGray_200,
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.openSansRegular,
    lineHeight: 24,
    paddingHorizontal: 24
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
    paddingTop: 20,
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
    marginTop: -20,
    fontFamily: FontFamily.openSansRegular,
    paddingHorizontal: 25,
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: 22 /* 100% */,
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
    fontSize: 14,
    marginVertical: 5,
    color: colors.sparklight_purple_blue,
    lineHeight: 20,
    fontWeight: "400",
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
  }, videoContainer:
  {
    width: wp('80%'),
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: 10
  }
});

export default NewBillerHome;
