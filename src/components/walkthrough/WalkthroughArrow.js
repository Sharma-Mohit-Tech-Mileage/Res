import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Easing } from "react-native";

const WalkthroughArrow = ({ leftPosition }) => {
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -10,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          left: leftPosition,
          transform: [{ translateY: bounceAnim }],
        },
      ]}
    >
      <View style={styles.triangle} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: -20,
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  triangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 16,
    borderRightWidth: 16,
    borderTopWidth: 20,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#8D3B90",
  },
});

export default WalkthroughArrow;
