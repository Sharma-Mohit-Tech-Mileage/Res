import React from "react";
import { View, StyleSheet, Image, ImageBackground, Linking, Text, Pressable } from "react-native";
import { FontFamily, FontSize, Color, Padding, Border } from "../../../GlobalStyles";
import AppStyles from "../utility/AppStyles";
import FeatureCard from "./FeatureCardMobile";
import { useNavigation } from "@react-navigation/native";
import { useFeatureFlag } from "../../contexts/Featureflagscontext";
import FeatureFlags from "../../config/Featureflags";
import { Env ,ISUAT} from "../../network/apis/account/Constants";
import { widthPercentageToDP as wp , heightPercentageToDP as hp} from "react-native-responsive-screen";
const PromoImage = require("../../../assets/man-on-mobile-phone-app.jpg");

const MobilePromo = () => {
  const navigation = useNavigation();

   const showSparklightMobile = useFeatureFlag(
      FeatureFlags.DASHBOARD_SPARKLIGHT_MOBILE_SECTION
    );

  const handleAddMobile = () => {
    Linking.openURL(Env.OFFER_URL+"?utm_source=mobileapp&utm_medium=pendingact");
  };


  const renderOfferBanner = () => {
      return (
        <View style={[ {height: 250 }]}>
          {/* <VideoPlayer videoId={videoId} /> */}
  
          <Image
            source={require("../../../assets/offer-banner-home.jpg")}
            style={{ width: "100%" }}
          />
          <View
            style={{
              flexDirection: "column",
              position: "absolute",
              top: 20,
              left: 15,
              right: 15,
            }}
          >
            <Text
              style={[styles.title2, { width: 230 }]}
              accessible={true}
              accessibilityLabel="Sparklight Internet + Mobile"
            >
              Sparklight Internet
              <Text style={{ fontWeight: "700", color: "#000" }}> + </Text>
              Mobile
            </Text>
            <Text
              style={[styles.title, { width: wp("50%") }]}
              accessible={true}
              accessibilityLabel="SAVE with FREE Unlimited Mobile for 1 year"
            >
              SAVE with FREE Unlimited Mobile for 1 year*
            </Text>
            <Pressable
              style={styles.offerBtn}
              onPress={handleAddMobile}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Get Offer"
              accessibilityHint="Opens Sparklight mobile offer"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text
                style={styles.getOfferButton}
                accessible={false}
                importantForAccessibility="no"
              >
                Get Offer
              </Text>
            </Pressable>
            
            
          </View>
        </View>
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
  },title: {
    fontFamily: FontFamily.openSansRegular,
    fontSize: FontSize.size_3xl,
    lineHeight: 22,
    color: Color.colorMidnightblue,
    marginBottom: Padding.p_5xl,
    fontWeight: "700",
  },title2: {
    fontFamily: FontFamily.openSansSemiBold,
    fontSize: FontSize.size_base,
    lineHeight: 26,
    color: Color.sparklightBrightPurple,
    marginBottom: Padding.p_5xl,
    fontWeight: "600",
  },offerDesclaimer: {
    color: Color.colorblack_100,
    fontFamily: FontFamily.openSansRegular,
    fontSize: FontSize.size_base,
    fontWeight: "400",
    marginHorizontal:20,
    marginBottom:8,
    lineHeight: 20,
    flexShrink: 2,
    textAlign: "center",
  },
  getOfferButton: {
    color: Color.sparklightWhite,
    fontFamily: FontFamily.openSansSemiBold,
    fontSize: FontSize.size_lg,
    fontWeight: "600",
    textAlign: "center",
  },offerBtn: {
    width: 120,
    zIndex: 1,
    marginTop: 5,
    backgroundColor: Color.sparklightBrightPurple,
    borderRadius: 50,
    padding: Padding.p_base,
  },
});

export default MobilePromo;
