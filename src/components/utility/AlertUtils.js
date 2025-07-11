import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Linking, Platform } from "react-native";
import { Border, Color, FontFamily, FontSize } from "../../../GlobalStyles";
import CloseIcon from "../../res/svgIcons/CloseIcon";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

/**
 * Generic Alert Component that can be customized for different alert types
 */
export const AlertComponent = ({ 
  title, 
  message, 
  indicatorColor, 
  iconTint, 
  titleStyle, 
  boldText, 
  actionText, 
  onActionPress, 
  onClose,
  styles: customStyles
}) => {
  // Merge custom styles with default styles
  const mergedStyles = { ...styles, ...customStyles };
  
  return (
    <View style={mergedStyles.errorBox}>
      <View style={mergedStyles.alertRowContainer}>
        <View style={[mergedStyles.indicator, { backgroundColor: indicatorColor }]} />
        <View style={mergedStyles.alertContentContainer}>
          <View style={mergedStyles.alertTitleRow}>
            <Image
              style={mergedStyles.alertIcon}
              resizeMode="contain"
              tintColor={iconTint}
              source={require("../../../assets/info-circle.png")}
            />
            <Text style={[mergedStyles.alertTitle, titleStyle]}>{title}</Text>
          </View>
          <Text style={mergedStyles.alertMessage}>
            {message}
            {boldText && (
              <Text style={[mergedStyles.alertMessage, mergedStyles.boldText]}>
                {" "}{boldText}{" "}
              </Text>
            )}
            {actionText && (
              <Text
                style={mergedStyles.actionText}
                onPress={onActionPress}
              >
                {" "}{actionText}{" "}
              </Text>
            )}
            {actionText && "and keep your app running smoothly."}
          </Text>
        </View>
        <TouchableOpacity
          style={mergedStyles.closeButtonContainer}
          onPress={onClose}
        >
          <CloseIcon />
        </TouchableOpacity>
      </View>
    </View>
  );
};

/**
 * Utility functions for common alert types
 */
export const AlertUtils = {
  /**
   * Creates an outage alert
   */
  createOutageAlert: (estimatedRestoreTime, onClose) => (
    <AlertComponent
      title="Outage Alert"
      message="Our systems show that you may be experiencing an outage related to your Internet service. We are working to restore service as soon as possible."
      indicatorColor="#F88700"
      iconTint="#F88700"
      boldText={`Estimated Time to Restore: ${estimatedRestoreTime}`}
      onClose={onClose}
    />
  ),

  /**
   * Creates an app update alert
   */
  createAppUpdateAlert: (onClose) => (
    <AlertComponent
      title="What's New"
      message="Enhance your app experience with the latest version."
      indicatorColor={Color.sparklightGreen}
      iconTint={Color.sparklightGreen}
      titleStyle={{ color: Color.sparklightGreen }}
      actionText="Update Now"
      onActionPress={() => {
        const storeUrl = Platform.OS === "android"
          ? "https://play.google.com/store/apps/details?id=com.sparklight"
          : "https://apps.apple.com/us/app/mysparklight/6469003880";
        Linking.openURL(storeUrl);
      }}
      onClose={onClose}
    />
  )
};

// Default styles for the alert components
const styles = StyleSheet.create({
  errorBox: {
    flexDirection: "column",
    marginHorizontal: 20,
    marginVertical: 20,
    borderColor: Color.sparklightGray,
    backgroundColor: Color.sparklightWhite,
    borderRadius: Border.br_11xs,
    borderWidth: 1,
    marginBottom: wp("15%"),
    marginTop: wp("-10%"),
  },
  alertRowContainer: {
    flexDirection: "row",
    width: "90%",
  },
  alertContentContainer: {
    flexDirection: "column",
    padding: 10,
  },
  alertTitleRow: {
    flexDirection: "row",
  },
  indicator: {
    width: 4,
  },
  alertIcon: {
    alignSelf: "center",
  },
  closeButtonContainer: {
    marginTop: 10,
  },
  alertTitle: {
    color: "#000",
    fontFamily: FontFamily.textXsSemibold,
    fontSize: 15,
    fontStyle: "normal",
    fontWeight: "700",
    marginLeft: 5,
    marginRight: 5,
  },
  alertMessage: {
    color: Color.colorGray_200,
    fontFamily: FontFamily.openSansRegular,
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: "400",
    marginLeft: 20,
    marginTop: 7,
    marginRight: 5,
  },
  boldText: {
    fontWeight: "700",
  },
  actionText: {
    color: Color.colorMidnightblue,
    fontFamily: FontFamily.openSansRegular,
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: "700",
    marginLeft: 20,
    marginTop: 7,
    marginRight: 5,
  }
});

export default AlertUtils;