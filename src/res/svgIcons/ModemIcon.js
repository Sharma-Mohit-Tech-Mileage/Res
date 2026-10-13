import * as React from "react"
import Svg, { Path } from "react-native-svg"
const ModemIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={17}
    height={17}
    fill="none"
    {...props}
  >
    <Path
      stroke="#8D3B90"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4.008 13H4m3.008 0H7m3.75-6v3m2.13-5.122a3 3 0 0 0-4.245 0m6.36-2.122a6 6 0 0 0-8.482 0M2.5 10.001h12a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-12A1.5 1.5 0 0 1 1 14.5v-3A1.5 1.5 0 0 1 2.5 10Z"
    />
  </Svg>
)
export default ModemIcon
