import * as React from "react"
import {Svg,Path,G,Defs,Stop,LinearGradient} from 'react-native-svg';
const TVIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={29}
    height={23}
    fill="none"
    {...props}
  >
    <Path
      fill="#fff"
      d="M26.899 19.46H2.1C.943 19.46 0 18.595 0 17.531V2.093C0 1.031.943.167 2.101.167H26.9C28.057.167 29 1.03 29 2.093v15.439c0 1.063-.943 1.927-2.101 1.927ZM2.1 1.272c-.54 0-.994.375-.994.82v15.439c0 .445.455.82.994.82H26.9c.54 0 .994-.375.994-.82V2.093c0-.445-.455-.82-.994-.82H2.1ZM19.696 22.058H9.304a.553.553 0 1 1 0-1.107h10.392a.553.553 0 1 1 0 1.107Z"
    />
   
    <Defs>
      <LinearGradient
        id="a"
        x1={-30.262}
        x2={73.224}
        y1={20.697}
        y2={20.697}
        gradientUnits="userSpaceOnUse"
      >
        <Stop offset="0" stopColor="#8D3B90" stopOpacity="0.78" />
        <Stop offset="1" stopColor="#8D3B90" stopOpacity="0.9" />
      </LinearGradient>
    </Defs>
  </Svg>
)
export default TVIcon
