import * as React from "react"
import{ Svg ,Path} from "react-native-svg";
const Chevronleft = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={8}
    height={14}
    fill="none"
    {...props}
  >
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeWidth={1.5}
      d="M7 13 1.315 7.707a.952.952 0 0 1 0-1.414L7 1"
    />
  </Svg>
)
export default Chevronleft
