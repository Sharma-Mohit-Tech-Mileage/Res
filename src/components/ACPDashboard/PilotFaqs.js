import React from "react";
import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import { FontFamily, FontSize, Color, Border } from "../../../GlobalStyles";
import { card } from "../../styles/utilities";
import { useNavigation } from "@react-navigation/native";
import AppStyles from "../../styles/AppStyles";
import { Hyperlink, SectionTitle } from "../common/customui/Typography";

// Card has wp("92%") width minus its own marginHorizontal:8 — give the image the same span.
const SCREEN_WIDTH = Dimensions.get("window").width;
const IMAGE_WIDTH = SCREEN_WIDTH - 16;

const PromoImage = require("../../../assets/sparklight-tech-app.jpg");

const PilotFaqs = () => {
  const navigation = useNavigation();
  
  return (
    <View style={[AppStyles.card, styles.container]}>
      <View
        style={styles.titleContainer}
        accessible={true}
        accessibilityRole="header" accessibilityLevel={2} accessibilityHint="Header"
      >
        <SectionTitle accessible={false} importantForAccessibility="no">
          Service Activation
        </SectionTitle>
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
      
      <View style={styles.linkWrapper}>
        <Hyperlink
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
        </Hyperlink>
      </View>
      
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
  titleContainer: {
    marginHorizontal: 24,
    marginTop: 5,
  },
  description: {
    fontFamily: FontFamily.RadioCanadaRegular,
    fontSize: FontSize.size_base,
    color: "#000000",
    fontWeight: "400",
    margin: 24,
    lineHeight: 24,
    marginTop: 12,
  },
  linkWrapper: {
    marginHorizontal: 24,
    marginBottom: 24,
  },
  imageContainer: {
    width: IMAGE_WIDTH,
    // Cap at native asset width (326px) and center so iPad never upscales/blurs.
    maxWidth: 315,
    alignSelf: "center",
    overflow: "hidden",
  },
  promoImage: {
    width: IMAGE_WIDTH,
    maxWidth: 315,
    aspectRatio: 1.92,
    alignSelf: "center",
    borderBottomLeftRadius: Border.br_5xs,
    borderBottomRightRadius: Border.br_5xs,
    resizeMode: "cover",
  },
});
   
export default PilotFaqs;
