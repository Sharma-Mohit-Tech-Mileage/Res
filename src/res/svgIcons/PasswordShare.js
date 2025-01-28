import * as React from "react"
import {Svg,Path , Rect} from 'react-native-svg';
const PasswordShare = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={21}
    fill="none"
    {...props}
  >
    <Path
      stroke="#8D3B90"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.083}
      d="M13 7h.008M13 12a5 5 0 1 0-4.955-4.327c.048.361.073.542.056.657a.71.71 0 0 1-.097.288c-.056.101-.156.2-.355.4l-4.258 4.258c-.145.144-.217.216-.268.3a.834.834 0 0 0-.1.241C3 13.913 3 14.015 3 14.22v1.448c0 .466 0 .7.09.878.08.157.208.284.365.364.178.091.412.091.878.091h1.448c.204 0 .306 0 .402-.023a.833.833 0 0 0 .24-.1c.085-.051.157-.123.3-.267l4.26-4.26c.198-.198.298-.297.399-.354a.709.709 0 0 1 .288-.097c.115-.017.296.008.658.056.22.03.444.045.672.045Z"
    />
    <Rect width={10} height={9} x={5} y={12} fill="#fff" rx={2} />
    <Path
      stroke="#8D3B90"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11.667 13 13 14.4m0 0-1.333 1.4M13 14.4H8.6c-.56 0-.84 0-1.054.114-.188.101-.341.262-.437.46C7 15.197 7 15.491 7 16.08v.07m0 2.45h4.4c.56 0 .84 0 1.054-.114.188-.101.341-.262.437-.46.109-.224.109-.518.109-1.106v-.07M7 18.6 8.333 20M7 18.6l1.333-1.4"
    />
  </Svg>
)
export default PasswordShare
