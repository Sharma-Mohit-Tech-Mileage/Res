import * as React from "react"
import{ Svg ,Path} from "react-native-svg";
const Checkcircle = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="none"
    {...props}
  >
    <Path
      stroke="#2BA948"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m4.667 7.783 2 2 4-4m3.666 2A6.667 6.667 0 1 1 1 7.783a6.667 6.667 0 0 1 13.333 0Z"
    />
  </Svg>
)
export default Checkcircle