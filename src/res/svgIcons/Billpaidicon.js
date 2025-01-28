import * as React from "react"
import {Svg,Path} from 'react-native-svg';
const Billpaidicon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={25}
    height={24}
    fill="none"
    {...props}
  >
    <Path
      stroke="#8D3B90"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16.5 8V4.5c0-.831 0-1.247-.175-1.503a1 1 0 0 0-.657-.42c-.306-.052-.683.122-1.438.47L5.358 7.143c-.673.31-1.01.466-1.257.707a2 2 0 0 0-.487.76c-.115.326-.115.697-.115 1.438V15m13.5-.5h.01M3.5 11.2v6.6c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874C5.02 21 5.58 21 6.7 21h11.6c1.12 0 1.68 0 2.108-.218a2 2 0 0 0 .874-.874c.218-.428.218-.988.218-2.108v-6.6c0-1.12 0-1.68-.218-2.108a2 2 0 0 0-.874-.874C19.98 8 19.42 8 18.3 8H6.7c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874C3.5 9.52 3.5 10.08 3.5 11.2Zm14 3.3a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z"
    />
  </Svg>
)
export default Billpaidicon
