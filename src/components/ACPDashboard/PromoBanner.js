// components/PromoBanner.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontFamily, FontSize, Color, Padding, Border } from '../../../GlobalStyles';
import Icon from '../common/Icon';

const PromoBanner = ({ title, showBonus = false }) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon name="refresh-cw" size={20} color={Color.sparklightWhite} />
      </View>
      
      <View style={styles.textContainer}>
        <Text 
          style={styles.title}
          accessibilityRole="header"
        >
          {title}
        </Text>
      </View>
      
      {showBonus && (
        <View style={styles.bonusContainer}>
          <Text style={styles.bonusText}>BONUS!</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Color.sparklightWhite,
    borderRadius: Border.br_xs,
    padding: Padding.p_xs,
    marginBottom: Padding.p_base,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: Border.br_81xl,
    backgroundColor: Color.sparklightBrightPurple,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Padding.p_xs,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontFamily: FontFamily.openSansSemiBold,
    fontSize: FontSize.size_base,
    color: Color.colorGray_200,
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  bonusContainer: {
    backgroundColor: Color.sparklightGreen,
    paddingHorizontal: Padding.p_xs,
    paddingVertical: Padding.p_11xs,
    borderRadius: Border.br_11xs,
    marginLeft: Padding.p_xs,
  },
  bonusText: {
    fontFamily: FontFamily.openSansSemiBold,
    fontSize: FontSize.size_xs,
    color: Color.sparklightWhite,
  },
});

export default PromoBanner;