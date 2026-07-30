// components/FeatureCard.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  FontFamily,
  FontSize,
  Color,
  Padding,
} from "../../../GlobalStyles";
import Icon from "../common/Icon";
import { card } from "../../styles/utilities";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import Touchable from "../common/customui/Touchable";
import {SectionTitle} from "../common/customui/Typography";
import AppStyles from "../../styles/AppStyles";
import { A11Y } from "../../styles/theme";

const FeatureCard = ({
  title,
  features = [],
  buttonText,
  buttonVariant = "primary",
  isActive = false,
  isLoading = false,
  onButtonPress,
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
    <View style={[AppStyles.card, { marginBottom: 16 }]}>
      <View style={styles.header} accessible={true} accessibilityLabel={`${title}`} accessibilityRole="header" accessibilityLevel={2}>
        <SectionTitle>{title}</SectionTitle>
      </View>

      {
        // Build an accessible label that reads the list and items in order
      }
      {(() => {
        const listLabel = `List with ${features.length} items: ${features.join(', ')}`;
        return (
          <View
            style={styles.features}
            accessible={true}
            accessibilityRole="list"
            accessibilityLabel={listLabel}
          >
            {features.map((feature, index) => (
              <View
                key={index}
                style={styles.featureRow}
                accessible={true}
                //accessibilityRole="listitem"
                accessibilityLabel={`${index + 1}. ${feature}`}
              >
                <Icon
                  name="green-checkcircle"
                  size={18}
                  color={Color.sparklightGreen}
                  style={styles.checkIcon}
                />
                <Text style={styles.featureText} accessible={true} accessibilityRole="header" accessibilityLevel={2} accessibilityLabel={`${feature}`}>{feature}</Text>
              </View>
            ))}
          </View>
        );
      })()}
      {isLoading ? (
        <SkeletonPlaceholder>
          <View style={styles.buttonSkeleton} />
        </SkeletonPlaceholder>
      ) : (
        <Touchable
          minSize={0}
          style={[styles.button, getButtonStyle()]}
          onPress={onButtonPress}
          accessibilityRole="button"
          accessibilityLabel={isActive?`${title} status is ${buttonText}`:buttonText}
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
    marginBottom: Padding.p_xl,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 1,
  },
  header: {
    paddingHorizontal: Padding.p_base,
    paddingVertical: Padding.p_xs,
    borderBottomWidth: 1,
    borderBottomColor: Color.colorWhitesmoke_200,
    backgroundColor: Color.colorWhitesmoke_100,
  },
  title: {
    fontFamily: FontFamily.RadioCanadaSemiBold,
    fontSize: FontSize.size_lg,
    color: Color.sparklightPrimaryPurple,
    fontWeight: "700",
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
    fontFamily: FontFamily.RadioCanadaRegular,
    fontSize: FontSize.size_lg,
    color: Color.colorGray_100,
    fontWeight: "400",
  },
  buttonSkeleton: {
    height: 48,
    borderRadius: 100,
    marginHorizontal: Padding.p_base,
    marginBottom: Padding.p_base,
  },
  button: {
    marginHorizontal: Padding.p_base,
    marginBottom: Padding.p_base,
    paddingVertical: 8,
    minHeight: A11Y.minTouch,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    width: "90%",
  },
  buttonPrimary: {
    backgroundColor: Color.sparklightPrimaryPurple,
  },
  buttonSuccess: {
    backgroundColor: "#C8E9D0",
    borderWidth: 1,
    borderColor: Color.sparklightGreen,
  },
  buttonText: {
    fontFamily: FontFamily.RadioCanadaSemiBold,
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

export default FeatureCard;
