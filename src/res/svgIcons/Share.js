import * as React from "react"
import {Svg, Path} from 'react-native-svg';
const Share = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="none"
    {...props}
  >
    <Path
      stroke="#767676"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M14 6V2m0 0h-4m4 0L8.667 7.333m-2-4H5.2c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874C2 4.853 2 5.413 2 6.533V10.8c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874C3.52 14 4.08 14 5.2 14h4.267c1.12 0 1.68 0 2.108-.218a2 2 0 0 0 .874-.874c.218-.428.218-.988.218-2.108V9.333"
    />
  </Svg>
)
export default Share
