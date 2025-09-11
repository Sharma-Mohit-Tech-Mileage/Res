import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const DangerIcon = ({ 
  size = 18, 
  color = '#EF4E3E',
  strokeWidth = 2,
  ...props 
}) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M9.39404 6V9M9.39404 12H9.40154M16.894 9C16.894 13.1421 13.5362 16.5 9.39404 16.5C5.25191 16.5 1.89404 13.1421 1.89404 9C1.89404 4.85786 5.25191 1.5 9.39404 1.5C13.5362 1.5 16.894 4.85786 16.894 9Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default DangerIcon;