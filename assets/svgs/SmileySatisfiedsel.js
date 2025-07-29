
import * as React from "react"
import{ Svg ,Path} from "react-native-svg";
const SmileySatisfiedsel = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={33}
    height={32}
    fill="none"
    {...props}
  >
    <Path
      stroke= { props?.color ? props.color : "#001321"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11.066 18.667s2 2.667 5.334 2.667c3.333 0 5.333-2.667 5.333-2.667M20.4 12h.013M12.4 12h.013m17.32 4c0 7.364-5.97 13.334-13.333 13.334-7.364 0-13.334-5.97-13.334-13.334 0-7.363 5.97-13.333 13.334-13.333S29.733 8.637 29.733 16Zm-8.667-4a.667.667 0 1 1-1.333 0 .667.667 0 0 1 1.333 0Zm-8 0a.667.667 0 1 1-1.333 0 .667.667 0 0 1 1.333 0Z"
    />
  </Svg>
)
export default SmileySatisfiedsel
