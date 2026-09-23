import React from "react";
import {
  Device,
  Connection,
  SpeedAnimationCanvas,
  useSpeedAnimation,
} from "./SpeedAnimationShared";

export default function WifiOnlySpeedAnimation({ style }) {
  const { progress, reducedMotion } = useSpeedAnimation();
  return (
    <SpeedAnimationCanvas width={201} style={style}>
      <Device x={45} type="phone" active={true} progress={progress} />
      <Connection x={79} progress={progress} reducedMotion={reducedMotion} />
      <Device x={140.5} type="modem" large active progress={progress} />
    </SpeedAnimationCanvas>
  );
}
