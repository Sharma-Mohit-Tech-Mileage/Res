import React, { useState, useEffect } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  AccessibilityInfo,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import ProfileSettingsHeader from "../common/ProfileSettingsHeader";
import {
  FontFamily,
  Color,
} from "../../../GlobalStyles";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import PubSub from 'pubsub-js'
import RenderText from "../common/RenderText";

const ModemReboot = () => {
  const navigation = useNavigation();

  const [screenReaderEnabled, setIsScreenReaderEnabled] = useState(false);

  useEffect(() => {
    async function getAccessibility() {
      try {
        const accessibility = await AccessibilityInfo.isScreenReaderEnabled();
        setIsScreenReaderEnabled(accessibility);
      } catch (error) {
        console.log(
          "There has been a problem with AccessibilityInfo.isScreenReaderEnabled(): " +
          error.message
        );
        setIsScreenReaderEnabled(false); // Setting a default value in case of error
      }
    }
    getAccessibility();
    const reduceMotionChangedSubscription = AccessibilityInfo.addEventListener(
      "screenReaderChanged",
      (isScreenReaderEnabled) => {
        setIsScreenReaderEnabled(isScreenReaderEnabled);
      }
    );
    return () => {
      reduceMotionChangedSubscription.remove();
    };
  }, [screenReaderEnabled]);

  const [inst1] = React.useState(
    ` button through the app. 
During the reboot, your internet service will be temporarily unavailable, and the lights on the front of the modem will start flashing. Your modem is ready once the status symbol light on the front of the modem is solid. This can take up to 10 minutes.`
  );

  const [inst2] = React.useState(
    "If you're still having issues, try a hard reboot of the modem by unplugging it from power, waiting 30 seconds, and then plugging it back in. Wait up to 10 minutes for your modem to come back online."
  );
  const [inst3] = React.useState(
    "If neither option fixes your issue, please don't hesitate to contact us for further assistance."
  );

  React.useEffect(() => {
    return () => {

    };
  }, []);

  return (
    <View style={styles.modemRebootContainer}>
      <ProfileSettingsHeader
        title="Modem Reboot Instructions"
        onPressBack={() => navigation.goBack()
        }
      />
      <ScrollView showsVerticalScrollIndicator={false} >
        <View style={{ flexDirection: "column", paddingBottom: hp('15%') }}>
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
            <Text style={styles.heading}>How to do a soft reboot</Text>
            <View
              style={{ backgroundColor: "#F4F4F5", height: 1, marginVertical: 20 }}
            />
            <Text style={styles.text}>
              {'You can reboot your modem by clicking '}
              <Text style={[styles.text, { fontWeight: '600' }]}> “Reboot Modem”</Text>{inst1}
            </Text>
          </View>

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
              source={require("../../../assets/modem-reboot-inst1.png")}
            />
            <Text style={styles.heading}>How to reboot manually</Text>
            <View
              style={{ backgroundColor: "#F4F4F5", height: 1, marginVertical: 20 }}
            />
            <Text style={styles.text}>{inst2}</Text>
          </View>
          <View
            style={[
              styles.card,
              styles.shadowProp,
              { flexDirection: "row" },
            ]}
          >
            <Image
              style={styles.contactUs}
              resizeMode='contain'
              tintColor={Color.sparklightBrightPurple}
              source={require("../../../assets/phone-outgoing-04.png")}
            />
            <RenderText
              navigation={navigation}
              splitKey={`contact us`}
              instruction={inst3}
              style={[styles.text, { width: wp('75%') }]}
              onTextPress={() => {
                navigation.navigate("SupportStack", {
                  isContactUs: true,
                });
              }}
            />
            {/* {screenReaderEnabled ? (
              <TextWithLinkVoiceOverEnabled instruction={inst3} />
            ) : (
              <TextWithLinkVoiceOverDisabled instruction={inst3} />
            )} */}

          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const TextWithLinkVoiceOverEnabled = ({ instruction }) => {
  const navigation = useNavigation();
  console.log("TextWithLinkVoiceOverEnabled");
  return instruction.includes("contact us") ? (
    <Text
      style={[styles.text, { width: wp('75%') }]}
      accessibilityLabel="If neither option fixes your issue, please don't hesitate to contact us Link for further assistance."
      onPress={() => navigation.navigate("SupportStack", { isContactUs: true })}
    >
      {instruction.split("contact us")[0]}
      <Text
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        style={styles.linkText}
      >
        contact us
      </Text>
      {instruction.split("contact us")[1]}
    </Text>
  ) : (
    <Text style={[styles.text, { width: wp('75%') }]}>{instruction}</Text>
  );
};

const TextWithLinkVoiceOverDisabled = ({ instruction }) => {
  console.log("TextWithLinkVoiceOverDisabled");
  const navigation = useNavigation();
  return (
    <Text style={[styles.text, { width: wp('75%') }]}
    >
      {instruction.includes("contact us") ? (
        <>
          {instruction.split("contact us")[0]}
          <Text

            accessibilityRole="link"
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
            style={styles.linkText}
            onPress={() => {
              navigation.navigate("SupportStack", {
                isContactUs: true,
              });
            }}
          >
            contact us
          </Text>
          {instruction.split("contact us")[1]}
        </>
      ) : (
        instruction
      )}
    </Text>
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
  }, contactUs: {
    alignSelf: "center",
    width: 30,
    height: 30,
    margin: 10
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
    marginTop: 10
  },
  text: {
    color: Color.sparklightGray1,
    fontFamily: FontFamily.openSansRegular,
    fontSize: 16,
    fontStyle: "normal",
    textAlign: "left",
    fontWeight: "400",
    paddingHorizontal: 8,
    alignSelf: "center",
  },
  linkText: {
    color: Color.colorMidnightblue,
    fontFamily: FontFamily.openSansSemiBold,
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: "700",
    paddingLeft: 5,
    flexWrap: 'wrap'
  },
});

export default ModemReboot;
