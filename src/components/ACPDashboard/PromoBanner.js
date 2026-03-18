import React from 'react';
import { View, StyleSheet } from 'react-native';
import {  Color, Padding, Border } from '../../../GlobalStyles';
import SignSaveResSvg from '../../res/svgIcons/SignSaveResSvg';

const PromoBanner = ({ title }) => {
  return (
    <View style={styles.container}>
      <View
        accessible={true}
        accessibilityRole="text"
        accessibilityLabel="Sign up and save with Auto Pay and Paperless Billing"
        style={styles.bannerGraphic}
      >
        <SignSaveResSvg width="100%" height={118} />
      </View>
      {/* <View style={styles.iconContainer}>
        <Icon name="refresh-cw" size={20} color="#8D3B90" />
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.title}>
          {title}
        </Text>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center', // Vertically centers icon with text block
    backgroundColor: Color.sparklightWhite,
    borderRadius: Border.br_xs,
    marginBottom: Padding.p_5xl,
    overflow: 'hidden',
  },
  bannerGraphic: {
    width: '100%',
    borderRadius: Border.br_7xs,
    overflow: 'hidden',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: Border.br_81xl,
    backgroundColor: Color.sparklightWhite,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Padding.p_xs,
    flexShrink: 0,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: Padding.p_xs,
  },
  title: {
    fontFamily: 'Effra',
    fontSize: 20,
    lineHeight: 26,
    color: '#8D3B90',
    fontWeight: '700',
  },
});

export default PromoBanner;
