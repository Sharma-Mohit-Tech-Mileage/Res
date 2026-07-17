import React from "react";
import Svg, { Path } from "react-native-svg";

const UserIcon = ({ width = 27, height = 26, fill = "#8D3B90", ...props }) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 27 26"
      fill="none"
      {...props}
    >
      <Path
        fill={fill}
        d="M13.99 12.58c1.67 0 3.27-.66 4.45-1.84a6.289 6.289 0 0 0 1.84-4.45c0-1.67-.66-3.27-1.84-4.45A6.289 6.289 0 0 0 13.99 0c-1.67 0-3.27.66-4.45 1.84A6.289 6.289 0 0 0 7.7 6.29c0 1.67.66 3.27 1.84 4.45a6.289 6.289 0 0 0 4.45 1.84ZM13.99 14.68c-10.47 0-12.57 6.29-12.57 8.38 0 2.09 2.1 2.1 2.1 2.1h20.96s2.1 0 2.1-2.1-2.1-8.38-12.57-8.38h-.02Z"
      />
    </Svg>
  );
};

export default UserIcon;
