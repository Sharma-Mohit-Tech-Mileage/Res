import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { MotiView } from 'moti';
import { Color } from '../../../GlobalStyles';

const WaveAnimation = ({ loading, isIssueDetected, children }) => {
  const iconSize = Dimensions.get('window').width * 0.30;
  const waveStartRadius = iconSize / 2;
  const containerSize = Dimensions.get('window').width * .95;

  // Purple palette from design for loading state
  const purpleWaveColors = [
    '#F1E7F1', // Outermost wave
    '#E8D7E9',
    '#BB89BC',
    '#8D3890'  // Innermost wave
  ];

  // Get wave color based on state
  const getWaveColor = (index) => {
    if (loading) {
      return purpleWaveColors[index];
    }
    return isIssueDetected ? 'rgba(255, 0, 0, 0.8)': Color.sparklightGreen;
  };

  // Get background color for icon container
  const getIconBackgroundColor = () => {
    return "#8D3890";
  };

  return (
    <View style={[styles.animationContainer, { width: containerSize, height: containerSize }]}>
      {loading ? (
        [...Array(4).keys()].map((index) => (
          <MotiView
            key={index}
            from={{ opacity: 0.7, scale: waveStartRadius / (containerSize / 2) }}
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
                backgroundColor: getWaveColor(index),
              },
            ]}
          />
        ))
      ) : (
        <View
          style={[
            styles.filledWave,
            {
              width: containerSize,
              height: containerSize,
              backgroundColor: getWaveColor(0),
              opacity: 0.3,
              transform: [{ scale: .8 }],
            },
          ]}
        />
      )}
      <View 
        style={[
          styles.iconContainer, 
          { 
            backgroundColor: getIconBackgroundColor(),
            width: iconSize, 
            height: iconSize,
          }
        ]}
      >
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  animationContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
    borderRadius: 9999,
  },
  filledWave: {
    position: 'absolute',
    borderRadius: 9999,
  },
  iconContainer: {
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 9999,
    overflow: 'hidden',
  },
});

export default WaveAnimation;