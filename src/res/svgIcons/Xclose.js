import * as React from "react"
import {Svg,Path} from 'react-native-svg';
const Xclose = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={14}
    height={14}
    fill="none"
    {...props}
  >
    <Path
      stroke="#767676"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 1 1 13M1 1l12 12"
    />
  </Svg>
)
export default Xclose
