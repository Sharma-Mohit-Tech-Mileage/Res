import * as React from "react"
import {Svg,Path} from 'react-native-svg';
const Modemicon = (props) => (
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
      d="M6.705 10.558a6.002 6.002 0 0 1 1.084-5.274m10.507 5.274a6.002 6.002 0 0 0-1.084-5.274M2.842 11.6a10 10 0 0 1 2.105-9.154M22.155 11.6a10 10 0 0 0-2.105-9.154M12.5 15V9M6 18.5h4M5.7 22h13.6c1.12 0 1.68 0 2.108-.218a2 2 0 0 0 .874-.874c.218-.428.218-.988.218-2.108v-.6c0-1.12 0-1.68-.218-2.108a2 2 0 0 0-.874-.874C20.98 15 20.42 15 19.3 15H5.7c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874C2.5 16.52 2.5 17.08 2.5 18.2v.6c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874C4.02 22 4.58 22 5.7 22Z"
    />
  </Svg>
)
export default Modemicon
