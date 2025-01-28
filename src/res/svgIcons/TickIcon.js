import * as React from "react"
import {Svg, G, Path, ClipPath, Defs} from 'react-native-svg';
const TickIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="none"
    {...props}
    accessible={true}
    accessibilityRole="image"
    accessibilityLabel={'Selected'}
  >
    <G clipPath="url(#a)">
      <Path
        stroke={props?.color?props.color:"#8D3B90"}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="m5 8 2 2 4-4m3.667 2A6.667 6.667 0 1 1 1.334 8a6.667 6.667 0 0 1 13.333 0Z"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h16v16H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default TickIcon
