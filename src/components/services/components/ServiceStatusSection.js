import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Color, FontSize, FontFamily, Padding, Border } from '../../../../GlobalStyles';
import NotificationAlert from '../../common/customui/NotificationAlert';
import SmallLoader from '../../common/customui/SmallLoader';
import SupportIcon from "../../../res/svgIcons/SupportIcon";

// Placeholder icon (you'll replace with your SVG)
const LaptopWifiIcon = () => (
  <View style={styles.iconPlaceholder}>
   <SupportIcon color={Color.sparklightBrightPurple} filled={true} />
  </View>
);

/**
 * ServiceStatusSection Component
 * Displays "Stay Connected with Confidence" section
 * Handles service status checking
 * Shows outage/no outage notifications
 */
const ServiceStatusSection = ({ 
  onCheckStatus, 
  outageData, 
  checking, 
  onCloseNotification 
}) => {
  const navigation = useNavigation();

  const handleNotificationLink = () => {
    // Navigate to Account Settings > Notifications
    navigation.navigate('account', {
      screen: 'AccountSettings',
      params: { focusNotifications: true }
    });
  };

  return (
    <View style={styles.container}>
      {/* Outage Notification */}
      {outageData && (
        <View style={styles.notificationContainer}>
          <NotificationAlert
            type={outageData.hasOutage ? "warning" : "info"}
            title={outageData.title}
            message={outageData.message}
            onClose={onCloseNotification}
            showCloseIcon={true}
            isVisible={true}
            splitKey="notification settings"
          />
        </View>
      )}

      {/* Stay Connected Section */}
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <LaptopWifiIcon />
        </View>

        <Text 
          style={styles.title}
          accessible={true}
          accessibilityRole="header"
        >
          Stay Connected with Confidence
        </Text>

        <Text 
          style={styles.subtitle}
          accessible={true}
        >
          When your connection pauses, we hit play.
        </Text>

        <TouchableOpacity
          style={[
            styles.button,
            checking && styles.buttonDisabled
          ]}
          onPress={onCheckStatus}
          disabled={checking}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Check Service Status"
          accessibilityHint="Double tap to check for service outages in your area"
          accessibilityState={{ disabled: checking, busy: checking }}
        >
          {checking ? (
            <SmallLoader isWhite={true} width={60} height={40} />
          ) : (
            <Text style={styles.buttonText}>Check Service Status</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: Padding.p_base,
    marginBottom: Padding.p_5xl,
  },
  notificationContainer: {
    paddingHorizontal: Padding.p_base,
    marginBottom: Padding.p_base,
  },
  card: {
    backgroundColor: Color.sparklightWhite,
    borderRadius: Border.br_5xs,
    padding: Padding.p_5xl,
    marginHorizontal: Padding.p_base,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Color.colorWhitesmoke_200,
    // Subtle shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    marginBottom: Padding.p_base,
  },
  iconPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: Border.br_xs,
    backgroundColor: Color.gray50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Color.sparklightBrightPurple,
  },
  iconText: {
    fontSize: 40,
  },
  title: {
    fontSize: FontSize.size_3xl,
    fontFamily: FontFamily.openSansSemiBold,
    fontWeight: '600',
    color: Color.sparklightBrightPurple,
    textAlign: 'center',
    marginBottom: Padding.p_5xs,
  },
  subtitle: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.openSansRegular,
    color: Color.colorGray_200,
    textAlign: 'center',
    marginBottom: Padding.p_5xl,
  },
  button: {
    backgroundColor: Color.colorMidnightblue,
    paddingVertical: Padding.p_base,
    paddingHorizontal: Padding.p_5xl,
    borderRadius: Border.br_11xs,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: FontSize.size_lg,
    fontFamily: FontFamily.openSansSemiBold,
    fontWeight: '700',
    color: Color.sparklightWhite,
  },
});

export default ServiceStatusSection;
