import * as React from "react";
import { Svg, Circle } from "react-native-svg";
const RadioButtonIcon = (props) =>
  props?.checked ? (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={20}
      height={20}
      fill="none"
      {...props}
    >
      <Circle cx={10} cy={10} r={9.5} fill="#fff" stroke="#737373" />
      <Circle cx={10} cy={10} r={6} fill="#8D3B90" />
    </Svg>
  ) : (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={20}
      height={20}
      fill="none"
      {...props}
    >
      <Circle cx={10} cy={10} r={9.5} fill="#fff" stroke="#737373" />
    </Svg>
  );
export default RadioButtonIcon;
