import React from "react";
import { StyleSheet, Text, Pressable, View, ScrollView } from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  BounceIn,
  withSpring,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
} from "react-native-reanimated";
import ProfileSettingsHeader from "../common/ProfileSettingsHeader";
import { useNavigation } from "@react-navigation/native";
import { Padding, Border, FontSize, Color, FontFamily } from "../../../GlobalStyles";
import ThumbsupIcon from "../../../assets/svgs/Thumbsup";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const ThumbsUp = () => {
  const navigation = useNavigation();
  const scale = useSharedValue(1);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const handlePress = () => {
    scale.value = withSequence(
      withSpring(1.05, { damping: 15, stiffness: 300 }),
      withSpring(1, { damping: 15, stiffness: 300 })
    );
    setTimeout(() => navigation.navigate("Account"), 150);
  };

  return (
    <View style={styles.feedback}>
      <ProfileSettingsHeader
        title="Feedback"
        onPressBack={() => navigation.navigate("Account")}
        accessibilityRole="text"
        accessibilityLabel="Feedback header"
      />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.content}>
          <Animated.View
            entering={FadeInUp.delay(100).springify()}
            style={styles.frameParent}
          >
            <Animated.View
              entering={BounceIn.delay(300).springify()}
              style={styles.containerImage}
            >
              <ThumbsupIcon />
            </Animated.View>

            <Animated.View
              entering={FadeInDown.delay(500).springify()}
              style={styles.textContainer}
            >
              <Text
                style={styles.thankYouFor}
                accessibilityRole="header" accessibilityLevel={2}
              >
                Thank you for your feedback!
              </Text>
              <Text
                style={styles.yourFeedbackMeans}
                accessibilityLabel="Your feedback means a lot to us. We will use it to improve our services for you and the communities we serve."
              >
                Your feedback means a lot to us! We will use it to continue
                improving our services for both you and the communities we serve.
              </Text>
            </Animated.View>
          </Animated.View>

          <AnimatedPressable
            entering={FadeInDown.delay(700).springify()}
            style={[styles.button, animatedButtonStyle]}
            onPress={handlePress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            accessibilityRole="button"
            accessibilityLabel="Done button. Return to Account screen"
          >
            <Text style={styles.buttonText}>Done</Text>
          </AnimatedPressable>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  feedback: {
    flex: 1,
    backgroundColor: Color.sparklightWhite,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: Color.sparklightWhite,
    marginBottom: "20%",
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  frameParent: {
    backgroundColor: Color.sparklightWhite,
    borderStyle: "solid",
    borderColor: "#e1e1e1",
    borderRadius: Border.br_11xs,
    alignSelf: "stretch",
    overflow: "hidden",
    alignItems: "center",
    padding: Padding.p_5xl,
    paddingTop: Padding.p_5xl + Padding.p_base,
  },
  containerImage: {
    width: 128,
    height: 128,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    shadowColor: "#101828",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 10,
  },
  textContainer: {
    marginTop: Padding.p_base,
    alignItems: "center",
    justifyContent: "center",
  },
  thankYouFor: {
    fontSize: 22,
    color: Color.colorGray_100,
    fontFamily: FontFamily.openSansRegular,
    lineHeight: 28,
    textAlign: "center",
    fontWeight: "600",
  },
  yourFeedbackMeans: {
    marginTop: 24,
    color: Color.sparklightDarkGray,
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.openSansRegular,
    lineHeight: 28,
    textAlign: "center",
    paddingHorizontal: Padding.p_sm,
  },
  button: {
    backgroundColor: Color.colorMidnightblue,
    height: 56,
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Border.br_11xs,
    alignSelf: "center",
    marginBottom: Padding.p_base,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "white",
    fontSize: FontSize.size_base,
    fontWeight: "600",
    fontFamily: FontFamily.openSansRegular,
  },
});

export default ThumbsUp;