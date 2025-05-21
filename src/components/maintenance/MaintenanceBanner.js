import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { Color, FontFamily, FontSize, Border, Padding } from '../../../GlobalStyles';

/**
 * MaintenanceBanner Component
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
  
  // Determine icon and background colors based on severity
  const getSeverityStyles = () => {
    switch(severity) {
      case "critical":
        return {
          iconText: "⚠️",
          backgroundColor: Color.colorlightRed,
          borderColor: Color.sparkLightRed,
        };
      case "warning":
        return {
          iconText: "⚠️",
          backgroundColor: `${Color.sparkLightInfo}22`, // 22 adds transparency
          borderColor: Color.sparkLightInfo,
        };
      case "info":
      default:
        return {
          iconText: "ℹ️",
          backgroundColor: Color.sparklightWhite,
          borderColor: null,
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
    <View style={[
      styles.bannerContainer, 
      { backgroundColor: severityStyles.backgroundColor },
      severityStyles.borderColor && { borderLeftWidth: 4, borderLeftColor: severityStyles.borderColor }
    ]}>
      <View style={styles.iconContainer}>
        <Text style={styles.infoIcon}>{severityStyles.iconText}</Text>
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.titleText}>{title}</Text>
        <Text style={styles.messageText}>{message}</Text>
        
        {link && (
          <TouchableOpacity onPress={handleLinkPress} accessibilityRole="link">
            <Text style={styles.linkText}>{linkText}</Text>
          </TouchableOpacity>
        )}
        
        {phoneNumber && (
          <Text style={styles.phoneText}>
            Need help? Call{' '}
            <Text 
              style={styles.phoneNumberText}
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
          style={styles.dismissButton} 
          onPress={onDismiss}
          accessibilityLabel="Dismiss message"
          accessibilityRole="button"
        >
          <Text style={styles.dismissText}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    backgroundColor: Color.sparklightWhite,
    borderRadius: Border.br_xs,
    padding: Padding.p_base,
    marginHorizontal: Padding.p_base,
    marginVertical: Padding.p_xs,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 100,
  },
  iconContainer: {
    marginRight: Padding.p_xs,
    justifyContent: 'flex-start',
    paddingTop: Padding.p_9xs,
  },
  infoIcon: {
    fontSize: FontSize.size_lg,
  },
  contentContainer: {
    flex: 1,
  },
  titleText: {
    fontFamily: FontFamily.openSansSemiBold,
    fontSize: FontSize.size_base,
    color: Color.colorGray_200,
    marginBottom: Padding.p_9xs,
  },
  messageText: {
    fontFamily: FontFamily.openSansRegular,
    fontSize: FontSize.size_sm,
    color: Color.colorGray_100,
    marginBottom: Padding.p_5xs,
    lineHeight: 22,
  },
  linkText: {
    fontFamily: FontFamily.openSansSemiBold,
    fontSize: FontSize.size_sm,
    color: Color.colorMidnightblue,
    textDecorationLine: 'underline',
    marginBottom: Padding.p_5xs,
  },
  phoneText: {
    fontFamily: FontFamily.openSansRegular,
    fontSize: FontSize.size_sm,
    color: Color.colorGray_100,
  },
  phoneNumberText: {
    fontFamily: FontFamily.openSansSemiBold,
    color: Color.colorMidnightblue,
  },
  dismissButton: {
    padding: Padding.p_9xs,
    justifyContent: 'flex-start',
  },
  dismissText: {
    fontSize: FontSize.size_lg,
    color: Color.colorGray_100,
  },
});

export default MaintenanceBanner;