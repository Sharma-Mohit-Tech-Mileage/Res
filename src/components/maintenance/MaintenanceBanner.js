import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Linking } from "react-native";
import { Border, Color, FontFamily} from "../../../GlobalStyles";
import CloseIcon from "../../res/svgIcons/CloseIcon";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import InfoIcon from "../../../assets/svgs/InfoIcon";
import { A11y } from "react-native-a11y-order";
/**
 * MaintenanceBanner Component
 * Styled to match AlertComponent from AlertUtils
 */
const MaintenanceBanner = ({ title , message , link, linkText,showPhoneNumber=false, phoneNumber, onDismiss, severity = "info" }) => {
  
  // Determine indicator color, icon tint and background based on severity
  const getSeverityStyles = () => {
    switch(severity) {
      case "critical":
        return {
          indicatorColor: Color.sparkLightRed,
          iconTint: Color.sparkLightRed,
          titleStyle: { color: Color.colorGray_200 }
        };
      case "warning":
        return {
          indicatorColor: Color.sparkLightInfo,
          iconTint: Color.sparkLightInfo,
          titleStyle: { color: Color.colorGray_200 }
        };
      case "info":
      default:
        return {
          indicatorColor: "#0060AE", // Deep purple/blue color
          iconTint: "#0060AE", // Deep purple/blue color
          titleStyle: { color: Color.colorGray_200 } // Deep purple/blue color
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
      <A11y.Order
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
      <View style={styles.alertRowContainer}>
        <View style={[{ backgroundColor: severityStyles.indicatorColor }]} />
        
        <View style={styles.alertContentContainer}>
          <A11y.Index index={1}>
          <View style={styles.alertTitleRow}>
            <View accessible={true} accessibilityRole="text" accessibilityLabel="Information Icon">
            <InfoIcon  
              color={severityStyles.iconTint} 
            />
            </View>
            <Text 
              style={[styles.alertTitle, severityStyles.titleStyle]}
              accessibilityRole='Header' accessibilityLevel={2} accessibilityHint="Header"
              accessible={true}
            >
              {title}
            </Text>
            
          </View>
          </A11y.Index>
          <A11y.Index index={2}>
          <Text style={styles.alertMessage}>{message}</Text>
          </A11y.Index>
          
          {link && (
            <A11y.Index index={3}>
            <TouchableOpacity onPress={handleLinkPress} accessibilityRole="link">
              <Text style={[styles.actionText, { marginLeft: 20, textDecorationLine: 'underline' }]}>{linkText}</Text>
            </TouchableOpacity>
            </A11y.Index>
          )}
          
          {showPhoneNumber && (
            <A11y.Index index={4}>
            <TouchableOpacity 
              onPress={handlePhonePress}
              accessibilityRole="link"
              accessibilityLabel={`Need help? Call ${phoneNumber}`}
              accessibilityHint="Double tap to call this phone number"
            >
              <Text style={styles.alertMessage}>
                Need help? Call{' '}
                <Text style={styles.actionText}>
                  {phoneNumber}
                </Text>
              </Text>
            </TouchableOpacity>
            </A11y.Index>
          )}
        </View>
        
        
      </View>
      {onDismiss && (
        <A11y.Index index={5} style={styles.closeButtonContainer}>
          <TouchableOpacity
            onPress={onDismiss}
            accessibilityLabel="Close button"
            accessibilityRole="button"
            accessibilityHint="Double tap to close this message"
            accessible={true}
          >
            <CloseIcon color="#000000" />
          </TouchableOpacity>
        </A11y.Index>
        )}
        </A11y.Order>
    </View>
  );
};

// Styles matching AlertUtils
const styles = StyleSheet.create({
  errorBox: {
    flexDirection: "column",
    marginHorizontal: 10,
    marginVertical: 20,
    borderColor: '#0060AE',
    backgroundColor:'#F0F8FF',
    borderRadius: Border.br_11xs,
    borderWidth: 1,
    marginBottom: wp("15%"),
    marginTop: wp("-10%"),
     borderRadius: 8,
  },
  alertRowContainer: {
    flexDirection: "row",
    width: "98%",
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
    top: 12,
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
    color: '#353091', // Changed to deep purple/blue color for links
    fontFamily: FontFamily.openSansRegular,
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: "700",
    marginTop: 7,
    marginRight: 5,
  }
});

export default MaintenanceBanner;
