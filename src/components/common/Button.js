// components/common/Button.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { FontFamily, FontSize, Color, Padding, Border } from '../../../GlobalStyles';

const Button = ({
  title,
  onPress,
  variant = 'primary', // primary, secondary, success, outline, text
  size = 'medium', // small, medium, large
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  style,
  textStyle,
  accessibilityLabel,
  accessibilityHint,
}) => {
  // Determine button style based on variant
  const getButtonStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.buttonSecondary;
      case 'success':
        return styles.buttonSuccess;
      case 'outline':
        return styles.buttonOutline;
      case 'text':
        return styles.buttonText;
      case 'primary':
      default:
        return styles.buttonPrimary;
    }
  };

  // Determine text style based on variant
  const getTextStyle = () => {
    switch (variant) {
      case 'outline':
        return styles.textOutline;
      case 'text':
        return styles.textLink;
      case 'success':
        return styles.textSuccess;
      case 'secondary':
      case 'primary':
      default:
        return styles.textPrimary;
    }
  };

  // Determine button size style
  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return styles.buttonSmall;
      case 'large':
        return styles.buttonLarge;
      case 'medium':
      default:
        return styles.buttonMedium;
    }
  };

  // Determine text size style
  const getTextSizeStyle = () => {
    switch (size) {
      case 'small':
        return styles.textSmall;
      case 'large':
        return styles.textLarge;
      case 'medium':
      default:
        return styles.textMedium;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getButtonStyle(),
        getSizeStyle(),
        fullWidth && styles.fullWidth,
        disabled && styles.buttonDisabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'outline' || variant === 'text' ? Color.colorMidnightblue : Color.sparklightWhite} 
          size="small" 
        />
      ) : (
        <>
          {icon && icon}
          <Text
            style={[
              styles.text,
              getTextStyle(),
              getTextSizeStyle(),
              disabled && styles.textDisabled,
              textStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Border.br_5xs,
  },
  buttonPrimary: {
    backgroundColor: Color.colorMidnightblue,
  },
  buttonSecondary: {
    backgroundColor: Color.sparklightDarkGray,
  },
  buttonSuccess: {
    backgroundColor: Color.colorAquamarine,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Color.colorMidnightblue,
  },
  buttonText: {
    backgroundColor: 'transparent',
  },
  buttonDisabled: {
    backgroundColor: Color.sparklightGray,
    borderColor: Color.sparklightGray,
  },
  buttonSmall: {
    paddingVertical: Padding.p_7xs,
    paddingHorizontal: Padding.p_5xs,
  },
  buttonMedium: {
    paddingVertical: Padding.p_xs,
    paddingHorizontal: Padding.p_base,
  },
  buttonLarge: {
    paddingVertical: Padding.p_base,
    paddingHorizontal: Padding.p_5xl,
  },
  fullWidth: {
    width: '100%',
  },
  text: {
    fontFamily: FontFamily.openSansSemiBold,
    textAlign: 'center',
  },
  textPrimary: {
    color: Color.sparklightWhite,
  },
  textOutline: {
    color: Color.colorMidnightblue,
  },
  textLink: {
    color: Color.colorMidnightblue,
  },
  textSuccess: {
    color: Color.success700,
  },
  textDisabled: {
    color: Color.sparklightDarkGray,
  },
  textSmall: {
    fontSize: FontSize.size_xs,
  },
  textMedium: {
    fontSize: FontSize.size_sm,
  },
  textLarge: {
    fontSize: FontSize.size_base,
  },
});

export default Button;