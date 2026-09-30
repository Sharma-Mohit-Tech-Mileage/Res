import React from "react";
import {
  Device,
  Connection,
  SpeedAnimationCanvas,
  useSpeedAnimation,
} from "./SpeedAnimationShared";

export default function ModemSpeedAnimation({ style }) {
  const { progress, reducedMotion } = useSpeedAnimation();
  return (
    <SpeedAnimationCanvas width={281} style={style}>
      <Device x={45} type="phone" active={false} progress={progress} />
      <Connection x={79} progress={progress} reducedMotion={reducedMotion} />
      <Device x={140.5} type="eero" large active progress={progress} />
      <Connection x={189} progress={progress} reducedMotion={reducedMotion} />
      <Device x={236} type="modem" active={true} progress={progress} />
    </SpeedAnimationCanvas>
  );
}
