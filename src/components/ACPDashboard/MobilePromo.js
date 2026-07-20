import React from "react";
import { View, StyleSheet, ImageBackground, Linking, Text, useWindowDimensions } from "react-native";
import { FontFamily, FontSize, Color, Border } from "../../../GlobalStyles";
import { card } from "../../styles/utilities";
import FeatureCard from "./FeatureCardMobile";
import { useFeatureFlag } from "../../contexts/Featureflagscontext";
import FeatureFlags from "../../config/Featureflags";
import Touchable from "../common/customui/Touchable";
import AppStyles from "../../styles/AppStyles";

const PromoImage = require("../../../assets/man-on-mobile-phone-app.jpg");

const MobilePromo = () => {
  const { width } = useWindowDimensions();
  const isCompactMobile = width <= 375;

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
        style={[ isCompactMobile && styles.offerCardCompact,AppStyles.card]}
        imageStyle={styles.offerCardImage}
        resizeMode="cover"
        accessible={false}
        importantForAccessibility="no"
      >
        <View style={[styles.offerContent, isCompactMobile && styles.offerContentCompact]}>
          <Text
            style={[styles.offerEyebrow, isCompactMobile && styles.offerEyebrowCompact]}
            accessible={true}
            accessibilityLabel="Sparklight Internet plus Mobile"
            maxFontSizeMultiplier={1.2}
          >
            Sparklight Internet
            <Text style={styles.offerEyebrowPlus}> + </Text>
            Mobile
          </Text>
          <Text
            style={[styles.offerHeadline, isCompactMobile && styles.offerHeadlineCompact]}
            accessible={true}
            accessibilityRole="header"
            accessibilityLabel="SAVE with FREE Unlimited Mobile for 1 year"
            maxFontSizeMultiplier={1.2}
          >
            SAVE with FREE Unlimited Mobile for 1 year*
          </Text>
          <Touchable
            minSize={0}
            onPress={handleAddMobile}
            style={[styles.offerButton, isCompactMobile && styles.offerButtonCompact]}
            accessibilityRole="button"
            accessibilityLabel="Get Offer"
          >
            <Text style={styles.getOfferButton}>Get Offer</Text>
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
    borderTopLeftRadius: Border.br_5xs,
    borderTopRightRadius: Border.br_5xs,
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
    minHeight: 225,
    overflow: "hidden",
    borderRadius: Border.br_5xs,
    backgroundColor: Color.sparklightWhite,
    flexDirection: "row",
  },
  offerCardCompact: {
    aspectRatio: undefined,
    minHeight: 235,
  },
  offerCardImage: {
    borderRadius: Border.br_5xs,
  },
  offerContent: {
    width: "60%",
    paddingVertical: 16,
    paddingLeft: 16,
    paddingRight: 10,
    justifyContent: "space-between",
  },
  offerContentCompact: {
    width: "66%",
    paddingVertical: 12,
    paddingLeft: 12,
    paddingRight: 10,
  },
  offerEyebrow: {
    fontFamily: FontFamily.openSansSemiBold,
    fontSize: FontSize.size_base,
    color: Color.sparklightBrightPurple,
    fontWeight: "600",
    marginBottom: 6,
  },
  offerEyebrowCompact: {
    fontSize: FontSize.size_sm,
    marginBottom: 4,
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
  offerHeadlineCompact: {
    fontSize: FontSize.size_lg,
    lineHeight: 22,
    marginBottom: 8,
  },
  offerButton: {
    minHeight: 44,
    borderRadius: Border.br_81xl,
    backgroundColor: Color.sparklightPrimaryPurple,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignSelf: "flex-start",
  },
  offerButtonCompact: {
    minHeight: 40,
    paddingVertical: 8,
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
});

export default MobilePromo;
