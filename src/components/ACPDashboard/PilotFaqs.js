import React from "react";
import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import { FontFamily, FontSize, Color, Border } from "../../../GlobalStyles";
import { card } from "../../styles/utilities";
import { useNavigation } from "@react-navigation/native";

// Card has wp("92%") width minus its own marginHorizontal:8 — give the image the same span.
const SCREEN_WIDTH = Dimensions.get("window").width;
const IMAGE_WIDTH = SCREEN_WIDTH - 16;

const PromoImage = require("../../../assets/sparklight-tech-app.jpg");

const PilotFaqs = () => {
  const navigation = useNavigation();
  
  return (
    <View style={[card.elevated, styles.container]}>
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
          navigation.navigate("ArticleWindowUtility", {
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
    width: IMAGE_WIDTH,
    overflow: "hidden",
  },
  promoImage: {
    width: IMAGE_WIDTH,
    height: IMAGE_WIDTH / 1.92,
    borderRadius: Border.br_11xs,
    resizeMode: "cover",
  },
});

export default PilotFaqs;
