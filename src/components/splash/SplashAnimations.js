import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Dimensions, View, StyleSheet } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Logo from '../../res/images/SpalshLogo';

const getDeviceSize = () => {
  const screenHeight = Dimensions.get('window').height;
  if (screenHeight < 550) return 'tiny';
  if (screenHeight < 600) return 'verySmall';
  if (screenHeight < 700) return 'small';
  return 'normal';
};

const ANIMATION_CONFIG = {
  tiny: { logoStart: 200 },
  verySmall: { logoStart: 250 },
  small: { logoStart: 300 },
  normal: { logoStart: 350 },
};

const ANIMATION_DURATION = 2000;

const SplashAnimations = ({ onAnimationComplete }) => {
  const deviceSize = getDeviceSize();
  const logoFade = useRef(new Animated.Value(0)).current;
  const logoMovement = useRef(
    new Animated.Value(ANIMATION_CONFIG[deviceSize].logoStart)
  ).current;

  useEffect(() => {
    startAnimations();
  }, []);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', () => {
      const newSize = getDeviceSize();
      logoMovement.setValue(ANIMATION_CONFIG[newSize].logoStart);
    });
    return () => subscription?.remove();
  }, []);

  const startAnimations = () => {
    Animated.timing(logoFade, {
      toValue: 1,
      duration: ANIMATION_DURATION,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      Animated.timing(logoMovement, {
        toValue: 0,
        duration: ANIMATION_DURATION,
        easing: Easing.inOut(Easing.exp),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished && onAnimationComplete) {
          onAnimationComplete();
        }
      });
    }, 500);
  };

  const getStyle = (baseStyle) => {
    const sizeStyle = `${baseStyle}_${deviceSize}`;
    return styles[sizeStyle] || styles[baseStyle];
  };

  return (
    <View style={getStyle('splashContainer')}>
      <Animated.View
        style={[
          getStyle('logo'),
          {
            opacity: logoFade,
            transform: [{ translateY: logoMovement }],
          },
        ]}
        accessibilityRole="image"
        accessibilityLabel="SparkLight"
        accessible={true}
      >
        <View style={{ alignSelf: 'center', marginTop: hp('5%') }}>
          <Logo width={300} height={84} />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  splashContainer: {
    marginTop: hp('20%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 320,
    height: 100,
  },
});

export default SplashAnimations;
