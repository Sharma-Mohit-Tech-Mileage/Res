// components/FeatureCard.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontFamily, FontSize, Color, Padding } from "../../../GlobalStyles";
import Icon from "../common/Icon";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
const FeatureCardMobile = ({
  title,
  features = [],
  buttonText,
  buttonVariant = "primary",
  isActive = false,
  onButtonPress,
  isLoading,
}) => {
  const getButtonStyle = () => {
    switch (buttonVariant) {
      case "success":
        return styles.buttonSuccess;
      case "primary":
      default:
        return styles.buttonPrimary;
    }
  };

  const getButtonTextStyle = () => {
    switch (buttonVariant) {
      case "success":
        return styles.buttonTextSuccess;
      case "primary":
      default:
        return styles.buttonTextPrimary;
    }
  };

  return (
    <View style={styles.container}>
      <Text
        style={[styles.title, { color: "#393D40" }]}
        accessibilityLabel="Smiling man holding a phone. Plans starting at $15 per month. Now take your connection on the go - Introducing Sparklight Mobile, heading level 2."
        accessible={true}
        accessibilityRole="header"
      >
        Now take your connection on the go{" "}
        <Text style={[styles.title]}>- Introducing Sparklight Mobile</Text>
      </Text>

      <View
        style={styles.features}
        accessible={true}
        accessibilityLabel="List with 4 items: Reliable 5G National Coverage., Unlimited Talk & Text., No Annual Contracts., Easy to Switch., Keep Your Number."
        accessibilityRole="list"
      >
        {features.map((feature, index) => (
          <View
            key={index}
            style={styles.featureRow}
            accessibilityRole="listitem"
            accessibilityLabel={feature}
          >
            <Icon
              name="green-checkcircle"
              size={18}
              color={Color.sparklightGreen}
              style={styles.checkIcon}
            />
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>

      {isLoading ? (
        <SkeletonPlaceholder>
          <View style={[styles.button, { height: 100, paddingVertical: 24 }]} />
        </SkeletonPlaceholder>
      ) : (
        <TouchableOpacity
          style={[styles.button, getButtonStyle()]}
          onPress={onButtonPress}
          accessibilityRole="button"
          accessibilityLabel={buttonText}
        >
          <Text style={[styles.buttonText, getButtonTextStyle()]}>
            {buttonText}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.sparklightWhite,
  },
  header: {
    paddingHorizontal: Padding.p_base,
    paddingVertical: Padding.p_xs,
    borderBottomWidth: 1,
    borderBottomColor: Color.colorWhitesmoke_200,
    backgroundColor: Color.colorWhitesmoke_100,
  },
  title: {
    fontFamily: FontFamily.openSansSemiBold,
    fontSize: FontSize.size_5xl,
    color: Color.sparklightBrightPurple,
    fontWeight: "700",
    margin: 24,
    lineHeight: 24,
  },
  features: {
    paddingVertical: Padding.p_xs,
    paddingHorizontal: Padding.p_base,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Padding.p_xs,
  },
  checkIcon: {
    marginRight: Padding.p_xs,
  },
  featureText: {
    fontFamily: FontFamily.openSansRegular,
    fontSize: FontSize.size_lg,
    color: Color.sparklightGray1,
    fontWeight: "400",
  },
  button: {
    marginHorizontal: Padding.p_base,
    marginBottom: 36,
    marginTop: 16, // <-- Add this line for top spacing
    paddingVertical: Padding.p_xs,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonPrimary: {
    backgroundColor: Color.sparklightBrightPurple,
  },
  buttonSuccess: {
    backgroundColor: "#C8E9D0",
    borderWidth: 1,
    borderColor: Color.sparklightGreen,
  },
  buttonText: {
    fontFamily: FontFamily.openSansSemiBold,
    fontSize: FontSize.size_lg,
    fontWeight: "700",
  },
  buttonTextPrimary: {
    color: Color.sparklightWhite,
  },
  buttonTextSuccess: {
    color: "#000",
  },
});

export default FeatureCardMobile;
