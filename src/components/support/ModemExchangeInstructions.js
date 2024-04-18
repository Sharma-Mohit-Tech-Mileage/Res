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
import { FontFamily, Color } from "../../../GlobalStyles";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import PubSub from 'pubsub-js';

const ModemExchangeInstructions = () => {
  const navigation = useNavigation();

  // Define your instructions here
  const instructions = [
    `The average lifespan of a modem is approximately 2-3 years, although some high-quality modems can last up to 5-8 years.`,
    `Typically, high-quality modems are replaced due to becoming outdated rather than breaking down.`,
    `If you suspect that your modem is not functioning properly, please contact us or visit your nearest Sparklight office to request a modem exchange.`,
    `Our team will be happy to assist you and ensure that you have the best possible internet experience.`,
  ];

  return (
    <View style={styles.modemRebootContainer}>
      <ProfileSettingsHeader
        title="Modem Exchange Instructions"
        onPressBack={() => {
          console.log('On Back Press');
          navigation.goBack();
        }}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.card, styles.shadowProp]}>
          <Image
            style={styles.frameChild}
            resizeMode="cover"
            source={require("../../../assets/modem-reboot-inst1.png")}
          />
          <Text style={styles.heading}>How to exchange modem</Text>
          <View style={styles.separator} />
          {instructions.map((instruction, index) => (
            <View key={index} style={styles.instructionContainer}>
              <View style={styles.bulletPoint}></View>
              <Text style={styles.instructionText}>
                {instruction.includes('contact us') ? (
                  <>
                    {instruction.split('contact us')[0]}
                    <Text accessible={true}
                      accessibilityRole="link"
                      accessibilityLabel="Contact us for more information"
                      hitSlop={{ top: 20, bottom:20, left: 20, right: 20 }}
                    style={styles.linkText} onPress={() => {
                      navigation.navigate("SupportStack", {
                        isContactUs: true,
                      })
                    }}>
                      contact us
                    </Text>
                    {instruction.split('contact us')[1]}
                  </>
                ) : (
                  instruction
                )}
              </Text>
            </View>
          ))}
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
    marginTop: wp("8%"),
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: "20%",
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
  heading: {
    color: Color.sparklightGray1,
    fontFamily: FontFamily.openSansRegular,
    fontSize: 16,
    fontWeight: "700",
    alignSelf: "center",
    marginTop: 10,
  },
  separator: {
    backgroundColor: "#F4F4F5",
    height: 1,
    marginTop: 10,
    marginBottom: 10,
  },
  instructionContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  bulletPoint: {
    fontSize: 16,
    lineHeight: 24, // Adjust line height to match your text if needed
    color: Color.sparklightGray1,
  },
  instructionText: {
    flex: 1,
    paddingLeft: 10,
    paddingRight:6,
    color: Color.sparklightGray1,
    fontFamily: FontFamily.openSansRegular,
    fontSize: 16,
    fontWeight: "400",
  },
  linkText: {
    color: Color.colorMidnightblue,
    fontFamily: FontFamily.openSansSemiBold,
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: "700",
    paddingLeft:5,
    flexWrap:'wrap'
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Color.sparklightGray1,
    marginTop: 8,
    marginRight: 8,
  },
});

export default ModemExchangeInstructions;
