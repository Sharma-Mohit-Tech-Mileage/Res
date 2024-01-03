import * as React from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
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

const ModemExchangeInstructions = () => {
  const navigation = useNavigation();
  const [inst1, setInst1] = React.useState(
    "The average lifespan of a modem is approximately 2-3 years, although some high-quality modems can last up to 5-8 years. Typically, high-quality modems are replaced due to becoming outdated rather than breaking down. If you suspect that your modem is not functioning properly, please contact us or visit your nearest Sparklight office to request a modem exchange. Our team will be happy to assist you and ensure that you have the best possible internet experience."
  );

  return (
    <View style={styles.modemRebootContainer}>
      <ProfileSettingsHeader
        title="Modem Exchange Instructions"
        onPressBack={() => navigation.goBack()}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ flexDirection: "column", paddingBottom: hp("15%") }}>
          <View
            style={[
              styles.card,
              styles.shadowProp,
              { flexDirection: "column" },
            ]}
          >
            <Image
              style={styles.frameChild}
              resizeMode="cover"
              source={require("../../../assets/modem-reboot-inst.png")}
            />
            <Text style={styles.heading}>How to do a modem exchange</Text>
            <View
              style={{ backgroundColor: "#F4F4F5", height: 1, marginTop: 20 }}
            />
            <Text style={styles.text}>{inst1}</Text>
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
    shadowOffset: { width: -1, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  frameChild: {
    alignSelf: "center",
    width: 71,
    height: 70,
  },
  contactUs: {
    alignSelf: "center",
    width: 40,
    height: 40,
    marginLeft: 10,
  },

  modemInstruction: {
    color: Color.colorGray_200,
    fontFamily: FontFamily.openSansRegular,
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: "400",
    marginLeft: 10,
  },
  heading: {
    color: Color.sparklightGray1,
    fontFamily: FontFamily.openSansRegular,
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: "700",
    alignSelf: "center",
    marginTop: 10,
  },
  text: {
    color: Color.sparklightGray1,
    fontFamily: FontFamily.openSansRegular,
    fontSize: 16,
    fontStyle: "normal",
    textAlign: "left",
    fontWeight: "400",
    padding: 20,
    alignSelf: "center",
  },
  
});

export default ModemExchangeInstructions;
