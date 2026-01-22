import * as React from "react"
import { Svg, Path } from 'react-native-svg';
const EmailIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={22}
    height={18}
    fill="none"
    {...props}
  >
    <Path
      stroke="#767676"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m1 4 8.165 5.715c.661.463.992.695 1.351.784a2 2 0 0 0 .968 0c.36-.09.69-.32 1.351-.784L21 4M5.8 17h10.4c1.68 0 2.52 0 3.162-.327a3 3 0 0 0 1.311-1.311C21 14.72 21 13.88 21 12.2V5.8c0-1.68 0-2.52-.327-3.162a3 3 0 0 0-1.311-1.311C18.72 1 17.88 1 16.2 1H5.8c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C1 3.28 1 4.12 1 5.8v6.4c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311C3.28 17 4.12 17 5.8 17Z"
    />
  </Svg>
)
export default EmailIcon
