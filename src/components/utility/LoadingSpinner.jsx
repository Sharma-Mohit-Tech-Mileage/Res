import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const SIZE = 130;
const STROKE_WIDTH = 18;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const LoadingSpinner = () => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <Svg width={SIZE} height={SIZE}>
          <Circle
            stroke="#ddd"
            fill="none"
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            strokeWidth={STROKE_WIDTH}
          />
          <Circle
            stroke="#8D3B90"
            fill="none"
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            strokeDasharray={`${CIRCUMFERENCE}`}
            strokeDashoffset={CIRCUMFERENCE * 0.75}
            strokeLinecap="square"
            strokeWidth={STROKE_WIDTH}
          />
        </Svg>
      </Animated.View>
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
};

export default LoadingSpinner;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    position: 'absolute',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
    color: '#001321',
  },
});
