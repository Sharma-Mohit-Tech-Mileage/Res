import * as React from "react"
import {Svg, Circle, G, Path, Line, Rect} from 'react-native-svg';
const SupportIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={30}
    height={30}
    fill="none"
    {...props}
  >
    <Path
      stroke="#767676"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10.036 10.286 5.322 5.572m0 18.856 4.714-4.714m9.428 0 4.714 4.714m0-18.856-4.714 4.714M28.084 15c0 7.364-5.97 13.333-13.334 13.333S1.416 22.363 1.416 15c0-7.364 5.97-13.333 13.334-13.333S28.083 7.637 28.083 15Zm-6.668 0a6.667 6.667 0 1 1-13.333 0 6.667 6.667 0 0 1 13.333 0Z"
    />
  </Svg>
)
export default SupportIcon
