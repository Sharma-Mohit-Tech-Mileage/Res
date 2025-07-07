import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontFamily, FontSize, Color, Padding } from '../../../GlobalStyles';
import NotificationAlert from '../common/customui/NotificationAlert';
import Icon from "../common/Icon";
const DisconnectedBanner = ({ navigation, onClose, showCloseIcon = false }) => {
  const disconnectedBannerMessage = `Your service has been disconnected. However, your online account will remain active for 90 days after disconnection. During this time, you can continue to log in to view your account details and pay any remaining balances.`;

  const handleManageServicesPress = () => {
    if (navigation) {
      navigation.navigate('account', { screen: 'Profile' });
    }
  };

  const handleContactSupportPress = () => {
    if (navigation) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Support', params: { isContactUs: true } }],
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.bannerWrapper}>
        <NotificationAlert
          type="info"
          title="Service Disconnected – Account Access Still Available"
          message={disconnectedBannerMessage}
          showCloseIcon={showCloseIcon}
          isVisible={true}
          onClose={onClose}
          splitKey="contact our support team"
        />
      </View>

      <View style={styles.reconnectionSection}>
        <View style={styles.reconnectionItem}>
          <View style={styles.checkIconContainer}>
            <Icon name="green-checkcircle" size={16} color={Color.sparklightGreen} style={styles.checkIcon} />
          </View>
          <Text style={styles.reconnectionText}>
            If you'd like to reconnect your service, please visit the{" "}
            <Text 
              style={styles.linkText}
              onPress={handleManageServicesPress}
              accessibilityRole="link"
              accessibilityLabel="Navigate to Manage Services"
              accessibilityHint="Double tap to go to Manage Services section"
            >
              Manage Services
            </Text>{" "}
            section in your account to explore available options.
          </Text>
        </View>
        
        <View style={styles.reconnectionItem}>
          <View style={styles.checkIconContainer}>
            <Icon name="green-checkcircle" size={16} color={Color.sparklightGreen} style={styles.checkIcon} />
          </View>
          <Text style={styles.reconnectionText}>
            If you have any questions or need assistance, please{" "}
            <Text 
              style={styles.linkText}
              onPress={handleContactSupportPress}
              accessibilityRole="link"
              accessibilityLabel="Contact our support team"
              accessibilityHint="Double tap to contact support"
            >
              contact our support team
            </Text>
            .
          </Text>
        </View>
      </View>

      <View style={styles.thankYouSection}>
        <Text style={styles.thankYouText}>
          Thank you for being a valued customer.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.sparklightWhite,
    marginBottom: Padding.p_xl,
  },
  bannerWrapper: {
    marginBottom: 0,
  },
  reconnectionSection: {
    paddingTop: Padding.p_base,
  },
  reconnectionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Padding.p_base,
  },
  checkIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Padding.p_xs,
    marginTop: 5,
  },
  checkIcon: {
    color: Color.sparklightWhite,
    fontSize: FontSize.size_sm,
    fontWeight: '700',
    fontFamily: FontFamily.openSansSemiBold,
  },
  reconnectionText: {
    flex: 1,
    fontFamily: FontFamily.openSansRegular,
    fontSize: FontSize.size_base,
    color: Color.colorGray_100,
    lineHeight: 22,
    flexWrap: 'wrap',
  },
  linkText: {
    color: Color.sparklightBrightPurple,
    fontFamily: FontFamily.openSansSemiBold,
    fontSize: FontSize.size_base,
    textDecorationLine: 'underline',
    fontWeight: '400',
  },
  thankYouSection: {
    paddingTop: Padding.p_xs,
  },
  thankYouText: {
   flex: 1,
    fontFamily: FontFamily.openSansRegular,
    fontSize: FontSize.size_base,
    color: Color.colorGray_100,
    lineHeight: 22,
    flexWrap: 'wrap',
    textAlign: 'center',
  },
});

export default DisconnectedBanner;