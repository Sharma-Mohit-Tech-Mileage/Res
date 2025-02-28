// components/FeatureCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontFamily, FontSize, Color, Padding, Border } from '../../../GlobalStyles';
import Icon from '../common/Icon';

const FeatureCard = ({ 
  title, 
  features = [], 
  buttonText, 
  buttonVariant = 'primary',
  isActive = false,
  onButtonPress 
}) => {
  const getButtonStyle = () => {
    switch (buttonVariant) {
      case 'success':
        return styles.buttonSuccess;
      case 'primary':
      default:
        return styles.buttonPrimary;
    }
  };

  const getButtonTextStyle = () => {
    switch (buttonVariant) {
      case 'success':
        return styles.buttonTextSuccess;
      case 'primary':
      default:
        return styles.buttonTextPrimary;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
      </View>
      
      <View style={styles.features}>
        {features.map((feature, index) => (
          <View key={index} style={styles.featureRow}>
            <Icon 
              name="check-circle" 
              size={16} 
              color={Color.sparklightGreen}
              style={styles.checkIcon}
            />
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>
      
      <TouchableOpacity 
        style={[styles.button, getButtonStyle()]}
        onPress={onButtonPress}
        accessibilityRole="button"
        accessibilityLabel={buttonText}
        accessibilityState={{ disabled: isActive && buttonVariant === 'success' }}
      >
        <Text style={[styles.buttonText, getButtonTextStyle()]}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.sparklightWhite,
    borderRadius: Border.br_xs,
    marginBottom: Padding.p_base,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  header: {
    paddingHorizontal: Padding.p_base,
    paddingVertical: Padding.p_xs,
    borderBottomWidth: 1,
    borderBottomColor: Color.colorWhitesmoke_200,
  },
  title: {
    fontFamily: FontFamily.openSansSemiBold,
    fontSize: FontSize.size_lg,
    color: Color.sparklightBrightPurple,
  },
  features: {
    paddingVertical: Padding.p_xs,
    paddingHorizontal: Padding.p_base,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Padding.p_xs,
  },
  checkIcon: {
    marginRight: Padding.p_xs,
  },
  featureText: {
    fontFamily: FontFamily.openSansRegular,
    fontSize: FontSize.size_sm,
    color: Color.colorGray_100,
  },
  button: {
    marginHorizontal: Padding.p_base,
    marginBottom: Padding.p_base,
    paddingVertical: Padding.p_xs,
    borderRadius: Border.br_5xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPrimary: {
    backgroundColor: Color.sparklightBrightPurple,
  },
  buttonSuccess: {
    backgroundColor: Color.colorAquamarine,
  },
  buttonText: {
    fontFamily: FontFamily.openSansSemiBold,
    fontSize: FontSize.size_base,
  },
  buttonTextPrimary: {
    color: Color.sparklightWhite,
  },
  buttonTextSuccess: {
    color: Color.success700,
  },
});

export default FeatureCard;