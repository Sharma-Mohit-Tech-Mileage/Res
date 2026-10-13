import React from "react";
import ModemSpeedAnimation from "../../res/svgIcons/ModemSpeedAnimation";
import WifiSpeedAnimation from "../../res/svgIcons/WifiSpeedAnimation";
import WifiOnlySpeedAnimation from "../../res/svgIcons/WifiOnlySpeedAnimation";

const SpeedAnimation = ({ speedType = "wifi", hasEeroDevice = true, style }) => {
  const Animation = speedType !== "wifi"
    ? ModemSpeedAnimation
    : hasEeroDevice ? WifiSpeedAnimation : WifiOnlySpeedAnimation;
  return <Animation style={style} />;
};

export default SpeedAnimation;
