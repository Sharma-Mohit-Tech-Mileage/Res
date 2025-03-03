// components/InfoBanner.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontFamily, FontSize, Color, Padding, Border } from '../../../GlobalStyles';
import Icon from '../common/Icon';

const InfoBanner = ({ message, icon = 'info' }) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon name={icon} size={20} color={Color.sparklightWhite} />
      </View>
      
      <View style={styles.textContainer}>
        <Text style={styles.message}>{message}</Text>
      </View>
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
  message: {
    fontFamily: 'Effra',
    fontSize: 20,
    color: Color.sparklightGray1,
    fontWeight: '700',
    flexShrink: 1,
    flexWrap: 'wrap',
  },
});

export default InfoBanner;