import * as React from "react"
import {Svg,Path} from 'react-native-svg';
const TicketListIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={22}
    height={18}
    fill="none"
    {...props}
  >
    <Path
      stroke={props.isGrey ?"#c8c8c8":"#8D3B90"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 5V4m0 5.5v-1M7 14v-1m-1.2 4h10.4c1.68 0 2.52 0 3.162-.327a3 3 0 0 0 1.311-1.311C21 14.72 21 13.88 21 12.2V5.8c0-1.68 0-2.52-.327-3.162a3 3 0 0 0-1.311-1.311C18.72 1 17.88 1 16.2 1H5.8c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C1 3.28 1 4.12 1 5.8v6.4c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311C3.28 17 4.12 17 5.8 17Z"
    />
  </Svg>
)
export default TicketListIcon