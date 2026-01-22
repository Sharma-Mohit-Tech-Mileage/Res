import * as React from "react"
import { Svg, Path } from "react-native-svg";
const PolygonIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={13}
    fill="none"
    {...props}
  >
    <Path
      fill="#fff"
      d="M6.928 12c.77 1.333 2.695 1.333 3.464 0L17.32 0H0l6.928 12Z"
    />
  </Svg>
)
export default PolygonIcon
