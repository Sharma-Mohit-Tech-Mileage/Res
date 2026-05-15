import * as React from "react"
import {Svg,Path} from 'react-native-svg';
const InternetIcon = (props) => (
    <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    accessible={true}
    accessibilityRole="text"
    accessibilityLabel={'Internet'}
    {...props}
  >
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.875}
      d="M12 19.5h.01M22.806 8.7A15.942 15.942 0 0 0 12 4.5c-4.166 0-7.96 1.592-10.807 4.2m3.539 3.543A10.958 10.958 0 0 1 12 9.5c2.786 0 5.33 1.036 7.268 2.743m-3.57 3.532A5.974 5.974 0 0 0 12 14.5c-1.416 0-2.718.49-3.745 1.312"
    />
  </Svg>
)
export default InternetIcon
