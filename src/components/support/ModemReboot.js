import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Linking,
  Modal,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import ProfileSettingsHeader from "../common/ProfileSettingsHeader";
import {
  FontFamily,
  Color,
  Border,
} from "../../../GlobalStyles";
import {
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import colors from "../../res/Colors";
import ModemInfo from "../../res/svgIcons/ModemInfo";
import RightArrow from "../../res/svgIcons/RightArrow";
import VideoIcon from "../../res/svgIcons/VideoIcon";

import { getUser } from "../../redux/utils/LocalStorage";
import { GetApiRequest } from "../../network/APIClient";
import CustomerErrorPage from "../utility/SystemErrorPopup";

const ModemReboot = ({route}) => {
  console.log('Route',JSON.stringify(route))
  const navigation = useNavigation();
  const [modemStatus, setModemStatus] = useState(route.params?.isError?"":'connected');
  const [accountNumber, setAccountNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRebootError, setIsRebootError] = useState(false);
  const [rebootErrorMsg] = useState(
    "Oops, we have encountered an error. Please retry or refer to the Modem Reboot Instructions."
  );

  const LoadingOverlay = () => {
    return (
      <Modal
        visible={loading}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setLoading(false);
        }}
      >
        <View style={styles.overlay}>
          <View style={styles.alertContainer}>
            <ActivityIndicator size="large" color={Color.colorGainsboro_200} />
            <Text style={styles.loadingTxt}>Rebooting Modem</Text>
          </View>
        </View>
      </Modal>
    );
  };

  const rebootModemAction = () => {
    console.log(accountNumber)
    if (accountNumber) {
      setLoading(true);
      const request = `mobile/api/Device/RebootModem?accountnumber=${accountNumber}`;
      GetApiRequest(
        request,
        (res) => {
          console.log("rebootModemAction", res);
          setModemStatus(res.status);
          setLoading(false);
          setTimeout(()=>{
            if (res.status == "Bad") {
              setIsRebootError(true);
            }
          },1000)
          
        },
        (error) => {
          console.log("rebootModemAction Error", error);
          setLoading(false);
          setTimeout(()=>{
            setIsRebootError(true);
          })
          
        }
      );
    }
  };

  useEffect(() => {
     getUser().then((res) => {
      setAccountNumber(res.userInfo.accountNumber);
    });
  }, []);

  useEffect(() => {

  }, [accountNumber]);

  const goBackAction=()=>{
    if(route.params?.isFromT){
      navigation.goBack()
    }else if(route.params?.isError){
      navigation.navigate("Support")
    }else{
      navigation.goBack()
    }
  }


  const RenderErrorBox = () => {
    return (
      <View style={styles.errorBox}>
        <View style={{ flexDirection: "row" }}>
          <View style={{ backgroundColor: "#F88700", width: 4 }} />
          <View style={{ flexDirection: "column", padding: 10 }}>
            <View style={{ flexDirection: "row" }}>
              <Image
                style={{ alignSelf: "center", width:24,height:24 }}
                resizeMode="cover"
                tintColor={"#F88700"}
                source={require("../../../assets/alert-triangle.png")}
              />
              <Text style={styles.modemError1}>
                Uh-oh, experiencing internet issues?
              </Text>
            </View>
            <Text style={styles.modemError2}>
              Click the Reboot Modem button below to quickly restart your modem.
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.modemRebootContainer}>
      <ProfileSettingsHeader
        title="Modem Reboot"
        onPressBack={() => {
          goBackAction()
        }
          
        }
      />
      <ScrollView>
        <View style={{ flexDirection: "column" }}>
          <View
            style={[
              styles.card,
              styles.shadowProp,
              { flexDirection: "column" },
            ]}
          >
            <Text style={styles.rebootModemTxt}>Modem Reboot</Text>
            <Image
              style={styles.frameChild}
              resizeMode="cover"
              source={
                modemStatus === ""
                  ? require("../../../assets/reboot_modem.png")
                  : require("../../../assets/reboot_modem.png")
              }
            />

            {/* {modemStatus === "" ? (
               <RenderErrorBox />
            ) : (
              <Text style={{ alignSelf: "center", marginVertical: 10 }}>
                Modem is connected
              </Text>
            )} */}
            <View style={styles.borderSec} />

            <TouchableOpacity
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginHorizontal: 20,
                alignItems: "center",
                paddingVertical: 15,
              }}
              onPress={() => {
                navigation.navigate("ModemRebootInstructions");
              }}
            >
              <View style={{ flexDirection: "row", alignContent: "center" }}>
                <ModemInfo />
                <Text style={styles.modemInstruction}>
                  Modem Reboot Instructions
                </Text>
              </View>
              <RightArrow />
            </TouchableOpacity>

            <View style={styles.borderSec} />

            <TouchableOpacity
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginHorizontal: 20,
                alignItems: "center",
                paddingTop: 15,
              }}
              onPress={() => {
                Linking.openURL("https://youtu.be/hVvi9e338KI");
              }}
            >
              <View style={{ flexDirection: "row", alignContent: "center" }}>
                <VideoIcon />
                <Text style={styles.modemInstruction}>Modem Reboot Video</Text>
              </View>
              <RightArrow />
            </TouchableOpacity>
          </View>
          <View style={{ marginTop: 20 }}>
            <TouchableOpacity
              style={styles.BtnContainer}
              onPress={() => {
                rebootModemAction();
              }}
            >
              <Text style={styles.Btn}>Reboot Modem</Text>
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: 20 }}>
            <TouchableOpacity
              style={[styles.BtnContainer, { backgroundColor: "#00000000" }]}
              onPress={() => {
                goBackAction();
              }}
            >
              <Text
                style={[styles.Btn, { color: colors.sparklight_purple_blue }]}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
          <LoadingOverlay />
          <CustomerErrorPage
            visible={isRebootError}
            message={rebootErrorMsg}
            title={"Modem Reboot Failed"}
            onActionTxt={"Retry Modem Reboot"}
            onAction={() => {
              setIsRebootError(false);
              rebootModemAction();
            }}
            onClose={() => {
              setIsRebootError(false);
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  modemRebootContainer: {
    width: "100%",
    flex: 1,
    alignItems: "center",
    backgroundColor: Color.colorWhitesmoke_200,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 2,
    width: wp("92%"),
    marginTop: wp("8%"),
    paddingTop: 20,
    paddingBottom: 20,
  },
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  frameChild: {
    alignSelf: "center",
    marginBottom:20,
    width: 100,
    height: 100,
  },
  rebootModemTxt: {
    color: colors.sparklight_grey,
    fontFamily: FontFamily.openSansRegular,
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: 22,
    marginLeft: 20,
    marginBottom: 20,
  },
  modemError1: {
    color: "#000000",
    FontFamily: FontFamily.textXsSemibold,
    fontSize: 15,
    fontStyle: "normal",
    fontWeight: "700",
    marginLeft: 5,
    marginRight: 5,
  },
  modemError2: {
    color: Color.colorGray_200,
    FontFamily: FontFamily.openSansRegular,
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: "400",
    marginLeft: 20,
    marginTop: 7,
    marginRight: 5,
  },
  errorBox: {
    flexDirection: "column",
    marginHorizontal: 15,
    marginVertical: 20,
    borderColor: Color.sparklightGray,
    borderRadius: Border.br_11xs,
    borderWidth: 1,
  },
  modemInstruction: {
    color: Color.colorGray_200,
    fontFamily: FontFamily.openSansRegular,
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: "400",
    marginLeft: 10,
  },
  BtnContainer: {
    backgroundColor: colors.sparklight_purple_blue,
    justifyContent: "center",
  },
  Btn: {
    color: colors.snow_white,
    fontFamily: FontFamily.openSansRegular,
    textAlign: "center",
    padding: 16,
    fontSize: 16,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  alertContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 5,
    width: "40%",
  },
  loadingTxt: {
    color: Color.sparklightGray1,
    textAlign: "center",
    fontFamily: FontFamily.openSansRegular,
    fontSize: 22,
    fontStyle: "normal",
    fontWeight: "400",
  },
  borderSec: {
    width: "100%",
    height: 1,
    backgroundColor: Color.sparklightGray,
  },
});

export default ModemReboot;
