import * as React from "react"
import {Svg, Path} from 'react-native-svg';
const RefreshIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    {...props}
  >
    <Path
      stroke="#8D3B90"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17.5 8.333S15.83 6.057 14.472 4.7a7.5 7.5 0 1 0 1.902 7.385m1.126-3.75v-5m0 5h-5"
    />
  </Svg>
)
export default RefreshIcon
