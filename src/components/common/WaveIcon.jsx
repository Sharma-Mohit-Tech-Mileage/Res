import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { MotiView } from 'moti';

const WaveAnimation = ({ loading, isIssueDetected, children }) => {
  const iconSize = Dimensions.get('window').width * 0.38; // Icon size
  const waveStartRadius = iconSize / 2; // Start wave just outside the icon's boundary
  const containerSize = Dimensions.get('window').width * .95; // Outer wave boundary

  // Determine the wave color based on detection status
  const waveColor = loading
    ? 'rgba(110, 1, 239, 0.8)' // Default wave color during loading
    : isIssueDetected
      ? 'rgba(255, 0, 0, 0.8)' // Red for issue detected
      : 'rgba(0, 255, 0, 0.8)'; // Green for no issue detected

  return (
    <View style={[styles.animationContainer, { width: containerSize, height: containerSize }]}>
      {loading ? (
        // Animated waves during loading phase
        [...Array(4).keys()].map((index) => (
          <MotiView
            key={index}
            from={{ opacity: 0.5, scale: waveStartRadius / (containerSize / 2) }}
            animate={{ opacity: 0, scale: .8 }}
            transition={{
              type: 'timing',
              duration: 2000,
              delay: index * 400,
              loop: true,
              repeatReverse: false,
            }}
            style={[
              styles.filledWave,
              {
                width: containerSize,
                height: containerSize,
                backgroundColor: waveColor,
              },
            ]}
          />
        ))
      ) : (
        // Static Full-Sized Wave when loading is false
        <View
          style={[
            styles.filledWave,
            {
              width: containerSize,
              height: containerSize,
              backgroundColor: waveColor,
              opacity: 0.3,
              transform: [{ scale: .8 }], // Static wave scaled to maximum size
            },
          ]}
        />
      )}
      <View style={[styles.iconContainer, { width: iconSize, height: iconSize }]}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  animationContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden', // Keeps waves inside bounds
    position: 'relative',
    borderRadius: 9999, // Ensures container remains circular
  },
  filledWave: {
    position: 'absolute',
    borderRadius: 9999, // Makes each wave circular
  },
  iconContainer: {
    zIndex: 1, // Ensures icon stays above waves
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white', // Icon's area remains unaffected visually
    borderRadius: 9999, // Ensure icon remains circular
    overflow: 'hidden', // Ensures icon remains within bounds
  },
});

export default WaveAnimation;