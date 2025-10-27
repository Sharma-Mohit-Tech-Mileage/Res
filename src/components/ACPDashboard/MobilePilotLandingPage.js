import React from "react";
import {
  View,
  Text,
  Linking,
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

const MobilePilotLandingPage = ({
  status = "Pending Status",
  action = "Awaiting Customer Equipment Pickup.",
}) => {
  return (
    <View style={styles.container}>
      <ProfileSettingsHeader
        onPressBack={() => {
          //navigation.goBack();
        }}
        showIcon={false}
        accessibleLable={"Service Activation, heading level 1."}
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
            <View
              accessibilityLabel="Information icon "
              accessible={true}
              accessibilityRole='text'
            >
              <Infocircle
                color={"#0060AE"}
                style={[styles.infoCircleIcon, { alignSelf: "flex-start" }]}
              />
            </View>

            <View style={{ marginLeft: 10, flex: 1, flexDirection: "column" }}>
              <Text
                style={styles.statusText}
                accessibilityLabel={`${status} ' ', ${action} heading level 2. Drop by any of our Sparklight stores to pick up your equipment.
                Just a quick reminder to bring your photo ID and account number
                along with you. See you soon!. `}
                accessibilityRole="text"
              >
                {status}:
                <Text
                  style={[
                    styles.statusText,
                    { color: Color.colorblack_100, fontWeight: "400" },
                  ]}
                >
                  {" "}
                  {action}
                </Text>
              </Text>
           <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              <Text style={styles.subText} accessible={false}>
                Drop by any of our Sparklight stores to pick up your equipment.
                Just a quick reminder to bring your photo ID and account number
                along with you. See you soon!
              </Text>
              
                
                <Text
                  style={[
                    styles.subText,
                    {
                      color: "#353091",
                      textDecorationLine: "underline",
                      fontWeight: "bold",
                    },
                  ]}
                  accessibilityLabel="Sparklight Store Locations and Hours"
                  accessibilityRole="link"
                  accessibilityHint="Opens Sparklight Store Locator webpage"
                  accessible={true}
                  onPress={() => {
                    Linking.openURL("https://www.sparklight.com/store-locator");
                  }}
                >
                  Sparklight Store Locations and Hours.
                </Text>
                
              
              </View>
              <View style={{ flexDirection: "row", flexWrap: "wrap" , marginTop:8}}>
              <Text style={styles.subText}>
                If you have any questions, please call{" "}
              </Text>
              <Text
                  style={[
                    styles.subText,
                    {
                      color: "#353091",
                      textDecorationLine: "underline",
                      fontWeight: "bold",
                    },
                  ]}
                  onPress={() => Linking.openURL("tel:8776922253")}
                  accessibilityLabel="Call 877-692-2253"
                  accessibilityRole="link"
                  accessible={true}
                >
                  877-692-2253
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={{ marginHorizontal: 24, marginBottom: 20 }}>
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
    
  },
  infoCircleIcon: {
    width: 16, // typical icon width
    height: 16, // match the font size of statusText
    marginTop: 4, // fine-tune vertical alignment if needed
    overflow: "hidden",
  },
};

export default MobilePilotLandingPage;
