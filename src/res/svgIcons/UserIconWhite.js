import * as React from "react"
import Svg, { Path } from 'react-native-svg';
const UserIconWhite = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={28}
    height={28}
    fill="none"
    {...props}
  >
    <Path
      fill="#FFF"
      d="M14 12.573A6.287 6.287 0 1 0 14 0a6.287 6.287 0 0 0 0 12.573Zm4.191-6.286a4.191 4.191 0 1 1-8.382 0 4.191 4.191 0 0 1 8.382 0Zm8.383 16.764c0 2.096-2.096 2.096-2.096 2.096H3.522s-2.095 0-2.095-2.096c0-2.095 2.095-8.382 12.573-8.382s12.574 6.287 12.574 8.382Zm-2.096-.008c-.002-.516-.323-2.066-1.744-3.487-1.366-1.366-3.937-2.791-8.734-2.791-4.799 0-7.368 1.425-8.734 2.79-1.421 1.422-1.74 2.972-1.744 3.488h20.956Z"
    />
  </Svg>
)
export default UserIconWhite
