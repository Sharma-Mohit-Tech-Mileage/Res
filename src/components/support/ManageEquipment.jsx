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
import { GetApiRequest,GetModemStatusApiRequest } from "../../network/APIClient";
import ModemIcon1 from "../../res/svgIcons/ModemIcon1";
import colors from "../../res/Colors";
import NotificationAlert from '../common/customui/NotificationAlert';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
const ManageEquipment = () => {
  const navigation = useNavigation();
  const [manufacturer, setManufacturer] = React.useState("");
  const [model, setModel] = React.useState("");
  const [transmissionType, setTransmissionType] = React.useState("");
  const [leased, setLeased] = React.useState("");
  const [plans, setPlans] = React.useState([]);
  const [loadingHealth, setLoadingHealth] = React.useState(false);
  const [currentHealth, setCurrentHealth] = React.useState("Optimal");
  const healthStatus = {
    Poor: "Issue Detected",
    Offline: "Offline",
  };
  const healthColors = {
    Optimal: colors.sparklight_green,
    Offline: Color.sparklightaddGray,
  };
  const shouldShowAlert = ["Poor", "Offline"].includes(currentHealth);
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
    let re = getUser().then((res) => {
      const request = `internet/api/internet/${res.userInfo.accountNumber}/plan`;
      GetApiRequest(
        request,
        (response) => {
          setPlans(response);
          if (response.length > 0) {
            let macAddress = response[0].macAddress;
            var mac = macAddress;
            if (res.userInfo.accountNumber === "128387263") {
              mac = "0c:f8:93:09:2c:85";
            } else if (res.userInfo.accountNumber === "133370775") {
              mac = "04:bc:9f:17:02:b8";
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
        console.log("checkModemDetails", res);
        if (res) {
          let temt = [];
          if (res.EquipmentType === "DOCSIS") {
            temt.push(res.uTxP_State);
            temt.push(res.uRxL_State);
            temt.push(res.uSNR_State);
            temt.push(res.dSNR_State);
            temt.push(res.dRxL_State);
            updateModemStatus(temt);
          }else if(res.EquipmentType === "ONU"){
            temt.push(res.OnutP_State);
            temt.push(res.OltrP_State);
            temt.push(res.OnurP_State);
            updateModemStatus(temt)
          }
          setLoadingHealth(true);
        }
      },
      (error) => {
        console.log("Modem details", error);
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
      }else{
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

  const GreenCircle = () => {
    return <View style={styles.greenTick}></View>;
  };

  const RedCircle = () => {
    return <View style={styles.redTick}></View>;
  };
  const OrangeCircle = () => {
    return <View style={styles.orangeTick}></View>;
  };

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
                      </Text>
                      {/* {loadingHealth ? <View style={styles.poorHealthParent}>
                        <Text style={[styles.poorHealth, styles.textTypo2]}>
                          {healthStatus[currentHealth] || "Good Health"}
                        </Text>
                        <Image
                          style={styles.frameChild}
                          tintColor={healthColors[currentHealth] || colors.sparklight_yellow}
                          resizeMode="cover"
                          source={require("../../../assets/Ellipse.png")}
                        />
                      </View> : (
                        <ActivityIndicator
                          size="small"
                          color="#8D3B90"
                          style={{ width: 40 }}
                        />
                      )} */}
                      <View style={[styles.badge, styles.parentBorder]}>
                        <Text style={[styles.text, styles.textTypo1]}>
                          {"leased".toLocaleUpperCase()}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            {shouldShowAlert && (
              <View style={{ paddingHorizontal: Padding.p_base, paddingBottom: Padding.p_5xl }}>
                <NotificationAlert
                  type="error"
                  title="An issue has been detected"
                  message="Try one of the options below to resolve."
                  showCloseIcon={false}
                  onClose={() => setShowErrorAlert(false)}
                />
              </View>
            )}
            <View
              style={[styles.supportAccordionParent, styles.supportParentFlexBox,]}>
              <View style={[styles.frameLayout]} />
              <TouchableOpacity
                style={[styles.frame9defaultSpaceBlock]}
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
                style={[styles.frame9defaultSpaceBlock]}
                onPress={() => {
                  navigation.navigate("ModemRebootScreen");
                }}
              >
                <Image
                  style={{ width: 20, height: 20, flexShrink: 0 }}
                  resizeMode="contain"
                  source={require("../../../assets/refresh.png")}
                />
                <Text style={styles.modemHealthSupport}>Reboot Modem</Text>
                <Image
                  resizeMode="stretch"
                  source={require("../../../assets/chevronright.png")}
                />
              </TouchableOpacity>
              <View style={[styles.frameLayout]} />
              {/*<TouchableOpacity
                style={[styles.frame9defaultSpaceBlock]}
                onPress={() => {
                  navigation.navigate("ModemConnectivityGuide");
                }}
              >
                <Image
                  style={{ width: 20, height: 20, flexShrink: 0 }}
                  resizeMode="contain"
                  source={require("../../../assets/tool-02.png")}
                />
                <Text style={styles.modemHealthSupport}>Check Connection</Text>
                <Image
                  resizeMode="stretch"
                  source={require("../../../assets/chevronright.png")}
                />
              </TouchableOpacity>*/}
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
  textTypo1: {
    fontSize: FontSize.textXsSemibold_size,
    textAlign: "center",
    lineHeight: 18,
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

