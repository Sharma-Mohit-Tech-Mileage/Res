import * as React from "react"
import {Svg,Path} from 'react-native-svg';
const Outageicon = (props) => (
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
      d="M13.5 2 4.595 12.688c-.349.418-.523.628-.526.804a.5.5 0 0 0 .186.397c.138.111.41.111.955.111H12.5l-1 8 8.906-10.688c.35-.418.524-.628.526-.804a.5.5 0 0 0-.185-.397C20.61 10 20.338 10 19.793 10H12.5l1-8Z"
    />
  </Svg>
)
export default Outageicon
