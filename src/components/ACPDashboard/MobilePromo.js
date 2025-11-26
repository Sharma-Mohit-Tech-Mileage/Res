import React from "react";
import { View, StyleSheet, Image, Linking } from "react-native";
import { FontFamily, FontSize, Color, Padding, Border } from "../../../GlobalStyles";
import AppStyles from "../utility/AppStyles";
import FeatureCard from "./FeatureCardMobile";
import { useNavigation } from "@react-navigation/native";

const PromoImage = require("../../../assets/man-on-mobile-phone-app.jpg");

const MobilePromo = () => {
  const navigation = useNavigation();

  const handleAddMobile = () => {
    Linking.openURL("https://sparklightmobile.com/?utm_source=mobileapp&utm_medium=pendingact");
  };

  return (
    <View style={[AppStyles.card, styles.container]}>
      <View style={styles.imageContainer}>
        <Image
          accessibilityLabel="Smiling man holding a phone. Plans starting at $15 per month, heading level 2."
          accessible={false}
          accessibilityRole="none"
          source={PromoImage}
          resizeMode="stretch"
          style={styles.promoImage}
        />
      </View>
      
      <FeatureCard
        isLoading={false}
        title="Paperless Billing"
        features={[
          "Reliable 5G National Coverage",
          "Unlimited Talk & Text",
          "No Annual Contracts",
          "Easy to Switch, Keep Your Number",
        ]}
        buttonText="Add Sparklight Mobile"
        buttonVariant="primary"
        isActive={true}
        onButtonPress={handleAddMobile}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    marginHorizontal: 8,
  },
  imageContainer: {
    alignSelf: "center",
    overflow: "hidden",
    marginBottom: 20,
    width: "100%",
  },
  promoImage: {
    width: "100%",
    aspectRatio: 1.1,
    resizeMode: "cover",
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
});

export default MobilePromo;
