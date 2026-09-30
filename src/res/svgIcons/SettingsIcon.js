import * as React from "react"
import Svg, { Path } from 'react-native-svg';
const SettingsIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={21}
    height={22}
    fill="none"
    {...props}
  >
    <Path
      stroke="#8D3B90"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10.238 1h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V19a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V3a2 2 0 0 0-2-2Z"
    />
    <Path
      stroke="#8D3B90"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10.018 14a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
    />
  </Svg>
)
export default SettingsIcon
