import * as React from "react"
import{ Svg ,Path} from "react-native-svg";
const Messagealertcircle = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={21}
    height={20}
     viewBox="0 0 21 20"
    fill="none"
    {...props}
  >
    <Path
      stroke="#8D3B90"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11.108 9.5V6m0 7h.01m-.01 5.5a8.5 8.5 0 1 0-8.057-5.783c.109.32.163.481.172.604a.899.899 0 0 1-.027.326c-.03.12-.098.245-.233.494l-1.636 3.027c-.233.432-.35.648-.323.815a.5.5 0 0 0 .233.35c.144.087.388.062.877.011l5.12-.529c.156-.016.233-.024.304-.021.07.002.118.009.186.024.07.016.156.05.33.116a8.478 8.478 0 0 0 3.054.566Z"
    />
  </Svg>
)
export default Messagealertcircle
