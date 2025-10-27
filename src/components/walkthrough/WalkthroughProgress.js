/**
 * ============================================================================
 * WALKTHROUGH PROGRESS INDICATORS
 * ============================================================================
 * 
 * Shows progress dots for walkthrough steps.
 * 
 * PROPS:
 *   - totalSteps: Number of total steps
 *   - currentStep: Current step index (0-based)
 * 
 * ============================================================================
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Color, Padding } from '../../../GlobalStyles';

const WalkthroughProgress = ({ totalSteps, currentStep }) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            index === currentStep && styles.dotActive,
            index < currentStep && styles.dotCompleted,
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Padding.p_5xs,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  dotActive: {
    width: 32,
    backgroundColor: Color.sparklightWhite,
  },
  dotCompleted: {
    width: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
});

export default WalkthroughProgress;