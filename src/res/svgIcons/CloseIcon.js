import * as React from "react"
import {Svg,Path} from 'react-native-svg';
const CloseIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={36}
    height={36}
    fill="none"
    {...props}
  >
    <Path
      stroke="#767676"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m13.5 4.5-9 9m0-9 9 9"
    />
  </Svg>
)
export default CloseIcon
