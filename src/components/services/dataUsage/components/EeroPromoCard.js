import React, { memo, useCallback, useMemo } from "react";
import { View, Text, Pressable, StyleSheet, Linking, Alert, Platform } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { theme } from "../../../../styles/theme";
import { card } from "../../../../styles/utilities";

const isValidUrl = (url) => {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();
  if (!trimmed) return false;
  return /^https?:\/\//i.test(trimmed) || /^[a-z]+:\/\//i.test(trimmed);
};

const EeroPromoCard = ({ promoData }) => {
  const show = !!promoData?.show;
  if (!show) return null;

  const storeUrl = useMemo(() => {
    const ios = promoData?.iosUrl?.trim();
    const android = promoData?.androidUrl?.trim();
    const fallback = promoData?.fallbackUrl?.trim(); // optional
    const url = Platform.OS === "ios" ? ios : android;
    return isValidUrl(url) ? url : isValidUrl(fallback) ? fallback : "";
  }, [promoData]);

  const tagline = useMemo(
    () => (promoData?.tagline?.trim() ? promoData.tagline.trim() : "Download the eero app to set up and manage your equipment."),
    [promoData]
  );

  const a11yLabel = useMemo(
    () => `Download eero app. ${tagline}`,
    [tagline]
  );

  const handleDownload = useCallback(async () => {
    try {
      if (!storeUrl) {
        Alert.alert("Link unavailable", "We can’t open the download link right now.");
        return;
      }

      const supported = await Linking.canOpenURL(storeUrl);
      if (!supported) {
        Alert.alert("Unable to Open", "Cannot open the app store. Please try again later.");
        return;
      }

      await Linking.openURL(storeUrl);
    } catch (error) {
      console.error("Error opening eero app link:", error);
      Alert.alert("Error", "Unable to open the download link. Please try again.");
    }
  }, [storeUrl]);

  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [styles.card, pressed && styles.pressed]}
        onPress={handleDownload}
        accessible
        accessibilityRole="button"
        accessibilityLabel={a11yLabel}
        accessibilityHint="Double tap to open the app store and download the eero app."
        android_ripple={{ color: `${theme.colors.white}18`, borderless: false }}
      >
        <View style={styles.backgroundPattern} accessible={false} />

        <View style={styles.content}>
          <View style={styles.textContent}>
            <View style={styles.topRow}>
              <View style={styles.logoPill} accessible={false}>
                <Text style={styles.logoText}>eero</Text>
              </View>

              <View
                style={styles.actionPill}
                accessible={false}
                importantForAccessibility="no-hide-descendants"
              >
                <Text style={styles.actionText}>Download</Text>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={18}
                  color={theme.colors.primaryDark}
                  style={{ marginLeft: 2 }}
                  accessible={false}
                />
              </View>
            </View>

            <Text style={styles.tagline} numberOfLines={3} ellipsizeMode="tail">
              {tagline}
            </Text>

            <View
              style={styles.ctaRow}
              accessible={false}
              importantForAccessibility="no-hide-descendants"
            >
              <MaterialCommunityIcons
                name="open-in-new"
                size={14}
                color={`${theme.colors.white}CC`}
                style={{ marginRight: 6 }}
                accessible={false}
              />
              <Text style={styles.ctaSubText}>
                Opens {Platform.OS === "ios" ? "App Store" : "Google Play"}
              </Text>
            </View>
          </View>

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
  pressed: { opacity: 0.96 },

  backgroundPattern: {
    position: "absolute",
    top: -52,
    right: -52,
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: `${theme.colors.primary}22`,
  },

  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
    zIndex: 1,
  },

  textContent: {
    flex: 1,
    paddingRight: theme.spacing.base,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing.xs,
  },

  logoPill: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: `${theme.colors.white}14`,
  },
  logoText: {
    fontSize: 22,
    fontFamily: theme.typography.family.semiBold,
    fontWeight: "700",
    color: theme.colors.white,
    letterSpacing: -0.4,
  },

  actionPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 6,
    borderRadius: 999,
  },
  actionText: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.family.semiBold,
    fontWeight: "700",
    color: theme.colors.primaryDark,
  },

  tagline: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.family.regular,
    color: theme.colors.white,
    opacity: 0.92,
    marginBottom: theme.spacing.sm,
    lineHeight: 20,
  },

  ctaRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  ctaSubText: {
    fontSize: theme.typography.size.xs,
    fontFamily: theme.typography.family.semiBold,
    fontWeight: "600",
    color: `${theme.colors.white}CC`,
  },

  imageContainer: {
    width: 84,
    height: 104,
    alignItems: "center",
    justifyContent: "center",
  },

  phoneMockup: {
    width: 72,
    height: 92,
    backgroundColor: theme.colors.white,
    borderRadius: 10,
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
    borderRadius: 7,
    padding: 6,
    overflow: "hidden",
  },
  screenContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  eeroIcon: {
    width: 26,
    height: 26,
    borderRadius: 7,
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

export default memo(EeroPromoCard);