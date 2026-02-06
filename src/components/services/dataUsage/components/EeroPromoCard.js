import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Linking,
  Platform,
  Image,
  Dimensions,
  Alert,
} from "react-native";
import { theme } from "../../../../styles/theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const EeroPromoCard = () => {
  const handleDownload = async () => {
    const url = Platform.OS === "ios"
      ? "https://apps.apple.com/app/eero-home-wifi-system/id1023499969"
      : "https://play.google.com/store/apps/details?id=com.eero.android";

    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Error", "Unable to open app store");
      }
    } catch (error) {
      console.error("Error opening app store:", error);
      Alert.alert("Error", "Unable to open app store");
    }
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [
          styles.card,
          pressed && styles.cardPressed,
        ]}
        onPress={handleDownload}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Download eero app to simplify connectivity"
        accessibilityHint="Double tap to open app store"
      >
        <Image
          source={require("../../../../../assets/eero-promo-banner.jpg")}
          style={styles.promoImage}
          resizeMode="cover"
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: theme.spacing.base,
  },
  card: {
    borderRadius: theme.radius.base,
    overflow: "hidden",
    backgroundColor: "#1a2b4a",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  promoImage: {
    width: "100%",
    height: 200,
  },
});

export default EeroPromoCard;