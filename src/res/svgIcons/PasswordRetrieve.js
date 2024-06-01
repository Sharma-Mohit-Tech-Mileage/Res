import * as React from "react"
import {Svg,Path , Circle} from 'react-native-svg';
const PasswordRetrieve = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={24}
    fill="none"
    {...props}
  >
    <Path
      stroke="#8D3B90"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.083}
      d="M12.5 8h.009m-.008 5a5 5 0 1 0-4.956-4.327c.049.361.073.542.057.657a.71.71 0 0 1-.098.288c-.056.101-.155.2-.354.4L2.89 14.275c-.144.144-.216.216-.268.3a.834.834 0 0 0-.1.241c-.023.096-.023.198-.023.402v1.448c0 .466 0 .7.091.878.08.157.208.284.364.364.179.091.412.091.879.091h1.448c.203 0 .305 0 .401-.023a.833.833 0 0 0 .241-.1c.084-.051.156-.123.3-.267l4.26-4.26c.198-.198.297-.297.398-.354a.71.71 0 0 1 .289-.097c.114-.017.295.008.657.056.22.03.444.045.673.045Z"
    />
    <Circle cx={10} cy={18.5} r={5} fill="#fff" />
    <Path
      stroke="#8D3B90"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13.286 17.944s-.664-.953-1.203-1.523a2.892 2.892 0 0 0-2.106-.921C8.333 15.5 7 16.907 7 18.643c0 1.736 1.333 3.143 2.977 3.143 1.358 0 2.503-.96 2.861-2.27m.448-1.572V15.85m0 2.095H11.3"
    />
  </Svg>
)
export default PasswordRetrieve
