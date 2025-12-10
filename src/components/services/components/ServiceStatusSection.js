import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Color, FontSize, FontFamily, Padding, Border } from '../../../../GlobalStyles';
import NotificationAlert from '../../common/customui/NotificationAlert';
import SmallLoader from '../../common/customui/SmallLoader';
import SupportIcon from "../../../res/svgIcons/SupportIcon";

// WiFi Icon with Ultra-Smooth Pulse Animation
const WiFiIconWithPulse = ({ size = 28, isAnimating = false }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    if (isAnimating) {
      // Ultra-smooth pulse animation
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 1500, // Slower = smoother
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      );

      // Smooth glow effect - PURPLE
      const glow = Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      );

      pulse.start();
      glow.start();

      return () => {
        pulse.stop();
        glow.stop();
      };
    } else {
      pulseAnim.setValue(1);
      glowAnim.setValue(0);
    }
  }, [isAnimating]);

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.4], // Subtle glow
  });

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      {/* Outer PURPLE glow circle */}
      {isAnimating && (
        <Animated.View
          style={[
            styles.glowCircle,
            {
              opacity: glowOpacity,
              transform: [{ scale: pulseAnim }],
            },
          ]}
        />
      )}
      
      {/* WiFi Icon with smooth pulse */}
      <Animated.View
        style={{
          transform: [{ scale: pulseAnim }],
        }}
      >
        <SupportIcon color={Color.sparklightBrightPurple} filled={true} size={size} />
      </Animated.View>
    </View>
  );
};

/**
 * ServiceStatusSection Component
 * Smooth pulsing animation while checking
 */
const ServiceStatusSection = ({ 
  onCheckStatus, 
  outageData, 
  checking, 
  onCloseNotification 
}) => {
  const navigation = useNavigation();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleNotificationLink = () => {
    navigation.navigate('account', {
      screen: 'AccountSettings',
      params: { focusNotifications: true }
    });
  };

  const handleCheckStatus = () => {
    // Start animation
    setIsAnimating(true);
    
    // Call original function
    if (onCheckStatus) {
      onCheckStatus();
    }
    
    // Auto-stop after 30 seconds
    setTimeout(() => {
      setIsAnimating(false);
    }, 30000);
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
        {/* Circular WiFi Icon with Smooth Pulse */}
        <View style={styles.iconContainer}>
          <View style={styles.circularBg}>
            <WiFiIconWithPulse size={28} isAnimating={isAnimating || checking} />
          </View>
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

        {/* Button */}
        <TouchableOpacity
          style={[
            styles.button,
            (checking || isAnimating) && styles.buttonDisabled
          ]}
          onPress={handleCheckStatus}
          disabled={checking || isAnimating}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Check Service Status"
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
  circularBg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E6D5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // PURPLE glow effect circle
  glowCircle: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Color.sparklightBrightPurple, // PURPLE
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