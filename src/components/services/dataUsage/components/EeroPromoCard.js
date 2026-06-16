import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Linking,
  Platform,
  Animated,
  Easing,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Svg, Circle, Path } from "react-native-svg";
import { theme } from "../../../../styles/theme";
import Touchable from "../../../common/customui/Touchable";
import InfoDialog from "../../../common/customui/InfoDialog";


// ── Wi-Fi icon (bottom-right watermark) ──
const WifiWatermark = () => (
  <View style={styles.watermark} pointerEvents="none">
    <Svg width={80} height={80} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 12.55a11 11 0 0 1 14.08 0"
        stroke="rgba(79,195,247,0.18)"
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Path
        d="M1.42 9a16 16 0 0 1 21.16 0"
        stroke="rgba(79,195,247,0.12)"
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Path
        d="M8.53 16.11a6 6 0 0 1 6.95 0"
        stroke="rgba(79,195,247,0.25)"
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Circle cx={12} cy={20} r={1} fill="rgba(79,195,247,0.22)" />
    </Svg>
  </View>
);

const EERO_DEFAULT_IOS_URL = "https://apps.apple.com/us/app/eero-wifi-system/id1023499075";
const EERO_DEFAULT_ANDROID_URL = "https://play.google.com/store/apps/details?id=com.eero.android&pcampaignid=web_share";

const EeroPromoCard = ({ promoData }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.4,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const storeName = Platform.OS === "ios" ? "App Store" : "Play Store";
  const [showError, setShowError] = useState(false);

  const handleDownload = async () => {
    const url =
      Platform.OS === "ios"
        ? (promoData?.iosUrl || EERO_DEFAULT_IOS_URL)
        : (promoData?.androidUrl || EERO_DEFAULT_ANDROID_URL);

    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        setShowError(true);
      }
    } catch {
      setShowError(true);
    }
  };

  return (
    <View style={styles.container}>
      <Touchable
        style={({ pressed }) => [
          styles.cardWrapper,
          { alignItems: 'stretch' },
          pressed && styles.cardPressed,
        ]}
        minSize={0}
        onPress={handleDownload}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`eero. Fast, reliable Wi-Fi for every room. Set up in minutes with the eero app. Download App. Available on ${storeName}.`}
        accessibilityHint={`Double tap to open ${storeName}`}
      >
        <LinearGradient
          style={styles.card}
          colors={["#0f142d", "#263067", "#0f142d"]}
          locations={[0, 0.45, 1]}
          useAngle={true}
          angle={145}
        >
          {/* Decorative elements */}
          <WifiWatermark />

          {/* Content */}
          <View style={styles.content}>


            {/* eero brand name */}
            <Text style={styles.brandName}>eero</Text>

            {/* Description */}
            <Text style={[styles.description, styles.descriptionBold]}>
              Fast, reliable Wi-Fi for every room.{"\n"}Set up in minutes with
              the eero app.
            </Text>

            {/* CTA row */}
            <View style={styles.ctaRow}>
              <View style={styles.ctaButton}>
                <Text style={styles.ctaText}>Download App</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </Touchable>
      <InfoDialog
        visible={showError}
        title="Error"
        message={`Unable to open ${storeName}`}
        onClose={() => setShowError(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: theme.spacing.base,
    marginBottom: 50,
  },

  cardWrapper: {
    borderRadius: theme.radius.lg,
    overflow: "hidden",
    ...theme.shadows.lg,
  },
  cardPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },

  card: {
    padding: 24,
    minHeight: 190,
    justifyContent: "center",
  },


  // ── Wi-Fi watermark (bottom-right) ──
  watermark: {
    position: "absolute",
    bottom: 16,
    right: 16,
    opacity: 0.9,
  },

  // ── Content ──
  content: {
    position: "relative",
    zIndex: 2,
  },

  brandName: {
    fontSize: 32,
    fontFamily: theme.typography.family.semiBold,
    color: "#FFFFFF",
    marginBottom: 6,
  },

  description: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: theme.typography.family.regular,
    color: "rgba(255,255,255,0.85)",
    marginBottom: 20,
    maxWidth: 300,
  },
  descriptionBold: {
    fontFamily: theme.typography.family.semiBold,
    fontWeight: "700",
  },

  ctaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    backgroundColor: "#FFFFFF",
  },
  ctaText: {
    fontSize: 16,
    fontFamily: theme.typography.family.semiBold,
    fontWeight: "700",
    color: theme.colors.primaryDark,
  },

});

export default EeroPromoCard;