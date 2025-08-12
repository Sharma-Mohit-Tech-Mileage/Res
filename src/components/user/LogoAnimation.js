import React, { useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from "react-native-reanimated";
import char1 from '../../../assets/images/char_1.png'
const letters = [
  require("../../../assets/images/char_1.png"),
  require("../../../assets/images/char_2.png"),
  require("../../../assets/images/char_3.png"),
  require("../../../assets/images/char_4.png"),
  require("../../../assets/images/char_5.png"),
  require("../../../assets/images/char_6.png"),
  require("../../../assets/images/char_7.png"),
  require("../../../assets/images/char_8.png"),
  require("../../../assets/images/char_9.png"),
  //require("../../../assets/images/char_1.png"),
  //require("../../../assets/images/char_1.png"),
];
export default function LogoAnimation() {
  // First char animation
  const firstScale = useSharedValue(0);

  // Rest char animations
  const drops = letters.slice(1).map(() => useSharedValue(-100));

  useEffect(() => {
    // First letter zoom in
    firstScale.value = withTiming(1, { duration: 800 });

    // Rest letters drop in
    drops.forEach((drop, i) => {
      setTimeout(() => {
        drop.value = withSpring(0, { damping: 10 });
      }, 800 + i * 100); // start after first letter finishes
    });
  }, []);

  const firstStyle = useAnimatedStyle(() => ({
    transform: [{ scale: firstScale.value }],
  }));

  return (
    <View style={styles.container}>
      {/* First letter zoom */}
      <Animated.View style={firstStyle}>
        <Image source={letters[0]} style={styles.letter} resizeMode="contain" />
      </Animated.View>

      {/* Rest letters drop */}
      {letters.slice(1).map((src, i) => {
        const dropStyle = useAnimatedStyle(() => ({
          transform: [{ translateY: drops[i].value }],
        }));
        return (
          <Animated.View key={i} style={dropStyle}>
            <Image source={src} style={styles.letter} resizeMode="contain" />
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4A90E2",
    flex: 1,
  },
  letter: {
    width: 40,
    height: 40,
    marginHorizontal: 1,
  },
});
