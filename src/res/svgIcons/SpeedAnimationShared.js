import React, { useEffect, useRef, useState } from "react";
import {
  AccessibilityInfo,
  Animated,
  Easing,
  StyleSheet,
  View,
} from "react-native";
import {Color} from "../../styles/GlobalStyles";
import Svg, { Circle, G, Line, Path, Rect } from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const GREEN = Color.sparklightGreen
const PURPLE = Color.colorMidnightblue

function DeviceIcon({ type, x, y, scale = 1, active }) {
  const stroke = active ? "#FFFFFF" : PURPLE;
  return (
    <G
      transform={`translate(${x} ${y}) scale(${scale})`}
      fill="none"
      stroke={stroke}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {type === "phone" ? (
        <>
          <Rect x={-7} y={-12} width={14} height={24} rx={2} />
          <Line x1={-3} y1={-9} x2={3} y2={-9} />
          <Circle cx={0} cy={8.5} r={0.8} fill={stroke} stroke="none" />
        </>
      ) : type === "eero" ? (
        <>
          <Rect
            x={-18}
            y={-18}
            width={36}
            height={36}
            rx={11}
            strokeWidth={2.5}
          />
          <Line x1={-12} y1={3} x2={-5} y2={3} strokeWidth={2.5} />
          <Path d="M-3 18v-5a3 3 0 0 1 6 0v5" strokeWidth={2.5} />
        </>
      ) : (
        <>
          <Rect x={-3.5} y={-13} width={7} height={23} rx={1.5} />
          <Circle cx={0} cy={-8} r={0.8} fill={stroke} stroke="none" />
          <Circle cx={0} cy={-3} r={0.8} fill={stroke} stroke="none" />
          <Circle cx={0} cy={2} r={0.8} fill={stroke} stroke="none" />
          <Line x1={-6} y1={14} x2={6} y2={14} />
        </>
      )}
    </G>
  );
}

export function Device({ x, type, large, active, progress }) {
  const radius = large ? 32 : 17;
  return (
    <>
      <Circle
        cx={x}
        cy={54.5}
        r={radius + 6}
        fill={active ? GREEN : "#EEEEEE"}
        opacity={active ? 0.12 : 0.5}
      />
      {active && (
        <AnimatedCircle
          cx={x}
          cy={54.5}
          r={radius + 3}
          fill="none"
          stroke={GREEN}
          strokeWidth={6}
          opacity={progress.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0.34, 0.08, 0.34],
          })}
        />
      )}
      <Circle cx={x} cy={54.5} r={radius} fill={active ? GREEN : "#E2E2E2"} />
      <DeviceIcon
        x={x}
        y={54.5}
        type={type}
        active={active}
        scale={large && type === "modem" ? 1.55 : large ? 1 : 0.9}
      />
    </>
  );
}

export function Connection({ x, progress, reducedMotion }) {
  return (
    <G>
      {[0, 1, 2, 3].map((index) => (
        <AnimatedCircle
          key={index}
          cx={x + index * 4}
          cy={54.5}
          r={1}
          fill={GREEN}
          opacity={
            reducedMotion
              ? 1
              : progress.interpolate({
                  inputRange: [0, index / 8 + 0.01, index / 8 + 0.13, 0.8, 1],
                  outputRange: [0.15, 0.15, 1, 1, 0.15],
                })
          }
        />
      ))}
    </G>
  );
}

export function useSpeedAnimation() {
  const progress = useRef(new Animated.Value(0)).current;
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((value) => {
        if (active) setReducedMotion(value);
      })
      .catch(() => {});
    const subscription = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      setReducedMotion,
    );
    return () => {
      active = false;
      subscription.remove();
    };
  }, []);
  useEffect(() => {
    progress.setValue(0);
    if (reducedMotion) return undefined;
    const animation = Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: 800,
        easing: Easing.linear,
        useNativeDriver: false,
        isInteraction: false,
      }),
    );
    animation.start();
    return () => animation.stop();
  }, [progress, reducedMotion]);
  return { progress, reducedMotion };
}

export function SpeedAnimationCanvas({ children, width = 281, style }) {
  return (
    <View
      style={[styles.animation, style]}
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Svg width="100%" height="100%" viewBox={`0 0 ${width} 109`}>
        {children}
      </Svg>
    </View>
  );
}
const styles = StyleSheet.create({ animation: { width: "100%", height: 110 } });
