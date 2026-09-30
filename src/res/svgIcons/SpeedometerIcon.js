import * as React from "react";
import Svg, { Path } from "react-native-svg";
import { theme } from "../../styles/theme";

const SpeedometerIcon = ({ color = theme.colors.primary, ...props }) => (
  <Svg
    width={18}
    height={18}
    viewBox="0 0 18 18"
    fill="none"
    accessible={false}
    {...props}
  >
    <Path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m9 10.5 3-3m-9.495 6.75a7.5 7.5 0 1 1 12.99 0"
    />
  </Svg>
);
export default SpeedometerIcon;
