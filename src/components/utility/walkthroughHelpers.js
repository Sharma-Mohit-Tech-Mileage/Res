import { Dimensions, Platform } from 'react-native';
import { getDeviceSize as resolveDeviceSize } from '../../utils/responsive';

export function calculateBubbleBottomPosition(tabBarHeight) {
  const spacing = 20;
  return tabBarHeight + spacing;
}

export function calculateTabBarHeight(insets = {}) {
  if (Platform.OS === 'ios') {
    return 90;
  }

  const baseHeight = Math.max(55, Dimensions.get('window').height * 0.08);
  return baseHeight + (insets.bottom || 0);
}

export function calculateTabWidth(visibleTabCount) {
  if (visibleTabCount === 0) return 0;
  return Dimensions.get('window').width / visibleTabCount;
}

export function calculateArrowPosition(tabIndex, visibleTabCount) {
  const tabWidth = calculateTabWidth(visibleTabCount);
  const tabCenter = (tabWidth * tabIndex) + (tabWidth / visibleTabCount);
  const arrowWidth = 32;

  return tabCenter - (arrowWidth / 2);
}

export function getResponsivePadding() {
  const { width: SCREEN_WIDTH } = Dimensions.get('window');
  if (SCREEN_WIDTH < 350) return 16;
  if (SCREEN_WIDTH < 400) return 20;
  if (SCREEN_WIDTH < 600) return 24;
  return 32;
}

export function getResponsiveFontSizes() {
  const { height: SCREEN_HEIGHT } = Dimensions.get('window');
  if (SCREEN_HEIGHT < 650) {
    return {
      title: 16,
      body: 13,
      label: 11,
    };
  }

  if (SCREEN_HEIGHT < 750) {
    return {
      title: 18,
      body: 14,
      label: 12,
    };
  }

  return {
    title: 20,
    body: 16,
    label: 14,
  };
}

// Delegates to the single source of truth in utils/responsive.
export function getDeviceSize() {
  const { width, height } = Dimensions.get('window');
  return resolveDeviceSize(width, height);
}
