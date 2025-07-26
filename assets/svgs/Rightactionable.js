import * as React from "react"
import{ Svg ,Path} from "react-native-svg";
const Rightactionable = (props) => (
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
      strokeWidth={1.875}
      d="m7.5 15 5-5-5-5"
    />
  </Svg>
)
export default Rightactionable
