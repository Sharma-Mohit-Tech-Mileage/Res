import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from "react-native";
import { Border, Color, FontFamily } from "../../../GlobalStyles";
import CloseIcon from "../../res/svgIcons/CloseIcon";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import InfoIcon from "../../../assets/svgs/InfoIcon";

/**
 * MaintenanceBanner Component
 * Styled to match AlertComponent from AlertUtils
 */
const MaintenanceBanner = ({
  title,
  message,
  link,
  linkText,
  showPhoneNumber = false,
  phoneNumber,
  onDismiss,
  severity = "info",
}) => {
  // Determine indicator color, icon tint and background based on severity
  const getSeverityStyles = () => {
    switch (severity) {
      case "critical":
        return {
          indicatorColor: Color.sparkLightRed,
          iconTint: Color.sparkLightRed,
          titleStyle: { color: Color.sparkLightRed },
        };
      case "warning":
        return {
          indicatorColor: Color.sparkLightInfo,
          iconTint: Color.sparkLightInfo,
          titleStyle: { color: Color.sparkLightInfo },
        };
      case "info":
      default:
        return {
          indicatorColor: "#0060AE", // Deep purple/blue color
          iconTint: "#0060AE", // Deep purple/blue color
          titleStyle: { color: "#0060AE" }, // Deep purple/blue color
        };
    }
  };

  const severityStyles = getSeverityStyles();

  const handleLinkPress = () => {
    if (link) {
      Linking.openURL(link).catch((err) =>
        console.error("An error occurred opening link:", err)
      );
    }
  };

  const handlePhonePress = () => {
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`).catch((err) =>
        console.error("An error occurred opening phone:", err)
      );
    }
  };

  return (
    <View style={styles.errorBox}>
      <View style={styles.alertRowContainer}>
        <View style={[{ backgroundColor: severityStyles.indicatorColor }]} />
        <View style={styles.alertContentContainer}>
          <View accessible={true} style={styles.alertTitleRow}>
            <InfoIcon color={severityStyles.iconTint} />
            <Text
              style={[styles.alertTitle, severityStyles.titleStyle]}
              accessibilityRole="header"
              accessibilityLabel={title}
              accessible={true}
            >
              {title}
            </Text>
          </View>

          <Text style={styles.alertMessage}>{message}</Text>

          {link && (
            <TouchableOpacity
              onPress={handleLinkPress}
              accessibilityRole="link"
            >
              <Text
                style={[
                  styles.actionText,
                  { marginLeft: 20, textDecorationLine: "underline" },
                ]}
              >
                {linkText}
              </Text>
            </TouchableOpacity>
          )}

          {showPhoneNumber && (
            <TouchableOpacity
              onPress={handlePhonePress}
              accessibilityRole="link"
              accessibilityLabel={`Need help? Call ${phoneNumber}`}
              accessibilityHint="Double tap to call this phone number"
            >
              <Text style={styles.alertMessage}>
                Need help? Call{" "}
                <Text style={styles.actionText}>{phoneNumber}</Text>
              </Text>
            </TouchableOpacity>
          )}
        </View>

        
      </View>
      {onDismiss && (
          <TouchableOpacity
            style={styles.closeButtonContainer}
            onPress={onDismiss}
            accessibilityLabel="Dismiss maintenance banner"
            accessibilityRole="button"
            accessibilityHint="Double tap to close this message"
            accessible={true}
          >
            <CloseIcon color="#0060AE" />
          </TouchableOpacity>
        )}
    </View>
  );
};

// Styles matching AlertUtils
const styles = StyleSheet.create({
  errorBox: {
    flexDirection: "column",
    marginHorizontal: 4,
    marginVertical: 20,
    borderColor: "#0060AE",
    backgroundColor: "#F0F8FF",
    borderRadius: Border.br_11xs,
    borderWidth: 1,
    marginBottom: wp("15%"),
    marginTop: wp("-10%"),
    borderRadius: 8,
  },
  alertRowContainer: {
    flexDirection: "row",
    width: "85%",
  },
  alertContentContainer: {
    flexDirection: "column",
    padding: 12,
  },
  alertTitleRow: {
    flexDirection: "row",
  },
  alertIcon: {
    alignSelf: "center",
    height: 20,
    width: 20,
  },
  closeButtonContainer: {
    alignContent: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 8,
    right: 8,
    width: 24,
    height: 24,
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
    color: "#353091", // Changed to deep purple/blue color for links
    fontFamily: FontFamily.openSansRegular,
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: "700",
    marginTop: 7,
    marginRight: 5,
  },
});

export default MaintenanceBanner;
