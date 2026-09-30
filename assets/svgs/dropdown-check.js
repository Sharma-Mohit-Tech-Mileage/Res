import * as React from "react";
import Svg, { Path } from "react-native-svg";

const DropdownCheck = (props) => (
  <Svg width={12} height={9} viewBox="0 0 12 9" fill="none" {...props}>
    <Path
      stroke="#8D3B90"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.33}
      d="M11.332.664 3.998 7.997.665 4.664"
    />
  </Svg>
);

export default DropdownCheck;
