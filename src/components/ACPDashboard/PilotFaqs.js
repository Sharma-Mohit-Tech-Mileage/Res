import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { FontFamily, FontSize, Color, Border } from "../../../GlobalStyles";
import AppStyles from "../utility/AppStyles";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";

const PromoImage = require("../../../assets/sparklight-tech-app.jpg");

const PilotFaqs = () => {
  const navigation = useNavigation();
  
  return (
    <View style={[AppStyles.card, styles.container]}>
      <View
        accessible={true}
        accessibilityRole="header" accessibilityLevel={2} accessibilityHint="Header"
      >
        <Text style={styles.title} accessible={false} importantForAccessibility="no">
          Service Activation
        </Text>
      </View>
      
      <Text
        style={styles.description}
        accessible={true}
        accessibilityRole="text"
        accessibilityLabel="For more information about Service Activation, please visit our FAQ page by clicking the link below."
      >
        For more information about Service Activation, please visit our FAQ
        page by clicking the link below.
      </Text>
      
      <Text
        style={styles.link}
        onPress={() => {
          navigation.navigate("ArticalWindowUtility", {
            url: "https://www.sparklight.com/Activation-faqs",
            name: "Sparklight Service Activation FAQs",
          });
        }}
        accessibilityRole="link"
        accessible={true}
        accessibilityLabel="Service Activation FAQs."
        accessibilityHint="Opens the Service Activation FAQs page"
      >
        Service Activation FAQ's
      </Text>
      
      <View style={styles.imageContainer}>
        <Image
          source={PromoImage}
          resizeMode="cover"
          style={styles.promoImage}
          accessibilityLabel="Decorative image of technician standing near service vehicle."
          accessible={true}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    marginHorizontal: 8,
    paddingTop: 8,
    shadowOffset: { width: 0, height: -1 },
  },
  title: {
    fontFamily: FontFamily.openSansSemiBold,
    fontSize: 20,
    color: Color.sparklightBrightPurple,
    fontWeight: "500",
    marginHorizontal: 24,
    marginTop: 5,
  },
  description: {
    fontFamily: FontFamily.openSansRegular,
    fontSize: FontSize.size_base,
    color: "#000000",
    fontWeight: "400",
    margin: 24,
    lineHeight: 24,
    marginTop: 12,
  },
  link: {
    fontFamily: FontFamily.openSansSemiBold,
    fontSize: 16,
    fontWeight: "500",
    color: Color.sparklightBrightPurple,
    textDecorationLine: "underline",
    marginHorizontal: 24,
    marginBottom: 24,
  },
  imageContainer: {
    minWidth: wp("80%"),
    overflow: "hidden",
  },
  promoImage: {
    aspectRatio: 1.92,
    borderRadius: Border.br_11xs,
    resizeMode: "cover",
  },
});

export default PilotFaqs;
