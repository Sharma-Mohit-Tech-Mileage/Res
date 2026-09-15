import React from "react";
import { Image, StyleSheet } from "react-native";

const wifiAnimation = require("../../../assets/Wifi-Speed-Animation.gif");
const wifiOnlyAnimation = require("../../../assets/Wifi-Speed-Only-Animation.gif");
const modemAnimation = require("../../../assets/Modem-Speed-Animation.gif");

const SpeedAnimation = ({ speedType = "wifi", hasEeroDevice = true }) => {
  const source =
    speedType === "wifi"
      ? hasEeroDevice
        ? wifiAnimation
        : wifiOnlyAnimation
      : modemAnimation;
  return (
    <Image
      source={source}
      resizeMode="contain"
      style={styles.animation}
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    />
  );
};

const styles = StyleSheet.create({
  animation: { width: "100%", height: 110 },
});

export default SpeedAnimation;
