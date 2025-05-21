import React from 'react';
import { View, Text, Image, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Color, FontFamily, FontSize, Padding, Border } from '../../../GlobalStyles';
import moment from 'moment';

/**
 * MaintenancePage Component
 */
const MaintenancePage = ({
  title = "System Maintenance in Progress",
  message = "We're updating our systems to serve you better. The app will be back online soon.",
  estimatedTime = "Estimated completion: July 11, 6:00 PM CT",
  contactInfo = "Need immediate assistance? Call 877-692-2253",
}) => {
  
  const handleContactPress = () => {
    // Extract phone number from contact info if it exists
    const phoneRegex = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g;
    const phoneMatch = contactInfo.match(phoneRegex);
    
    if (phoneMatch && phoneMatch[0]) {
      const phoneNumber = phoneMatch[0].replace(/[-.\s]/g, '');
      Linking.openURL(`tel:${phoneNumber}`).catch(err => 
        console.error('An error occurred opening phone:', err)
      );
    }
  };
  
  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      colors={["rgba(53, 48, 145, 0.78)", "rgba(141, 59, 144, 0.9)"]}
      style={styles.container}
    >
      <View style={styles.contentContainer}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            resizeMode="contain"
            style={styles.logo}
            source={require("../../../assets/SparklightEntryLogo.png")}
            accessibilityRole="image"
            accessibilityLabel="SparkLight"
          />
        </View>
        
        {/* Maintenance Message Card */}
        <View style={styles.cardContainer}>
          <View style={styles.iconContainer}>
            <Text style={styles.maintenanceIcon}>🔧</Text>
          </View>
          
          <Text style={styles.titleText}>{title}</Text>
          
          <View style={styles.separator} />
          
          <Text style={styles.messageText}>{message}</Text>
          
          {estimatedTime && (
            <View style={styles.timeContainer}>
              <Text style={styles.estimatedTimeText}>{estimatedTime}</Text>
            </View>
          )}
          
          {contactInfo && (
            <TouchableOpacity 
              style={styles.contactContainer} 
              onPress={handleContactPress}
              accessibilityRole="link"
            >
              <Text style={styles.contactText}>{contactInfo}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      <Text style={styles.copyrightText}>
        {`Copyright © ${moment().year()}, Sparklight ®, All Rights Reserved.`}
      </Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: Padding.p_13xl,
  },
  logo: {
    width: 320,
    height: 100,
  },
  cardContainer: {
    backgroundColor: Color.sparklightWhite,
    borderRadius: Border.br_xs,
    padding: Padding.p_5xl,
    width: wp('85%'),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  iconContainer: {
    marginBottom: Padding.p_base,
  },
  maintenanceIcon: {
    fontSize: 48,
  },
  titleText: {
    fontFamily: FontFamily.openSansSemiBold,
    fontSize: FontSize.size_3xl,
    color: Color.colorGray_200,
    textAlign: 'center',
    marginBottom: Padding.p_base,
  },
  separator: {
    height: 1,
    backgroundColor: Color.colorWhitesmoke_300,
    width: '100%',
    marginBottom: Padding.p_5xl,
  },
  messageText: {
    fontFamily: FontFamily.openSansRegular,
    fontSize: FontSize.size_base,
    color: Color.colorGray_100,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Padding.p_5xl,
  },
  timeContainer: {
    backgroundColor: Color.colorWhitesmoke_200,
    padding: Padding.p_base,
    borderRadius: Border.br_5xs,
    marginBottom: Padding.p_5xl,
    width: '100%',
  },
  estimatedTimeText: {
    fontFamily: FontFamily.openSansSemiBold,
    fontSize: FontSize.size_sm,
    color: Color.colorGray_200,
    textAlign: 'center',
  },
  contactContainer: {
    width: '100%',
    marginBottom: Padding.p_base,
  },
  contactText: {
    fontFamily: FontFamily.openSansRegular,
    fontSize: FontSize.size_sm,
    color: Color.colorMidnightblue,
    textAlign: 'center',
  },
  copyrightText: {
    position: "absolute",
    bottom: hp("5%"),
    fontFamily: FontFamily.openSansRegular,
    fontSize: 14,
    fontWeight: "400",
    color: Color.sparklightWhite,
    alignSelf: "center",
  },
});

export default MaintenancePage;