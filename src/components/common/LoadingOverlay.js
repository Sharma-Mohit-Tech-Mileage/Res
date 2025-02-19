import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Dimensions, Animated, Text } from "react-native";
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";
import { Color, FontFamily } from "../../../GlobalStyles";

const DoughnutSpinner = ({ size = 50, strokeWidth = 8 }) => {
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1000, // one full rotation per second
        useNativeDriver: true,
      })
    ).start();
  }, [spinAnim]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const radius = size / 2 - strokeWidth / 2;

  return (
    <Animated.View style={{ transform: [{ rotate: spin }] }}>
      <Svg width={size} height={size}>
        <Defs>
          <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#8D3B90" stopOpacity="0.9" />
            <Stop offset="0.5" stopColor="#8D3B90" stopOpacity="0.8" />
            <Stop offset="1" stopColor="#8D3B90" stopOpacity="0.7" />
          </LinearGradient>
        </Defs>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#grad)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
        />
      </Svg>
    </Animated.View>
  );
};

const LoadingOverlay = ({
  isLoading,
  message = "Saving...",
  headerHeight = 96,
}) => {
  if (!isLoading) return null;
  const window = Dimensions.get("window");

  return (
    <View
      style={[
        styles.overlay,
        { top: headerHeight, height: window.height - headerHeight },
      ]}
    >
      <View style={styles.banner}>
        <DoughnutSpinner size={50} strokeWidth={8} />
        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    left: 0,
    right: 0,
    backgroundColor: "rgba(255,255,255,0.8)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  banner: {
    width: 120,
    height: 120,
    backgroundColor: "#fff",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  message: {
    marginTop: 12,
    color: Color.sparklightBrightPurple,
    fontSize: 16,
    fontWeight: "400",
    fontFamily: FontFamily.openSansRegular,
    textAlign: "center",
  },
});

export default LoadingOverlay;