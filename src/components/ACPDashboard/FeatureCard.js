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
            <Icon name="green-checkcircle" size={16} color={Color.sparklightGreen} style={styles.checkIcon} />
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>
      
      <TouchableOpacity 
        style={[styles.button, getButtonStyle()]}
        onPress={onButtonPress}
        accessibilityRole="button"
        accessibilityLabel={buttonText}
      >
        <Text style={[styles.buttonText, getButtonTextStyle()]}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.sparklightWhite,
    borderRadius: 1,
    marginBottom: Padding.p_xl,
    shadowColor: '#000000',
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.25, // #00000040 is approximately 25% opacity
  shadowRadius: 4,
  elevation: 4, // for Android shadow effect
  },
  header: {
    paddingHorizontal: Padding.p_base,
    paddingVertical: Padding.p_xs,
    borderBottomWidth: 1,
    borderBottomColor: Color.colorWhitesmoke_200,
    backgroundColor: Color.colorWhitesmoke_100,
  },
  title: {
    fontFamily: FontFamily.openSansSemiBold,
    fontSize: FontSize.size_lg,
    color: Color.sparklightBrightPurple,
    fontWeight: '700',
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
    fontSize: FontSize.size_lg,
    color: Color.colorGray_100,
    fontWeight: '400',
  },
  button: {
    marginHorizontal: Padding.p_base,
    marginBottom: Padding.p_base,
    paddingVertical: Padding.p_xs,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPrimary: {
    backgroundColor: Color.sparklightBrightPurple,
  },
  buttonSuccess: {
    backgroundColor: '#C8E9D0',
    borderWidth: 1,
    borderColor: Color.sparklightGreen,
  },
  buttonText: {
    fontFamily: FontFamily.openSansSemiBold,
    fontSize: FontSize.size_lg,
    fontWeight: '400',
  },
  buttonTextPrimary: {
    color: Color.sparklightWhite,
  },
  buttonTextSuccess: {
    color: '#000'
  },
});

export default FeatureCard;