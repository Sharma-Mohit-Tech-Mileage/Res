import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Linking, Platform } from "react-native";
import { Border, Color, FontFamily, FontSize } from "../../../GlobalStyles";
import CloseIcon from "../../res/svgIcons/CloseIcon";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import WarningIcon from '../../../assets/svgs/Alerttriangle'
import InfoIcon from "../../../assets/svgs/InfoIcon";
/**
 * Generic Alert Component that can be customized for different alert types
 * Updated to match finalized notification design
 */
export const AlertComponent = ({ 
  type, // New prop to specify alert type: "warning" or "info"
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
  IconSource // New prop for icon source
}) => {
  // Enhanced color schemes based on finalized notification design
  const getAlertStyles = () => {
    // Map indicatorColor to finalized notification colors
    if (indicatorColor === "#F88700") {
      // Outage Alert -> Warning style
      return {
        backgroundColor: "#FFFAEB",
        borderColor: "#DD6D02",
        closeButtonColor: "#000000",
        titleColor: Color.colorGray_200
      };
    } else if (indicatorColor === Color.sparklightGreen) {
      // App Update -> Info style (following user's specification)
      return {
        backgroundColor: "#F0F8FF",
        borderColor: "#0060AE",
        closeButtonColor: "#000000",
        titleColor: Color.colorGray_200
      };
    } else {
      // Default to info colors for any other cases
      return {
        backgroundColor: "#F0F8FF",
        borderColor: "#0060AE",
        closeButtonColor: "#000000",
        titleColor: Color.colorGray_200
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
        borderColor: alertStyles.borderColor,
        marginBottom: type === "warning" ? wp("15%") : wp("11%"),
      }
    ]}>
      <View style={[
        mergedStyles.alertRowContainer,
        !onClose && mergedStyles.alertRowContainerNoClose
      ]}>
        <View style={mergedStyles.alertIcon} accessible={true} accessibilityRole="text" accessibilityLabel={type==="warning" ? "Warning Icon":"Information Icon"}>
         { IconSource? <IconSource/> :<InfoIcon  
              color={'#0060AE'} 
            />}
        </View>
        <View style={mergedStyles.alertContentContainer}>
          <View style={mergedStyles.alertTitleRow} accessibilityRole="header" accessibilityLevel={2}
              accessible={true}
                accessibilityLabel={`${title}`}>
            <Text style={[
              mergedStyles.alertTitle, 
              titleStyle,
              { color: alertStyles.titleColor }
            ]}
              >
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
                {actionText}
              </Text>
            )}
            {actionText && " and keep your app running smoothly."}
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
      type="warning"
      title="Outage Notification"
      message="Our systems show that you may be experiencing an outage related to your internet service. We are working to restore service as soon as possible."
      indicatorColor="#F88700" // Maps to warning styling internally
      iconTint="#DD6D02" // Use finalized warning color for icon
      titleStyle={{ color: "#DD6D02" }}
      boldText={`Estimated Time to Restore: ${estimatedRestoreTime}.`}
      IconSource={WarningIcon} // Warning icon
      onClose={onClose}
    />
  ),

  /**
   * Creates an app update alert using INFO design (blue/info styling)
   */
  createAppUpdateAlert: (onClose) => (
    <AlertComponent
      type="info"
      title="What's New"
      message="Enhance your app experience with the latest version. "
      indicatorColor={Color.sparklightGreen} // Maps to info styling internally (per user spec)
      iconTint="#0060AE" // Use finalized info color for icon
      titleStyle={{ color: "#0060AE" }}
      actionText="Update Now"
      IconSource={InfoIcon} // Info icon
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
    marginVertical: 8,
    borderRadius: 8, // Updated to match finalized design
    borderWidth: 1,
    paddingLeft: 16,
    paddingRight: 12,
    paddingVertical: 16,
    marginBottom: wp("15%"), // Preserving intentional values
    marginTop: wp("-5%"), // Preserving intentional values
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
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center', // vertical center in row
    width: 24,
    height: 24,
    marginLeft: 12, // space from content
    marginRight: 0, // flush to right edge
  },
  alertTitle: {
    fontFamily: FontFamily.textXsSemibold,
    fontSize: 15,
    color:"#000000",
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
    fontFamily: FontFamily.openSansSemiBold,
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: "700",
    textDecorationLine: "underline",
    textDecorationColor: Color.colorMidnightblue,
    marginLeft: 20,
    marginTop: 7,
    marginRight: 5,
  }
});

export default AlertUtils;