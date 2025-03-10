// components/common/Card.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Color, Border, Padding } from '../../../GlobalStyles';

const Card = ({ 
  children, 
  style, 
  elevation = 1,
  padding = 'medium', // none, small, medium, large
  backgroundColor = Color.sparklightWhite,
  borderRadius = Border.br_xs,
}) => {
  
  // Determine padding based on size
  const getPaddingStyle = () => {
    switch (padding) {
      case 'none':
        return styles.paddingNone;
      case 'small':
        return styles.paddingSmall;
      case 'large':
        return styles.paddingLarge;
      case 'medium':
      default:
        return styles.paddingMedium;
    }
  };

  return (
    <View 
      style={[
        styles.card,
        getPaddingStyle(),
        {
          backgroundColor,
          borderRadius,
          // Dynamic elevation for Android
          elevation: elevation,
          // Dynamic shadow for iOS
          shadowOpacity: 0.1,
          shadowRadius: elevation * 1.5,
          shadowOffset: { height: elevation, width: 0 },
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Color.sparklightWhite,
    borderRadius: Border.br_xs,
    shadowColor: '#000',
    marginBottom: Padding.p_base,
  },
  paddingNone: {
    padding: 0,
  },
  paddingSmall: {
    padding: Padding.p_xs,
  },
  paddingMedium: {
    padding: Padding.p_base,
  },
  paddingLarge: {
    padding: Padding.p_5xl,
  },
});

export default Card;