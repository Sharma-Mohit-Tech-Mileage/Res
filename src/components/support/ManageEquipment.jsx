import * as React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import ProfileSettingsHeader from "../common/ProfileSettingsHeader";
import {
  FontFamily,
  Padding,
  Color,
  FontSize,
  Border,
} from "../../../GlobalStyles";
import MyServicePlan from "../common/MyServicePlan";
import { ScrollView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { getUser } from "../../redux/utils/LocalStorage";
import {
  GetApiRequest,
  GetModemStatusApiRequest,
} from "../../network/APIClient";
import ModemIcon1 from "../../res/svgIcons/ModemIcon1";
import colors from "../../res/Colors";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import CheckConnection from "../../res/svgIcons/CheckConnection";
import RefreshIcon from "../../res/svgIcons/RefreshIcon";
import PubSub from "pubsub-js";
import WifiIssueIcon from "../../res/svgIcons/WifiIssueIcon";
import IntermittentIssues from "../../res/svgIcons/IntermittentIssues";
import Surfingissue from "../../res/svgIcons/surfingissue";

const ManageEquipment = () => {
  const navigation = useNavigation();
  const [manufacturer, setManufacturer] = React.useState("");
  const [model, setModel] = React.useState("");
  const [transmissionType, setTransmissionType] = React.useState("");
  const [leased, setLeased] = React.useState("");
  const [plans, setPlans] = React.useState([]);
  const [loadingHealth, setLoadingHealth] = React.useState(false);
  const [currentHealth, setCurrentHealth] = React.useState("Optimal");
  const [isOffline, setIsOffline] = React.useState(false);
  const [isContactUs, setIsContactUs] = React.useState(false);

  const getLeasedDetails = () => {
    let re = getUser().then((res) => {
      const request = `mobile/api/Device/GetOwnershipInfo?accountnumber=${res.userInfo.accountNumber}`;
      GetApiRequest(
        request,
        (res) => {
          console.log("getLeasedDetails", res);
          setLeased(res?.modemOwnership ?? "");
        },
        (error) => {
          console.log("getLeasedDetails Error", error);
        }
      );
    });
  };

  const getInternetPlanDetails = () => {
    setLoadingHealth(true);
    let re = getUser().then((res) => {
      const request = `internet/api/internet/${res.userInfo.accountNumber}/plan`;
      GetApiRequest(
        request,
        (response) => {
          console.log("getInternetPlanDetails", response.length);
          setPlans(response);
          if (response.length > 0) {
            let macAddress = response[0].macAddress;
            var mac = macAddress;
            if (res.userInfo.accountNumber === "128387263") {
              mac = "00:1d:d0:d4:f8:02";
            } else if (res.userInfo.accountNumber === "133370775") {
              mac = "60:19:71:d5:10:72";
            } else if (res.userInfo.accountNumber === "133437285") {
              mac = "00:40:36:59:62:d0";
            } else if (res.userInfo.accountNumber === "131684698") {
              mac = "ac:20:2e:6d:82:f1";
            } else if (res.userInfo.accountNumber === "136885142") {
              mac = "00:40:36:59:00:00";
            }

            checkModemDetails(mac);
          }
        },
        (error) => {
          setLoadingHealth(false);
        }
      );
    });
  };

  /**
   * get modem details
   */

  const checkModemDetails = (macAddress) => {
    const request = `api/modem/GetModemInfoAsync?mac=${macAddress}`;
    GetModemStatusApiRequest(
      request,
      (res) => {
        if (res) {
          console.log("checkModemDetails", res);
          if (res.status && res.status === 408) {
            setLoadingHealth(false);
            setCurrentHealth("Poor");
            return;
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
            temt.push(res.OnutP_State);
            temt.push(res.OltrP_State);
            temt.push(res.OnurP_State);
            updateModemStatus(temt);
          }
          setLoadingHealth(false);
        }
      },
      (errorCode) => {
        setLoadingHealth(false);
        console.log("Modem details", errorCode);
        if (errorCode === 404) {
          setIsOffline(true);
          return;
        } else if (
          errorCode === 400 ||
          (errorCode === 500) | (errorCode === 504)
        ) {
          setCurrentHealth("Offline");
          setIsContactUs(true);
        }
      }
    );
  };

  const updateModemStatus = (temt) => {
    const allGreen = temt.every((v) => v === "Green");
    if (!allGreen) {
      const checkYellow = temt.includes("Yellow");
      const checkRed = temt.includes("Red");
      if (checkRed) {
        setCurrentHealth("Offline");
      } else if (checkYellow) {
        setCurrentHealth("Poor");
      } else {
        setCurrentHealth("Offline");
      }
    } else {
      setCurrentHealth("Optimal");
    }
  };

  const getModemDetails = () => {
    let re = getUser().then((res) => {
      const request = `internet/api/internet/${res.userInfo.accountNumber}/modem`;
      GetApiRequest(request, onSuccess, onError);
    });
  };

  const onSuccess = (res) => {
    console.log("getModemDetails", res);
    if (res) {
      setManufacturer(res.manufacturer);
      setModel(res.model);
      setTransmissionType(res.transmissionType);
    }
  };
  const onError = (error) => {
    console.log("error", error);
  };

  React.useEffect(() => {
    getModemDetails();
    getLeasedDetails();
    getInternetPlanDetails();
  }, []);

  React.useEffect(() => {
    console.log("Current Health", currentHealth);
  }, [currentHealth]);

  return (
    <View style={styles.manageEquipment}>
      <ProfileSettingsHeader
        title="Manage Equipment "
        onPressBack={() => navigation.navigate("SupportStack")}
      />
      <ScrollView>
        <View style={styles.myModemParent}>
          <View style={[styles.myModem, styles.myModemSpaceBlock]}>
            <View
              style={[styles.myModemWrapper, styles.frameParentSpaceBlock1]}
            >
              <Text style={[styles.myModem1, styles.myModem1Typo]}>
                My Modem
              </Text>
            </View>
            <View style={styles.frameParentSpaceBlock1}>
              <View style={[styles.frameWrapper, styles.contentSpaceBlock]}>
                <View style={styles.frameContainer}>
                  <View style={styles.docsis31Parent}>
                    <View style={styles.iconBg}>
                      <ModemIcon1 />
                    </View>
                    <View style={styles.motorolaParent}>
                      <Text style={[styles.motorola, styles.myModem1Typo]}>
                        {manufacturer}
                      </Text>
                      <Text style={styles.mb8600Docsis}>
                        {model}
                        {/* {transmissionType} */}
                      </Text>

                      {!loadingHealth ? (
                        <View style={styles.poorHealthParent}>
                          <Text style={[styles.poorHealth, styles.textTypo2]}>
                            {isOffline
                              ? "Offline"
                              : currentHealth === "Poor"
                              ? "Issue Detected"
                              : currentHealth == "Offline"
                              ? "Issue Detected"
                              : "Optimal Health"}
                          </Text>
                          <Image
                            style={styles.frameChild}
                            tintColor={
                              isOffline
                                ? colors.sparklight_red
                                : currentHealth === "Optimal"
                                ? colors.sparklight_green
                                : currentHealth === "Offline"
                                ? colors.sparklight_red
                                : colors.sparklight_yellow
                            }
                            resizeMode="cover"
                            source={require("../../../assets/Ellipse.png")}
                          />
                        </View>
                      ) : (
                        <ActivityIndicator
                          size="small"
                          color={Color.colorGainsboro_200}
                          style={{ width: 40 }}
                        />
                      )}
                      <View style={[styles.badge, styles.parentBorder]}>
                        <Text style={[styles.text, styles.textTypo1]}>
                          {"leased".toLocaleUpperCase()}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>

              {(currentHealth != "Optimal" || isOffline) && !loadingHealth && (
                <View
                  style={[
                    styles.notificationsWrapper,
                    styles.myModemSpaceBlock,
                  ]}
                >
                  <View style={[styles.notifications, styles.parentBorder1,{borderLeftColor: isOffline
                                ? colors.sparklight_red
                                : currentHealth === "Offline"
                                ? colors.sparklight_red
                                : colors.sparklight_yellow }]}>
                    <View style={styles.bannerWarning}>
                      <View style={styles.rightActionableParent}>
                        
                        <View style={styles.creditCardWillExpireSoonParent}>
                          <View style={{flexDirection:'row'}}>
                          <Image
                          style={{ alignSelf: "center", width: 24, height: 24 }}
                          resizeMode="cover"
                          tintColor={isOffline
                            ? colors.sparklight_red
                            : currentHealth === "Optimal"
                            ? colors.sparklight_green
                            : currentHealth === "Offline"
                            ? colors.sparklight_red
                            : colors.sparklight_yellow}
                          source={require("../../../assets/infocircle.png")}
                        />
                          <Text style={[styles.creditCardWill,{marginLeft:5,color:(currentHealth === "Poor")? '#000': Color.sparkLightRed }]}>
                            {isOffline
                              ? "Modem is Offline"
                              : isContactUs
                              ? "Please try again later"
                              : "An issue has been detected"}
                          </Text>
                            </View>
                          <Text
                            style={[
                              styles.yourSavedCard,
                              styles.yourSavedCardSpaceBlock,
                            ]}
                          >
                            {isContactUs
                              ? `Sorry, we're having trouble completing the modem system check right now. This seems to be an issue on our end. Please try again later. If the problem persists, please contact our support team for assistance.`
                              : "Try one of the highlighted options below to resolve"}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              )}
            </View>
            <View
              style={[
                styles.supportAccordionParent,
                styles.supportParentFlexBox,
              ]}
            >
              <View style={[styles.frameLayout]} />
              <TouchableOpacity
                style={[
                  styles.frame9defaultSpaceBlock,
                  {
                    backgroundColor: isContactUs
                      ? "white"
                      : currentHealth === "Offline" ||
                        isOffline ||
                        currentHealth === "Poor"
                      ? "#EF4E3E10"
                      : "white",
                  },
                ]}
                onPress={() => {
                  navigation.navigate("ModemConnectivityGuide", {
                    isSuccess: true,
                  });
                }}
              >
                <CheckConnection />
                <Text style={styles.modemHealthSupport}>Check connection</Text>
                <Image
                  resizeMode="stretch"
                  source={require("../../../assets/chevronright.png")}
                />
              </TouchableOpacity>

              {/* <View style={[styles.frameLayout]} />
                            <View style={[styles.frame9defaultSpaceBlock]} >
                                <Image
                                    resizeMode="stretch"
                                    source={require("../../../assets/key-02.png")}
                                />
                                <Text style={styles.modemHealthSupport}>Update Password</Text>
                                <Image
                                    resizeMode="stretchstretch"
                                    source={require("../../../assets/chevronright.png")}
                                />
                            </View> */}
              <View style={[styles.frameLayout]} />
              {manufacturer != "Calix" && (
                <TouchableOpacity
                  style={[
                    styles.frame9defaultSpaceBlock,
                    {
                      backgroundColor: isContactUs
                        ? "white"
                        : currentHealth === "Offline" ||
                          currentHealth === "Poor"
                        ? "#EF4E3E10"
                        : "white",
                    },
                  ]}
                  onPress={() => {
                    if (!loadingHealth) {
                      navigation.navigate("ModemRebootScreen", {
                        isError:
                          currentHealth != "Optimal" || isOffline
                            ? true
                            : false,
                        isFromT: true,
                      });
                    }
                  }}
                >
                  {/* <Image
                  style={{ width: 20, height: 20, flexShrink: 0 }}
                  resizeMode="contain"
                  source={require("../../../assets/refresh.png")}
                /> */}
                  <RefreshIcon />
                  <Text style={styles.modemHealthSupport}>Reboot Modem</Text>
                  <Image
                    resizeMode="stretch"
                    source={require("../../../assets/chevronright.png")}
                  />
                </TouchableOpacity>
              )}

              <View style={[styles.frameLayout]} />
              <TouchableOpacity
                style={[
                  styles.frame9defaultSpaceBlock,
                  {
                    backgroundColor: isContactUs
                      ? "white"
                      : currentHealth === "Offline"
                      ? "#EF4E3E10"
                      : "white",
                  },
                ]}
                onPress={() => {
                  navigation.navigate("ModemExchange");
                }}
              >
                <Image
                  style={{ width: 20, height: 20, flexShrink: 0 }}
                  resizeMode="contain"
                  source={require("../../../assets/repeat-01.png")}
                />
                <Text style={styles.modemHealthSupport}>Exchange Modem</Text>
                <Image
                  resizeMode="stretch"
                  source={require("../../../assets/chevronright.png")}
                />
              </TouchableOpacity>

              <View style={[styles.frameLayout]} />
              <TouchableOpacity
                style={[
                  styles.frame9defaultSpaceBlock,
                  {
                    backgroundColor:
                      currentHealth === "Offline" || isContactUs
                        ? "#EF4E3E10"
                        : "white",
                  },
                ]}
                onPress={() => {
                  PubSub.publish("event.contactUsEvent", {});
                  setTimeout(
                    () =>
                      navigation.navigate("SupportStack", {
                        isContactUs: true,
                      }),
                    500
                  );
                }}
              >
                <Image
                  style={{ width: 20, height: 20, flexShrink: 0 }}
                  resizeMode="contain"
                  tintColor={Color.sparklightBrightPurple}
                  source={require("../../../assets/phone-outgoing-04.png")}
                />
                <Text style={styles.modemHealthSupport}>Contact Us</Text>
                <Image
                  resizeMode="stretch"
                  source={require("../../../assets/chevronright.png")}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Quick Link section */}

          <View
            style={[
              styles.myModem,
              styles.myModemSpaceBlock,
              { marginTop: 20 },
            ]}
          >
            <View
              style={[styles.myModemWrapper, styles.frameParentSpaceBlock1]}
            >
              <Text style={[styles.myModem1, styles.myModem1Typo]}>
                Quick Links
              </Text>
            </View>
            <View
              style={[
                styles.supportAccordionParent,
                styles.supportParentFlexBox,
              ]}
            >
              <View style={[styles.frameLayout]} />

              <TouchableOpacity
                style={[styles.frame9defaultSpaceBlock]}
                onPress={() => {
                  navigation.navigate("ArticalWindowUtility", {
                    url: "https://support.sparklight.com/hc/en-us/articles/115010184927-What-Can-I-Do-for-WiFi-Issues",
                    name: "Wifi Issues",
                  });
                }}
              >
                <WifiIssueIcon />
                <Text style={styles.modemHealthSupport}>Wifi Issues</Text>
                <Image
                  resizeMode="stretch"
                  source={require("../../../assets/chevronright.png")}
                />
              </TouchableOpacity>

              <View style={[styles.frameLayout]} />
              <TouchableOpacity
                style={[styles.frame9defaultSpaceBlock]}
                onPress={() => {
                  navigation.navigate("ArticalWindowUtility", {
                    url: "https://support.sparklight.com/hc/en-us/sections/115002453808-Surfing-Email",
                    name: "Surfing Issues",
                  });
                }}
              >
                <Surfingissue />
                <Text style={styles.modemHealthSupport}>Surfing Issues</Text>
                <Image
                  resizeMode="stretch"
                  source={require("../../../assets/chevronright.png")}
                />
              </TouchableOpacity>

              <View style={[styles.frameLayout]} />
              <TouchableOpacity
                style={[styles.frame9defaultSpaceBlock]}
                onPress={() => {
                  navigation.navigate("PeriodicProblems");
                }}
              >
                <IntermittentIssues />
                <Text style={styles.modemHealthSupport}>
                  Intermittent Issues
                </Text>
                <Image
                  resizeMode="stretch"
                  source={require("../../../assets/chevronright.png")}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.frameFlexBox]}>
            <MyServicePlan plans={plans} navigation={navigation} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  textTypo2: {
    fontFamily: FontFamily.openSansSemiBold,
    fontWeight: "600",
  },
  myModemSpaceBlock: {
    paddingTop: Padding.p_base,
    alignSelf: "stretch",
  },
  frameParentSpaceBlock1: {
    paddingBottom: Padding.p_5xl,
    alignSelf: "stretch",
  },
  myModem1Typo: {
    color: Color.colorGray_100,
    textAlign: "left",
    fontFamily: FontFamily.openSansRegular,
    lineHeight: 28,
  },
  contentSpaceBlock: {
    paddingVertical: 0,
    alignSelf: "stretch",
  },
  parentBorder: {
    borderWidth: 1,
    borderStyle: "solid",
  },
  parentBorder1: {
    borderWidth: 1,
    borderStyle: "solid",
    borderLeftWidth: 5,
    borderLeftColor: colors.sparklight_yellow,
  },
  textTypo1: {
    fontSize: FontSize.textXsSemibold_size,
    textAlign: "center",
    lineHeight: 18,
  },
  yourSavedCardSpaceBlock: {
    marginTop: 8,
    alignSelf: "stretch",
  },
  supportParentFlexBox: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  frame9defaultSpaceBlock: {
    paddingVertical: Padding.p_base,
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: Padding.p_5xl,
  },
  frameLayout: {
    width: "100%",
    height: 1,
    backgroundColor: Color.sparklightGray,
  },
  frameFlexBox: {
    padding: Padding.p_5xl,
    justifyContent: "center",
    alignItems: "center",
  },
  textTypo: {
    fontFamily: FontFamily.textXsSemibold,
    fontWeight: "600",
  },
  myModem1: {
    textAlign: "left",
    fontSize: FontSize.size_3xl,
    flex: 1,
  },
  myModemWrapper: {
    paddingTop: Padding.p_5xs,
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: Padding.p_5xl,
  },
  motorola: {
    fontSize: FontSize.size_base,
    textAlign: "left",
  },
  mb8600Docsis: {
    color: Color.sparklightDarkGray,
    fontSize: FontSize.textXsSemibold_size,
    textAlign: "left",
    fontFamily: FontFamily.openSansRegular,
    lineHeight: 28,
  },
  poorHealth: {
    color: Color.colorGray_100,
    fontSize: FontSize.textXsSemibold_size,
    textAlign: "left",
    lineHeight: 28,
  },
  frameChild: {
    width: 8,
    height: 8,
    marginLeft: 8,
  },
  poorHealthParent: {
    alignItems: "center",
    flexDirection: "row",
  },
  text: {
    color: Color.colorGray_200,
    fontFamily: FontFamily.openSansSemiBold,
    fontWeight: "600",
  },
  badge: {
    backgroundColor: Color.gray50,
    borderColor: Color.colorWhitesmoke_200,
    paddingHorizontal: Padding.p_5xs,
    paddingVertical: Padding.p_11xs,
    alignSelf: "flex-start",
    alignItems: "center",
    flexDirection: "column",
    borderRadius: Border.br_11xs,
  },
  motorolaParent: {
    marginLeft: 24,
    justifyContent: "center",
    flex: 1,
  },
  docsis31Parent: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    alignSelf: "stretch",
  },
  frameContainer: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
  },
  frameWrapper: {
    paddingHorizontal: Padding.p_base,
    paddingVertical: 0,
  },
  creditCardWill: {
    fontWeight: "700",
    fontFamily: FontFamily.interBold,
    color: Color.sparkLightRed,
    fontSize: FontSize.textXsSemibold_size,
    textAlign: "left",
    alignSelf:'center'
  },
  yourSavedCard: {
    color: Color.colorGray_100,
    fontSize: FontSize.textXsSemibold_size,
    textAlign: "left",
    fontFamily: FontFamily.openSansRegular,
  },
  creditCardWillExpireSoonParent: {
    marginLeft: 10,
    flex: 1,
  },
  rightActionableParent: {
    flexDirection: "row",
    flex: 1,
  },
  bannerWarning: {
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: Color.sparklightWhite,
    alignSelf: "stretch",
    flex: 1,
  },
  notifications: {
    flexDirection: "row",
    borderColor: Color.sparklightGray,
    borderRadius: Border.br_11xs,
    alignSelf: "stretch",
    padding: 5,
  },
  notificationsWrapper: {
    marginTop: 24,
    justifyContent: "center",
    paddingHorizontal: Padding.p_5xl,
  },
  modemHealthSupport: {
    marginLeft: 10,
    color: Color.colorGray_100,
    fontSize: FontSize.size_base,
    textAlign: "left",
    fontFamily: FontFamily.openSansRegular,
    lineHeight: 28,
    flex: 1,
  },
  supportAccordionParent: {
    backgroundColor: Color.sparklightWhite,
    borderRadius: Border.br_11xs,
    alignSelf: "stretch",
    overflow: "hidden",
  },
  myModem: {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: Color.sparklightWhite,
    backgroundColor: Color.sparklightWhite,
    borderRadius: Border.br_11xs,
    overflow: "hidden",
  },
  myModemParent: {
    paddingTop: Padding.p_5xl,
    paddingBottom: Padding.p_base,
    paddingHorizontal: Padding.p_base,
    marginBottom: "15%",
  },
  manageEquipment: {
    width: "100%",
    flex: 1,
    backgroundColor: Color.colorWhitesmoke_200,
  },
  iconBg: {
    backgroundColor: "#F4F4F5",
    padding: 5,
    width: wp("20%"),
    height: wp("20%"),
    borderRadius: 10,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ManageEquipment;
