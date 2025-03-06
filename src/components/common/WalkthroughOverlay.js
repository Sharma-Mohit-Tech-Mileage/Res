import React, { useState } from "react";
import { View, Text, StyleSheet, Image, Pressable, Dimensions } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { updateWalkThroughStep } from "../../redux/actions/DashboardAction";
import { FontSize, FontFamily, Color, Border } from "../../../GlobalStyles";

const tabWidth = Number(Dimensions.get("window").width / 4);

const WalkthroughOverlay = ({ onFinish }) => {
  const dispatch = useDispatch();
  const [walkThroughStep, setWalkThroughStep] = useState(0);
  const [showWalkThrough, setShowWalkThrough] = useState(true);
  const user = useSelector(state => state.combinedReducers.user.userData);

  const walkThroughScreens =  [
    {
      title: "Home",
      description: user?.isNormalUser
        ? "View information related to your internet health, billing, service and more."
        : "Get a quick overview of your account.",
      buttonText: "Next",
    },
    {
      title: "Billing",
      description: "Make payments, set up Auto Pay and view statements.",
      buttonText: "Next",
    },
    {
      title: "Service",
      description: "Manage your internet plans, explore upgrades and view available services.",
      buttonText: "Next",
    },
    {
      title: "Support",
      description: user?.isNormalUser
        ? "View our FAQ, check in on your modem or troubleshoot your issues."
        : "View FAQs and contact our Support Team for assistance.",
      buttonText: "Next",
    },
    {
      title: "Account",
      description: user?.isNormalUser
        ? "Manage your profile settings, notifications, users and more."
        : "Manage your profile settings, notifications, and more.",
      buttonText: "Let's Go!",
    },
  ];
  const changeWalkThroughStep = (requestedStep) => {
    // Assume walkThroughStep holds the current step (0–4)
    let newStep = requestedStep;
    
    // For non-normal users, skip step 2.
    if (user && !user.isNormalUser) {
      // Determine direction by comparing current step and the requested step.
      // If moving forward (current < requested) and requested is 2, jump to 3.
      if (walkThroughStep < requestedStep && requestedStep === 2) {
        newStep = 3;
      }
      // If moving backward (current > requested) and requested is 2, go back to 1.
      else if (walkThroughStep > requestedStep && requestedStep === 2) {
        newStep = 1;
      }
    }
  
    if (newStep > 4) { // We have 5 steps (0–4)
      dispatch(updateWalkThroughStep(null));
      setShowWalkThrough(false);
      if (onFinish) {
        onFinish(); // Notify parent that walkthrough is finished.
      }
    } else {
      dispatch(updateWalkThroughStep(newStep));
      setWalkThroughStep(newStep);
    }
  };

  const bottomCarotStyles = [styles.bottomCarot];
  if (walkThroughStep === 1) {
    bottomCarotStyles.push(styles.bottomCarotStep2);
  } else if (walkThroughStep === 2) {
    bottomCarotStyles.push(styles.bottomCarotStep3);
  } else if (walkThroughStep === 3) {
    bottomCarotStyles.push(styles.bottomCarotStep4);
  } else if (walkThroughStep === 4) {
    bottomCarotStyles.push(styles.bottomCarotStep5);
  }

  const currentScreen = walkThroughScreens[walkThroughStep];

  if (!showWalkThrough) {
    return null;
  }

  return (
    // Mark the overlay container as modal so that screen readers ignore the background.
    <View 
      style={styles.walkThroughBubble} 
      accessibilityViewIsModal={true} 
    >
      <View>
        <View
          accessible={true}
          accessibilityLabel={currentScreen?.title}
          style={styles.title}
        >
          <Text style={styles.titleText}>{currentScreen?.title}</Text>
        </View>
        <View
          accessible={true}
          accessibilityLabel={currentScreen.description}
          style={styles.description}
        >
          <Text style={styles.descriptionText}>
            {currentScreen.description}
          </Text>
        </View>
      </View>
      <View style={styles.walkThroughBottomArea}>
        <View style={styles.circlePaging}>
          <View style={styles.circle}></View>
          <View
            style={
              walkThroughStep < 1
                ? [styles.circle, styles.circleUnselected]
                : styles.circle
            }
          ></View>
          <View
            style={
              walkThroughStep < 2
                ? [styles.circle, styles.circleUnselected]
                : styles.circle
            }
          ></View>
          <View
            style={
              walkThroughStep < 3
                ? [styles.circle, styles.circleUnselected]
                : styles.circle
            }
          ></View>
          <View
            style={
              walkThroughStep < 4
                ? [styles.circle, styles.circleUnselected]
                : styles.circle
            }
          ></View>
        </View>
        <View style={styles.walkThroughButtons}>
          <View style={styles.walkThroughSubButtons}>
            {walkThroughStep > 0 && (
              <Pressable
                style={[styles.button, styles.buttonsLayout, styles.buttonPrevious]}
                onPress={() => changeWalkThroughStep(walkThroughStep - 1)}
                accessibilityLabel="Previous Step"
                accessibilityRole="button"
              >
                <Text style={styles.decline}>Previous</Text>
              </Pressable>
            )}
            <Pressable
              style={[styles.button, styles.buttonsLayout, styles.buttonNext]}
              onPress={() => changeWalkThroughStep(walkThroughStep + 1)}
              accessibilityLabel={
                walkThroughStep < walkThroughScreens.length - 1
                  ? "Next Step"
                  : "Finish Walkthrough"
              }
              accessibilityRole="button"
            >
              <Text style={styles.accept}>{currentScreen.buttonText}</Text>
            </Pressable>
          </View>
        </View>
      </View>
      <View>
        <Image
          style={bottomCarotStyles}
          tintColor={"#FFF"}
          source={require("../../../assets/polygon.png")}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  accept: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.openSansRegular,
    textAlign: "center",
    color: Color.sparklightWhite,
  },
  bottomCarot: {
    width: 18,
    height: 13,
    position: "absolute",
    top: 20,
  },
  bottomCarotStep2: {
    left: (tabWidth - 30) * 1,
  },
  bottomCarotStep3: {
    left: (tabWidth - 25) * 2,
  },
  bottomCarotStep4: {
    left: (tabWidth - 25) * 3,
  },
  bottomCarotStep5: {
    left: (tabWidth - 22) * 4,
  },
  circle: {
    width: 8,
    height: 8,
    backgroundColor: Color.colorMidnightblue,
    borderRadius: 8,
    marginLeft: 10,
  },
  circleUnselected: {
    backgroundColor: "#D9D9D9",
  },
  circlePaging: {
    width: 100,
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 16,
  },
  walkThroughBottomArea: {
    flexDirection: "row",
    flex: 1,
  },
  walkThroughButtons: {
    justifyContent: "space-between",
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  walkThroughSubButtons: {
    width: 195,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  title: {
    marginBottom: 5,
  },
  titleText: {
    color: Color.sparklightGray1,
    fontSize: FontSize.size_lg,
    fontFamily: FontFamily.openSansSemiBold,
  },
  description: {},
  descriptionText: {
    color: Color.sparklightGray1,
    fontSize: FontSize.size_sm,
    fontFamily: FontFamily.openSansRegular,
    lineHeight: 24,
  },
  decline: {
    fontSize: FontSize.size_sm,
    fontFamily: FontFamily.openSansRegular,
    color: Color.colorMidnightblue,
    textAlign: "center",
  },
  button: {
    backgroundColor: Color.colorMidnightblue,
  },
  buttonNext: {
    justifyContent: "flex-end",
    marginLeft: 10,
  },
  buttonPrevious: {
    backgroundColor: Color.colorWhitesmoke_200,
  },
  buttonsLayout: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Border.br_11xs,
    minHeight: 32,
    textAlign: "center",
  },
  walkThroughBubble: {
    backgroundColor: "white",
    position: "absolute",
    bottom: 90,
    height: 180,
    width: Dimensions.get("window").width - 40,
    left: 20,
    zIndex: 10,
    borderRadius: 10,
    justifyContent: "space-between",
    padding: 20,
  },
});

export default WalkthroughOverlay;