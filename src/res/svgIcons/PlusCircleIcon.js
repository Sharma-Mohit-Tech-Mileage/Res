import * as React from 'react';
import { Svg, Path, Circle } from 'react-native-svg';

const PlusCircleIcon = ({ color = "#8D3B90", size = 16, ...props }) => (
  <Svg width={size} height={size} viewBox="0 0 16 16" fill="none" {...props}>
    <Circle cx={8} cy={8} r={7.25} stroke={color} strokeWidth={1.5} />
    <Path
      stroke={color}
      strokeLinecap="round"
      strokeWidth={1.5}
      d="M8 4.8v6.4M4.8 8h6.4"
    />
  </Svg>
);

export default PlusCircleIcon;
