import * as React from "react"
import {Svg,Path} from 'react-native-svg';
const DownArrow = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={12}
    height={8}
    fill="none"
    {...props}
  >
    <Path
      stroke="#353091"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m1 1.5 5 5 5-5"
    />
  </Svg>
)
export default DownArrow
