import * as React from "react"
import{ Svg ,Path} from "react-native-svg";
const Thumbsup = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={74}
    height={74}
    fill="none"
    {...props}
  >
    <Path
      stroke="url(#a)"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={4}
      d="M21.761 67.478V33.954M6.523 40.049v21.334a6.095 6.095 0 0 0 6.095 6.095h40.918a9.143 9.143 0 0 0 9.037-7.753l3.282-21.333c.852-5.539-3.433-10.533-9.037-10.533H46.142a3.048 3.048 0 0 1-3.048-3.048v-10.77a7.515 7.515 0 0 0-7.515-7.516c-.99 0-1.887.583-2.289 1.488L22.565 32.144a3.047 3.047 0 0 1-2.785 1.81h-7.162a6.095 6.095 0 0 0-6.095 6.095Z"
    />
    <defs>
      <linearGradient
        id="a"
        x1={36.243}
        x2={36.243}
        y1={6.525}
        y2={67.478}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#353091" stopOpacity={0.78} />
        <stop offset={1} stopColor="#8D3B90" stopOpacity={0.9} />
      </linearGradient>
    </defs>
  </Svg>
)
export default Thumbsup
