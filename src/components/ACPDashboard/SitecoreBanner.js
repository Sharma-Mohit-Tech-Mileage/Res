import React, { useCallback, useState } from "react";
import {
  AppState,
  ImageBackground,
  Linking,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getBanner } from "../../network/apis/sitecore/banner.service";
import Touchable from "../common/customui/Touchable";
import { Color, FontFamily } from "../../styles/GlobalStyles";

export default function SitecoreBanner({ presentation = "cms", fallback = null }) {
  const [requestFailed, setRequestFailed] = useState(false);
  const [banner, setBanner] = useState(null);
  const [failedImage, setFailedImage] = useState(null);
  const [linkError, setLinkError] = useState(false);
  const [cardWidth, setCardWidth] = useState(0);
  const { width } = useWindowDimensions();
  useFocusEffect(
    useCallback(() => {
      let mounted = true;
      let request = 0;
      const refresh = async () => {
        const version = ++request;
        try {
          const next = await getBanner();
          if (mounted && version === request) {
            setRequestFailed(false);
            setBanner(next);
            setFailedImage(null);
            setLinkError(false);
          }
        } catch (_) {
          if (mounted && version === request) {
            setRequestFailed(true);
            setBanner(null);
          }
        }
      };
      refresh();
      const subscription = AppState.addEventListener("change", (state) => {
        if (state === "active") {
          refresh();
        }
      });
      return () => {
        mounted = false;
        subscription.remove();
      };
    }, []),
  );

  if (requestFailed) {
    return fallback;
  }
  if (!banner) {
    return null;
  }
  const tablet = width >= 768;
  const selectedImage = tablet
    ? banner.tabletImage || banner.phoneImage
    : banner.phoneImage || banner.tabletImage;
  const uri = selectedImage !== failedImage ? selectedImage : null;
  // These placements retain reference sizing while honoring CMS composition.
  const referencePresentation = presentation === "phone-left-white";
  const alignment = banner.alignment;
  const lightText = !banner.lightText;
  const whiteReference = referencePresentation && banner.lightText;
  const tabletScale = (cardWidth || width) / 2000;
  const rightReference = referencePresentation && alignment === "right";
  const referenceScale = (cardWidth || width) / (tablet ? 2000 : 1086);
  const position = { left: "flex-start", center: "center", right: "flex-end" }[
    alignment
  ];
  // Apply CMS alignment to both the column and its copy/CTA.
  const textAlignment = rightReference ? "left" : alignment;
  const contentAlignment = rightReference ? "flex-start" : position;
  // CMS Light artwork uses purple copy; Dark artwork uses white copy.
  const foreground = whiteReference
    ? Color.colorMidnightblue
    : lightText
    ? "#FFFFFF"
    : "#79246C";
  const eyebrowColor = whiteReference
    ? Color.sparklightPrimaryPurple
    : foreground;
  const buttonBackground = lightText
    ? "#FFFFFF"
    : Color.sparklightPrimaryPurple;
  const buttonForeground = lightText
    ? Color.sparklightPrimaryPurple
    : "#FFFFFF";
  const compact = (cardWidth || width) < 340;
  const backgroundImageStyle = referencePresentation
    ? styles.referenceBackgroundImage
    : styles.backgroundImage;
  const openCta = async () => {
    try {
      await Linking.openURL(banner.ctaUrl);
      setLinkError(false);
    } catch (_) {
      setLinkError(true);
    }
  };
  return (
    <View
      style={styles.container}
      onLayout={(event) => setCardWidth(event.nativeEvent.layout.width)}
    >
      <ImageBackground
        testID="sitecore-banner"
        source={uri ? { uri } : undefined}
        onError={() => setFailedImage(selectedImage)}
        resizeMode="cover"
        imageStyle={[
          backgroundImageStyle,
          styles.imageFit,

        ]}
        style={[
          styles.card,
          {
            minHeight: Math.max(
              referencePresentation ? 180 : 220,
              (cardWidth || width) *
                (referencePresentation
                  ? tablet
                    ? 900 / 2000
                    : 660 / 1086
                  : 220 / 354),
            ),
            backgroundColor:
              referencePresentation ? "#FFFFFF" : uri ? "transparent" : lightText ? "#79246C" : "#FFFFFF",
            alignItems: position,
          },
        ]}
      >
        <View
          testID="sitecore-banner-content"
          style={[
            styles.content,
            referencePresentation && styles.referenceContent,
            referencePresentation &&
              alignment === "left" &&
              styles.referenceLeftContent,
            referencePresentation &&
              tablet && {
                width: alignment === "left" ? "64%" : "58%",
                paddingLeft:
                  alignment === "left" ? (cardWidth || width) * 0.075 : 0,
                paddingVertical: (cardWidth || width) * 0.05,
              },
            rightReference && { width: "56.6%", paddingRight: 70 * referenceScale },
            rightReference && !tablet && { paddingVertical: 15 * referenceScale },
            rightReference && tablet && { paddingVertical: 100 * referenceScale },
            { alignSelf: position, alignItems: contentAlignment },
            compact && !referencePresentation && styles.compactContent,
          ]}
        >
          {!!banner.eyebrow && (
            <Text
              style={[
                styles.eyebrow,
                referencePresentation && !tablet && styles.referenceEyebrow,
                referencePresentation &&
                  tablet && {
                    marginBottom: 50 * tabletScale,
                  },
                rightReference && { marginBottom: 50 * referenceScale },
                tablet ? styles.tabletEyebrowText : styles.mobileEyebrowText,
                { color: eyebrowColor, textAlign: textAlignment },
              ]}
            >
              {banner.eyebrow}
            </Text>
          )}
          {!!banner.headline && (
            <Text
              accessibilityRole="header"
              style={[
                styles.headline,
                referencePresentation && !tablet && styles.referenceHeadline,
                referencePresentation &&
                  tablet && {
                    marginBottom: 80 * tabletScale,
                  },
                rightReference && { marginBottom: (tablet ? 90 : 65) * referenceScale },
                tablet ? styles.tabletHeadlineText : styles.mobileHeadlineText,
                { color: foreground, textAlign: textAlignment },
              ]}
            >
              {banner.headline}
            </Text>
          )}
          {!!banner.ctaLabel && !!banner.ctaUrl && (
            <Touchable
              accessibilityRole="link"
              accessibilityLabel={banner.ctaLabel}
              onPress={openCta}
              style={[
                styles.button,
                { backgroundColor: buttonBackground },
              ]}
            >
              <Text
                style={[
                  styles.buttonText,
                  tablet ? styles.tabletCtaText : styles.mobileCtaText,
                  { color: buttonForeground },
                ]}
              >
                {banner.ctaLabel}
              </Text>
            </Touchable>
          )}
          {linkError && (
            <Text accessibilityRole="alert" style={{ color: foreground }}>
              Unable to open this link. Please try again.
            </Text>
          )}
        </View>
      </ImageBackground>
      {!!banner.disclaimer && (
        <Text
          style={[
            styles.disclaimer,
            tablet ? styles.tabletDisclaimerText : styles.mobileDisclaimerText,
          ]}
        >
          {banner.disclaimer}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mobileEyebrowText: { fontSize: 16, lineHeight: 20, fontFamily: FontFamily.RadioCanadaSemiBold, fontWeight: "600" },
  tabletEyebrowText: { fontSize: 18, lineHeight: 35, fontFamily: FontFamily.RadioCanadaSemiBold, fontWeight: "600" },
  mobileHeadlineText: { fontSize: 20, lineHeight: 25, fontFamily: FontFamily.RadioCanadaBold, fontWeight: "700" },
  tabletHeadlineText: { fontSize: 28, lineHeight: 35, fontFamily: FontFamily.RadioCanadaBold, fontWeight: "700" },
  mobileCtaText: { fontSize: 18, lineHeight: 25, fontFamily: FontFamily.RadioCanadaSemiBold, fontWeight: "600" },
  tabletCtaText: { fontSize: 20, lineHeight: 35, fontFamily: FontFamily.RadioCanadaSemiBold, fontWeight: "600" },
  mobileDisclaimerText: { fontSize: 12, lineHeight: 16, fontFamily: FontFamily.RadioCanadaRegular, fontWeight: "400" },
  tabletDisclaimerText: { fontSize: 16, lineHeight: 16, fontFamily: FontFamily.RadioCanadaRegular, fontWeight: "400" },
  container: {
    width: "100%",
    alignSelf: "stretch",
    backgroundColor: Color.sparklightWhite,
    borderWidth: 0,
    borderRadius: 0,
    overflow: "hidden",
  },
  card: { width: "100%", justifyContent: "center", overflow: "hidden" },
  imageFit: {
    width: "100%",
    height: "100%",
  },
  referenceBackgroundImage: { resizeMode: "cover" },
  backgroundImage: {
    width: "120%",
    height: "120%",
    resizeMode: "cover",
    transform: [{ scale: 1.4 }, { translateY: 12 }, { translateX: 18 }],
  },
  content: { width: "60%", paddingVertical: 28, paddingHorizontal: 16 },
  referenceLeftContent: { paddingLeft: 16, paddingRight: 0 },
  referenceContent: {
    width: "58%",
    paddingVertical: 20,
    paddingLeft: 0,
    paddingRight: 16,
  },
  referenceEyebrow: { fontSize: 12, lineHeight: 15, marginBottom: 12 },
  referenceHeadline: { marginBottom: 22 },
  referenceButton: { minHeight: 36, paddingVertical: 6, paddingHorizontal: 22 },
  referenceButtonText: { fontSize: 14 },
  compactContent: { width: "64%", paddingHorizontal: 12 },
  eyebrow: {
    width: "100%",
    flexShrink: 1,
    fontFamily: FontFamily.RadioCanadaSemiBold,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  headline: {
    width: "100%",
    flexShrink: 1,
    marginBottom: 14,
  },
  button: {
    maxWidth: "100%",
    minHeight: 48,
    borderRadius: 50,
    paddingHorizontal: 22,
    paddingVertical: 8,
    justifyContent: "center",
  },
  buttonText: {
    flexShrink: 1,
    fontFamily: FontFamily.RadioCanadaSemiBold,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  disclaimer: {
    width: "84%",
    alignSelf: "center",
    flexShrink: 1,
    marginTop: 10,
    marginBottom: 8,
    textAlign: "center",
    color: Color.colorblack_100,
  },
});
