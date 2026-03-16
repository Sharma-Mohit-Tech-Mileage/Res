import React from "react";
import { View, StyleSheet, Image, Linking, Text, Pressable } from "react-native";
import { FontFamily, FontSize, Color, Padding, Border } from "../../../GlobalStyles";
import AppStyles from "../utility/AppStyles";
import FeatureCard from "./FeatureCardMobile";
import { useNavigation } from "@react-navigation/native";
import { useFeatureFlag } from "../../contexts/Featureflagscontext";
import FeatureFlags from "../../config/Featureflags";
const PromoImage = require("../../../assets/man-on-mobile-phone-app.jpg");

const MobilePromo = () => {
  const navigation = useNavigation();

   const showSparklightMobile = useFeatureFlag(
      FeatureFlags.DASHBOARD_SPARKLIGHT_MOBILE_SECTION
    );

  const handleAddMobile = () => {
    Linking.openURL("https://sparklightmobile.com/?utm_source=mobileapp&utm_medium=pendingact");
  };


  const renderOfferBanner = () => {
      return (
        <View style={[{overflow:'hidden', height:260}]}>
          {/* <VideoPlayer videoId={videoId} /> */}
  
          <Image
            source={require("../../../assets/offer-banner-home.jpg")}
            style={{ width: "100%", height: "100%" }}
            resizeMode='stretch'
          />
        <View style={{flexDirection:'column', position: "absolute", top: 10, left: 15}}>
          <Text
            style={[
              styles.title2,
              {  width: 230 },
            ]}
            accessible={true}
            accessibilityLabel="Sparklight Internet + Mobile"
          >
            Sparklight Internet 
           <Text style={{fontWeight: "700",color:'#000'}}> + </Text>
            Mobile
          </Text>
          <Text
            style={[
              styles.title,
              {  width: 200 },
            ]}
            accessible={true}
            accessibilityLabel="SAVE with FREE Unlimited Mobile for 1 year"
          >
            SAVE with FREE Unlimited Mobile for 1 year
          </Text>
          <Pressable
            style={{ width:120, marginTop: 5 ,backgroundColor: Color.sparklightBrightPurple,borderRadius: 50,padding:Padding.p_base}}
            onPress={handleAddMobile}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Get Offer Button"
          >
            <Text style={{color: Color.sparklightWhite,fontFamily: FontFamily.openSansSemiBold,fontSize: FontSize.size_lg,fontWeight: "600",textAlign:'center'}} accessible={true} accessibilityRole="button" accessibilityLabel="Get Offer Button">
              Get Offer
            </Text>
            </Pressable>
          </View>
        </View>
      );
    };
  

  return (
    <View style={[AppStyles.card, styles.container]}>
      {showSparklightMobile ?renderOfferBanner() : (
        <>
      <View style={styles.imageContainer}>
         <Image
          accessible={true}
          accessibilityRole="header" accessibilityLevel={2} accessibilityHint="Header"
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
      </>)}
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
  },title: {
    fontFamily: FontFamily.openSansRegular,
    fontSize: FontSize.size_5xl,
    lineHeight: 26,
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
  },
});

export default MobilePromo;
