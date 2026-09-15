import React, { useEffect, useRef } from "react";
import { Animated, Easing, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { Body } from "../../common/customui/Typography";
import styles from "./wifiSpeedStyles";

const WifiSpeedTestRunning = () => {
  const value = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(value, {
          toValue: 1,
          duration: 1400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(value, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [value]);
  return (
    <View
      style={styles.gauge}
      accessibilityLiveRegion="polite"
      accessibilityLabel="Speed test running. Sample download 101.5 megabits per second."
    >
      <Svg width="100%" height={240} viewBox="0 0 280 240" accessible={false}>
        <Path
          d="M 55 210 A 115 115 0 1 1 225 210"
          fill="none"
          stroke="#1968B4"
          strokeWidth={22}
        />
      </Svg>
      <Animated.View
        style={[
          styles.needlePivot,
          {
            transform: [
              {
                rotate: value.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["-50deg", "55deg"],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.needle} />
      </Animated.View>
      <Body style={styles.gaugeValue}>101.5</Body>
      <Body style={styles.units}>Mbps</Body>
    </View>
  );
};
export default WifiSpeedTestRunning;
