import * as React from "react"
import {Svg,Path} from 'react-native-svg';
const InfoIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={18}
    fill="none"
    {...props}
  >
    <Path
      stroke="#353091"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M8 10.667V8m0-2.667h.007M14.667 8A6.667 6.667 0 1 1 1.334 8a6.667 6.667 0 0 1 13.333 0Z"
    />
  </Svg>
)
export default InfoIcon
