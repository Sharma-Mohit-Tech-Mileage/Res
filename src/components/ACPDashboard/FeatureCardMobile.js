// components/FeatureCard.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontFamily, FontSize, Color, Padding, Border } from "../../../GlobalStyles";
import AppStyles from "../../styles/AppStyles";
import Icon from "../common/Icon";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import Touchable from "../common/customui/Touchable";
import { A11Y } from "../../styles/theme";

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
    <View style={[AppStyles.card, styles.container]}>
      <Text
        style={[styles.title, { color: "#393D40" }]}
        accessible={true}
        accessibilityRole="header" accessibilityLevel={2}
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
            accessible={false}
            importantForAccessibility="no"
          >
            <Icon
              name="green-checkcircle"
              size={18}
              color={Color.sparklightGreen}
              style={styles.checkIcon}
            />
            <Text style={styles.featureText} accessible={false} importantForAccessibility="no">{feature}</Text>
          </View>
        ))}
      </View>

      {isLoading ? (
        <SkeletonPlaceholder>
          <View style={[styles.button, { height: 100, paddingVertical: 24 }]} />
        </SkeletonPlaceholder>
      ) : (
        <Touchable
          minSize={0}
          style={[styles.button, getButtonStyle()]}
          onPress={onButtonPress}
          accessibilityRole="button"
          accessibilityLabel={buttonText}
        >
          <Text style={[styles.buttonText, getButtonTextStyle()]}>
            {buttonText}
          </Text>
        </Touchable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.sparklightWhite,
    borderTopWidth: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: Border.br_5xs,
    borderBottomRightRadius: Border.br_5xs,
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
    fontSize: 20,
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
    fontSize: FontSize.size_base,
    color: Color.sparklightGray1,
    fontWeight: "400",
  },
  button: {
    alignSelf: "stretch",
    marginHorizontal: Padding.p_base,
    marginBottom: 32,
    paddingVertical: Padding.p_base,
    paddingHorizontal: Padding.p_base,
    borderRadius: Border.br_81xl, // Adjust as needed
    minHeight: A11Y.minTouch,
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
    fontSize: FontSize.size_base,
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
