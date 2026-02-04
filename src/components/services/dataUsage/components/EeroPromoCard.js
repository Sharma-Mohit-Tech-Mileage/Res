/**
 * EeroPromoCard Component
 * Path: src/components/services/dataUsage/components/EeroPromoCard.js
 *
 * Displays eero app promo with:
 * - Deep linking to iOS/Android app stores
 * - Phone mockup illustration (CSS-only)
 * - Dark card design
 */

import React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Linking,
  Alert,
  Platform,
} from "react-native";
import { theme } from "../../../../styles/theme";
import { card } from "../../../../styles/utilities";

const EeroPromoCard = ({ promoData }) => {
  if (!promoData || !promoData.show) return null;

  const handleDownload = async () => {
    try {
      // Determine URL based on platform
      const url =
        Platform.OS === "ios" ? promoData.iosUrl : promoData.androidUrl;

      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert(
          "Unable to Open",
          "Cannot open the app store. Please try again later.",
        );
      }
    } catch (error) {
      console.error("Error opening eero app link:", error);
      Alert.alert(
        "Error",
        "Unable to open the download link. Please try again.",
      );
    }
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [styles.card, pressed && { opacity: 0.95 }]}
        onPress={handleDownload}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="eero app simplifies connectivity. Download Now."
        accessibilityHint="Double tap to download the eero app from your device's app store"
      >
        {/* Background Pattern */}
        <View style={styles.backgroundPattern} accessible={false} />

        <View style={styles.content}>
          {/* Left Content */}
          <View style={styles.textContent}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>eero</Text>
            </View>

            <Text style={styles.tagline}>{promoData.tagline}</Text>

            <View style={styles.downloadButton}>
              <Text style={styles.downloadText}>Download Now</Text>
            </View>
          </View>

          {/* Right Image - Phone Mockup (CSS-only) */}
          <View style={styles.imageContainer} accessible={false}>
            <View style={styles.phoneMockup}>
              <View style={styles.phoneScreen}>
                <View style={styles.screenContent}>
                  <View style={styles.eeroIcon}>
                    <Text style={styles.eeroIconText}>eero</Text>
                  </View>
                  <View style={styles.screenLines}>
                    <View style={[styles.screenLine, { width: "80%" }]} />
                    <View style={[styles.screenLine, { width: "60%" }]} />
                    <View style={[styles.screenLine, { width: "70%" }]} />
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.base,
    marginHorizontal: theme.spacing.base,
  },
  card: {
    ...card.base,
    backgroundColor: theme.colors.primaryDark,
    padding: theme.spacing.lg,
    overflow: "hidden",
    position: "relative",
  },

  // Background Pattern
  backgroundPattern: {
    position: "absolute",
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: `${theme.colors.primary}20`,
  },

  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
    zIndex: 1,
  },

  // Left Content
  textContent: {
    flex: 1,
    paddingRight: theme.spacing.base,
  },
  logoContainer: {
    marginBottom: theme.spacing.xs,
  },
  logoText: {
    fontSize: 28,
    fontFamily: theme.typography.family.semiBold,
    fontWeight: "700",
    color: theme.colors.white,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.family.regular,
    color: theme.colors.white,
    opacity: 0.9,
    marginBottom: theme.spacing.sm,
    lineHeight: 20,
  },
  downloadButton: {
    alignSelf: "flex-start",
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing.base,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.xs,
    marginTop: theme.spacing.xs,
  },
  downloadText: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.family.semiBold,
    fontWeight: "600",
    color: theme.colors.primaryDark,
  },

  // Right Image - Phone Mockup (CSS-only, no images)
  imageContainer: {
    width: 80,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  phoneMockup: {
    width: 70,
    height: 90,
    backgroundColor: theme.colors.white,
    borderRadius: 8,
    padding: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  phoneScreen: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderRadius: 5,
    padding: 6,
    overflow: "hidden",
  },
  screenContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  eeroIcon: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  eeroIconText: {
    fontSize: 8,
    fontFamily: theme.typography.family.semiBold,
    fontWeight: "700",
    color: theme.colors.white,
  },
  screenLines: {
    width: "100%",
    gap: 3,
  },
  screenLine: {
    height: 2,
    backgroundColor: theme.colors.border,
    borderRadius: 1,
  },
});

export default EeroPromoCard;
