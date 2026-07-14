import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Linking,
  ImageBackground,
} from "react-native";
import { FontFamily, FontSize, Color, Padding } from "../../../GlobalStyles";
import PlayIcon from "../../../assets/svgs/PlayIcon";
import { useFeatureFlag } from "../../contexts/Featureflagscontext";
import FeatureFlags from "../../config/Featureflags";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import Touchable from "../common/customui/Touchable";

const WelcomeCard = () => {
  const isNewDashboardEnabled = useFeatureFlag(
    FeatureFlags.DASHBOARD_NEW_LAYOUT,
    false,
  );
  const videoId = "C3cMQoWxv6I";

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
            onPress={() => {
              Linking.openURL(
                "https://sparklightmobile.com/?utm_source=mobileapp&utm_medium=activehome",
              );
            }}
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

  const renderWelcomeBanner = () => {
    return (
      <>
        <ImageBackground
          source={require("../../../assets/welcome-banner-home.png")}
          style={[styles.videoContainer, { aspectRatio: 2 }]}
          imageStyle={styles.welcomeBannerImage}
          accessible={false}
          importantForAccessibility="no"
        >
          <Text
            style={[styles.title, styles.welcomeTitle]}
            accessible={true}
            accessibilityRole="header"
            accessibilityLevel={1}
            accessibilityLabel="We’re excited to get you connected!"
            maxFontSizeMultiplier={1.2}
          >
            We’re excited to get you connected!
          </Text>
          <View
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              paddingVertical: 6,
              backgroundColor: "rgba(255, 255, 255, 0.8)",
            }}
          >
            <Touchable
              minSize={0}
              style={{ flexDirection: "row", marginTop: 5, marginLeft: 20 }}
              onPress={() => {
                Linking.openURL(`https://www.youtube.com/watch?v=${videoId}`);
              }}
              accessible={true}
              accessibilityRole="link"
              accessibilityLabel="Watch welcome video"
              accessibilityHint="Double tap to watch on YouTube"
            >
              <Text style={styles.watchVideoButton} maxFontSizeMultiplier={1.2}>
                Watch our welcome video
              </Text>
              <View
                style={{ marginLeft: 5, alignSelf: "center", marginTop: 3 }}
              >
                <PlayIcon />
              </View>
            </Touchable>
          </View>

        </ImageBackground>
      </>
    );
  };

  return (
    <View style={styles.container}>
      {isNewDashboardEnabled ? renderOfferBanner() : renderWelcomeBanner()}
      {isNewDashboardEnabled && (
        <Text
            style={[styles.offerDesclaimer]}
            accessible={true}
            accessibilityLabel="Offer not available for FlexConnect or LIFT customers. Certain taxes and fees do not apply."
            maxFontSizeMultiplier={1.2}
          >
            *Offer not available for FlexConnect or LIFT customers. Certain
            taxes & fees do not apply.
          </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    backgroundColor: Color.sparklightWhite,
    marginBottom: Padding.p_base,
  },
  title: {
    fontFamily: FontFamily.openSansRegular,
    fontSize: FontSize.size_5xl,
    lineHeight: 26,
    color: Color.colorMidnightblue,
    marginBottom: Padding.p_5xl,
    fontWeight: "700",
  },
  videoContainer: {
    overflow: "hidden",
  },
  welcomeBannerImage: {
    width: "100%",
  },
  welcomeTitle: {
    position: "absolute",
    top: 50,
    left: 20,
    width: wp("55%"),
  },
  welcomeOverlay: {
    position: "absolute",
    width: "100%",
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  welcomeVideoLink: {
    flexDirection: "row",
    marginTop: 5,
    marginLeft: 20,
  },
  watchVideoButton: {
    marginVertical: Padding.p_sm,
    fontSize: FontSize.size_base,
    color: Color.colorMidnightblue,
    fontFamily: FontFamily.openSansSemiBold,
    fontWeight: "700",
  },
  offerDesclaimer: {
    color: Color.colorblack_100,
    fontFamily: FontFamily.openSansRegular,
    fontSize: FontSize.size_xs,
    lineHeight: 16,
    fontWeight: "400",
    width: "100%",
    marginTop: 10,
    maxWidth: wp("80%"),
    alignSelf: "center",
    marginHorizontal: 12,
    flexShrink: 1,
    textAlign: "center",
  },
  getOfferButton: {
    color: Color.sparklightWhite,
    fontFamily: FontFamily.openSansSemiBold,
    fontSize: FontSize.size_base,
    fontWeight: "600",
    textAlign: "center",
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

export default WelcomeCard;
