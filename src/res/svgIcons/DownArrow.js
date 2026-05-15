import * as React from "react"
import{ Svg ,Path} from "react-native-svg";

const DownArrow = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={13}
    height={8}
    fill="none"
    {...props}
  >
    <Path
      stroke="#353091"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m1.922 1.422 5.079 5.23 4.92-5.38"
    />
  </Svg>
)
export default DownArrow

