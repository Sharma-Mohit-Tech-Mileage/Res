import * as React from "react"
import {Svg, Path,  LinearGradient, Stop, Defs} from 'react-native-svg';
const BellRingingIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={74}
    height={74}
    fill="none"
    {...props}
  >
    <Path
      stroke="url(#paint0_linear_927_4956)"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={4}
      d="M28.9381 64.4302C31.087 66.3269 33.9099 67.4778 37.0015 67.4778C40.0932 67.4778 42.916 66.3269 45.065 64.4302M7.421 18.167C7.37728 13.7438 9.76198 9.61338 13.6144 7.43967M66.5699 18.167C66.6137 13.7438 64.229 9.6134 60.3765 7.43969M55.2872 24.8111C55.2872 19.9614 53.3607 15.3104 49.9315 11.8812C46.5022 8.45192 41.8512 6.52539 37.0015 6.52539C32.1519 6.52539 27.5008 8.45192 24.0716 11.8812C20.6423 15.3104 18.7158 19.9614 18.7158 24.8111C18.7158 34.2288 16.3401 40.6769 13.6862 44.9419C11.4476 48.5395 10.3283 50.3383 10.3694 50.8401C10.4148 51.3957 10.5325 51.6076 10.9803 51.9397C11.3846 52.2397 13.2075 52.2397 16.8533 52.2397H57.1498C60.7955 52.2397 62.6184 52.2397 63.0228 51.9397C63.4705 51.6076 63.5882 51.3957 63.6337 50.8401C63.6747 50.3383 62.5554 48.5395 60.3168 44.9419C57.663 40.6769 55.2872 34.2288 55.2872 24.8111Z"
    />
    <Defs>
      <LinearGradient 
        id="paint0_linear_927_4956" 
        x1="-35.1988" 
        y1="36.5622" 
        x2="110.544" 
        y2="36.5622" 
        gradientUnits="userSpaceOnUse">
        <Stop offset="0" stopColor="#353091" stopOpacity="0.78" />
        <Stop offset="1" stopColor="#8D3B90" stopOpacity="0.9" />
      </LinearGradient>
    </Defs>
  </Svg>
)
export default BellRingingIcon
