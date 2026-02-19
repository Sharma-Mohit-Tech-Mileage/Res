import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Animated, Easing, Dimensions, Platform } from "react-native";
import { useDispatch } from "react-redux";
import { updateWalkThroughStep } from "../../redux/actions/DashboardAction";
import WalkthroughContent from "./WalkthroughContent";
import WalkthroughArrow from "./WalkthroughArrow";
import {
  calculateArrowPosition,
  calculateBubbleBottomPosition,
  getResponsivePadding,
  calculateTabWidth,
} from "../utility/walkthroughHelpers";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const WalkthroughOverlay = ({
  visibleTabs,
  currentStep,
  onFinish,
  tabBarHeight,
}) => {
  const dispatch = useDispatch();
  const [localStep, setLocalStep] = useState(currentStep);

  // Animation values
  const overlayFade = useRef(new Animated.Value(0)).current;
  const bubbleFade = useRef(new Animated.Value(0)).current;
  const bubbleSlide = useRef(new Animated.Value(50)).current;
  // Right after calculating positions, add:
  useEffect(() => {
    console.log("=== WALKTHROUGH DEBUG ===");
    console.log("Step:", localStep);
    console.log("Tab Bar Height:", tabBarHeight);
    console.log("Screen Height:", SCREEN_HEIGHT);
    console.log("Top Overlay Height:", SCREEN_HEIGHT - tabBarHeight);
    console.log("Active Tab Left:", activeTabLeft);
    console.log("Active Tab Right:", activeTabRight);
    console.log("Has Left Shadow:", localStep > 0);
    console.log("Has Right Shadow:", localStep < visibleTabs.length - 1);
  }, [localStep, tabBarHeight]);
  // Entry animation
  useEffect(() => {
    Animated.parallel([
      Animated.timing(overlayFade, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.timing(bubbleFade, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.spring(bubbleSlide, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    setLocalStep(currentStep);
  }, [currentStep]);

  const handleNext = () => {
    const nextStep = localStep + 1;

    if (nextStep >= visibleTabs.length) {
      handleFinish();
      return;
    }

    setLocalStep(nextStep);
    dispatch(updateWalkThroughStep(nextStep));
  };

  const handlePrevious = () => {
    if (localStep === 0) return;
    const prevStep = localStep - 1;
    setLocalStep(prevStep);
    dispatch(updateWalkThroughStep(prevStep));
  };

  const handleSkip = () => {
    handleFinish();
  };

  const handleFinish = () => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(bubbleFade, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(bubbleSlide, {
          toValue: 50,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(overlayFade, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      dispatch(updateWalkThroughStep(null));
      if (onFinish) onFinish();
    });
  };

  // Validation
  if (!visibleTabs || visibleTabs.length === 0) {
    return null;
  }

  if (localStep < 0 || localStep >= visibleTabs.length) {
    return null;
  }

  const currentTab = visibleTabs[localStep];

  // Calculate positions using helper functions
  const arrowPosition = calculateArrowPosition(localStep, visibleTabs.length);
  const horizontalPadding = getResponsivePadding();
  const bubbleBottomPosition = calculateBubbleBottomPosition(tabBarHeight);

  // Calculate spotlight positions for active tab
  const tabWidth = calculateTabWidth(visibleTabs.length);
  const activeTabLeft = tabWidth * localStep;
  const activeTabRight = tabWidth * (localStep + 1);

  return (
    <>
      {/* TOP OVERLAY */}
      <Animated.View
        style={[
          styles.topOverlay,
          {
            height: SCREEN_HEIGHT - tabBarHeight,
            opacity: overlayFade.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.7],
            }),
          },
        ]}
        pointerEvents="box-only"
        onStartShouldSetResponder={() => true}
        importantForAccessibility="no-hide-descendants"
        accessibilityElementsHidden={true}
        accessible={false}
      />

      {/* LEFT SHADOW */}
      {localStep > 0 && (
        <Animated.View
          style={[
            styles.tabShadow,
            {
              bottom: 0,
              left: 0,
              width: activeTabLeft,
              height: tabBarHeight,
              opacity: overlayFade.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.85],
              }),
            },
          ]}
          pointerEvents="box-only"
          onStartShouldSetResponder={() => true}
          importantForAccessibility="no-hide-descendants"
          accessibilityElementsHidden={true}
          accessible={false}
        />
      )}

      {(localStep < visibleTabs.length - 1 || Platform.OS === "android") && (
        <Animated.View
          style={[
            styles.tabShadow,
            {
              bottom: 0,
              left: activeTabRight,
              width:
                localStep < visibleTabs.length - 1
                  ? SCREEN_WIDTH - activeTabRight
                  : 0.1, // Tiny width on last step for Android fix
              height: tabBarHeight,
              opacity: overlayFade.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.85],
              }),
            },
          ]}
          pointerEvents="box-only"
          onStartShouldSetResponder={() => true}
          importantForAccessibility="no-hide-descendants"
          accessibilityElementsHidden={true}
          accessible={false}
        />
      )}

      {/* ACTIVE TAB HIGHLIGHT */}
      <Animated.View
        style={[
          styles.activeTabHighlight,
          {
            bottom: 0,
            left: activeTabLeft,
            width: tabWidth,
            height: tabBarHeight,
            opacity: overlayFade.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.15],
            }),
          },
        ]}
        // Do not block the highlighted tab press.
        pointerEvents="none"
        importantForAccessibility="no-hide-descendants"
        accessibilityElementsHidden={true}
        accessible={false}
      />

      {/* Walkthrough bubble */}
      <Animated.View
        style={[
          styles.bubbleContainer,
          {
            bottom: bubbleBottomPosition,
            left: horizontalPadding,
            right: horizontalPadding,
            opacity: bubbleFade,
            transform: [{ translateY: bubbleSlide }],
          },
        ]}
        accessibilityViewIsModal={true}
        accessible={false}
        importantForAccessibility="yes"
      >
        <WalkthroughContent
          tab={currentTab}
          currentStep={localStep}
          totalSteps={visibleTabs.length}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onSkip={handleSkip}
        />

        <WalkthroughArrow leftPosition={arrowPosition} />
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  topOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#000",
    zIndex: 100,
    elevation: 100, // ADD THIS for Android
  },
  tabShadow: {
    position: "absolute",
    backgroundColor: "#000",
    zIndex: 100,
    elevation: 100, // ADD THIS for Android
  },
  activeTabHighlight: {
    position: "absolute",
    backgroundColor: "rgba(53, 48, 145, 0.3)",
    zIndex: 99,
    elevation: 99, // ADD THIS for Android
  },
  bubbleContainer: {
    position: "absolute",
    zIndex: 102,
    elevation: 102, // ADD THIS for Android
  },
});

export default WalkthroughOverlay;
