import React from "react";
import Svg, { Path } from "react-native-svg";

const creditCard = ({
  width = 27,
  height = 27,
  fill = "#632965",
  ...props
}) => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 36 27"
      fill="none"
      {...props}
    >
      <Path
        fill={fill}
        d="M2.85 10.83H.69v10.82c0 1.15.46 2.25 1.27 3.06a4.33 4.33 0 0 0 3.06 1.27h25.96c1.15 0 2.25-.46 3.06-1.27a4.33 4.33 0 0 0 1.27-3.06V10.83H2.85Zm2.17 6.49c0-.57.23-1.12.63-1.53.41-.41.96-.63 1.53-.63h2.16c.57 0 1.12.23 1.53.63.41.41.63.96.63 1.53v2.16a2.2 2.2 0 0 1-.63 1.53c-.41.41-.96.63-1.53.63H7.18a2.2 2.2 0 0 1-1.53-.63c-.41-.41-.63-.96-.63-1.53v-2.16ZM34.03 1.28A4.33 4.33 0 0 0 30.97.01H5.02c-1.15 0-2.25.46-3.06 1.27A4.33 4.33 0 0 0 .69 4.34V6.5H35.3V4.34c0-1.15-.46-2.25-1.27-3.06Z"
      />
    </Svg>
  );
};

export default creditCard;
