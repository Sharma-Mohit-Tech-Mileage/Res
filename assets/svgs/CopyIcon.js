import * as React from "react";
import { Svg, Rect, Path } from "react-native-svg";

const CopyIcon = ({ width = 20, height = 20, stroke = "#8D3B90", ...props }) => (
  <Svg width={width} height={height} viewBox="0 0 20 20" fill="none" {...props}>
    <Rect
      x={7}
      y={7}
      width={10}
      height={10}
      rx={2}
      stroke={stroke}
      strokeWidth={1.5}
    />
    <Path
      d="M13 5.5V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h.5"
      stroke={stroke}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default CopyIcon;
