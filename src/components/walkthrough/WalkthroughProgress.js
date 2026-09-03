import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Padding } from '../../../GlobalStyles';

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
    backgroundColor: '#E5E7EB',
  },
  dotActive: {
    width: 32,
    backgroundColor: '#353091',
  },
  dotCompleted: {
    width: 6,
    backgroundColor: '#9CA3AF',
  },
});

export default WalkthroughProgress;