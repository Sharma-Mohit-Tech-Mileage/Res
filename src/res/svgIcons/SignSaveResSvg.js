import React from "react";
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Rect,
  G,
  Path,
  Text as SvgText,
  TSpan,
} from "react-native-svg";

const SignSaveResSvg = ({ width = "100%", height = 118, ...props }) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 327.402985 117.910448"
      accessible={false}
      importantForAccessibility="no"
      accessibilityRole="image"
      accessibilityLabel="Sign up and save with Auto Pay and Paperless Billing"
      {...props}
    >
      <Defs>
        <LinearGradient
          id="promoGradient"
          x1="52.373134"
          y1="-52.373134"
          x2="275.029851"
          y2="170.283582"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0" stopColor="#353091" />
          <Stop offset="1" stopColor="#8B3B90" />
        </LinearGradient>
      </Defs>

      <Rect width="327.402985" height="117.910448" fill="url(#promoGradient)" />

      <G>
        <Path
          fill="#FFFFFF"
          d="M87.621913,25.504787c.217929.315544-1.237146,1.6189-1.545613,1.913754-.372421.355987-2.871957,2.608106-3.071927,2.589073-21.291003-15.244933-52.42003-4.697875-59.122739,20.774005-7.560263,28.730788,19.496539,53.715823,47.673232,45.522339,24.15753-7.024754,34.816107-35.410517,20.889107-56.544634.038402-.462274,3.97442-4.797104,4.372169-4.699452,2.795267,3.862572,5.051145,8.375055,6.404648,12.961693,9.745216,33.023771-20.639545,62.982288-53.59756,54.7925-27.362568-6.799367-41.769574-37.732462-28.2407-62.896134,12.890956-23.977147,44.43124-30.462087,66.239383-14.413144Z"
        />
        <Path
          fill="#FFFFFF"
          d="M112.477612,15.226739c-6.696307,7.115334-13.996604,13.665951-20.436173,21.024798-12.079801,13.804248-20.853931,29.806471-30.21022,45.488905l-1.932822.292673c-3.802863-5.891066-6.098831-12.566563-9.112934-18.85837-2.071017-4.323158-4.309984-10.520088-10.243247-9.474891.130502-2.560213,2.754689-5.009705,5.071449-5.801979,8.521591-2.914175,12.594178,5.207281,16.557263,11.056462,11.851938-15.073303,24.674349-33.040203,42.176803-41.942937,1.240935-.631209,5.385511-2.683765,6.517738-2.461402.516812.101499,1.020493.671576,1.612142.676742Z"
        />
      </G>

      <SvgText
        fill="#FFFFFF"
        fontSize="22.094469"
        x="131.571413"
        y="32.672969"
      >
        <TSpan fontFamily="Effra-Regular">Sign up and save</TSpan>
        <TSpan x="131.571413" dy="30.932129" fontFamily="Effra-Regular">
          with
        </TSpan>
        <TSpan fontFamily="Effra-Bold" fontWeight="700"> Auto Pay</TSpan>
        <TSpan fontFamily="Effra-Regular"> and</TSpan>
        <TSpan x="131.571413" dy="30.932129" fontFamily="Effra-Bold" fontWeight="700">
          Paperless Billing
        </TSpan>
      </SvgText>
    </Svg>
  );
};

export default SignSaveResSvg;
