import * as React from "react"
import {Svg, Defs, G, Path, ClipPath} from 'react-native-svg';
const WifiIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={25}
    height={24}
    fill="none"
    {...props}
  >
    <G clipPath="url(#a)">
      <Path
        stroke="#8D3B90"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12.498 19.5h.01M23.305 8.7a15.942 15.942 0 0 0-10.807-4.2c-4.166 0-7.96 1.592-10.807 4.2m3.539 3.543A10.958 10.958 0 0 1 12.498 9.5c2.786 0 5.33 1.036 7.268 2.743m-3.57 3.532a5.975 5.975 0 0 0-3.698-1.275c-1.416 0-2.718.49-3.745 1.312"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M.5 0h24v24H.5z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default WifiIcon
