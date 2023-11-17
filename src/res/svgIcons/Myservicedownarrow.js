import * as React from "react"
import {Svg,Path} from 'react-native-svg';
const Myservicedownarrow = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={25}
    fill="none"
    {...props}
  >
    <Path
      stroke="#353091"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.875}
      d="m7.998 12.886 4 4m0 0 4-4m-4 4v-8m10 4c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10 10 4.477 10 10Z"
    />
  </Svg>
)
export default Myservicedownarrow