import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  ScrollView
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  Color,
  Padding,
  Border,
  FontSize,
  FontFamily,
} from "../../../../GlobalStyles";
import ServiceIcon from "../../../res/svgIcons/troubleshooting/ServiceIcon";
import SuccessIcon from "../../../res/svgIcons/troubleshooting/SuccessIcon";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import RightArrow from "../../../res/svgIcons/RightArrow";
import ProfileSettingsHeader from "../../common/ProfileSettingsHeader";
import WifiIssueIcon from "../../../res/svgIcons/WifiIssueIcon";
import Surfingissue from "../../../res/svgIcons/surfingissue";
import IntermittentIssues from "../../../res/svgIcons/IntermittentIssues";
import Noconnection from "../../../res/svgIcons/Noconnection";
import Modemicon from "../../../res/svgIcons/Modemicon";
const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const ModemHealthy = () => {
  const navigation = useNavigation();
  return (
    <View style={{ flex: 1, backgroundColor: Color.colorWhitesmoke_200 }}>
      <ProfileSettingsHeader
        title="Troubleshooting"
        onPressBack={() => navigation.navigate('SupportStack')}
        accessibilityLabel="Back to Support"
        accessibilityHint="Navigates back to the Support screen"
      />
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          paddingHorizontal: Padding.p_base,
          paddingVertical: Padding.p_5xl,
          marginBottom: "15%",
        }}
      >
         <ScrollView style={{marginBottom:20}}>
        <View style={styles.container}>
          <Text style={styles.topLeftText}>3 of 3</Text>
          <View style={styles.content}>
            <View style={styles.circle}>
              <ServiceIcon />
            </View>

            <View style={{ justifyContent: "center", paddingVertical: 8 }}>
              <SuccessIcon />
            </View>

            <View style={{ justifyContent: "center", paddingVertical: 8 }}>
              <Text style={styles.title}>
                {"No service issues were detected."}
              </Text>
            </View>
          
            <View style={{ flexDirection: "column", flex: 1 }}>
              <View style={styles.card}>
              <View style={styles.borderSec} />
              <TouchableOpacity
                  style={styles.pressableStyle}
                  onPress={() => {
                    navigation.navigate('ManageEquipment',{isFromTroubleshooting:true})
                  }}
                >
                  <View style={styles.menuWrap}>
                    <Modemicon />
                    <Text style={styles.menuText}>Manage Equipment</Text>
                  </View>
                  <RightArrow />
                </TouchableOpacity>
               
                <View style={styles.borderSec} />
                <TouchableOpacity
                  style={styles.pressableStyle}
                  onPress={() => {
                    navigation.navigate('ArticalWindowUtility',{url:'https://support.sparklight.com/hc/en-us/articles/115010184927-What-Can-I-Do-for-WiFi-Issues',name:'Wi-Fi Issues'})
                  }}
                >
                  <View style={styles.menuWrap}>
                    <WifiIssueIcon />
                    <Text style={styles.menuText}>Wi-Fi Issues</Text>
                  </View>
                  <RightArrow />
                </TouchableOpacity>
                <View style={styles.borderSec} />

                <TouchableOpacity
                  style={styles.pressableStyle}
                  onPress={() => {
                    navigation.navigate('ArticalWindowUtility',{url:'https://support.sparklight.com/hc/en-us/sections/115002453808-Surfing-Email',name:'Surfing Issues'})
                  }}
                >
                  <View style={styles.menuWrap}>
                    <Surfingissue />
                    <Text style={styles.menuText}>Surfing Issues</Text>
                  </View>
                  <RightArrow />
                </TouchableOpacity>
                <View style={styles.borderSec} />
                <TouchableOpacity
                  style={styles.pressableStyle}
                  onPress={() => {
                    navigation.navigate("PeriodicProblems");
                  }}
                >
                  <View style={styles.menuWrap}>
                    <IntermittentIssues />
                    <Text style={styles.menuText}>Intermittent Issues</Text>
                  </View>
                  <RightArrow />
                </TouchableOpacity>
                <View style={styles.borderSec} />
                <TouchableOpacity
                  style={styles.pressableStyle}
                  onPress={() => {
                    navigation.navigate('ModemConnectivityGuide',{isSuccess:true})
                  }}
                >
                  <View style={styles.menuWrap}>
                    <Noconnection />
                    <Text style={styles.menuText}>No Connection</Text>
                  </View>
                  <RightArrow />
                </TouchableOpacity>
                
              </View>
            </View>
          </View>
        </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: windowHeight * 0.05,
    backgroundColor: Color.sparklightWhite,
    
  },
  content: {
    flexGrow: 1, // This allows the content to expand
    alignItems: "center",
    justifyContent: "center",
    
  },
  pressableStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    alignItems: "center",
    paddingVertical: 20,
  },
  circle: {
    width: windowWidth * 0.5,
    height: windowWidth * 0.5,
    borderRadius: (windowWidth * 0.5) / 2,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginBottom: 20,
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: "center",
  },
  menuText: {
    color: Color.colorGray_200,
    fontFamily: FontFamily.openSansRegular,
    fontSize: FontSize.size_base,
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
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#292929",
    textAlign: "center",
    lineHeight: 28,
    fontWeight: "400",
  },
  topLeftText: {
    position: "absolute",
    top: 0,
    left: 0,
    color: "#292929",
    fontFamily: FontFamily.openSansRegular,
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 28,
    padding: 10,
  },
  card: {
    paddingVertical: Padding.p_base,
    width: wp("92%"),
  },
});

export default ModemHealthy;

