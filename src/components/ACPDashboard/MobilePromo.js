import React from "react";
import { View, StyleSheet, ImageBackground, Linking, Text } from "react-native";
import { FontFamily, FontSize, Color } from "../../../GlobalStyles";
import { card } from "../../styles/utilities";
import FeatureCard from "./FeatureCardMobile";
import { useFeatureFlag } from "../../contexts/Featureflagscontext";
import FeatureFlags from "../../config/Featureflags";
import Touchable from "../common/customui/Touchable";

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
            maxFontSizeMultiplier={1.2}
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
            maxFontSizeMultiplier={1.2}
          >
            SAVE with FREE Unlimited Mobile for 1 year*
          </Text>
          <Touchable
            minSize={0}
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
            <Text style={styles.getOfferButton} importantForAccessibility="no" maxFontSizeMultiplier={1.2}>
              Get Offer
            </Text>
          </Touchable>
        </View>
      </ImageBackground>
    );
  };
  

  return (
    <>
    <View style={[card.elevated, styles.container]}>
      {showSparklightMobile ? renderOfferBanner() : (
        <>
      <View style={styles.imageContainer}>
         <ImageBackground
          source={PromoImage}
          resizeMode="cover"
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
              accessibilityLabel="Offer not available for FlexConnect or LIFT customers. Certain taxes and fees do not apply."
              maxFontSizeMultiplier={1.2}>
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
    // Cap at native asset width (326px) so iPad never upscales/blurs.
    maxWidth: 326,
  },
  promoImage: {
    width: "100%",
    maxWidth: 326,
    alignSelf: "center",
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
    // Cap at native asset width (354px) and center so iPad never upscales/blurs.
    maxWidth: 354,
    alignSelf: "center",
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
