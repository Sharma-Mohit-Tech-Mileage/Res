import * as React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

const CircleAlertIcon = ({
  size = 18,
  color = '#4C5458',
  strokeWidth = 2,
  accessible = true,
  accessibilityLabel = "Alert icon",
  accessibilityRole = "Text",
  ...props
}) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Circle
      cx={12}
      cy={12}
      r={10}
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 8v4M12 16h.01"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default CircleAlertIcon;
