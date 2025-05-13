import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Animated,
  Easing
} from 'react-native';

const height = 80;

const startRotationAnimation = (durationMs, rotationDegree) => {
  Animated.loop(
    Animated.timing(rotationDegree, {
      toValue: 360,
      duration: durationMs,
      easing: Easing.linear,
      useNativeDriver: true
    })
  ).start();
};

const LoadingSpinner = ({ color, durationMs = 1000, text = 'Loading' }) => {
  const rotationDegree = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    startRotationAnimation(durationMs, rotationDegree);
  }, [durationMs]);

  const rotate = rotationDegree.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg']
  });

  return (
    <View style={styles.container} accessibilityRole="progressbar">
      <View style={[styles.background, { borderColor: color }]} />
      <Animated.View
        style={[
          styles.progress,
          { borderTopColor: color },
          { transform: [{ rotateZ: rotate }] }
        ]}
      />
      <View style={styles.textContainer}>
        <Text style={styles.text}>{text}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: height,
    height: height,
    justifyContent: 'center',
    alignItems: 'center'
  },
  background: {
    width: '100%',
    height: '100%',
    borderRadius: height / 2,
    borderWidth: 8,
    opacity: 0.25
  },
  progress: {
    width: '100%',
    height: '100%',
    borderRadius: height / 2,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderWidth: 8,
    position: 'absolute'
  },
  textContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontSize: 10,
    color: '#000'
  }
});

export default LoadingSpinner;
