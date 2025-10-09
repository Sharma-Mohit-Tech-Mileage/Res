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

const MobilePilotLandingPage = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <ProfileSettingsHeader
        onPressBack={() => {
          navigation.goBack();
        }}
        title={"Service Activation"}
      />

      <View style={{flexDirection:'column'}}>
        <View style={styles.infoBox}>
            <View style={{padding:16, flexDirection:'row', alignItems:'flex-start'}}>
                <Infocircle />

                <View style={{marginLeft:10, flex:1, flexDirection:'column'}}>
                <Text>
                    Pending Status: 
                    <Text>Waiting Customer Equipment Pickup</Text>
                </Text>
                <Text> {''} </Text>
                <Text>Drop by any of our Sparklight stores to pick up your equipment. Just a quick reminder to bring your photo ID and account number along with you. See you soon! Sparklight Store Locations and Hours.</Text>
                <Text> {''} </Text>
                <Text>If you have any questions, please
call 877-692-2253.</Text>
                </View>
            </View> 
        </View>
        <PilotServiceStatus currentStage={2} />
      </View>
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
    
  },
};

export default MobilePilotLandingPage;
