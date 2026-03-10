import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Linking,
  Platform,
  Alert,
  Animated,
  Easing,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Svg, Circle, Path } from "react-native-svg";
import { theme } from "../../../../styles/theme";

// ── Animated Wi-Fi rings (decorative) ──
const WifiRings = () => (
  <View style={styles.ringsContainer} pointerEvents="none">
    <View style={[styles.ring, styles.ringOuter]} />
    <View style={[styles.ring, styles.ringMiddle]} />
    <View style={[styles.ring, styles.ringInner]} />
  </View>
);

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

const EeroPromoCard = () => {
  // ── Subtle pulse animation on the status dot ──
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

  const handleDownload = async () => {
    const url =
      Platform.OS === "ios"
        ? "https://apps.apple.com/us/app/eero-wifi-system/id1023499075"
        : "https://play.google.com/store/apps/details?id=com.eero.android&pcampaignid=web_share";

    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Error", `Unable to open ${storeName}`);
      }
    } catch (error) {
      console.error(`Error opening ${storeName}:`, error);
      Alert.alert("Error", `Unable to open ${storeName}`);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [
          styles.cardWrapper,
          pressed && styles.cardPressed,
        ]}
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
          <WifiRings />
          <WifiWatermark />

          {/* Content */}
          <View style={styles.content}>
            {/* Tag line with pulse dot — hidden from screen reader */}
            <View
              style={styles.tagRow}
              accessibilityElementsHidden={true}
              importantForAccessibility="no-hide-descendants"
            >
              <Animated.View
                style={[styles.statusDot, { opacity: pulseAnim }]}
              />
              <Text style={styles.tagText}>WHOLE-HOME WI-FI</Text>
            </View>

            {/* eero brand name */}
            <Text style={styles.brandName}>eero</Text>

            {/* Description */}
            <Text style={styles.description}>
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
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: theme.spacing.base,
  },

  cardWrapper: {
    borderRadius: 18,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
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

  // ── Decorative rings (top-right) ──
  ringsContainer: {
    position: "absolute",
    top: -30,
    right: -30,
  },
  ring: {
    position: "absolute",
    borderRadius: 999,
    borderWidth: 1,
  },
  ringOuter: {
    width: 160,
    height: 160,
    borderColor: "rgba(38,48,103,0.35)",
  },
  ringMiddle: {
    width: 120,
    height: 120,
    top: 20,
    left: 20,
    borderColor: "rgba(38,48,103,0.2)",
  },
  ringInner: {
    width: 80,
    height: 80,
    top: 40,
    left: 40,
    borderColor: "rgba(38,48,103,0.12)",
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

  tagRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#2ecc71",
  },
  tagText: {
    fontSize: 10,
    fontFamily: theme.typography.family.semiBold,
    letterSpacing: 1.5,
    color: "rgba(255,255,255,0.7)",
  },

  brandName: {
    fontSize: 32,
    fontFamily: theme.typography.family.semiBold,
    color: "#FFFFFF",
    marginBottom: 6,
  },

  description: {
    fontSize: 14,
    lineHeight: 21,
    fontFamily: theme.typography.family.regular,
    color: "rgba(255,255,255,0.85)",
    marginBottom: 20,
    maxWidth: 240,
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
    backgroundColor: theme.colors.upload,
  },
  ctaText: {
    fontSize: 14,
    fontFamily: theme.typography.family.semiBold,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  freeLabel: {
    fontSize: 11,
    color: "rgba(255,255,255,0.35)",
  },
});

export default EeroPromoCard;