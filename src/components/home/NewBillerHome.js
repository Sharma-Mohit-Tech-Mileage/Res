import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
  Dimensions,
  Linking,
} from "react-native";
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

import { saveAccountServices } from "../../redux/actions/ProfileActionSuite";
import { useDispatch } from "react-redux";
import { Env } from "../../network/apis/account/Constants";
import { checkForMinorUpdate } from "../utility/constant";
import MyInternetDetialsBiller from "../common/MyInternetDetailsBiller";

const tabWidth = Number(Dimensions.get("window").width / 4);

const NewBillerHome = ({ navigation }) => {
  const [isImageDispaly, setIsImageDispaly] = useState(true);
  const dispatch = useDispatch();
  const [billAmt, setBillAmt] = useState(0);
  const [dueDate, setDueDate] = useState("");
  const [payStatus, setPayStatus] = useState({});
  const [updateStatus, setUpdateStatus] = useState({
    isMinorUpdateAvailable: false,
    currentVersion: "",
    latestVersion: "",
  });

  const getEasyPlanStatus = () => {
    getUser().then((res) => {
      const request = `AccountSvc/api/Accounts/${res.userInfo.accountNumber}/easypay`;
      GetApiRequest(
        request,
        (res) => {
          if (res) {
            console.log("getEasyPlanStatus", res);
            setPayStatus(res);
          }
        },
        (error) => {
          console.log("getEasyPlanStatus error", error);
        }
      );
    });
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

  const getUserAccountDetails = () => {
    getUser().then((res) => {
      const request = `AccountSvc/api/Accounts/GetAccountDetailsByAccountNumber?accountNumber=${res.userInfo.accountNumber}`;
      GetApiRequest(
        request,
        (res) => {
          console.log("getUserAccountDetails", res);
          if (res) {
            dispatch(saveAccountServices(res.services));

            let dueDate = moment(res.payment_due_date).format("ll");
            setDueDate(dueDate);
            let billAmnt = (
              Math.round(res.payment_due_amount * 100) / 100
            ).toFixed(2);
            setBillAmt(billAmnt);
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
    getEasyPlanStatus();
  }, []);

  useEffect(() => {
    //checkModemOutagStatus();
    getUserAccountDetails();

    const fetchData = async () => {
      try {
        const result = await getUpgradeToken();
        console.log("getUpgradeTokenResult: ", JSON.stringify(result));
        storeUpgradeToken(result);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, []);

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
              paddingBottom: 50,
            }}
          >
            {updateStatus.isMinorUpdateAvailable ? <AppUpdateAlert /> : null}

            <View style={[styles.card, styles.shadowProp, { marginTop: -40 }]}>
              <View
              //style={{ backgroundColor: "#F4F4F5", height: 1, marginTop: 10 }}
              />
              <Text
                style={[
                  styles.descriptionText,
                  {
                    fontSize: FontSize.size_3xl,
                    fontWeight: "400",
                    marginBottom: 20,
                  },
                ]}
              >
                Welcome to Sparklight
              </Text>
              <View style={{ flexDirection: "column" }}>
                <Text style={styles.descriptionText}>
                  We’re excited to connect with you! Sparklight is dedicated to
                  offering our customers a variety of enhanced self-service
                  options including online pay and Auto Pay through the customer
                  portal and MySparklight app.{"\n"}
                  {"\n"}
                  As you navigate, please be aware that select features
                  available to current customers may not be immediately
                  accessible to you. We are working diligently to add new
                  options and features to enhance your Sparklight experience.
                  Thank you for your patience and understanding during this
                  transition period.
                </Text>

                {isImageDispaly ? (
                  <Image
                    style={{
                      width: wp("80%"),
                      borderRadius: 5,
                      alignSelf: "center",
                      marginTop: 10,
                    }}
                    source={require("../../../assets/newbiller.png")}
                  />
                ) : (
                  <></>
                )}

                <TouchableOpacity
                  accessible={true}
                  accessibilityLabel={isImageDispaly ? "Collapse" : "Expand"}
                  accessibilityRole="button"
                  onPress={() => {
                    setIsImageDispaly(!isImageDispaly);
                  }}
                  style={{
                    flexDirection: "row",
                    alignSelf: "center",
                    padding: 5,
                    marginVertical: 5,
                    marginHorizontal: 25,
                  }}
                >
                  <Text style={styles.hideShowDetails}>
                    {isImageDispaly ? "Collapse" : "Expand"}
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
            <View>
              <MyInternetDetialsBiller
                plans={payStatus}
                billAmt={billAmt}
                dueDate={dueDate}
                navigation={navigation}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
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

  description: {},
  descriptionText: {
    color: Color.colorGray_200,
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.openSansRegular,
    lineHeight: 24,
    paddingHorizontal: 24,
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
  },
});

export default NewBillerHome;
