import * as React from "react"
import {Svg,Path} from 'react-native-svg';
const PasswordKey = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={18}
    fill="none"
    {...props}
  >
    <Path
      stroke="#8D3B90"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.083}
      d="M11.5 6.5h.008m-.008 5a5 5 0 1 0-4.955-4.327c.048.361.073.542.056.657a.71.71 0 0 1-.097.288c-.056.101-.156.2-.355.4l-4.258 4.258c-.145.144-.217.216-.268.3a.834.834 0 0 0-.1.241c-.023.096-.023.198-.023.402v1.448c0 .466 0 .7.09.878.08.157.208.284.365.364.178.091.412.091.878.091h1.448c.204 0 .306 0 .402-.023a.833.833 0 0 0 .24-.1c.085-.051.157-.123.3-.267l4.26-4.26c.198-.198.298-.297.399-.354a.71.71 0 0 1 .288-.097c.115-.017.296.008.658.056.22.03.444.045.672.045Z"
    />
  </Svg>
)
export default PasswordKey
