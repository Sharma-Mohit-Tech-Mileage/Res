import * as React from "react"
import {Svg, Circle, G, Path, Line, Stop,Defs,LinearGradient} from 'react-native-svg';
const OutageIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={85}
    height={113}
    fill="none"
    {...props}
  >
    <Path
      fill="url(#a)"
      d="M42.203 62.15c-10.904 0-19.775-8.871-19.775-19.775 0-10.904 8.87-19.775 19.775-19.775 10.904 0 19.775 8.87 19.775 19.775 0 10.904-8.871 19.775-19.775 19.775Zm0-33.9c-7.788 0-14.125 6.337-14.125 14.125 0 7.787 6.337 14.125 14.125 14.125 7.787 0 14.125-6.338 14.125-14.125 0-7.788-6.338-14.125-14.125-14.125Z"
    />
    <Path
      fill="url(#b)"
      d="M42.375 113a2.828 2.828 0 0 1-2.026-.856C38.7 110.445 0 70.261 0 42.375 0 19.009 19.009 0 42.375 0 65.742 0 84.75 19.009 84.75 42.375c0 27.886-38.7 68.07-40.349 69.769a2.816 2.816 0 0 1-2.026.856Zm0-107.35C22.125 5.65 5.65 22.125 5.65 42.375c0 22.179 28.75 54.992 36.725 63.669C50.35 97.364 79.1 64.536 79.1 42.375c0-20.25-16.475-36.725-36.725-36.725Z"
    />
    <Defs>
      <LinearGradient
        id="a"
        x1={35.261}
        x2={48.937}
        y1={32.575}
        y2={64.533}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#8D3B90" />
        <Stop offset={1} stopColor="#353091" />
      </LinearGradient>
      <LinearGradient
        id="b"
        x1={27.5}
        x2={74}
        y1={28.5}
        y2={110}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#8D3B90" />
        <Stop offset={1} stopColor="#353091" />
      </LinearGradient>
    </Defs>
  </Svg>
)
export default OutageIcon
