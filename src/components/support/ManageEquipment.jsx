import * as React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, ScrollView, } from "react-native";
import ProfileSettingsHeader from "../common/ProfileSettingsHeader";
import { FontFamily, Padding, Color, FontSize, Border, } from "../../../GlobalStyles";
import MyServicePlan from "../common/MyServicePlan";
import { useNavigation } from "@react-navigation/native";
import { getUser } from "../../redux/utils/LocalStorage";
import {
  GetApiRequest,
  GetEuroApiRequest,
  GetModemStatusApiRequest,
  PostruckRollApi,
} from "../../network/APIClient";
import ModemIcon1 from "../../res/svgIcons/ModemIcon1";
import colors from "../../res/Colors";
import { widthPercentageToDP as wp, heightPercentageToDP as hp, } from "react-native-responsive-screen";
import CheckConnection from "../../res/svgIcons/CheckConnection";
import RefreshIcon from "../../res/svgIcons/RefreshIcon";
import PubSub from "pubsub-js";
import WifiIssueIcon from "../../res/svgIcons/WifiIssueIcon";
import IntermittentIssues from "../../res/svgIcons/IntermittentIssues";
import PasswordKey from "../../res/svgIcons/passwordKey";
import Surfingissue from "../../res/svgIcons/surfingissue";
import PasswordRetrieve from "../../res/svgIcons/PasswordRetrieve";
import PasswordShare from "../../res/svgIcons/PasswordShare";
import Loader from "../utility/Loader";
import { useSelector } from "react-redux";

const ManageEquipment = ({ route }) => {
  const navigation = useNavigation();
  const user = useSelector((state) => state.combinedReducers.user.userData);
  const [manufacturer, setManufacturer] = React.useState("");
  const [macAddress, setMacAddress] = React.useState("");
  const [model, setModel] = React.useState("");
  const [transmissionType, setTransmissionType] = React.useState("");
  const [leased, setLeased] = React.useState("");
  const [plans, setPlans] = React.useState([]);
  const [loadingHealth, setLoadingHealth] = React.useState(false);
  const [currentHealth, setCurrentHealth] = React.useState("Optimal");
  const [isOffline, setIsOffline] = React.useState(false);
  const [isContactUs, setIsContactUs] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [isEEroDevice, setIsEEroDevice] = React.useState(false);
  const [eeroDeviceData, setEEroDeviceData] = React.useState(null);
  const [wifiPasswordCanChange, setwifiPasswordCanChange] = React.useState(false);
  const [wifiData, setwifiData] = React.useState([]);
  const [truckrollPrediction, setTruckrollPrediction] = React.useState(-1);
  const [hasEeroDevice, setHasEeroDevice] = React.useState(false);
  const [networkId, setNetworkId] = React.useState(null);
  const [modemSupported, setModemSupported] = React.useState(false);
  // Step 1: Check if user has Eero device
  const checkDeviceSupport = () => {
    setLoading(true);
    const accountNumber = user?.userInfo?.accountNumber;
    const requestUrl = `mobile/api/Modem/GetCombinedModems?accountNumber=${accountNumber}`;
    GetApiRequest(
      requestUrl,
      (response) => {
        const { erosSupported, modemSupported } = response;
        setIsEEroDevice(erosSupported);
        setModemSupported(modemSupported);
        if (erosSupported) {
          fetchNetworkId();
          getEuroAccountDetails();
        } else if(modemSupported) {
          getModemPassword();
          getWifiPassword();
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error checking device support:", error);
        setLoading(false);
      }
    );
  };

  const getModemPassword = () => {
    setLoading(true);
    let re = getUser().then((res) => {
      const request = `internet/api/internet/${res.userInfo.accountNumber}/modemmobile`;
      GetApiRequest(request, onSuccessModemPassword, onErrorModemPassword);
    });
  };

  const fetchNetworkId = async () => {
    try {
      const user = await getUser();
      const accountNumber = user?.userInfo?.accountNumber;
      const request = `/mobile/api/Eero/GetEeroAccountDetails?accountnumber=${accountNumber}`;
      GetApiRequest(
        request,
        (response) => {
          const networks = response?.data?.networks;
          if (networks && networks.length > 0) {
            const networkId = networks[0].split('/').pop();
            setHasEeroDevice(!!networkId);
            setNetworkId(networkId || null);
          } else {
            setHasEeroDevice(false);
          }
        },
        (error) => {
          setHasEeroDevice(false);
        }
      );
    } catch (error) {
      setHasEeroDevice(false);
    }
  };

  const getEuroAccountDetails = () => {
    setLoading(true);
    const request = `/mobile/api/Eero/GetEeroAccountDetails?accountnumber=${user?.userInfo?.accountNumber}`;
    GetApiRequest(
      request,
      (res) => {
        setLoading(false);
        if (res?.data !== null) {
          setEEroDeviceData(res.data)
          setwifiPasswordCanChange(false);
        } else {
          getModemPassword();
        }
      },
      (error) => {
        setLoading(false);
        console.log(`getEuroAccountDetails==error`, error);
      }
    );
  };

  const onSuccessModemPassword = (res) => {
    setLoading(false);
    if (res) {
      setwifiPasswordCanChange(true)
    }
    else {
      setwifiPasswordCanChange(false)
    }
  };
  const onErrorModemPassword = (error) => {
    setLoading(false);
    console.log("error", error);
    setwifiPasswordCanChange(false);
  };

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
          console.log("getInternetPlanDetails", JSON.stringify(response));
          setPlans(response);
          if (response.length > 0) {
            let macAddress = response[0].macAddress;
            var mac = macAddress;
            if (res.userInfo.accountNumber === "128387263") {
              mac = "bc:3e:07:38:56:d0";
            } else if (user.userInfo.accountNumber === "902880244") {
              mac = "bc:3e:07:38:56:d0";
            } else if (user.userInfo.accountNumber === "902880236") {
              mac = "28:7a:ee:8e:cf:8c";
            } else if (user.userInfo.accountNumber === "902880079") {
              mac = "00:40:36:5f:cc:7f";
            } else if (res.userInfo.accountNumber === "136885142") {
              mac = "20:73:55:89:c7:00";
            }

            checkModemDetails(mac);
            setMacAddress(mac)
          }
        },
        (error) => {
          setLoadingHealth(false);
        }
      );
    });
  };

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
            temt.push(res.ONUTP_State);
            temt.push(res.OLTRP_State);
            temt.push(res.ONURP_State);
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
        } else if (
          errorCode === 400 ||
          (errorCode === 500) | (errorCode === 504)
        ) {
          setCurrentHealth("Poor");
          setIsContactUs(true);
        } else {
          setCurrentHealth("Offline");
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
    checkDeviceSupport();
    getModemDetails();
    getLeasedDetails();
    getInternetPlanDetails();
  }, []);

  React.useEffect(() => {
    if (currentHealth == 'Poor') {
      getTruckRollPostApiRequets(macAddress.replaceAll(':', ''), user?.userInfo?.accountNumber)
    }
  }, [currentHealth]);

  const getWifiPassword = () => {
    const request = `/internet/api/internet/${user?.userInfo?.accountNumber}/modem/security/Get`;
    GetApiRequest(
      request,
      (res) => {
        console.log(res);
        if (res) {
          setwifiData(res);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  };


  const getTruckRollPostApiRequets = (macAddress, accountNumber) => {
    setLoadingHealth(true);
    let request = {
      dataframe_split: {
        columns: ["accountnumber", "mac"],
        data: [[accountNumber, macAddress]],
      },
    };
    PostruckRollApi(
      "model/lgb_model_fs/Staging/invocations",
      request,
      (res) => {
        if (res) {
          console.log('isLoading', res.predictions[0])

          if (res.predictions.length > 0 && res.predictions[0] == 1) {
            console.log('getTruckRollPostApiRequets', JSON.stringify(res))
            setTruckrollPrediction(res.predictions[0]);
          }
        }
        setLoadingHealth(false);
      },
      (error) => {
        setLoadingHealth(false);
        console.log("TruckRollApi Error", JSON.stringify(error));
      }
    );
  };

  const renderOtherDeviceOptions = () => {
    return (
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
            navigation.navigate("UpdateModemPassword");
          }}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Update your WiFi password"
        >
          <PasswordKey />
          <Text style={styles.modemHealthSupport}>Update Password</Text>
          <Image
            style={styles.rightIconStyle}
            source={require("../../../assets/chevronright.png")}
          />
        </TouchableOpacity>

        <View style={[styles.frameLayout]} />
        <TouchableOpacity
          style={[styles.frame9defaultSpaceBlock]}
          onPress={() => {
            navigation.navigate("RetrieveModemPassword");
          }}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Retrieve your WiFi password"
        >
          <PasswordRetrieve />
          <Text style={styles.modemHealthSupport}>
            Retrieve Password
          </Text>
          <Image
            style={styles.rightIconStyle}
            source={require("../../../assets/chevronright.png")}
          />
        </TouchableOpacity>

        <View style={[styles.frameLayout]} />
        <TouchableOpacity
          style={[styles.frame9defaultSpaceBlock]}
          onPress={() => {
            navigation.navigate("ShareWifiScreen", {
              wifiData: wifiData,
            });
          }}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Share your WiFi password"
        >
          <PasswordShare />
          <Text style={styles.modemHealthSupport}>Share Password</Text>
          <Image
            style={styles.rightIconStyle}
            source={require("../../../assets/chevronright.png")}
          />
        </TouchableOpacity>
      </View>
    )
  }

  const renderEEroDeviceOptions = () => {
    return (
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
            navigation.navigate("UpdateModemPassword", { isEEroDevice: true, eeroDeviceData: eeroDeviceData });
          }}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Update your eero device password"
        >
          <PasswordKey />
          <Text style={styles.modemHealthSupport}>Update Password</Text>
          <Image
            style={styles.rightIconStyle}
            source={require("../../../assets/chevronright.png")}
          />
        </TouchableOpacity>

        <View style={[styles.frameLayout]} />
        <TouchableOpacity
          style={[styles.frame9defaultSpaceBlock]}
          onPress={() => {
            navigation.navigate("EEroFeatures");
          }}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Open the eero app for more features"
        >
          <PasswordRetrieve />
          <Text style={styles.modemHealthSupport}>
            Open eero App
          </Text>
          <Image
            style={styles.rightIconStyle}
            source={require("../../../assets/chevronright.png")}
          />
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.manageEquipment}>
      <ProfileSettingsHeader
        title="Manage Equipment "
        onPressBack={() => {
          navigation.navigate("support");
        }}
      />
      <ScrollView automaticallyAdjustContentInsets={false}>
        <View style={styles.myModemParent}>
          <View style={[styles.myModem, styles.myModemSpaceBlock]}>
            <View style={[styles.myModemWrapper, styles.frameParentSpaceBlock1]}>
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
                      <Text style={styles.mb8600Docsis}>{model}</Text>

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
                      {leased.length > 0 && (
                        <View style={[styles.badge, styles.parentBorder]}>
                          <Text style={[styles.text, styles.textTypo1]}>
                            {leased.toLocaleUpperCase()}
                          </Text>
                        </View>
                      )}
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
                  <View style={[styles.notifications, styles.parentBorder1]}>
                    <View
                      style={{
                        backgroundColor: isOffline
                          ? colors.sparklight_red
                          : currentHealth === "Offline"
                            ? colors.sparklight_red
                            : colors.sparklight_yellow,
                        width: 4,
                      }}
                    />
                    <View style={styles.bannerWarning}>
                      <View style={styles.rightActionableParent}>
                        <View style={styles.creditCardWillExpireSoonParent}>
                          <View style={{ flexDirection: "row" }}>
                            <Image
                              style={{
                                alignSelf: "center",
                                width: 24,
                                height: 24,
                              }}
                              resizeMode="cover"
                              tintColor={
                                isOffline
                                  ? colors.sparklight_red
                                  : currentHealth === "Optimal"
                                    ? colors.sparklight_green
                                    : currentHealth === "Offline"
                                      ? colors.sparklight_red
                                      : colors.sparklight_yellow
                              }
                              source={require("../../../assets/infocircle.png")}
                            />
                            <Text
                              style={[
                                styles.creditCardWill,
                                {
                                  marginLeft: 5,
                                  color:
                                    currentHealth === "Poor"
                                      ? "#000"
                                      : Color.sparkLightRed,
                                },
                              ]}
                            >
                              {truckrollPrediction === 1
                                ? 'Schedule a Service Appointment'
                                : isOffline
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
                            {truckrollPrediction === 1
                              ? "We've noticed that your modem has been experiencing repeated issues, which may be affecting your internet service quality. We recommend you contact us to schedule a service appointment."
                              : isContactUs
                                ? "Sorry, we're having trouble completing the modem system check right now. This seems to be an issue on our end. Please try again later. If the problem persists, please contact our support team for assistance."
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
                    backgroundColor:
                      isContactUs || truckrollPrediction == 1 || loadingHealth
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
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Check your modem connection"
              >
                <CheckConnection />
                <Text style={styles.modemHealthSupport}>Check Connection</Text>
                <Image
                  style={styles.rightIconStyle}
                  source={require("../../../assets/chevronright.png")}
                />
              </TouchableOpacity>
              <View style={[styles.frameLayout]} />
              {manufacturer != "Calix" && (
                <TouchableOpacity
                  style={[
                    styles.frame9defaultSpaceBlock,
                    {
                      backgroundColor:
                        isContactUs || truckrollPrediction == 1 || loadingHealth
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
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="Reboot your modem"
                >
                  <RefreshIcon />
                  <Text style={styles.modemHealthSupport}>Reboot Modem</Text>
                  <Image
                    style={styles.rightIconStyle}
                    source={require("../../../assets/chevronright.png")}
                  />
                </TouchableOpacity>
              )}

              <View style={[styles.frameLayout]} />
              <TouchableOpacity
                style={[
                  styles.frame9defaultSpaceBlock,
                  {
                    backgroundColor:
                      isContactUs || truckrollPrediction == 1 || loadingHealth
                        ? "white"
                        : currentHealth === "Offline"
                          ? "#EF4E3E10"
                          : "white",
                  },
                ]}
                onPress={() => {
                  navigation.navigate("ModemExchange");
                }}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Exchange your modem"
              >
                <Image
                  style={{ width: 20, height: 20, flexShrink: 0 }}
                  resizeMode="contain"
                  source={require("../../../assets/repeat-01.png")}
                />
                <Text style={styles.modemHealthSupport}>Exchange Modem</Text>
                <Image
                  style={styles.rightIconStyle}
                  source={require("../../../assets/chevronright.png")}
                />
              </TouchableOpacity>

              <View style={[styles.frameLayout]} />
              <TouchableOpacity
                style={[
                  styles.frame9defaultSpaceBlock,
                  {
                    backgroundColor:
                      currentHealth === "Offline" ||
                        isContactUs ||
                        (!loadingHealth && truckrollPrediction == 1)
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
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Contact support for further assistance"
              >
                <Image
                  style={{ width: 20, height: 20, flexShrink: 0 }}
                  resizeMode="contain"
                  tintColor={Color.sparklightBrightPurple}
                  source={require("../../../assets/phone-outgoing-04.png")}
                />
                <Text style={styles.modemHealthSupport}>Contact Us</Text>
                <Image
                  style={styles.rightIconStyle}
                  source={require("../../../assets/chevronright.png")}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* WiFi Password */}
          {(wifiPasswordCanChange || isEEroDevice) && (
            <View
              style={[ styles.myModem, styles.myModemSpaceBlock, { marginTop: 20 }, ]}
            >
              <View style={[styles.myModemWrapper, styles.frameParentSpaceBlock1]}>
                <Text style={[styles.myModem1, styles.myModem1Typo]}>
                  WiFi Password
                </Text>
              </View>
              {isEEroDevice ? renderEEroDeviceOptions() : renderOtherDeviceOptions()}
            </View>
          )}

          {/* Quick Link section */}
          <View
            style={[
              styles.myModem,
              styles.myModemSpaceBlock,
              { marginTop: 20 },
            ]}
          >
            <View style={[styles.myModemWrapper, styles.frameParentSpaceBlock1]}>
              <Text style={[styles.myModem1, styles.myModem1Typo]}>
                Quick Links
              </Text>
            </View>
            <View style={[styles.supportAccordionParent, styles.supportParentFlexBox]}>
              <View style={[styles.frameLayout]} />

              <TouchableOpacity
                style={[styles.frame9defaultSpaceBlock]}
                onPress={() => {
                  navigation.navigate("ArticalWindowUtility", {
                    url: "https://support.sparklight.com/hc/en-us/articles/115010184927-What-Can-I-Do-for-WiFi-Issues",
                    name: "Wifi Issues",
                  });
                }}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Learn more about WiFi issues"
              >
                <WifiIssueIcon />
                <Text style={styles.modemHealthSupport}>Wifi Issues</Text>
                <Image
                  style={styles.rightIconStyle}
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
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Learn more about surfing issues"
              >
                <Surfingissue />
                <Text style={styles.modemHealthSupport}>Surfing Issues</Text>
                <Image
                  style={styles.rightIconStyle}
                  source={require("../../../assets/chevronright.png")}
                />
              </TouchableOpacity>

              <View style={[styles.frameLayout]} />
              <TouchableOpacity
                style={[styles.frame9defaultSpaceBlock]}
                onPress={() => {
                  if (!loadingHealth) {
                    navigation.navigate("PeriodicProblems", {
                      isError: currentHealth != "Optimal" || isOffline,
                    });
                  }
                }}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Learn more about intermittent issues"
              >
                <IntermittentIssues />
                <Text style={styles.modemHealthSupport}>
                  Intermittent Issues
                </Text>
                <Image
                  style={styles.rightIconStyle}
                  source={require("../../../assets/chevronright.png")}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.frameFlexBox]}>
            <MyServicePlan plans={plans} hasEeroDevice={hasEeroDevice} networkId={networkId} navigation={navigation} />
          </View>
        </View>
      </ScrollView>
      {loading ? <Loader /> : null}
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
    alignSelf: "center",
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
    padding: 5,
  },
  notifications: {
    flexDirection: "row",
    borderColor: Color.sparklightGray,
    borderRadius: Border.br_11xs,
    alignSelf: "stretch",
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
  rightIconStyle: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
});

export default ManageEquipment;
