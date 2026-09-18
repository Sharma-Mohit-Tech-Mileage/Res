import React from "react";
import Svg, { Path } from "react-native-svg";
export default function HistoryServiceIcon({ width = 20, height = 20 }) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 18 18"
      fill="none"
      accessible={false}
    >
      <Path
        d="M2.25 2.25V15.75H15.75M9.75 12.75V6.75M13.5 12.75V3.75M6 12.75V10.5"
        stroke="#8D3B90"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
