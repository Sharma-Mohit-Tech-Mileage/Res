/**
 * ============================================================================
 * WALKTHROUGH HELPER FUNCTIONS
 * ============================================================================
 * 
 * Pure functions for calculating walkthrough positions and dimensions.
 * Separated from components for easier testing and reusability.
 * 
 * ============================================================================
 */

import { Dimensions, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
/**
 * Calculate bubble bottom position (distance from bottom of screen)
 */
export function calculateBubbleBottomPosition(tabBarHeight) {
  const spacing = 20;
  return tabBarHeight + spacing;
}

/**
 * Calculate tab bar height (for consistency)
 */
export function calculateTabBarHeight(insets = {}) {
  if (Platform.OS === 'ios') {
    return 90; // Fixed height for iOS
  }
  
  // Android: dynamic based on screen and safe area
  const baseHeight = Math.max(55, SCREEN_HEIGHT * 0.08);
  return baseHeight + (insets.bottom || 0);
}
/**
 * Calculate tab width based on visible tab count
 */
export function calculateTabWidth(visibleTabCount) {
  if (visibleTabCount === 0) return 0;
  return SCREEN_WIDTH / visibleTabCount;
}

/**
 * Calculate position of walkthrough arrow
 */
export function calculateArrowPosition(tabIndex, visibleTabCount) {
  const tabWidth = calculateTabWidth(visibleTabCount);
  const tabCenter = (tabWidth * tabIndex) + (tabWidth / visibleTabCount);
  const arrowWidth = 32; // Arrow component width
  
  return tabCenter - (arrowWidth / 2);
}

/**
 * Calculate responsive horizontal padding based on screen size
 */
export function getResponsivePadding() {
  if (SCREEN_WIDTH < 350) return 16; 
  if (SCREEN_WIDTH < 400) return 20; 
  if (SCREEN_WIDTH < 600) return 24; 
  return 32; 
}

/**
 * Calculate responsive font sizes based on screen size
 */
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


/**
 * Get device size classification for responsive design
 * 
 * @returns {String} - Device size: 'small', 'medium', 'large', 'tablet'
 */
export function getDeviceSize() {
  if (SCREEN_HEIGHT < 650) return 'small';
  if (SCREEN_HEIGHT < 750) return 'medium';
  if (SCREEN_HEIGHT < 900) return 'large';
  return 'tablet';
}