import * as React from "react"
import {Svg,Path,Defs,LinearGradient} from 'react-native-svg';
const SvgComponent = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={121}
    height={121}
    fill="none"
    {...props}
  >
    <Path
      stroke="url(#a)"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={8}
      d="M88.75 73.056h.063M4 16.556v87.888C4 111.379 9.621 117 16.556 117h87.888c6.935 0 12.556-5.621 12.556-12.556V41.667c0-6.935-5.621-12.556-12.556-12.556H16.556C9.62 29.111 4 23.49 4 16.556Zm0 0C4 9.62 9.621 4 16.556 4h75.333m0 69.056a3.139 3.139 0 1 1-6.278 0 3.139 3.139 0 0 1 6.278 0Z"
    />
    <Defs>
      <LinearGradient
        id="a"
        x1={29}
        x2={117}
        y1={24.5}
        y2={125.5}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#8D3B90" />
        <stop offset={1} stopColor="#353091" />
      </LinearGradient>
    </Defs>
  </Svg>
)
export default SvgComponent