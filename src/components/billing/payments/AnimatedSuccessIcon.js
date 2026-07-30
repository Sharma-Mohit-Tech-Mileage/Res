import React, { useEffect, useRef, useState } from "react";
import { Animated, AccessibilityInfo } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedPath = Animated.createAnimatedComponent(Path);

const CIRCLE_LENGTH = 2 * Math.PI * 7.5;

const VARIANTS = {
  success: { color: "#2BA948", marks: [{ d: "M6.019 9L8.269 11.25L12.769 6.75", length: 9.6 }] },
  error: {
    color: "#DC3626",
    marks: [
      { d: "M6.394 6L12.394 12", length: 8.5 },
      { d: "M12.394 6L6.394 12", length: 8.5 },
    ],
  },
};

const AnimatedSuccessIcon = ({ size = 64, variant = "success", color }) => {
  const config = VARIANTS[variant] || VARIANTS.success;
  const strokeColor = color || config.color;
  const circleProgress = useRef(new Animated.Value(CIRCLE_LENGTH)).current;
  const markProgress = useRef(config.marks.map((mark) => new Animated.Value(mark.length))).current;
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (!mounted) return;
      if (enabled) {
        setReduceMotion(true);
        circleProgress.setValue(0);
        markProgress.forEach((progress) => progress.setValue(0));
        return;
      }
      Animated.sequence([
        Animated.timing(circleProgress, { toValue: 0, duration: 550, useNativeDriver: false }),
        ...markProgress.map((progress) =>
          Animated.timing(progress, { toValue: 0, duration: 220, useNativeDriver: false })
        ),
      ]).start();
    });
    return () => {
      mounted = false;
    };
  }, [circleProgress, markProgress]);

  return (

    <Svg width={size} height={size} viewBox="0.394 0 18 18" fill="none">
      <AnimatedCircle
        cx={9.394}
        cy={9}
        r={7.5}
        stroke={strokeColor}
        strokeWidth={2}
        strokeLinecap="round"
        strokeDasharray={reduceMotion ? undefined : `${CIRCLE_LENGTH}`}
        strokeDashoffset={reduceMotion ? 0 : circleProgress}
        rotation={-90}
        originX={9.394}
        originY={9}
      />
      {config.marks.map((mark, index) => (
        <AnimatedPath
          key={mark.d}
          d={mark.d}
          stroke={strokeColor}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={reduceMotion ? undefined : `${mark.length}`}
          strokeDashoffset={reduceMotion ? 0 : markProgress[index]}
        />
      ))}
    </Svg>
  );
};

export default AnimatedSuccessIcon;
