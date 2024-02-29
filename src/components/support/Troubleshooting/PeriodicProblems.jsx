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
import {
  Color,
  Padding,
  Border,
  FontSize,
  FontFamily,
} from "../../../../GlobalStyles";
import ProfileSettingsHeader from "../../common/ProfileSettingsHeader";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import RightArrow from "../../../res/svgIcons/RightArrow";
import SettingsIcon from "../../../res/svgIcons/SettingsIcon";
import WifiIssueIcon from "../../../res/svgIcons/WifiIssueIcon";
import RefreshIcon from "../../../res/svgIcons/RefreshIcon";
const PeriodicProblems = ({route}) => {
  console.log('Intermi',JSON.stringify(route))
  const navigation = useNavigation();

  const instructions1 = [
    "Intermittent dropouts can be caused by various factors.Check for damaged cables or outdated firmware on your modem.",
    "Sometimes a device itself may be experiencing problems.Verify if it is a specific device or if all devices have issues.",
    "Proximity to other wireless networks, such as in apartments, can also cause intermittent issues.",
  ];

  const renderInstruction = (instruction, index) => (
    <View key={index} style={styles.instructionContainer}>
      <View style={styles.bulletPoint} />
      <Text style={styles.instructionText}>{instruction}</Text>
    </View>
  );

  return (
    <View style={styles.modemRebootContainer}>
      <ProfileSettingsHeader
        title="Troubleshooting"
        onPressBack={() => navigation.goBack()}
      />
      <ScrollView showsVerticalScrollIndicator={false} style={{marginBottom:80}}>
        <View style={{ flexDirection: "column", flex: 1 }}>
          <View style={[styles.card, styles.shadowProp]}>
            <Image
              style={styles.frameChild}
              resizeMode="cover"
              source={require("../../../../assets/modem-reboot-inst.png")}
            />
            <Text style={styles.heading}>Intermittent Issues </Text>
            <View
              style={{
                backgroundColor: "#F4F4F5",
                height: 1,
                marginVertical: 20,
              }}
            />
            {instructions1.map(renderInstruction)}
            <View style={{ paddingTop: 32 }}>
              <View style={styles.borderSec} />
              <TouchableOpacity
                style={styles.pressableStyle}
                onPress={() => {
                  navigation.navigate("ModemRebootScreen", {
                    isError: (route.params?.health!='Optimal')?true:false,
                    isFromT: true,
                  });
                }}
              >
                <View style={styles.menuWrap}>
                  <RefreshIcon />
                  <Text style={styles.menuText}>Reboot Modem</Text>
                </View>
                <RightArrow />
              </TouchableOpacity>
              <View style={styles.borderSec} />

              <TouchableOpacity
                style={styles.pressableStyle}
                onPress={() => {
                  navigation.navigate("ModemExchange");
                }}
              >
                <View style={styles.menuWrap}>
                  <Image
                    style={{ width: 20, height: 20, flexShrink: 0 }}
                    resizeMode="contain"
                    source={require("../../../../assets/repeat-01.png")}
                  />
                  <Text style={styles.menuText}>Exchange Modem</Text>
                </View>
                <RightArrow />
              </TouchableOpacity>
              <View style={styles.borderSec} />
              <TouchableOpacity
                style={styles.pressableStyle}
                onPress={() => {
                  navigation.navigate("ArticalWindowUtility", {
                    url: "https://support.sparklight.com/hc/en-us/articles/115010184927-What-Can-I-Do-for-WiFi-Issues",
                    name: "Wi-Fi Issues",
                  });
                }}
              >
                <View style={styles.menuWrap}>
                  <WifiIssueIcon />
                  <Text style={styles.menuText}>Wi-Fi Issues</Text>
                </View>
                <RightArrow />
              </TouchableOpacity>
            </View>
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
    width: wp("92%"),
    marginTop: Padding.p_5xl,
    flex: 1,
  },
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: -1, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  pressableStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    marginHorizontal: 20,
  },
  frameChild: {
    alignSelf: "center",
    width: 71,
    height: 70,
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
  instructionContainer: {
    flexDirection: "row",
    alignItems: "flex-start", // Align items to the start of the cross axis
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Color.sparklightGray1,
    marginTop: 8, // Adjust the top margin to align the bullet with the first line of text
    marginRight: 8,
  },
  instructionText: {
    color: Color.sparklightGray1,
    fontFamily: FontFamily.openSansRegular,
    fontSize: 16,
    flexShrink: 1,
  },
  menuText: {
    color: Color.colorGray_200,
    fontFamily: FontFamily.openSansRegular,
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: "400",
    marginLeft: 10,
  },
  menuWrap: {
    flexDirection: "row",
    alignContent: "center",
  },
  borderSec: {
    width: "100%",
    height: 1,
    backgroundColor: Color.sparklightGray,
  },
});

export default PeriodicProblems;
