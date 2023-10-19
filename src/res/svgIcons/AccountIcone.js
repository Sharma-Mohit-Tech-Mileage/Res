import * as React from "react";
import { Svg, Circle, G, Path, Line, Rect, Text } from "react-native-svg";
const width = 50;
const height = 50;
const size = width < height ? width - 16 : height - 8;
const strokeWidth = 12;
const radius = (size - strokeWidth) / 2;
const circunference = radius * 2 * Math.PI;
const AccountIcon = (props) => (
  <Svg width={width} height={size}>
    <Circle
      stroke="#767676"
      fill={props.focused ? "#353091" : "#767676"}
      cx={(size / 2)+5}
      cy={size / 2}
      r={radius}
      strokeDasharray={`${circunference} ${circunference}`}
    />
    <Text
      stroke="white"
      fontSize="15"
      x={size / 2+5}
      y={size / 2 + 5}
      textAnchor="middle"
    >
      MS
    </Text>
  </Svg>
);
export default AccountIcon;
