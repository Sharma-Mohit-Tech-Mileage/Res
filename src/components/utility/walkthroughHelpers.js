import { Dimensions, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export function calculateBubbleBottomPosition(tabBarHeight) {
  const spacing = 20;
  return tabBarHeight + spacing;
}

export function calculateTabBarHeight(insets = {}) {
  if (Platform.OS === 'ios') {
    return 90;
  }

  const baseHeight = Math.max(55, SCREEN_HEIGHT * 0.08);
  return baseHeight + (insets.bottom || 0);
}

export function calculateTabWidth(visibleTabCount) {
  if (visibleTabCount === 0) return 0;
  return SCREEN_WIDTH / visibleTabCount;
}

export function calculateArrowPosition(tabIndex, visibleTabCount) {
  const tabWidth = calculateTabWidth(visibleTabCount);
  const tabCenter = (tabWidth * tabIndex) + (tabWidth / visibleTabCount);
  const arrowWidth = 32;

  return tabCenter - (arrowWidth / 2);
}

export function getResponsivePadding() {
  if (SCREEN_WIDTH < 350) return 16;
  if (SCREEN_WIDTH < 400) return 20;
  if (SCREEN_WIDTH < 600) return 24;
  return 32;
}

export function getResponsiveFontSizes() {
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

export function getDeviceSize() {
  if (SCREEN_HEIGHT < 650) return 'small';
  if (SCREEN_HEIGHT < 750) return 'medium';
  if (SCREEN_HEIGHT < 900) return 'large';
  return 'tablet';
}
