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
import FeatureCard from "./FeatureCardMobile";
const PromoImage = require("../../../assets/man-on-mobile-phone-app.jpg");

const MobilePromo = ({ navigation }) => {
  return (
    <View
      style={[AppStyles.card, { marginVertical: 10, marginHorizontal: 24 }]}
     
    >
      <View style={styles.imageContainer}
      accessible={true}
      accessibilityLabel="Smiling man holding a phone"
      accessibilityRole="image">
        <Image source={PromoImage} resizeMode='stretch' style={styles.promoImageSty}  />
      </View>

      <FeatureCard
        isLoading={false}
        title="Paperless Billing"
        features={["Reliable 5G National Coverage", "Unlimited Talk & Text", "No Annual Contracts","Easy to Switch, Keep Your Number"]}
        buttonText={"Add Sparklight Mobile"}
        buttonVariant={"primary"}
        isActive={true}
        onButtonPress={() =>
          navigation.navigate("account", { screen: "Notifications" })
        }

      />
    </View>
  );
};

const styles = StyleSheet.create({
    title: {
        fontFamily: FontFamily.openSansSemiBold,
        fontSize: FontSize.size_5xl,
        color: Color.colorGray_200,
        marginBottom: Padding.p_5xl,
        fontWeight: "700",
    },
    imageContainer: {
        borderRadius: Border.br_11xs,
        alignSelf: "center",
        overflow: "hidden",
        marginBottom: 20,
        width: "100%",
    },
    promoImageSty: {
    width: "100%",
    aspectRatio: 1.1, // Adjust the ratio as needed (e.g., 2 for 2:1 width:height)
    resizeMode: "cover",
},
});

export default MobilePromo;
