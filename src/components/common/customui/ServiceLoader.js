import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { Body } from "./Typography";
import { theme } from "../../../styles/theme";

export default function ServiceLoader({ ring = false, label }) {
  const rotation = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const animation = Animated.loop(Animated.timing(rotation, {
      toValue: 1, duration: 1400, easing: Easing.linear, useNativeDriver: true,
    }));
    animation.start();
    return () => animation.stop();
  }, [rotation]);
  const size = ring ? 160 : 64;
  return (
    <View style={{width: size, height: size, alignItems: "center", justifyContent: "center"}}
      accessible accessibilityRole="progressbar" accessibilityLabel={label || "Loading"} accessibilityState={{busy: true}}>
      <Animated.View style={[StyleSheet.absoluteFillObject, {transform: [{rotate: rotation.interpolate({inputRange: [0, 1], outputRange: ["0deg", "360deg"]})}]}]}>
        <Svg width={size} height={size} viewBox="0 0 100 100" accessible={false}>
          {ring && <Circle cx="50" cy="50" r="40" stroke="#DDDDDD" strokeWidth="14" fill="none" />}
          <Circle cx="50" cy="50" r="40" stroke={theme.colors.purpleBright} strokeWidth={ring ? 14 : 6} fill="none" strokeDasharray={ring ? "63 189" : "170 82"} strokeLinecap={ring ? "butt" : "round"} />
          {!ring && <Circle cx="50" cy="50" r="26" stroke="#D9A0DE" strokeWidth="6" fill="none" strokeDasharray="110 54" strokeDashoffset="65" strokeLinecap="round" />}
        </Svg>
      </Animated.View>
      {label && <Body>{label}</Body>}
    </View>
  );
}
