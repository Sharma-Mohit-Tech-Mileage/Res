import * as React from "react"
import{ Svg ,Path} from "react-native-svg";
const PilotTick = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={22}
    height={22}
    fill="none"
    {...props}
  >
    <Path
      stroke={props.isActive?"#fff":"#737373"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 10.08V11a10 10 0 1 1-5.93-9.14M8 10l3 3L21 3"
    />
  </Svg>
)
export default PilotTick