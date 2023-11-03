import * as React from "react"
import {Svg, Circle, G, Path, Line, Defs, ClipPath} from 'react-native-svg';
const TimerInfo = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={17}
    fill="none"
    {...props}
  >
    <G clipPath="url(#a)">
      <Path
        stroke="#767676"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M8 4.886v4l2.667 1.333m4-1.333a6.667 6.667 0 1 1-13.333 0 6.667 6.667 0 0 1 13.333 0Z"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 .886h16v16H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default TimerInfo
