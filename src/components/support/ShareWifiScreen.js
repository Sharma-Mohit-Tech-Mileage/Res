import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import QRCode from "react-native-qrcode-svg";
import Share from "react-native-share";
import { captureRef } from "react-native-view-shot";
import ProfileSettingsHeader from "../common/ProfileSettingsHeader";
import { Color, FontFamily, Padding } from "../../../GlobalStyles";
import colors from "../../res/Colors";

const ShareWifiScreen = ({route}) => {

    console.log('route',JSON.stringify(route))

  const [ssid, setSsid] = useState(route?.params?.ssid);
  const [password, setPassword] = useState(route?.params?.skey);
  const [encryption, setEncryption] = useState("WPA");
  const qrCodeRef = useRef();
  const navigation = useNavigation();

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
    <View style={styles.container}>
      <ProfileSettingsHeader
        title="Share Wifi Password"
        onPressBack={() => {
          navigation.goBack();
        }}
      />
      <View ref={qrCodeRef} style={styles.qrContainer}>
        <QRCode value={generateWifiQRCode()} size={250} />
      </View>
      <View style={{marginTop:40, width:'75%' }}>
        <TouchableOpacity
          style={styles.BtnContainer}
          onPress={() => {
            shareQRCode()
          }}
        >
          <Text style={styles.Btn}>Share Wifi Password</Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: 20 }}>
        <TouchableOpacity
          style={[styles.BtnContainer, { backgroundColor: "#00000000" }]}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Text style={[styles.Btn, { color: colors.sparklight_purple_blue }]}>
            Cancel
          </Text>
        </TouchableOpacity>
      </View>
    </View>
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
    marginTop:80,
    padding: 40,
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
});

export default ShareWifiScreen;
