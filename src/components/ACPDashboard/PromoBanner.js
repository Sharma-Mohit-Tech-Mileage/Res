import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Color, Padding, Border } from '../../../GlobalStyles';
import SignSaveResSvg from '../../res/svgIcons/SignSaveResSvg';

const BANNER_ASPECT_RATIO = 327.402985 / 117.910448;

const PromoBanner = () => {
  return (
    <View style={styles.container}>
      <View
        accessible={true}
        accessibilityRole="text"
        accessibilityLabel="Sign up and save with Auto Pay and Paperless Billing"
        style={[styles.bannerGraphic, { width: '100%', aspectRatio: BANNER_ASPECT_RATIO }]}
      >
        <SignSaveResSvg width="100%" height="100%" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
});

export default PromoBanner;
