import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import {
  FontFamily,
  FontSize,
  Color,
  Padding,
  Border,
} from "../../../GlobalStyles";
import AppStyles from "../common/styles/AppStyles";
const PromoImage = require("../../../assets/sparklight-tech-app.jpg");

const PilotFaqs = ({ navigation }) => {
  return (
    <View
      style={[AppStyles.card, { marginVertical: 10, marginHorizontal: 24 }]}
    >
      <View style={styles.videoContainer}>
        <Text style={styles.title}>Service Activation</Text>

        <Text style={styles.title2}>
          For more information about Service Activation, please visit our FAQ
          page by clicking the link below.
        </Text>

        <Text
          style={[
            styles.title,
            {
              fontSize: FontSize.size_lg,
              fontFamily: FontFamily.openSansRegular,
              marginBottom: 24,
              color: Color.sparklightBrightPurple,
              textDecorationLine: "underline",
            },
          ]}
          onPress={() => {
            // Replace with your actual FAQ URL
            Linking.openURL("https://www.sparklight.com/support/service-activation-faq");
          }}
          accessibilityRole="link"
          accessibilityLabel="Service Activation FAQs, link"
        >
          Service Activation FAQ’s
        </Text>
        <Image source={PromoImage} resizeMode="contain" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontFamily: FontFamily.openSansSemiBold,
    fontSize: FontSize.size_5xl,
    color: Color.sparklightBrightPurple,
    fontWeight: "700",
    marginHorizontal: 24,
    marginTop: 10,
  },
  title2: {
    fontFamily: FontFamily.openSansSemiBold,
    fontSize: FontSize.size_base,
    color: Color.colorGray_200,
    fontWeight: "600",
    margin: 24,
    lineHeight: 24,
  },
  videoContainer: {
    borderRadius: Border.br_11xs,
  },
});

export default PilotFaqs;
