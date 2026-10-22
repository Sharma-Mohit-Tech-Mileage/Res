import * as React from "react";
import { Svg, Path } from "react-native-svg";

const PaymentPlanIcon = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" {...props}>
    <Path
      d="M4 7.5A2.5 2.5 0 0 1 6.5 5H19a1 1 0 0 1 1 1v2.2M4 7.5V17a2 2 0 0 0 2 2h12.5a1.5 1.5 0 0 0 1.5-1.5v-8A1.5 1.5 0 0 0 18.5 8H6.5A2.5 2.5 0 0 1 4 7.5Z"
      stroke="#8D3B90"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M16 13.5h2" stroke="#8D3B90" strokeWidth={1.8} strokeLinecap="round" />
  </Svg>
);

export default PaymentPlanIcon;
