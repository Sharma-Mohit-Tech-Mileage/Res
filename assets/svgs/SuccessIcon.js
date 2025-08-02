import * as React from "react"
import { Svg,Path } from "react-native-svg";
const SuccessIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={18}
    fill="none"
    {...props}
  >
    <Path
      stroke="#2BA948"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m6.019 9 2.25 2.25 4.5-4.5M16.894 9a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z"
    />
  </Svg>
)
export default SuccessIcon
