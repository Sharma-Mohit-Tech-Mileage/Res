import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Linking, Platform } from "react-native";
import { Border, Color, FontFamily, FontSize } from "../../../GlobalStyles";
import CloseIcon from "../../res/svgIcons/CloseIcon";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

/**
 * MaintenanceBanner Component
 * Styled to match AlertComponent from AlertUtils
 */
const MaintenanceBanner = ({ 
  title = "Billing system upgrade – July 11",
  message = "We're updating to a faster, more modern experience for managing your Sparklight services. Learn more:",
  link = "https://www.sparklight.com/billingmigration",
  linkText = "Learn more",
  phoneNumber = "877-692-2253",
  onDismiss,
  severity = "info" // "info", "warning", or "critical"
}) => {
  
  // Determine indicator color, icon tint and background based on severity
  const getSeverityStyles = () => {
    switch(severity) {
      case "critical":
        return {
          indicatorColor: Color.sparkLightRed,
          iconTint: Color.sparkLightRed,
          titleStyle: { color: Color.sparkLightRed }
        };
      case "warning":
        return {
          indicatorColor: Color.sparkLightInfo,
          iconTint: Color.sparkLightInfo,
          titleStyle: { color: Color.sparkLightInfo }
        };
      case "info":
      default:
        return {
          indicatorColor: "#4B2E83", // Deep purple/blue color
          iconTint: "#4B2E83", // Deep purple/blue color
          titleStyle: { color: "#4B2E83" } // Deep purple/blue color
        };
    }
  };
  
  const severityStyles = getSeverityStyles();
  
  const handleLinkPress = () => {
    if (link) {
      Linking.openURL(link).catch(err => console.error('An error occurred opening link:', err));
    }
  };
  
  const handlePhonePress = () => {
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`).catch(err => console.error('An error occurred opening phone:', err));
    }
  };
  
  return (
    <View style={styles.errorBox}>
      <View style={styles.alertRowContainer}>
        <View style={[styles.indicator, { backgroundColor: severityStyles.indicatorColor }]} />
        <View style={styles.alertContentContainer}>
          <View style={styles.alertTitleRow}>
            <Image
              style={styles.alertIcon}
              resizeMode="contain"
              tintColor={severityStyles.iconTint}
              source={require("../../../assets/info-circle.png")}
            />
            <Text style={[styles.alertTitle, severityStyles.titleStyle]}>{title}</Text>
          </View>
          
          <Text style={styles.alertMessage}>{message}</Text>
          
          {link && (
            <TouchableOpacity onPress={handleLinkPress} accessibilityRole="link">
              <Text style={[styles.actionText, { marginLeft: 20 }]}>{linkText}</Text>
            </TouchableOpacity>
          )}
          
          {phoneNumber && (
            <Text style={styles.alertMessage}>
              Need help? Call{' '}
              <Text 
                style={styles.actionText}
                onPress={handlePhonePress}
                accessibilityRole="link"
              >
                {phoneNumber}
              </Text>
            </Text>
          )}
        </View>
        
        {onDismiss && (
          <TouchableOpacity
            style={styles.closeButtonContainer}
            onPress={onDismiss}
            accessibilityLabel="Dismiss message"
            accessibilityRole="button"
          >
            <CloseIcon />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// Styles matching AlertUtils
const styles = StyleSheet.create({
  errorBox: {
    flexDirection: "column",
    marginHorizontal: 4,
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
  actionText: {
    color: Color.sparklightBrightPurple, // Changed to deep purple/blue color for links
    fontFamily: FontFamily.openSansRegular,
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: "700",
    marginTop: 7,
    marginRight: 5,
  }
});

export default MaintenanceBanner;