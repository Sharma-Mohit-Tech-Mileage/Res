import * as React from "react";
import { Svg, Circle, G, Path, Line, Rect, Text } from "react-native-svg";
const width = 50;
const height = 50;
const size = width < height ? width - 16 : height - 8;
const strokeWidth = 12;
const radius = (size - strokeWidth) / 2;
const circunference = radius * 2 * Math.PI;
const AccountIcon = (props) => {
   const Fname= props.data.params.fname.charAt(0);
   const Lname= props.data.params.lname.charAt(0);
  

    //console.log("FName",props.data.params.fname)
    //console.log("Lname",props.data.params.lname)
  
  return (
    <Svg width={width} height={size}>
      <Circle
        stroke="#767676"
        fill={props.focused ? "#353091" : "#767676"}
        cx={size / 2 + 5}
        cy={size / 2}
        r={radius}
        strokeDasharray={`${circunference} ${circunference}`}
      />
      <Text
        stroke="white"
        fontSize="14"
        x={size / 2}
        y={size / 2 + 5}
        textAnchor="middle"
      >
        {Fname}{Lname}
      </Text>
    </Svg>
  );
};
export default AccountIcon;
