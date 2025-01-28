import * as React from 'react';
import { Svg, Path } from 'react-native-svg';

const RightArrow = ({ color = "#353091", ...props }) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    {...props}
  >
    <Path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m7.5 15 5-5-5-5"
    />
  </Svg>
);

export default RightArrow;
