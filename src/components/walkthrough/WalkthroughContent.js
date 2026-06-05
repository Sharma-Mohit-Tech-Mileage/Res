import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  AccessibilityInfo,
  findNodeHandle,
} from "react-native";
import Touchable from "../common/customui/Touchable";
import LinearGradient from "react-native-linear-gradient";
import Icon from "../common/Icon";
import WalkthroughProgress from "./WalkthroughProgress";
import { FontFamily, Color, Border, Padding } from "../../../GlobalStyles";

const WalkthroughContent = ({
  tab,
  currentStep,
  totalSteps,
  onNext,
  onSkip,
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const titleRef = useRef(null);
  useEffect(() => {
    // Pulse animation for icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (titleRef.current) {
        const node = findNodeHandle(titleRef.current);
        if (node) {
          AccessibilityInfo.setAccessibilityFocus(node);
        }
      }
    }, 350);
    return () => clearTimeout(timeout);
  }, [currentStep]);

  const { walkthrough } = tab;
  const isLastStep = currentStep === totalSteps - 1;

  const walkthroughA11yLabel = (() => {
    switch (tab?.id) {
      case "home":
        return "Home Dashboard Tab";
      case "billing":
        return "Billing & Payments Tab";
      case "services":
        return "Service Tab";
      case "support":
        return "Support Center Tab";
      case "account":
        return "Account Settings Tab";
      default:
        return `${tab?.name || ""} Tab`.trim();
    }
  })();

  return (
    <View style={styles.bubble} accessible={false}>
      {/* Header */}
      <View style={styles.header} accessible={false}>
        <View style={styles.stepInfo} accessible={false}>
          <Animated.View
            style={[styles.iconCircle, { transform: [{ scale: pulseAnim }] }]}
            accessible={true}
            accessibilityLabel={walkthroughA11yLabel}
            accessibilityRole="text"
            ref={titleRef}
          >
            <LinearGradient
              colors={["#edf1f4", "#edf1f4"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.iconGradient}
            >
              <Icon name={walkthrough.iconName} size={25} color="#FFFFFF" />
            </LinearGradient>
          </Animated.View>
          <Text
            style={styles.stepText}
            accessible={true}
            accessibilityRole="text"
            accessibilityLabel={`Step ${currentStep + 1} of ${totalSteps}`}
          >
            {" "}
            Step {currentStep + 1} of {totalSteps}{" "}
          </Text>
        </View>

        <Touchable
          onPress={onSkip}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          accessibilityRole="button"
          accessibilityLabel="Skip walkthrough"
        >
          <Text style={styles.skipText}>Skip</Text>
        </Touchable>
      </View>

      {/* Content */}
      <View style={styles.content} accessible={false}>
        <Text
          style={styles.title}
          accessible={true}
          accessibilityRole="header" accessibilityLevel={2} accessibilityHint="Header"
        >
          {walkthrough.title}
        </Text>
        <Text
          style={styles.description}
          accessible={true}
          accessibilityLabel={walkthrough.description}
        >
          {walkthrough.description}
        </Text>
      </View>

      {/* Footer */}
      <View style={styles.footer} accessible={false}>
        <WalkthroughProgress
          totalSteps={totalSteps}
          currentStep={currentStep}
        />

        <View style={styles.actions} accessible={false}>
          <LinearGradient
            colors={["#353091", "#353091"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.buttonNext}
          >
            <Touchable
              minSize={0}
              style={styles.buttonNextInner}
              onPress={onNext}
              accessibilityRole="button"
              accessibilityLabel={
                isLastStep ? "Finish walkthrough" : "Next step"
              }
            >
              <Text style={styles.buttonNextText}>
                {isLastStep ? "Let's Go!" : "Next"}
              </Text>
            </Touchable>
          </LinearGradient>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bubble: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: Padding.p_5xl,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Padding.p_base,
  },
  stepInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: Border.br_xs,
    marginRight: Padding.p_xs,
    overflow: "hidden",
  },
  iconGradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  stepText: {
    fontFamily: FontFamily.openSansRegular,
    color: Color.sparklightGray1,
    fontWeight: "400",
    fontSize: 14,
  },
  skipText: {
    fontFamily: FontFamily.openSansSemiBold,
    color: "#353091",
    fontWeight: "600",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  content: {
    marginBottom: Padding.p_xl,
  },
  title: {
    fontFamily: FontFamily.openSansSemiBold,
    color: "#1F2937",
    fontWeight: "700",
    fontSize: 18,
    marginBottom: Padding.p_5xs,
    lineHeight: 22,
  },
  description: {
    fontFamily: FontFamily.openSansRegular,
    color: Color.sparklightGray1,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "400",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  actions: {
    flexDirection: "row",
    gap: Padding.p_xs,
  },
  buttonNext: {
    borderRadius: 2,
    shadowColor: "#353091",
  },
  buttonNextInner: {
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  buttonNextText: {
    fontFamily: FontFamily.openSansSemiBold,
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
    textAlign: "center",
  },
});

export default WalkthroughContent;
