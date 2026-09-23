import * as React from "react";
import { Svg, Path } from "react-native-svg";

const AlertIconV2 = ({
  width = 36,
  height = 30,
  stroke = "#EF4E3E",
  ...props
}) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 38 32"
    fill="none"
    {...props}
  >
    <Path
      d="M18.9993 11.6249V18.1249M18.9993 24.6249H19.0159M16.6915 3.32394L2.98332 26.4097C2.22298 27.6902 1.84281 28.3304 1.899 28.8559C1.94801 29.3142 2.19429 29.7307 2.57655 30.0017C3.01481 30.3124 3.77358 30.3124 5.29113 30.3124H32.7074C34.2249 30.3124 34.9837 30.3124 35.422 30.0017C35.8042 29.7307 36.0505 29.3142 36.0995 28.8559C36.1557 28.3304 35.7756 27.6902 35.0152 26.4097L21.3071 3.32393C20.5495 2.04804 20.1706 1.4101 19.6764 1.19584C19.2453 1.00894 18.7532 1.00894 18.3221 1.19584C17.8279 1.4101 17.4491 2.04804 16.6915 3.32394Z"
      stroke={stroke}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default AlertIconV2;