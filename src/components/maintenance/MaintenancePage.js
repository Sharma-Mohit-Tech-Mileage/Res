import React from 'react';
import { View, Text, Image, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Color, FontFamily, FontSize, Padding, Border } from '../../../GlobalStyles';
import moment from 'moment';
import { navigationRef } from '../../navigations/UserNavigations';
import Icon from "../common/Icon";
import VersionCheck from 'react-native-version-check';
const MaintenancePage = ({
  title = "We'll Be Back Soon",
  message = "Our app is currently undergoing scheduled maintenance and will be temporarily unavailable. Thanks for your patience as we work to improve your experience. Please relaunch the app after the maintenance window.",
  estimatedTime = null,
  contactInfo = "contact us",
  contactLink = null,
  showLoginButton = false,
  isBlockingUser = false,
  pageType = "NORMAL"
}) => {
  
 const handleContactPress = () => {
  
  if (!contactLink) {
    return;
  }
  
  Linking.openURL(contactLink).catch(err => 
    console.error('🔧 📄 Error opening contact link:', err)
  );
};
  
  const handleBackToLogin = () => {
    
    if (navigationRef.current) {
      
      navigationRef.current.reset({
        index: 0,
        routes: [{ 
          name: 'Splash', 
          params: { 
            isLogout: true, 
            fromBlocking: true
          } 
        }],
      });
    } else {
      console.error('🔧 📄 🚫 Navigation ref not available');
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
        {/* Logo with Version */}
        <View style={styles.logoContainer}>
          <Image
            resizeMode="contain"
            style={styles.logo}
            source={require("../../../assets/SparklightEntryLogo.png")}
            accessibilityRole="image"
            accessibilityLabel="SparkLight"
          />
          <Text style={styles.versionText}>Version: {VersionCheck.getCurrentVersion()}</Text>
        </View>
        
        {/* Maintenance Message Card */}
        <View style={styles.cardContainer}>
          {/* Gear Icons - Replace this section with your SVG component */}
          <View style={styles.gearIconsContainer}>
            <Text style={styles.gearIcon}><Icon name="gear" color={Color.colorMidnightblue} size={84}/></Text>
            
          </View>
          
          <Text style={styles.titleText}>{title}</Text>
          
          <Text style={styles.messageText}>{message}</Text>
          
          {estimatedTime && (
            <View style={styles.estimatedTimeSection}>
              <Text style={styles.estimatedTimeLabel}>Estimated Completion Time</Text>
              <Text style={styles.estimatedTimeValue}>{estimatedTime}</Text>
            </View>
          )}
          
        {contactInfo && contactLink && !showLoginButton && (
  <View style={styles.contactSection}>
    <Text style={styles.contactMessage}>
      For immediate assistance, please{' '}
      <TouchableOpacity 
        onPress={handleContactPress}
        accessibilityRole="link"
        style={styles.contactLinkContainer}
      >
        <Text style={styles.contactLink}>{contactInfo}</Text>
      </TouchableOpacity>
      .
    </Text>
  </View>
)}
          
          {/* Back to Login Button for blocking scenarios */}
          {showLoginButton && (
            <TouchableOpacity 
              style={styles.loginButton}
              onPress={handleBackToLogin}
              accessibilityRole="button"
              accessibilityLabel="Go back to login screen"
            >
              <Text style={styles.loginButtonText}>Back to Login</Text>
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
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 280,
    height: 90,
    marginBottom: 10,
  },
  versionText: {
    fontFamily: FontFamily.openSansRegular,
    fontSize: FontSize.size_sm,
    color: '#FFFFFF',
    fontWeight: '400',
    opacity: 0.8,
  },
  cardContainer: {
    backgroundColor: Color.sparklightWhite,
    borderRadius: 16,
    padding: 32,
    width: wp('90%'),
    alignItems: 'center',
    shadowColor: 'green',
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 10,
  },
  gearIconsContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    alignItems: 'center',
  },
  gearIcon: {
    fontSize: 32,
    marginHorizontal: 4,
    color: Color.colorMidnightblue, // This will be replaced with SVG
  },
  titleText: {
    fontFamily: FontFamily.openSansRegular,
    fontSize: 32,
    color: Color.sparklightGray1,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '400',
  },
  messageText: {
    fontFamily: FontFamily.openSansRegular,
    fontSize: FontSize.size_base,
    color: '#707679',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  estimatedTimeSection: {
    backgroundColor: Color.colorWhitesmoke_200,
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  estimatedTimeLabel: {
    fontFamily: FontFamily.openSansSemiBold,
    fontSize: FontSize.size_base,
    color: '#000',
    marginBottom: 4,
    fontWeight: '400',
  },
  estimatedTimeValue: {
    fontFamily: FontFamily.openSansSemiBold,
    fontSize: FontSize.size_base,
    color: '#000',
    fontWeight: '700',
  },
  contactSection: {
    width: '100%',
    alignItems: 'center',
  },
  contactMessage: {
    fontFamily: FontFamily.openSansRegular,
    fontSize: FontSize.size_base,
    color: Color.sparklightGray1,
    textAlign: 'center',
    fontWeight: '400',
  },
  contactLinkContainer: {
    display: 'inline',
  },
  contactLink: {
    fontFamily: FontFamily.openSansRegular,
    fontSize: FontSize.size_base,
    color: Color.sparklightBrightPurple,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  copyrightText: {
    position: "absolute",
    bottom: hp("3%"),
    fontFamily: FontFamily.openSansRegular,
    fontSize: 14,
    fontWeight: "400",
    color: '#FFFFFF',
    alignSelf: "center",
    opacity: 0.8,
  },
  // Enhanced features for blocking scenarios
  loginButton: {
    backgroundColor: Color.colorMidnightblue,
    borderRadius: Border.br_xs,
    paddingVertical: Padding.p_base,
    paddingHorizontal: Padding.p_5xl,
    marginTop: Padding.p_base,
    width: '100%',
    alignItems: 'center',
  },
  loginButtonText: {
    fontFamily: FontFamily.openSansSemiBold,
    fontSize: FontSize.size_base,
    color: Color.sparklightWhite,
    textAlign: 'center',
  },
  blockingInfoContainer: {
    backgroundColor: '#FFF3CD',
    borderColor: '#FFEAA7',
    borderWidth: 1,
    borderRadius: Border.br_5xs,
    padding: Padding.p_base,
    marginTop: Padding.p_base,
    width: '100%',
  },
  blockingInfoText: {
    fontFamily: FontFamily.openSansRegular,
    fontSize: FontSize.size_sm,
    color: '#856404',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default MaintenancePage;