import * as React from "react"
import {Svg,Path} from 'react-native-svg';
const Buffer = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <Path
      stroke="#E1E1E1"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.875}
      d="M11.998 2v4m0 12v4m-6-10h-4m20 0h-4m1.078 7.078-2.828-2.828M19.076 5l-2.828 2.828M4.92 19.078l2.828-2.828M4.92 5l2.828 2.828"
    />
  </Svg>
)
export default Buffer
