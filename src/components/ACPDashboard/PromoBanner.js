import React from 'react';
import { View, StyleSheet } from 'react-native';
import {  Color, Padding, Border } from '../../../GlobalStyles';
import SignSaveResSvg from '../../res/svgIcons/SignSaveResSvg';

// SVG viewBox is 327.402985 × 117.910448 — keep the wrapper at this aspect
// ratio so the banner stretches edge-to-edge on tablets and the artwork
// scales proportionally instead of leaving white space at the sides.
const BANNER_ASPECT_RATIO = 327.402985 / 117.910448;

const PromoBanner = ({ title }) => {
  return (
    <View style={styles.container}>
      <View
        accessible={true}
        accessibilityRole="text"
        accessibilityLabel="Sign up and save with Auto Pay and Paperless Billing"
        style={[styles.bannerGraphic, { aspectRatio: BANNER_ASPECT_RATIO }]}
      >
        <SignSaveResSvg width="100%" height="100%" />
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
