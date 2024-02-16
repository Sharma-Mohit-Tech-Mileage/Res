import * as React from "react"
import {Svg,Path} from 'react-native-svg';

const CheckConnection = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    {...props}
  >
    <Path
      stroke="#8D3B90"
      strokeLinejoin="round"
      strokeWidth={1.8}
      d="M13.865 6.555V3.29c0-.715-.573-1.291-1.26-1.291-.688 0-1.261.587-1.261 1.29v3.265H8.677V3.29C8.677 2.576 8.104 2 7.417 2c-.688 0-1.26.587-1.26 1.29v3.265H4V8.09c0 2.816 1.885 5.205 4.417 5.92-.021.117-.042.234-.042.362v1.963c0 .917.73 1.664 1.625 1.664.896 0 1.625-.747 1.625-1.664v-1.963c0-.128-.01-.245-.042-.362C14.125 13.296 16 10.907 16 8.09V6.555h-2.146.01Z"
    />
  </Svg>
)
export default CheckConnection
