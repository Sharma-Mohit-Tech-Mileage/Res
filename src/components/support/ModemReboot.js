import * as React from "react";
import { Image, StyleSheet, Text, View, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ProfileSettingsHeader from "../common/ProfileSettingsHeader";
import {
  FontFamily,
  Padding,
  Color,
  FontSize,
  Border,
} from "../../../GlobalStyles";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import colors from "../../res/Colors";

const ModemReboot = () => {
  // const navigation = useNavigation();

  return (
    <View style={styles.modemRebootContainer}>
      <ProfileSettingsHeader
        title="Modem Reboot"
        // onPressBack={() => navigation.navigate("support")}
      />
      <ScrollView>
        <View style={[styles.card, styles.shadowProp]}>
          <View style={{ flexDirection: "column" }}>
            <Text style={styles.rebootModemTxt}>Modem Reboot</Text>
            <Image
              style={styles.frameChild}
              resizeMode="cover"
              source={require("../../../assets/modemReboot.png")}
            />

            <View style={styles.errorBox}>
              <View style={{ flexDirection: "row" }}>
                <View style={{ backgroundColor: "#F88700", width: 4 }} />
                <View style={{ flexDirection: "column", padding: 10 }}>
                  <View style={{ flexDirection: "row" }}>
                    <Image
                      style={styles.frameChild}
                      resizeMode="cover"
                      tintColor={"#F88700"}
                      source={require("../../../assets/info-circle.png")}
                    />
                    <Text style={styles.modemError1}>
                      Uh-oh, experiencing internet issues?
                    </Text>
                  </View>
                  <Text style={styles.modemError2}>
                    Click the Reboot Modem button below to quickly restart your
                    modem.
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={{ backgroundColor: "#F4F4F5", height: 1, marginTop: 10 }}
            />

               <View style={{flexDirection:'row'}}>
                

               </View>

            <View
              style={{ backgroundColor: "#F4F4F5", height: 1, marginTop: 20 }}
            />
          </View>
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
    width: wp("87%"),
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
    color: Color.sparkLightInfo,
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
    marginTop: 20,
    borderColor: Color.sparklightGray,
    borderRadius: Border.br_11xs,
    borderWidth: 1,
  },
});

export default ModemReboot;
