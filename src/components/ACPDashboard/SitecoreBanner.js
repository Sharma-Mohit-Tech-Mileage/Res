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
import { Color, FontFamily } from "../../../GlobalStyles";

export default function SitecoreBanner() {
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
    }, [])
  );

  if (!banner) {
    return null;
  }
  const tablet = width >= 768;
  const selectedImage = tablet
    ? banner.tabletImage || banner.phoneImage
    : banner.phoneImage || banner.tabletImage;
  const uri = selectedImage !== failedImage ? selectedImage : null;
  const position = { left: "flex-start", center: "center", right: "flex-end" }[
    banner.alignment
  ];
  // CMS theme describes foreground contrast; do not infer colors from image pixels.
  const foreground = banner.lightText ? "#FFFFFF" : Color.colorMidnightblue;
  const eyebrowColor = banner.lightText
    ? "#FFFFFF"
    : Color.sparklightPrimaryPurple;
  const buttonBackground = banner.lightText
    ? "#FFFFFF"
    : Color.sparklightPrimaryPurple;
  const buttonForeground = banner.lightText
    ? Color.sparklightPrimaryPurple
    : "#FFFFFF";
  const compact = (cardWidth || width) < 340;
  const openCta = async () => {
    try {
      await Linking.openURL(banner.ctaUrl);
      setLinkError(false);
    } catch (_) {
      setLinkError(true);
    }
  };
  return (
    <View onLayout={(event) => setCardWidth(event.nativeEvent.layout.width)}>
      <ImageBackground
        testID="sitecore-banner"
        source={uri ? { uri } : undefined}
        onError={() => setFailedImage(selectedImage)}
        resizeMode="cover"
        style={[
          styles.card,
          {
            minHeight: Math.max(225, (cardWidth * 225) / 354),
            backgroundColor: banner.lightText ? "#79246C" : "#FFFFFF",
            alignItems: position,
          },
        ]}
      >
        <View
          testID="sitecore-banner-content"
          style={[
            styles.content,
            { alignItems: position },
            compact && styles.compactContent,
          ]}
        >
          {!!banner.eyebrow && (
            <Text
              style={[
                styles.eyebrow,
                { color: eyebrowColor, textAlign: banner.alignment },
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
                { color: foreground, textAlign: banner.alignment },
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
  card: { width: "100%", justifyContent: "center", overflow: "hidden" },
  content: { width: "60%", paddingVertical: 24, paddingHorizontal: 16 },
  compactContent: { width: "64%", paddingHorizontal: 12 },
  eyebrow: {
    fontFamily: FontFamily.RadioCanadaSemiBold,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  headline: {
    fontFamily: FontFamily.RadioCanadaSemiBold,
    fontSize: 22,
    lineHeight: 26,
    fontWeight: "700",
    marginBottom: 14,
  },
  compactHeadline: { fontSize: 20, lineHeight: 24 },
  button: {
    minHeight: 44,
    borderRadius: 50,
    paddingHorizontal: 22,
    paddingVertical: 10,
    justifyContent: "center",
  },
  buttonText: {
    fontFamily: FontFamily.RadioCanadaSemiBold,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  disclaimer: {
    fontFamily: FontFamily.RadioCanadaRegular,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 10,
    marginBottom: 8,
    marginHorizontal: 16,
    textAlign: "center",
    color: Color.colorblack_100,
  },
});
