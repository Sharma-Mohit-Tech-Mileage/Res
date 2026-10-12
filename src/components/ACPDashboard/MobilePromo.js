import React from "react";
import { View, StyleSheet, ImageBackground, Linking, Text } from "react-native";

import { Border } from "../../styles/GlobalStyles";

import FeatureCard from "./FeatureCardMobile";
import { useFeatureFlag } from "../../contexts/Featureflagscontext";
import FeatureFlags from "../../config/Featureflags";
import SitecoreBanner from "./SitecoreBanner";
import AppStyles from "../../styles/AppStyles";
import { assetWidthCap } from "../../utils/responsive";

const PromoImage = require("../../../assets/man-on-mobile-phone-app.jpg");

const MobilePromo = () => {
  const showSparklightMobile = useFeatureFlag(
    FeatureFlags.DASHBOARD_SPARKLIGHT_MOBILE_SECTION
  );

  const handleAddMobile = () => {
    Linking.openURL(
      "https://sparklightmobile.com/?utm_source=mobileapp&utm_medium=pendingact"
    );
  };

  if (showSparklightMobile) {
    return <SitecoreBanner presentation="phone-right-gradient" />;
  }

  return (
    <>
      <View style={[AppStyles.card, styles.container]}>
        <>
          <View style={[styles.imageContainer]}>
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
        </>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 8,
  },
  imageContainer: {
    ...assetWidthCap(PromoImage),
    overflow: "hidden",
  },
  promoImage: {
    ...assetWidthCap(PromoImage),
    aspectRatio: 1.1,
  },
  promoImageBackground: {
    resizeMode: "cover",
    borderTopLeftRadius: Border.br_5xs,
    borderTopRightRadius: Border.br_5xs,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
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
});

export default MobilePromo;
