/**
 * ============================================================================
 * WALKTHROUGH CONTENT BUBBLE
 * ============================================================================
 * 
 * Main content area showing title, description, and actions.
 * 
 * PROPS:
 *   - tab: Current tab object (from visibleTabs array)
 *   - currentStep: Current step index
 *   - totalSteps: Total number of steps
 *   - onNext: Callback for next button
 *   - onPrevious: Callback for previous button
 *   - onSkip: Callback for skip button
 * 
 * ============================================================================
 */

import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Easing, Platform, } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from '../common/Icon';
import WalkthroughProgress from './WalkthroughProgress';
import { FontFamily, Color, Border, Padding } from '../../../GlobalStyles';
import { getResponsiveFontSizes } from '../utility/walkthroughHelpers';

const WalkthroughContent = ({
  tab,
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  onSkip,
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fontSizes = getResponsiveFontSizes();

  useEffect(() => {
    // Pulse animation for icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const { walkthrough } = tab;
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <LinearGradient
      colors={["rgba(53,48,145,1)", "rgba(141,59,144,1)"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.bubble}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.stepInfo}>
          <Animated.View
            style={[
              styles.iconCircle,
              {
                backgroundColor: Color.sparklightWhite,
                transform: [{ scale: pulseAnim }],
              },
            ]}
          >
            <Icon
              name={walkthrough.iconName}
              size={25}
              color={Color.sparklightWhite}
            />
          </Animated.View>
          <Text style={[styles.stepText, { fontSize: fontSizes.label }]}>
            Step {currentStep + 1} of {totalSteps}
          </Text>
        </View>

        <Pressable
          onPress={onSkip}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          accessibilityRole="button"
          accessibilityLabel="Skip walkthrough"
        >
          <Text style={[styles.skipText, { fontSize: fontSizes.label }]}>
            Skip
          </Text>
        </Pressable>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text
          style={[styles.title, { fontSize: fontSizes.title }]}
          accessible={true}
          accessibilityLabel={walkthrough.title}
        >
          {walkthrough.title}
        </Text>
        <Text
          style={[styles.description, { fontSize: fontSizes.body }]}
          accessible={true}
          accessibilityLabel={walkthrough.description}
        >
          {walkthrough.description}
        </Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <WalkthroughProgress
          totalSteps={totalSteps}
          currentStep={currentStep}
        />

        <View style={styles.actions}>
          <Pressable
            style={[
              styles.buttonNext,
              { backgroundColor: Color.colorMidnightblue },
            ]}
            onPress={onNext}
            accessibilityRole="button"
            accessibilityLabel={isLastStep ? 'Finish walkthrough' : 'Next step'}
          >
            <Text style={[styles.buttonNextText, { fontSize: fontSizes.body }]}>
              {isLastStep ? "Let's Go!" : 'Next'}
            </Text>
          </Pressable>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  bubble: {
    borderRadius: 24,
    padding: Padding.p_5xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.6,
    shadowRadius: 32,
    elevation: 20,
    ...(Platform.OS === 'android' && {
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.1)',
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Padding.p_base,
  },
  stepInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: Border.br_xs,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Padding.p_xs,
  },
  stepText: {
    fontFamily: FontFamily.openSansSemiBold,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '600',
  },
  skipText: {
    fontFamily: FontFamily.openSansSemiBold,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '600',
  },
  content: {
    marginBottom: Padding.p_xl,
  },
  title: {
    fontFamily: FontFamily.openSansSemiBold,
    color: Color.sparklightWhite,
    fontWeight: '700',
    marginBottom: Padding.p_5xs,
  },
  description: {
    fontFamily: FontFamily.openSansRegular,
    color: '#D1D5DB',
    lineHeight: 21,
    fontWeight: '400',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: Padding.p_xs,
  },
  buttonPrev: {
    padding: Padding.p_9xs,
    paddingHorizontal: Padding.p_base,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  buttonPrevText: {
    fontFamily: FontFamily.openSansSemiBold,
    color: Color.sparklightWhite,
    fontWeight: '600',
  },
  buttonNext: {
    paddingVertical: Padding.p_9xs,
    paddingHorizontal: Padding.p_xl,
    borderRadius: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonNextText: {
    fontFamily: FontFamily.openSansSemiBold,
    color: Color.sparklightWhite,
    fontWeight: '600',
  },
});

export default WalkthroughContent;