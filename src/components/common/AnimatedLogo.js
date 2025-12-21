import React, { useEffect, useRef } from 'react';
import { View, Animated, Text, StyleSheet } from 'react-native';
import { FontFamily } from '../../../GlobalStyles';

const AnimatedLogo = ({ width = 320, height = 80.8648681640625 }) => {
  const slash = '/';
  const letters = ['S', 'p', 'a', 'r', 'k', 'l', 'i', 'g', 'h', 't'];
  const trademark = '®';
  
  const slashAnim = useRef(new Animated.Value(0)).current;
  const letterAnims = useRef(letters.map(() => new Animated.Value(0))).current;
  const trademarkAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // First animate the slash
    Animated.sequence([
      Animated.delay(200),
      Animated.parallel([
        Animated.timing(slashAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(slashAnim, {
          toValue: 1,
          friction: 4,
          tension: 50,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      // Then animate letters sequentially
      const letterAnimations = letters.map((_, index) => {
        return Animated.parallel([
          Animated.timing(letterAnims[index], {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.spring(letterAnims[index], {
            toValue: 1,
            friction: 4,
            tension: 50,
            useNativeDriver: true,
          }),
        ]);
      });

      Animated.stagger(80, letterAnimations).start(() => {
        // Finally animate the trademark
        Animated.parallel([
          Animated.timing(trademarkAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.spring(trademarkAnim, {
            toValue: 1,
            friction: 4,
            tension: 50,
            useNativeDriver: true,
          }),
        ]).start();
      });
    });
  }, []);

  return (
    <View style={[styles.container, { width, height }]}>
      <View style={styles.logoRow}>
        <Animated.Text
          style={[
            styles.slash,
            {
              opacity: slashAnim,
              transform: [
                {
                  scale: slashAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 1],
                  }),
                },
                {
                  translateY: slashAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [30, 0],
                  }),
                },
              ],
            },
          ]}
        >
          {slash}
        </Animated.Text>
        {letters.map((letter, index) => (
          <Animated.Text
            key={index}
            style={[
              index === 0 ? styles.firstLetter : styles.letter, // S is first letter
              {
                opacity: letterAnims[index],
                transform: [
                  {
                    scale: letterAnims[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.5, 1],
                    }),
                  },
                  {
                    translateY: letterAnims[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: [30, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            {letter}
          </Animated.Text>
        ))}
      </View>
      <Animated.Text
        style={[
          styles.trademark,
          {
            opacity: trademarkAnim,
            transform: [
              {
                scale: trademarkAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.5, 1],
                }),
              },
              {
                translateY: trademarkAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 0],
                }),
              },
            ],
          },
        ]}
      >
        {trademark}
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 1,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slash: {
    fontSize: 98,
    fontWeight: 'bold',
    height: 118,
    color: 'white',
    fontFamily: FontFamily.interBold,
    marginRight: 1,
    bottom: 5,
  },
  firstLetter: {
    fontSize: 58,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: FontFamily.interBold,
    marginRight: 1,
    marginHorizontal: 1,
  },
  letter: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: FontFamily.interBold,
    marginRight: -1,
    marginHorizontal: 1,
  },
  trademark: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: FontFamily.interBold,
    position: 'absolute',
    top: 20,
    right: -2,
  },
});

export default AnimatedLogo;