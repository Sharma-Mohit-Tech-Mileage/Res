import React from "react";
import SitecoreBanner from "./SitecoreBanner";
import {
  View,
  Text,
  StyleSheet,
  Image,
  useWindowDimensions,
  Linking,
} from "react-native";
import { FontFamily, FontSize, Color, Padding } from "../../../GlobalStyles";
import PlayIcon from "../../../assets/svgs/PlayIcon";
import { useFeatureFlag } from "../../contexts/Featureflagscontext";
import FeatureFlags from "../../config/Featureflags";
import { wp } from "../../utils/responsive";
import Touchable from "../common/customui/Touchable";
import { Title } from "../common/customui/Typography";

const WelcomeCard = () => {
  const isNewDashboardEnabled = useFeatureFlag(
    FeatureFlags.DASHBOARD_NEW_LAYOUT,
    false
  );
  const videoId = "C3cMQoWxv6I";
  const { width: screenWidth } = useWindowDimensions();
  const heroSource = require("../../../assets/generic-mobile-hero-woman.png");

  const renderWelcomeBanner = () => {
    return (
      <View style={styles.container}>
        {/* <Text style={styles.title} >We're Excited to Connect with you!</Text> */}

        <View style={[styles.videoContainer, { aspectRatio: 2 }]}>
          {/*accessible={true}
       accessibilityLabel="Welcome to Sparklight, video title."
       accessibilityRole="link">*/}
          {/* <VideoPlayer videoId={videoId} /> */}
          <Image
            source={heroSource}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
            accessible={false}
            importantForAccessibility="no"
          />
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
          <View
            style={[
              styles.titleContainer,
              { maxWidth: Math.max(195, screenWidth * 0.45) },
            ]}
            accessible={true}
            accessibilityRole="header"
            accessibilityLevel={1}
            accessibilityLabel="We’re excited to get you connected!"
          >
            <Title
              style={styles.title}
              accessible={false}
              importantForAccessibility="no"
              maxFontSizeMultiplier={1.2}
            >
              We’re excited to get you connected!
            </Title>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {isNewDashboardEnabled ? <SitecoreBanner /> : renderWelcomeBanner()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    backgroundColor: Color.sparklightWhite,
    marginBottom: Padding.p_base,
  },
  titleContainer: {
    position: "absolute",
    top: 30,
    left: 20,
    right: 20,
    maxWidth: 195,
  },
  title: {
    lineHeight: 26,
    marginBottom: Padding.p_5xl,
    flexWrap: "wrap",
    flexShrink: 1,
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
    fontSize: FontSize.RadioCanadaSemiBold_size,
    color: Color.sparklightGray1,
    fontFamily: FontFamily.RadioCanadaRegular,
  },
});

export default WelcomeCard;
