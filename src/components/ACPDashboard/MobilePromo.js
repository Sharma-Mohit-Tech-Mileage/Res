import React from "react";
import { View, Text, StyleSheet, Image, Linking } from "react-native";
import {
  FontFamily,
  FontSize,
  Color,
  Padding,
  Border,
} from "../../../GlobalStyles";
import AppStyles from "../utility/AppStyles";
import FeatureCard from "./FeatureCardMobile";
import { useNavigation } from "@react-navigation/native";
const PromoImage = require("../../../assets/man-on-mobile-phone-app.jpg");

const MobilePromo = () => {

  const navigation=useNavigation();
  return (
    <View
      style={[AppStyles.card, { marginVertical: 10, marginHorizontal: 24 }]}
     
    >
      <View style={styles.imageContainer}
     >
      <Image accessibilityLabel="Smiling man holding a phone. Plans starting at $15 per month, heading level 2."
      accessible={false}
      accessibilityRole='none'
      source={PromoImage} resizeMode='stretch' style={styles.promoImageSty}  />
      </View>

      <FeatureCard
        isLoading={false}
        title="Paperless Billing"
        features={["Reliable 5G National Coverage", "Unlimited Talk & Text", "No Annual Contracts","Easy to Switch, Keep Your Number"]}
        buttonText={"Add Sparklight Mobile"}
        buttonVariant={"primary"}
        isActive={true}
        onButtonPress={() =>
          navigation.navigate("ArticalWindowUtility", { url: "https://sparklightmobile.com/?utm_source=mobileapp&utm_medium=pendingact", name: "Sparklight Mobile" })
           
          //Linking.openURL(" https://sparklightmobile.com/?utm_source=mobileapp&utm_medium=pendingact")
        }

      />
    </View>
  );
};

const styles = StyleSheet.create({
    title: {
        fontFamily: FontFamily.openSansRegular,
        fontSize: FontSize.size_base,
        color: Color.colorGray_200,
        marginBottom: Padding.p_5xl,
        fontWeight: "400",
    },
    imageContainer: {
        alignSelf: "center",
        overflow: "hidden",
        marginBottom: 20,
        width: "100%",
    },
    promoImageSty: {
    width: "100%",
    aspectRatio: 1.1, // Adjust the ratio as needed (e.g., 2 for 2:1 width:height)
    resizeMode: "cover",
    borderTopLeftRadius:3,
    borderTopRightRadius:3,
},
});

export default MobilePromo;
