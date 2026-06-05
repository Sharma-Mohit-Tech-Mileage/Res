import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '../../styles/theme';

const AnnouncementProgress = ({ totalSteps, currentStep }) => {
  return (
    <View 
      style={styles.container}
      accessible={true}
      accessibilityRole="progressbar"
      accessibilityLabel={`Progress: Step ${currentStep + 1} of ${totalSteps}`}
    >
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
    gap: theme.spacing.sm,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E5E7EB',
  },
  dotActive: {
    width: 32,
    backgroundColor: theme.colors.primaryDark,
  },
  dotCompleted: {
    width: 6,
    backgroundColor: '#9CA3AF',
  },
});

export default AnnouncementProgress;