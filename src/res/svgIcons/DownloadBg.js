import * as React from "react"
import {Svg,Path} from 'react-native-svg';
const IconBg = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={42}
    height={43}
    fill="none"
    {...props}
  >
    <Path
      fill="#fff"
      d="M0 12.96c0-4.27 0-6.406.844-8.032A7.5 7.5 0 0 1 4.043 1.73C5.668.886 7.803.886 12.075.886h17.85c4.271 0 6.407 0 8.032.844a7.5 7.5 0 0 1 3.199 3.198C42 6.554 42 8.69 42 12.961v17.85c0 4.27 0 6.407-.844 8.032a7.5 7.5 0 0 1-3.199 3.198c-1.625.845-3.76.845-8.032.845h-17.85c-4.271 0-6.407 0-8.032-.845a7.5 7.5 0 0 1-3.199-3.198C0 37.217 0 35.082 0 30.811V12.96Z"
    />
  </Svg>
)
export default IconBg