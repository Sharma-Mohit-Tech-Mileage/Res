import * as React from "react"
import {Svg, Circle, G, Path, Line, Rect} from 'react-native-svg';
const VideoIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    {...props}
  >
    <Path
      fill="#8D3B90"
      fillRule="evenodd"
      d="M2 19.48c0-.286.239-.519.533-.519h14.934c.294 0 .533.233.533.52 0 .286-.239.519-.533.519H2.533A.527.527 0 0 1 2 19.48Z"
      clipRule="evenodd"
    />
    <Rect
      width={18}
      height={14.623}
      x={1}
      y={1}
      fill="#fff"
      stroke="#8D3B90"
      strokeWidth={2}
      rx={1}
    />
    <Path fill="#8D3B90" d="m14 8.312-7 3.117V5.195l7 3.117Z" />
  </Svg>
)
export default VideoIcon
