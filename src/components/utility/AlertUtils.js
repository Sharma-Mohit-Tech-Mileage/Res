import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Linking, Platform } from "react-native";
import {Color, FontFamily } from "../../../GlobalStyles";
import CloseIcon from "../../res/svgIcons/CloseIcon";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

/**
 * Generic Alert Component that can be customized for different alert types
 * Updated to match finalized notification design
 */
export const AlertComponent = ({ 
  title, 
  message, 
  indicatorColor, // Now used for determining background and border colors
  iconTint, 
  titleStyle, 
  boldText, 
  actionText, 
  onActionPress, 
  onClose,
  styles: customStyles,
  iconSource // New prop for icon source
}) => {
  // Enhanced color schemes based on finalized notification design
  const getAlertStyles = () => {
    // Map indicatorColor to finalized notification colors
    if (indicatorColor === "#F88700") {
      // Outage Alert -> Warning style
      return {
        backgroundColor: "#FFFAEB",
        borderColor: "#DD6D02",
        closeButtonColor: "#DD6D02",
        titleColor: "#DD6D02"
      };
    } else if (indicatorColor === Color.sparklightGreen) {
      // App Update -> Info style (following user's specification)
      return {
        backgroundColor: "#F0F8FF",
        borderColor: "#0060AE",
        closeButtonColor: "#0060AE",
        titleColor: "#0060AE"
      };
    } else {
      // Default to info colors for any other cases
      return {
        backgroundColor: "#F0F8FF",
        borderColor: "#0060AE",
        closeButtonColor: "#0060AE",
        titleColor: "#0060AE"
      };
    }
  };

  const alertStyles = getAlertStyles();
  
  // Merge custom styles with default styles
  const mergedStyles = { ...styles, ...customStyles };
  
  return (
    <View style={[
      mergedStyles.errorBox,
      {
        backgroundColor: alertStyles.backgroundColor,
        borderColor: alertStyles.borderColor
      }
    ]}>
      <View style={[
        mergedStyles.alertRowContainer,
        !onClose && mergedStyles.alertRowContainerNoClose
      ]}>
        <Image
          style={mergedStyles.alertIcon}
          resizeMode="contain"
          tintColor={iconTint}
          source={iconSource || require("../../../assets/info-circle.png")}
        />
        
        <View style={mergedStyles.alertContentContainer}>
          <View style={mergedStyles.alertTitleRow}>
            <Text style={[
              mergedStyles.alertTitle, 
              titleStyle,
              { color: alertStyles.titleColor }
            ]}>
              {title}
            </Text>
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
        
        {onClose && (
          <TouchableOpacity
            style={mergedStyles.closeButtonContainer}
            onPress={onClose}
            accessibilityLabel="Close alert"
            accessibilityRole="button"
            accessibilityHint="Double tap to close this alert"
          >
            <CloseIcon color={alertStyles.closeButtonColor} width={16} height={16} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

/**
 * Utility functions for common alert types
 * Updated to use finalized notification design mappings
 */
export const AlertUtils = {
  /**
   * Creates an outage alert using WARNING design (orange/warning styling)
   */
  createOutageAlert: (estimatedRestoreTime, onClose) => (
    <AlertComponent
      title="Outage Alert"
      message="Our systems show that you may be experiencing an outage related to your Internet service. We are working to restore service as soon as possible."
      indicatorColor="#F88700" // Maps to warning styling internally
      iconTint="#DD6D02" // Use finalized warning color for icon
      titleStyle={{ color: "#DD6D02" }}
      boldText={`Estimated Time to Restore: ${estimatedRestoreTime}`}
      iconSource={require("../../../assets/Icon/TriangleAlert.png")} // Warning icon
      onClose={onClose}
    />
  ),

  /**
   * Creates an app update alert using INFO design (blue/info styling)
   */
  createAppUpdateAlert: (onClose) => (
    <AlertComponent
      title="What's New"
      message="Enhance your app experience with the latest version."
      indicatorColor={Color.sparklightGreen} // Maps to info styling internally (per user spec)
      iconTint="#0060AE" // Use finalized info color for icon
      titleStyle={{ color: "#0060AE" }}
      actionText="Update Now"
      iconSource={require("../../../assets/Icon/Info.png")} // Info icon
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

// Enhanced styles matching finalized notification design
// Preserving intentional margin values as specified
const styles = StyleSheet.create({
  errorBox: {
    flexDirection: "row",
    alignItems: 'flex-start',
    marginHorizontal: 14,
    marginVertical: 20,
    borderRadius: 8, // Updated to match finalized design
    borderWidth: 1,
    paddingLeft: 16,
    paddingRight: 12,
    paddingVertical: 16,
    marginBottom: wp("15%"), // Preserving intentional values
    marginTop: wp("-10%"), // Preserving intentional values
  },
  alertRowContainer: {
    flexDirection: "row",
    width: "100%",
    paddingRight: 20, // Space for close button when present
  },
  alertRowContainerNoClose: {
    paddingRight: 0, // No space needed when no close button
  },
  alertContentContainer: {
    flexDirection: "column",
    flex: 1,
    marginLeft: 12,
  },
  alertTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  alertIcon: {
    width: 20,
    height: 22,
  },
  closeButtonContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 8,
    width: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertTitle: {
    fontFamily: FontFamily.textXsSemibold,
    fontSize: 15,
    fontStyle: "normal",
    fontWeight: "700",
    marginRight: 5,
  },
  alertMessage: {
    color: '#000000', // Black text for optimal readability
    fontFamily: FontFamily.openSansRegular,
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: "400",
    marginTop: 8,
    marginRight: 5,
  },
  boldText: {
    fontWeight: "700",
    fontFamily: FontFamily.openSansSemiBold,
  },
  actionText: {
    color: Color.colorMidnightblue, // Restored original link color
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