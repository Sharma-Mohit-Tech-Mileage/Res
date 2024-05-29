import * as React from "react"
import {Svg, Path} from 'react-native-svg';
const ReloadIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={8}
    height={8}
    fill="none"
    {...props}
  >
    <Path
      stroke="#0060AE"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7.285 2.944s-.663-.954-1.202-1.523A2.892 2.892 0 0 0 3.977.5C2.333.5 1 1.907 1 3.643c0 1.736 1.333 3.143 2.977 3.143 1.357 0 2.503-.96 2.861-2.27m.447-1.572V.85m0 2.095H5.3"
    />
  </Svg>
)
export default ReloadIcon