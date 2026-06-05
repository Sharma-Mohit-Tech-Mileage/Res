import * as React from "react"
import {Svg,Path} from "react-native-svg";
const searchmd = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    {...props}
  >
    <Path
      stroke="#767676"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m19 19-4.35-4.35M17 9A8 8 0 1 1 1 9a8 8 0 0 1 16 0Z"
    />
  </Svg>
)
export default searchmd
