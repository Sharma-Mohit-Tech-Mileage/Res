import * as React from "react"
import {Svg,Path} from 'react-native-svg';
const SupportIcon = (props) => (
  <Svg
  xmlns="http://www.w3.org/2000/svg"
  width={40}
  height={29}
  fill="none"
  {...props}
>
  <Path
     fill={props?.isNewBillerUser ? '#c8c8c8' :"#767676"}
    d="M19.958 28a3.54 3.54 0 1 0 0-7.081 3.54 3.54 0 0 0 0 7.081ZM19.958 5.046c6.687 0 12.574 3.38 16.064 8.518l2.893-2.893C34.657 4.814 27.747 1 19.958 1 12.168 1 5.269 4.814 1 10.671l2.893 2.893c3.49-5.139 9.388-8.518 16.065-8.518Z"
        />
  <Path
      fill={props?.isNewBillerUser ? '#c8c8c8' :"#767676"}
      d="M19.957 14.9a9.56 9.56 0 0 1 8.832 5.897l3.014-3.014c-2.336-4.128-6.767-6.93-11.846-6.93-5.078 0-9.509 2.802-11.846 6.93l3.015 3.014a9.56 9.56 0 0 1 8.831-5.898Z"
        />
</Svg>
)
export default SupportIcon
