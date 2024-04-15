import * as React from "react"
import {Svg,Path,G,Defs,Stop,LinearGradient} from 'react-native-svg';
const TVIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={42}
    height={42}
    fill="none"
    {...props}
  >
    <Path
      fill="url(#a)"
      d="M0 12.075c0-4.271 0-6.407.844-8.032A7.5 7.5 0 0 1 4.043.844C5.668 0 7.803 0 12.075 0h17.85c4.271 0 6.407 0 8.032.844a7.5 7.5 0 0 1 3.199 3.199C42 5.668 42 7.803 42 12.075v17.85c0 4.271 0 6.407-.844 8.032a7.5 7.5 0 0 1-3.199 3.199c-1.625.844-3.76.844-8.032.844h-17.85c-4.271 0-6.407 0-8.032-.844a7.5 7.5 0 0 1-3.199-3.199C0 36.332 0 34.197 0 29.925v-17.85Z"
    />
    <G fill="#fff">
      <Path d="M31.262 27.866H10.738A1.668 1.668 0 0 1 9 26.281V13.586a1.668 1.668 0 0 1 1.738-1.585h20.524A1.668 1.668 0 0 1 33 13.586v12.695a1.668 1.668 0 0 1-1.738 1.585ZM10.738 12.915a.772.772 0 0 0-.823.675v12.695c.05.41.412.705.823.676h20.524a.77.77 0 0 0 .823-.675v-12.7a.772.772 0 0 0-.823-.675H10.738v.004ZM25.3 30.002h-8.6a.457.457 0 0 1-.446-.467.458.458 0 0 1 .445-.443h8.602a.457.457 0 0 1 .445.468.458.458 0 0 1-.445.442Z" />
    </G>
    <Defs>
      <LinearGradient
        id="a"
        x1={-30.262}
        x2={73.224}
        y1={20.697}
        y2={20.697}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#353091" stopOpacity={0.78} />
        <Stop offset={1} stopColor="#8D3B90" stopOpacity={0.9} />
      </LinearGradient>
    </Defs>
  </Svg>
)
export default TVIcon
