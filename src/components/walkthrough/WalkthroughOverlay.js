/**
 * ============================================================================
 * WALKTHROUGH OVERLAY - WITH SPOTLIGHT CUTOUT - REDESIGNED
 * ============================================================================
 * 
 * Creates a true spotlight effect with improved UX:
 * - Dark overlay covers entire screen EXCEPT active tab
 * - Active tab remains fully visible and interactive-looking
 * - Arrow points to the clear/visible tab
 * - NO FADE TRANSITIONS between steps (instant switch)
 * - Improved accessibility for screen readers
 * 
 * IMPROVEMENTS:
 * - Removed card fade transitions for smoother UX
 * - Added accessibility props to hide overlays from screen readers
 * - Lighter overlay shadow (softer look with white card)
 * 
 * ============================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, Platform, Dimensions } from 'react-native';
import { useDispatch } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { updateWalkThroughStep } from '../../redux/actions/DashboardAction';
import WalkthroughContent from './WalkthroughContent';
import WalkthroughArrow from './WalkthroughArrow';
import {
  calculateArrowPosition,
  calculateBubbleBottomPosition,
  getResponsivePadding,
  calculateTabWidth,
} from '../utility/walkthroughHelpers';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const WalkthroughOverlay = ({ visibleTabs, currentStep, onFinish, tabBarHeight }) => {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const [localStep, setLocalStep] = useState(currentStep);

  // Animation values
  const overlayFade = useRef(new Animated.Value(0)).current;
  const bubbleFade = useRef(new Animated.Value(0)).current;
  const bubbleSlide = useRef(new Animated.Value(50)).current;

  // Entry animation
  useEffect(() => {
    Animated.parallel([
      Animated.timing(overlayFade, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.timing(bubbleFade, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.spring(bubbleSlide, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Sync with parent
  useEffect(() => {
    setLocalStep(currentStep);
  }, [currentStep]);

  // Handle step change - NO FADE TRANSITION
  const handleNext = () => {
    const nextStep = localStep + 1;

    if (nextStep >= visibleTabs.length) {
      handleFinish();
      return;
    }

    // Instant step change - no fade animation
    setLocalStep(nextStep);
    dispatch(updateWalkThroughStep(nextStep));
  };

  const handlePrevious = () => {
    if (localStep === 0) return;

    const prevStep = localStep - 1;

    // Instant step change - no fade animation
    setLocalStep(prevStep);
    dispatch(updateWalkThroughStep(prevStep));
  };

  const handleSkip = () => {
    handleFinish();
  };

  const handleFinish = () => {
    // Exit animation
    Animated.parallel([
      Animated.timing(overlayFade, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(bubbleFade, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(bubbleSlide, {
        toValue: 50,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      dispatch(updateWalkThroughStep(null));
      if (onFinish) onFinish();
    });
  };

  // Validation
  if (!visibleTabs || visibleTabs.length === 0) {
    return null;
  }

  if (localStep < 0 || localStep >= visibleTabs.length) {
    return null;
  }

  const currentTab = visibleTabs[localStep];
  
  // Calculate positions using helper functions
  const arrowPosition = calculateArrowPosition(localStep, visibleTabs.length);
  const horizontalPadding = getResponsivePadding();
  const bubbleBottomPosition = calculateBubbleBottomPosition(tabBarHeight);
  
  // Calculate spotlight positions for active tab
  const tabWidth = calculateTabWidth(visibleTabs.length);
  const activeTabLeft = tabWidth * localStep;
  const activeTabRight = tabWidth * (localStep + 1);

  return (
    <>
      {/* TOP OVERLAY - Covers everything ABOVE the tab bar */}
      <Animated.View
        style={[
          styles.topOverlay,
          {
            height: SCREEN_HEIGHT - tabBarHeight,
            opacity: overlayFade.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.70],
            }),
          },
        ]}
        importantForAccessibility="no-hide-descendants"
        accessible={false}
      />

      {/* LEFT SHADOW - Covers tabs to the LEFT of active tab */}
      {localStep > 0 && (
        <Animated.View
          style={[
            styles.tabShadow,
            {
              bottom: 0,
              left: 0,
              width: activeTabLeft,
              height: tabBarHeight,
              opacity: overlayFade.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.85],
              }),
            },
          ]}
          importantForAccessibility="no-hide-descendants"
          accessible={false}
        />
      )}

      {/* RIGHT SHADOW - Covers tabs to the RIGHT of active tab */}
      {localStep < visibleTabs.length - 1 && (
        <Animated.View
          style={[
            styles.tabShadow,
            {
              bottom: 0,
              left: activeTabRight,
              width: SCREEN_WIDTH - activeTabRight,
              height: tabBarHeight,
              opacity: overlayFade.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.85],
              }),
            },
          ]}
          importantForAccessibility="no-hide-descendants"
          accessible={false}
        />
      )}

      {/* ACTIVE TAB HIGHLIGHT (Subtle purple glow) */}
      <Animated.View
        style={[
          styles.activeTabHighlight,
          {
            bottom: 0,
            left: activeTabLeft,
            width: tabWidth,
            height: tabBarHeight,
            opacity: overlayFade.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.15],
            }),
          },
        ]}
        importantForAccessibility="no-hide-descendants"
        accessible={false}
      />

      {/* Walkthrough bubble */}
      <Animated.View
        style={[
          styles.bubbleContainer,
          {
            bottom: bubbleBottomPosition,
            left: horizontalPadding,
            right: horizontalPadding,
            opacity: bubbleFade,
            transform: [{ translateY: bubbleSlide }],
          },
        ]}
        accessibilityViewIsModal={true}
      >
        <WalkthroughContent
          tab={currentTab}
          currentStep={localStep}
          totalSteps={visibleTabs.length}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onSkip={handleSkip}
        />

        <WalkthroughArrow leftPosition={arrowPosition} />
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  topOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000',
    zIndex: 100,
  },
  tabShadow: {
    position: 'absolute',
    backgroundColor: '#000',
    zIndex: 100,
  },
  activeTabHighlight: {
    position: 'absolute',
    backgroundColor: 'rgba(53, 48, 145, 0.3)',
    zIndex: 99,
  },
  bubbleContainer: {
    position: 'absolute',
    zIndex: 102,
  },
});

export default WalkthroughOverlay;