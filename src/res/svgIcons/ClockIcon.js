import * as React from "react";
import Svg, { Path } from "react-native-svg";
import { theme } from "../../styles/theme";

const ClockIcon = ({ color = theme.colors.primary, ...props }) => (
  <Svg
    width={17}
    height={17}
    viewBox="0 0 17 17"
    fill="none"
    accessible={false}
    {...props}
  >
    <Path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8.5 4v4.5l3 1.5M16 8.5a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z"
    />
  </Svg>
);
export default ClockIcon;
