import React, { useState } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Color, FontFamily, FontSize, Padding, Border } from '../../styles/GlobalStyles';
import { HEADER_GRADIENT } from '../common/ProfileSettingsHeader';
import SignSaveCheckIcon from '../../res/svgIcons/SignSaveCheckIcon';
import { BREAKPOINTS } from '../../utils/responsive';

// Phones keep the button-label size; tablets scale up; no line cap so large system fonts wrap and the banner grows.
const BASE_WIDTH = 327.402985;
const BASE_HEIGHT = 76;
const MAX_SCALE = 1.6;
const ICON_SIZE = 36;
const ARC_LARGE = 140;
const ARC_SMALL = 84;
const A11Y_LABEL = 'Sign up today and save with Auto Pay and Paperless Billing';

const PromoBanner = () => {
  const [width, setWidth] = useState(0);
  const { width: windowWidth } = useWindowDimensions();
  const isTablet = windowWidth >= BREAKPOINTS.medium;
  const scale = isTablet && width ? Math.min(Math.max(width / BASE_WIDTH, 1), MAX_SCALE) : 1;
  const px = (n) => n * scale;
  const circle = (size) => ({ width: px(size), height: px(size), borderRadius: px(size) / 2 });

  return (
    <LinearGradient
      {...HEADER_GRADIENT}
      style={[styles.container, { minHeight: px(BASE_HEIGHT), paddingHorizontal: px(Padding.p_base), paddingVertical: px(Padding.p_xs) }]}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={A11Y_LABEL}
    >
      <View style={[styles.arc, circle(ARC_LARGE), { right: -px(ARC_LARGE) / 3, top: -px(ARC_LARGE) / 2 }]} />
      <View style={[styles.arc, circle(ARC_SMALL), { right: px(ARC_SMALL) / 2, bottom: -px(ARC_SMALL) / 1.6 }]} />

      <View accessible={false} importantForAccessibility="no-hide-descendants">
        <SignSaveCheckIcon size={px(ICON_SIZE)} color={Color.sparklightWhite} />
      </View>

      <Text
        style={[styles.text, { marginLeft: px(Padding.p_xs), fontSize: px(FontSize.size_lg), lineHeight: px(24) }]}
        accessible={false}
      >
        {'Sign up today and save with '}
        <Text style={styles.bold}>{'Auto\u00A0Pay'}</Text>
        {' and '}
        <Text style={styles.bold}>{'Paperless\u00A0Billing'}</Text>
      </Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Border.br_xs,
    marginBottom: Padding.p_5xl,
    overflow: 'hidden',
  },
  arc: {
    position: 'absolute',
    backgroundColor: Color.sparklightWhite,
    opacity: 0.08,
  },
  text: {
    flex: 1,
    color: Color.sparklightWhite,
    fontFamily: FontFamily.RadioCanadaSemiBold,
    fontWeight: '600',
  },
  bold: {
    fontFamily: FontFamily.RadioCanadaBold,
    fontWeight: '700',
  },
});

export default PromoBanner;
