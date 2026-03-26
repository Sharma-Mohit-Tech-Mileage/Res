// components/WelcomeCard.js
import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  AccessibilityInfo,
  Linking,
  Image,
  ImageBackground,
  Pressable,
} from "react-native";
import {
  FontFamily,
  FontSize,
  Color,
  Padding,
  Border,
} from "../../../GlobalStyles";

import PlayIcon from "../../../assets/svgs/PlayIcon";
import { useFeatureFlag } from "../../contexts/Featureflagscontext";
import FeatureFlags from "../../config/Featureflags";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { Env, ISUAT } from "../../network/apis/account/Constants";

const WelcomeCard = () => {
  const [isAccessibilityEnabled, setIsAccessibilityEnabled] =
    React.useState(false);
  const isMarketingBannerEnabled = useFeatureFlag(
    FeatureFlags.DASHBOARD_SPARKLIGHT_MOBILE_SECTION,
    false,
  );

  const isNewDashboardEnabled = useFeatureFlag(
    FeatureFlags.DASHBOARD_NEW_LAYOUT,
    false,
  );
  // YouTube video ID
  const videoId = "C3cMQoWxv6I";
  //  useEffect(() => {
  //     AccessibilityInfo.isScreenReaderEnabled().then(setIsAccessibilityEnabled);
  //     const subscription = AccessibilityInfo.addEventListener(
  //       'screenReaderChanged',
  //       setIsAccessibilityEnabled
  //     );

  //     return () => subscription?.remove();
  //   }, []);

  const renderOfferBanner = () => {
    return (
      <View style={[styles.videoContainer, { height: 250 }]}>
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
            left: 20,
          }}
        >
          <Text
            style={[styles.title2, { width: wp("55%") }]}
            accessible={true}
            accessibilityLabel="Sparklight Internet + Mobile"
          >
            Sparklight Internet
            <Text style={{ fontWeight: "700", color: "#000" }}> + </Text>
            Mobile
          </Text>
          <Text
            style={[styles.title, { width: 230 }]}
            accessible={true}
            accessibilityLabel="SAVE with FREE Unlimited Mobile for 1 year"
          >
            SAVE with FREE Unlimited Mobile for 1 year*
          </Text>
          <Pressable
            style={styles.offerBtn}
            onPress={() => {
              Linking.openURL(
                "https://sparklightmobile.com/?utm_source=mobileapp&utm_medium=activehome",
              );
            }}
          >
            <Text
              style={styles.getOfferButton}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Get Offer Button"
            >
              Get Offer
            </Text>
          </Pressable>
        </View>
      </View>
    );
  };

  const renderWelcomeBanner = () => {
    return (
      <>
        <ImageBackground
          source={require("../../../assets/welcome-banner-home.png")}
          style={styles.videoContainer}
          imageStyle={styles.welcomeBannerImage}
          accessible={false}
          importantForAccessibility="no"
        >
          {/* <VideoPlayer videoId={videoId} /> */}
          <Text
            style={[styles.title, styles.welcomeTitle]}
            accessible={true}
            accessibilityRole="header"
            accessibilityLevel={1}
            accessibilityLabel="We’re excited to get you connected!"
          >
            We’re excited to get you connected!
          </Text>
          <View style={styles.welcomeOverlay}>
            <Pressable
              style={styles.welcomeVideoLink}
              onPress={() => {
                Linking.openURL(`https://www.youtube.com/watch?v=${videoId}`);
              }}
              accessible={true}
              importantForAccessibility="yes"
              accessibilityRole="link"
              accessibilityLabel="Watch our welcome video"
              accessibilityHint="Double tap to watch on YouTube"
            >
              <Text style={styles.watchVideoButton}>
                Watch our welcome video
              </Text>
              <View
                style={{ marginLeft: 5, alignSelf: "center", marginTop: 3 }}
              >
                <PlayIcon />
              </View>
            </Pressable>
          </View>
        </ImageBackground>
        {/* {isAccessibilityEnabled && (
          <>
            <Text
              onPress={() => {
                Linking.openURL(`https://www.youtube.com/watch?v=${videoId}`);
              }}
              style={[
                styles.accessibilityText,
                {
                  textDecorationLine: "underline",
                  textDecorationColor: Color.colorMidnightblue,
                },
              ]}
              accessibilityLabel="Video player loaded"
              accessibilityHint="Double tap to watch on YouTube"
            >
              Watch on YouTube
            </Text>
            <Text
              style={styles.accessibilityText}
              accessibilityLabel="Video player loaded"
              accessibilityHint="Double tap to watch on YouTube"
            >
              {`Welcomo to Sparklight Veo Transcription
            What is great intemet? Is it strong? Is it fast? Is liable?
            At Sparklight, we know connection goes way beyond technology. From Monday morning meetings to Friday • nights with friends-and everything in between-the best connections are always there right when you nee d them.
            So how do you know it's great internet? Because it works.
            Were Sparklight, and we're always working for you.`}
            </Text>
          </>
        )} */}
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
  title2: {
    fontFamily: FontFamily.openSansSemiBold,
    fontSize: FontSize.size_base,
    lineHeight: 26,
    color: Color.sparklightBrightPurple,
    marginBottom: Padding.p_5xs,
    fontWeight: "600",
  },
  videoContainer: {
    overflow: "hidden",
    height: 200,
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
    top: 170,
    width: "100%",
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  welcomeVideoLink: {
    flexDirection: "row",
    marginTop: 5,
    marginLeft: 20,
  },
  accessibilityText: {
    marginTop: Padding.p_sm,
    fontSize: FontSize.size_sm,
    color: Color.colorGray_200,
    fontFamily: FontFamily.openSansRegular,
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
    fontSize: FontSize.size_base,
    fontWeight: "400",
    width: "100%",
    marginTop: 8,
    maxWidth: wp("80%"),
    alignSelf: "center",
    marginHorizontal: 12,
    flexShrink: 1,
    textAlign: "left",
  },
  getOfferButton: {
    color: Color.sparklightWhite,
    fontFamily: FontFamily.openSansSemiBold,
    fontSize: FontSize.size_lg,
    fontWeight: "600",
    textAlign: "center",
  },
  offerBtn: {
    width: 120,
    backgroundColor: Color.sparklightBrightPurple,
    borderRadius: 50,
    padding: Padding.p_base,
  },
});

export default WelcomeCard;
