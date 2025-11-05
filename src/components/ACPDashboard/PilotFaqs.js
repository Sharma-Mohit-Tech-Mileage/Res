import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import {
  FontFamily,
  FontSize,
  Color,
  Padding,
  Border,
} from "../../../GlobalStyles";
import AppStyles from "../utility/AppStyles";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
const PromoImage = require("../../../assets/sparklight-tech-app.jpg");

const PilotFaqs = ({ navigation }) => {
  return (
    <View
      style={[AppStyles.card, { marginVertical: 16, marginHorizontal: 24, paddingTop:8,shadowOffset: { width: 1, height:-2 } }]}
      
    >
      <View
        accessible={true}
        accessibilityLabel="Service Activation section, heading level 2."
        //accessibilityRole="header"
        accessibilityRole="none"
      >
        <Text style={styles.title} accessible={false}>Service Activation</Text>
      </View>
      <Text
        style={styles.title2}
        accessible={true}
        accessibilityRole="text"
        accessibilityLabel="For more information about Service Activation, please visit our FAQ page by clicking the link below."
      >
        For more information about Service Activation, please visit our FAQ
        page by clicking the link below.
      </Text>
      <Text
        style={[
          styles.title,
          {
            fontSize: 16,
            fontFamily: FontFamily.openSansRegular,
            marginBottom: 24,
            fontWeight: "600",
            color: Color.sparklightBrightPurple,
            textDecorationLine: "underline",
            lineHeight: 18,
          },
        ]}
        onPress={() => {
          Linking.openURL("https://www.sparklight.com/support/service-activation-faq");
        }}
        accessibilityRole="link"
        accessible={true}
        accessibilityLabel="Service Activation FAQs."
        accessibilityHint="Opens the Service Activation FAQs page"
      >
        Service Activation FAQ’s
      </Text>
      <View style={{ minWidth:wp("80%"), overflow: "hidden", marginBottom: 10 }} >
      <Image
        source={PromoImage}
        resizeMode="cover"
        style={styles.promoImageSty}
        accessibilityLabel="Decorative image of technician standing near service vehicle."
        accessible={true}
      />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontFamily: FontFamily.openSansSemiBold,
    fontSize: 20,
    color: Color.sparklightBrightPurple,
    fontWeight: "600",
    marginHorizontal: 24,
    marginTop: 5,
  },
  title2: {
    fontFamily: FontFamily.openSansRegular,
    fontSize: FontSize.size_base,
    color: "#000000",
    fontWeight: "400",
    margin: 24,
    lineHeight: 24,
    marginTop: 12,
  },
  videoContainer: {
    borderRadius: Border.br_11xs,
    minHeight: 370, // Increase the box size
    backgroundColor: "#fff", // Optional: ensure background is visible
    justifyContent: "center", // Optional: center content vertically
  },
  promoImageSty: {
    aspectRatio: 1.92, // Adjust this ratio to match your image's proportions
    borderRadius: Border.br_11xs,
    resizeMode: "cover",
  },
});

export default PilotFaqs;
