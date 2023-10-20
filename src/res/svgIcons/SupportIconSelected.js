import * as React from "react"
import {Svg, Circle, G, Path, Line, Rect} from 'react-native-svg';
const SupportIconSelected = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={33}
    height={32}
    fill="none"
    {...props}
  >
    <Path
      fill="#353091"
      d="M16.75 29.333c7.364 0 13.334-5.97 13.334-13.333 0-7.364-5.97-13.333-13.334-13.333C9.387 2.667 3.417 8.637 3.417 16c0 7.364 5.97 13.333 13.333 13.333Z"
    />
    <Path
      fill="#353091"
      d="M16.75 22.667a6.667 6.667 0 1 0 0-13.334 6.667 6.667 0 0 0 0 13.334Z"
    />
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12.036 11.286 7.322 6.572m0 18.856 4.714-4.714m9.428 0 4.714 4.714m0-18.856-4.714 4.714M30.084 16c0 7.364-5.97 13.333-13.334 13.333-7.363 0-13.333-5.97-13.333-13.333 0-7.364 5.97-13.333 13.333-13.333 7.364 0 13.334 5.97 13.334 13.333Zm-6.667 0a6.667 6.667 0 1 1-13.333 0 6.667 6.667 0 0 1 13.333 0Z"
    />
  </Svg>
)
export default SupportIconSelected
