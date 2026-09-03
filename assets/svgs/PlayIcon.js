import * as React from "react"
import Svg, { Path } from "react-native-svg"

const PlayIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={15}
    height={15}
    fill="none"
    {...props}
  >
    <Path
      stroke="#3730A3"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.33}
      d="M7.33 13.997a6.667 6.667 0 1 0 0-13.333 6.667 6.667 0 0 0 0 13.333Z"
    />
    <Path
      stroke="#3730A3"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.33}
      d="m5.997 4.664 4 2.667-4 2.666V4.664Z"
    />
  </Svg>
)

export default PlayIcon
    