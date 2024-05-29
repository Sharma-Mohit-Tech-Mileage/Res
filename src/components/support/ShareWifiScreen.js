import React, { useRef, useState,useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import QRCode from "react-native-qrcode-svg";
import Share from "react-native-share";
import { captureRef } from "react-native-view-shot";
import ProfileSettingsHeader from "../common/ProfileSettingsHeader";
import { Color, FontFamily, FontSize, Padding } from "../../../GlobalStyles";
import colors from "../../res/Colors";
import { Select, Box, CheckIcon } from "native-base";

const ShareWifiScreen = ({ route }) => {
  console.log("route", JSON.stringify(route));

  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  const [encryption, setEncryption] = useState("WPA");
  const [wifiDetails, setWifiDetails] = useState(route?.params?.wifiData);
  const [selectedItem, setSelectedItem] = useState("");
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
      <View  style={styles.qrContainer}>
        <View style={styles.textinput}>
          <Text style={{ fontSize: 16 }}>SSID</Text>
          <Box style={[styles.container1]}>
            <Select
              selectedValue={selectedItem}
              minWidth="200"
              accessibilityLabel="Choose wifi"
              placeholder="Select an option"
              maxFontSizeMultiplier={1.25}
              _selectedItem={{
                bg: Color.Gray300,
                endIcon: <CheckIcon size="5" />,
              }}
              style={styles.dropdown}
              onValueChange={(itemValue) => {
                setSelectedItem(itemValue)
                setPassword(itemValue.securityKey)
                setSsid(itemValue.ssid)
              }
              
              }
              
            >
              {wifiDetails.map((item, index) => (
                <Select.Item
                  key={index}
                  label={item.ssid}
                  value={item}
                />
              ))}
            </Select>
          </Box>
        </View>
        <View  ref={qrCodeRef} style={{marginTop:40, justifyContent:'center', alignItems:'center'}}>
        <QRCode value={generateWifiQRCode()} size={200}  />
        </View>
        <Text style={{ fontSize: 14 , marginTop:40}}>Scan this QR code to connect My Network</Text>
      </View>
      <View style={{ marginTop: 20, width: "75%" }}>
        <TouchableOpacity
          style={styles.BtnContainer}
          onPress={() => {
            if(selectedItem!=''){
            shareQRCode();
            }
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
    marginTop: 80,
    padding: 20,
    width:'90%',
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
});

export default ShareWifiScreen;
