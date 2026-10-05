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

export default function SitecoreBanner({ presentation = "cms" }) {
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
            setBanner(next);
            setFailedImage(null);
            setLinkError(false);
          }
        } catch (_) {
          if (mounted && version === request) {
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

  if (!banner) {
    return null;
  }
  const tablet = width >= 768;
  const selectedImage = tablet
    ? banner.tabletImage || banner.phoneImage
    : banner.phoneImage || banner.tabletImage;
  const uri = selectedImage !== failedImage ? selectedImage : null;
  // These placements use the approved phone-left, white-background design.
  // Other placements can continue using CMS-controlled alignment and theme.
  const referencePresentation = presentation === "phone-left-white";
  const alignment = referencePresentation ? "right" : banner.alignment;
  const lightText = referencePresentation ? false : banner.lightText;
  const position = { left: "flex-start", center: "center", right: "flex-end" }[
    alignment
  ];
  // Alignment selects the content column. Side columns retain a shared
  // leading edge for copy and CTA, matching the CMS banner compositions.
  const textAlignment = alignment === "center" ? "center" : "left";
  const contentAlignment = alignment === "center" ? "center" : "flex-start";
  // CMS theme describes foreground contrast; do not infer colors from image pixels.
  const foreground = lightText ? Color.colorMidnightblue :  "#FFFFFF"
  const eyebrowColor = lightText ? Color.sparklightPrimaryPurple : "#FFFFFF" 
  const buttonBackground = lightText
    ? "#FFFFFF"
    : Color.sparklightPrimaryPurple;
  const buttonForeground = lightText
    ? Color.sparklightPrimaryPurple
    : "#FFFFFF";
  const compact = (cardWidth || width) < 340;
  const backgroundImageStyle = referencePresentation
    ? tablet
      ? styles.referenceTabletBackgroundImage
      : styles.referenceBackgroundImage
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
        imageStyle={[backgroundImageStyle, styles.imageFit]}
        style={[
          styles.card,
          {
            minHeight: Math.max(
              referencePresentation ? 180 : 220,
              (cardWidth || width) *
                (referencePresentation ? 0.35 : 220 / 354),
            ),
            backgroundColor: lightText ? "#79246C" : "#FFFFFF",
            alignItems: position,
          },
        ]}
      >
        <View
          testID="sitecore-banner-content"
          style={[
            styles.content,
            referencePresentation && styles.referenceContent,
            { alignItems: contentAlignment, position: (contentAlignment==='flex-start')? 'absolute':'relative', left:24,top:24 },
            compact && styles.compactContent,
           
          ]}
        >
          {!!banner.eyebrow && (
            <Text
              style={[
                styles.eyebrow,
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
                compact && styles.compactHeadline,
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
              style={[styles.button, { backgroundColor: buttonBackground }]}
            >
              <Text style={[styles.buttonText, { color: buttonForeground }]}>
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
        <Text style={styles.disclaimer}>{banner.disclaimer}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
  referenceBackgroundImage: {
    width: "110%",
    height: "120%",
    resizeMode: "cover",
    transform: [{ scale: 1.08 }, { translateY: 10 }],
  },
  referenceTabletBackgroundImage: {
    width: "130%",
    height: "130%",
    resizeMode: "cover",
    transform: [{ scale: 1.12 }, { translateY: 18 }, { translateX: 18 }],
  },
  backgroundImage: {
    width: "120%",
    height: "120%",
    resizeMode: "cover",
    transform: [{ scale: 1.4 }, { translateY: 12 }, { translateX: 18 }],
  },
  content: { width: "60%", paddingVertical: 28, paddingHorizontal: 16 },
  referenceContent: { paddingVertical: 20 },
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
    fontFamily: FontFamily.RadioCanadaSemiBold,
    fontSize: 22,
    lineHeight: 26,
    fontWeight: "700",
    marginBottom: 14,
  },
  compactHeadline: { fontSize: 20, lineHeight: 24 },
  button: {
    maxWidth: "100%",
    minHeight: 44,
    borderRadius: 50,
    paddingHorizontal: 22,
    paddingVertical: 10,
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
    fontFamily: FontFamily.RadioCanadaRegular,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 10,
    marginBottom: 8,
    textAlign: "center",
    color: Color.colorblack_100,
  },
});
