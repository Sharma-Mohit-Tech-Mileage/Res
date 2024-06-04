import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Pressable,
  Image,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import QRCode from "react-native-qrcode-svg";
import Share from "react-native-share";
import { captureRef } from "react-native-view-shot";
import ProfileSettingsHeader from "../common/ProfileSettingsHeader";
import SparkLightDropdown from "../common/customui/SparkLightDropdown";
import {
  Color,
  FontFamily,
  FontSize,
  Padding,
  Border,
} from "../../../GlobalStyles";
import colors from "../../res/Colors";
import { Select, Box, CheckIcon } from "native-base";
import LinearGradient from "react-native-linear-gradient";

const ShareWifiScreen = ({ route }) => {
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [encryption, setEncryption] = useState("WPA");
  const [wifiDetails, setWifiDetails] = useState(route?.params?.wifiData);
  const [iconPressed, setIconPressed] = useState(false);
  const [slectedPasword, setSelectedPassword] = useState("")
  const [passwordList, setPasswordList] = useState([]);
  const [modemPasswordData, setModemPasswordData] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const qrCodeRef = useRef();
  const navigation = useNavigation();

  const closeModal = () => {
    setModalVisible(false);
    onClose();
  };


  useEffect(() => {
    modemPasswordData?.map((item) => {
      if (item.ssid == slectedPasword) {
        setSelectedItem(item)
        setPassword(item.securityKey);
        setSsid(item.ssid);
      }
    })
  }, [slectedPasword])


  useEffect(() => {
    if (wifiDetails) {
      setModemPasswordData(wifiDetails)
      const list = wifiDetails.map((value) => value.ssid)
      setPasswordList(list);
      setSelectedPassword(list[0])
    }
  }, []);

  // useEffect(() => {
  //   if (selectedItem != -1) {
  //     const wifi = route?.params?.wifiData.find((el) => el.ssid == selectedItem);
  //     console.log("selected", wifi);
  //     setItem(wifi)
  //     setPassword(wifi.securityKey);
  //     setSsid(wifi.ssid);
  //   }
  // }, [selectedItem]);

  //setPassword(itemValue.securityKey)
  //setSsid(itemValue.ssid)

  const handlePasswordSelection = (value) => {
    setSelectedPassword(value)
  }

  const generateWifiQRCode = () => {
    return `WIFI:T:${encryption};S:${ssid};P:${password};;`;
  };

  const shareQRCode = async () => {
    try {
      const uri = await captureRef(qrCodeRef, {
        format: "png",
        quality: 0.8,
      });

      const shareOptions = {
        url: uri,
        type: "image/png",
        failOnCancel: false,
      };

      await Share.open(shareOptions);
    } catch (error) {
      console.error("Error sharing QR Code: ", error);
    }
  };

  return (
    <>
      <LinearGradient
        style={[styles.profileSettingsChild]}
        locations={[0, 1]}
        colors={["rgba(53, 48, 145, 1)", "rgba(141, 59, 144, 1)"]}
        useAngle={true}
        angle={90}
      ></LinearGradient>

      <View style={styles.container}>
        <StatusBar
          barStyle="light-content"
          translucent={true}
          backgroundColor="transparent"
        />
        <LinearGradient
          style={[styles.profileSettingsChild, { paddingTop: 40 }]}
          locations={[0, 1]}
          colors={["rgba(53, 48, 145, 1)", "rgba(141, 59, 144, 1)"]}
          useAngle={true}
          angle={90}
        >
          <View style={[styles.navBar]}>
            <Pressable
              style={[styles.navIcon, styles.chevronLayout]}
              onPress={() => {
                navigation.goBack();
              }}
              accessibilityLabel="Back"
              accessibilityHint="Go back to the previous screen"
              accessibilityRole="button"
              accessible={true}
              hitSlop={20}
            >
              <Image
                style={[styles.icon, iconPressed ? styles.iconPressed : null]}
                resizeMode="cover"
                source={require("../../../assets/xclose.png")}
                accessible={false}
              />
            </Pressable>
            <Text style={styles.title}>Share Wifi Password</Text>
            <Pressable
              style={[styles.navIcon, styles.chevronLayout]}
              onPress={() => {
                shareQRCode();
              }}
              accessibilityLabel="Share"
              accessibilityHint="Share your WiFi Password"
              accessibilityRole="button"
              accessible={true}
              hitSlop={20}
              onPressIn={() => setIconPressed(true)}
              onPressOut={() => setIconPressed(false)}
            >
              <Image
                style={[styles.icon, iconPressed ? styles.iconPressed : null]}
                resizeMode="cover"
                source={require("../../../assets/share.png")}
                accessible={false}
              />
            </Pressable>
          </View>
        </LinearGradient>

        <View style={styles.qrContainer}>
          <View style={styles.textinput}>
            <Text style={{ fontSize: 16 }}>SSID</Text>
            <SparkLightDropdown
            items={passwordList}
            selectedValue={slectedPasword}
            onValueChange={handlePasswordSelection}
            dropDownStyle={{ color: Color.sparklightDarkGray }}
          />
          </View>
          <View
            ref={qrCodeRef}
            style={{
              marginTop: 40,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <QRCode value={generateWifiQRCode()} size={200} />
          </View>
          <Text style={{ fontSize: 14, marginTop: 40 }}>
            Scan this QR code to connect "{slectedPasword}" Network
          </Text>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    alignItems: "center",
    backgroundColor: Color.colorWhitesmoke_200,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: "100%",
  },
  qrContainer: {
    marginTop: 20,
    padding: 20,
    width: "90%",
    backgroundColor: Color.sparklightWhite,
    alignItems: "center",
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
  textinput: {
    justifyContent: "center",
    alignSelf: "stretch",
    marginVertical: 10,
  },
  container1: {
    marginTop: 8,
    borderColor: Color.sparklightDarkGray, // Set the border color here
    borderWidth: 1, // Set the border width here
    borderRadius: 2, // Set the border radius here
  },
  dropdown: {
    flexDirection: "row", // Ensure text and icon are in a row
    justifyContent: "space-between", // Space the text and icon
    alignItems: "center", // Center the items vertically
    paddingHorizontal: Padding.p_base,
    color: Color.colorGray_200,
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.openSansRegular,
    paddingVertical: Padding.p_xs,
    height: 48,
  },
  item: {
    padding: Padding.p_base,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  closeButton: {
    alignSelf: "flex-end",
    color: "white",
    fontSize: 16,
    backgroundColor: Color.colorMidnightblue,
  },
  closeBtn: {
    textAlign: "center",
    fontSize: FontSize.size_sm,
    fontFamily: FontFamily.openSansRegular,
  },
  buttons: {
    marginLeft: 10,
    backgroundColor: Color.colorMidnightblue,
  },
  buttonsLayout: {
    paddingHorizontal: Padding.p_base,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Border.br_11xs,
  },
  text1Clr: {
    color: Color.colorWhitesmoke_200,
    textAlign: "center",
  },
  pdf: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  profileSettingsChild: {
    overflow: "hidden",
    width: "100%",
    zIndex: 1,
  },
  navBar: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", // Center items in navBar
    paddingHorizontal: 8, // Added for spacing
  },
  title: {
    flex: 1,
    fontSize: FontSize.size_lg,
    textAlign: "center",
    fontWeight: "600",
    color: Color.sparklightWhite,
    fontFamily: FontFamily.openSansSemiBold,
    padding: 8,
  },
  chevronLeft: {
    position: "absolute",
    left: 18,
  },
  chevronRight: {
    position: "absolute",
    right: 18,
  },
  chevronLayout: {
    justifyContent: "center",
    alignItems: "center",
    height: 24,
    width: 24,
    zIndex: 1,
  },
  chevronLeftLayout: {
    height: 24,
    width: 24,
  },
  icon: {
    height: 24,
    width: 24,
  },
  iconPressed: {
    // Style for icon when pressed
    opacity: 0.5, // Change opacity on press
  },
});

export default ShareWifiScreen;
