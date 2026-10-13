import React from "react";
import Svg, { Path } from "react-native-svg";
export default function EquipmentServiceIcon({ width = 20, height = 20 }) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 18 18"
      fill="none"
      accessible={false}
    >
        <Path
          d="M4.5075 13.4999H4.5M7.5075 13.4999H7.5M11.25 7.49994V10.4999M13.3799 5.37742C13.1013 5.09849 12.7705 4.87721 12.4063 4.72624C12.0421 4.57527 11.6517 4.49756 11.2574 4.49756C10.8632 4.49756 10.4728 4.57527 10.1086 4.72624C9.74443 4.87721 9.41357 5.09849 9.13495 5.37742M15.4951 3.25499C14.37 2.13062 12.8444 1.49902 11.2538 1.49902C9.66321 1.49902 8.13768 2.13062 7.01257 3.25499M3 10.4999H15C15.8284 10.4999 16.5 11.1715 16.5 11.9999V14.9999C16.5 15.8284 15.8284 16.4999 15 16.4999H3C2.17157 16.4999 1.5 15.8284 1.5 14.9999V11.9999C1.5 11.1715 2.17157 10.4999 3 10.4999Z"
          stroke="#8D3B90"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
    </Svg>
  );
}
