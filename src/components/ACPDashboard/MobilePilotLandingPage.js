import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
} from "react-native";
import {
  FontFamily,
  FontSize,
  Color,
  Padding,
  Border,
} from "../../../GlobalStyles";
import PilotServiceStatus from "./PilotServiceStatus";
import ProfileSettingsHeader from "../common/ProfileSettingsHeader";
import Infocircle from "../../../assets/svgs/Infocircle";
import MobilePromo from "./MobilePromo";
import PilotFaqs from "./PilotFaqs";
import { XAxis } from "react-native-svg-charts";

const MobilePilotLandingPage = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <ProfileSettingsHeader
        onPressBack={() => {
          //navigation.goBack();
        }}
        showIcon={false}
        title={"Service Activation"}
      />

      <ScrollView style={{ flexDirection: "column" }}>
        <View style={styles.infoBox}>
          <View
            style={{
              padding: 16,
              flexDirection: "row",
              alignItems: "flex-start",
            }}
          >
            <Infocircle color={"#0060AE"} style={[styles.infoCircleIcon, { alignSelf: "flex-start" }]} />

            <View style={{ marginLeft: 10, flex: 1, flexDirection: "column" }}>
              <Text style={styles.statusText}>
                Pending Status:
                <Text
                  style={[
                    styles.statusText,
                    { color: Color.colorblack_100, fontWeight: "400" },
                  ]}
                >
                  {" "}{"Awaiting Customer Equipment Pickup"}
                </Text>
              </Text>

              <Text style={styles.subText}>
                Drop by any of our Sparklight stores to pick up your equipment.
                Just a quick reminder to bring your photo ID and account number
                along with you. See you soon!{" "}
                <Text style={[styles.subText,{color:'#353091',textDecorationLine:'underline',fontWeight:'bold',}]}>Sparklight Store Locations and Hours</Text>.
              </Text>
              <Text>{""} </Text>
              <Text style={styles.subText}>If you have any questions, please call <Text style={[styles.subText,{color:'#353091',textDecorationLine:'underline',fontWeight:'bold'}]} onPress={()=>{

              }}>877-692-2253</Text>.</Text>
            </View>
          </View>
        </View>
        <View style={{ marginHorizontal: 24, marginBottom: 20 ,}}>
        <PilotServiceStatus currentStage={2} />
      </View>
        <MobilePromo />
        <PilotFaqs />
      </ScrollView>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    marginBottom: Platform.OS === "ios" ? 90 : 60,
    backgroundColor: Color.sparklightWhite,
  },
  infoBox: {
    flexDirection: "column",
    marginHorizontal: 24,
    marginVertical: 20,
    borderColor: "#0060AE",
    backgroundColor: "#F0F8FF",
    borderRadius: Border.br_11xs,
    marginTop: 20,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 25,
  },
  statusText: {
    fontFamily: FontFamily.openSansRegular,
    fontSize: FontSize.size_base,
    color: "#353091",
    fontWeight: "700",
  },
  subText: {
    fontFamily: FontFamily.openSansRegular,
    fontSize: FontSize.size_sm,
    color: Color.colorblack_100,
    fontWeight: "400",
    marginVertical: 4,
  },
  infoCircleIcon: {
    width: 16,           // typical icon width
    height: 16,          // match the font size of statusText
    marginTop: 4,        // fine-tune vertical alignment if needed
    overflow: "hidden",
  },
};

export default MobilePilotLandingPage;
