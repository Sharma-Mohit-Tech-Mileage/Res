import * as React from "react"
import { Svg ,Path} from "react-native-svg";
const EyeIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="none"
    {...props}
  >
    <Path
      stroke="#8D3B90"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M1.613 8.475c-.09-.143-.136-.215-.161-.326a.782.782 0 0 1 0-.298c.025-.11.07-.183.161-.327.75-1.188 2.984-4.19 6.387-4.19 3.404 0 5.637 3.002 6.387 4.19.09.144.136.216.162.327.019.083.019.215 0 .298-.026.11-.071.183-.162.326-.75 1.188-2.983 4.192-6.387 4.192-3.403 0-5.636-3.004-6.387-4.192Z"
    />
    <Path
      stroke="#8D3B90"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
    />
  </Svg>
)
export default EyeIcon
