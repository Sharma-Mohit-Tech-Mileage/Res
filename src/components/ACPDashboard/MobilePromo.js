import React from "react";
import { View, StyleSheet, ImageBackground, Linking, Text, Pressable } from "react-native";
import { FontFamily, FontSize, Color } from "../../../GlobalStyles";
import AppStyles from "../utility/AppStyles";
import FeatureCard from "./FeatureCardMobile";
import { useFeatureFlag } from "../../contexts/Featureflagscontext";
import FeatureFlags from "../../config/Featureflags";

const PromoImage = require("../../../assets/man-on-mobile-phone-app.jpg");

const MobilePromo = () => {
  const showSparklightMobile = useFeatureFlag(
    FeatureFlags.DASHBOARD_SPARKLIGHT_MOBILE_SECTION,
  );

  const handleAddMobile = () => {
    Linking.openURL(
      "https://sparklightmobile.com/?utm_source=mobileapp&utm_medium=pendingact",
    );
  };

  const renderOfferBanner = () => {
    return (
      <ImageBackground
        source={require("../../../assets/offer-banner-home.jpg")}
        style={styles.offerCard}
        resizeMode="cover"
        accessible={false}
        importantForAccessibility="no"
      >
        <View style={styles.offerContent}>
          <Text
            style={styles.offerEyebrow}
            accessible={true}
            accessibilityLabel="Sparklight Internet plus Mobile"
            allowFontScaling={true}
          >
            Sparklight Internet
            <Text style={styles.offerEyebrowPlus}> + </Text>
            Mobile
          </Text>
          <Text
            style={styles.offerHeadline}
            accessible={true}
            accessibilityRole="header"
            accessibilityLabel="SAVE with FREE Unlimited Mobile for 1 year"
            allowFontScaling={true}
          >
            SAVE with FREE Unlimited Mobile for 1 year*
          </Text>
          <Pressable
            style={({ pressed }) => [
              styles.offerBtn,
              pressed && styles.offerBtnPressed,
            ]}
            onPress={handleAddMobile}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Get Offer"
            accessibilityHint="Opens Sparklight mobile offer"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.getOfferButton} importantForAccessibility="no">
              Get Offer
            </Text>
          </Pressable>
        </View>
      </ImageBackground>
    );
  };
  

  return (
    <>
    <View style={[AppStyles.card, styles.container]}>
      {showSparklightMobile ? renderOfferBanner() : (
        <>
      <View style={styles.imageContainer}>
         <ImageBackground
          source={PromoImage}
          resizeMode="stretch"
          style={styles.promoImage}
          imageStyle={styles.promoImageBackground}
          accessible={false}
          importantForAccessibility="no"
        >
          <View style={styles.promoHeadingOverlay}>
            <Text
              accessible={true}
              accessibilityRole="header"
              accessibilityLabel="Plan starting at $ 15 per month"
              accessibilityLevel={2}
              style={styles.promoHeadingAccessibilityText}
            >
              Plan starting at $ 15 per month
            </Text>
          </View>
        </ImageBackground>
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
      </>)}
    </View>
    {showSparklightMobile && <Text style={[styles.offerDesclaimer]}
              accessible={true}
              accessibilityLabel="Offer not available for FlexConnect or LIFT customers. Certain taxes and fees do not apply.">
             *Offer not available for FlexConnect or LIFT customers. Certain taxes & fees do not apply.
            </Text>}
      </>
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
  },
  promoImageBackground: {
    resizeMode: "cover",
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  promoHeadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  promoHeadingAccessibilityText: {
    color: "rgba(0,0,0,0.01)",
    fontSize: 1,
    lineHeight: 1,
  },
  offerCard: {
    width: "100%",
    aspectRatio: 354 / 225,
    overflow: "hidden",
    backgroundColor: Color.sparklightWhite,
    flexDirection: "row",
  },
  offerContent: {
    width: "60%",
    paddingVertical: 16,
    paddingLeft: 16,
    paddingRight: 8,
    justifyContent: "center",
  },
  offerEyebrow: {
    fontFamily: FontFamily.openSansSemiBold,
    fontSize: FontSize.size_base,
    color: Color.sparklightBrightPurple,
    fontWeight: "600",
    marginBottom: 6,
  },
  offerEyebrowPlus: {
    color: Color.colorblack_100,
    fontWeight: "700",
  },
  offerHeadline: {
    fontFamily: FontFamily.openSansSemiBold,
    fontSize: FontSize.size_3xl,
    lineHeight: 26,
    color: Color.colorMidnightblue,
    fontWeight: "700",
    marginBottom: 12,
  },
  offerDesclaimer: {
    color: Color.colorblack_100,
    fontFamily: FontFamily.openSansRegular,
    fontSize: FontSize.size_xs,
    lineHeight: 16,
    fontWeight: "400",
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 8,
    flexShrink: 2,
    textAlign: "center",
  },
  getOfferButton: {
    color: Color.sparklightWhite,
    fontFamily: FontFamily.openSansSemiBold,
    fontSize: FontSize.size_base,
    fontWeight: "600",
    textAlign: "center",
  },
  offerBtn: {
    alignSelf: "flex-start",
    paddingHorizontal: 22,
    paddingVertical: 10,
    backgroundColor: Color.sparklightBrightPurple,
    borderRadius: 50,
    minWidth: 110,
  },
  offerBtnPressed: {
    opacity: 0.85,
  },
});

export default MobilePromo;
