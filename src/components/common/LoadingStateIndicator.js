import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontFamily } from "../../../GlobalStyles";
import colors from "../../res/Colors";
import LottieView from "lottie-react-native";

export const LoadingState = {
  CHECKING_SESSION: "CHECKING_SESSION",
  OPENING_BROWSER: "OPENING_BROWSER",
  AUTHENTICATING: "AUTHENTICATING",
  LOADING_DATA: "LOADING_DATA",
  NONE: "NONE",
};

const LOADING_MESSAGES = {
  [LoadingState.CHECKING_SESSION]: "Checking your session...",
  [LoadingState.OPENING_BROWSER]: "Opening secure login...",
  [LoadingState.AUTHENTICATING]: "Signing you in...",
  [LoadingState.LOADING_DATA]: "Loading your account...",
  [LoadingState.NONE]: "",
};

const LoadingStateIndicator = ({ state, isWhite = false }) => {
  if (state === LoadingState.NONE) {
    return null;
  }

  const animationSource = isWhite
    ? require("../../../assets/animations/loader-white.json")
    : require("../../../assets/animations/loader-colored.json");

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <LottieView
          source={animationSource}
          autoPlay
          loop
          style={styles.lottie}
        />
        <Text style={[styles.message, isWhite && styles.whiteText]}>
          {LOADING_MESSAGES[state]}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  content: {
    alignItems: "center",
    paddingHorizontal: 40,
  },
  lottie: {
    width: 120,
    height: 120,
  },
  message: {
    fontSize: 16,
    fontFamily: FontFamily.RadioCanadaRegular,
    color: colors.snow_white,
    marginTop: 10,
    textAlign: "center",
  },
  whiteText: {
    color: colors.snow_white,
  },
});

export default LoadingStateIndicator;
