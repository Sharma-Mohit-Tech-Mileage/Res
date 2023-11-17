import * as React from "react"
import {Svg, Circle, G, Path, Line, Rect} from 'react-native-svg';
const UpArrow = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    {...props}
  >
    <Path
      stroke="#353091"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m5 12.5 5-5 5 5"
    />
  </Svg>
)
export default UpArrow
