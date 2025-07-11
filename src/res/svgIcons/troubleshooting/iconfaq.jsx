import React from 'react';
import { Svg, Path } from 'react-native-svg';
const IconFaq = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={25}
    fill="none"
    {...props}
  >
    <Path
      stroke="#393D40" // Changed color to F8F5EF
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 14.5c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5a6 6 0 1 0-12 0c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5m0 4h6m-5 4h4"
    />
  </Svg>
)
export default IconFaq
