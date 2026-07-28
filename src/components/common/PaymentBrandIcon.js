import React from "react";
import Svg, { Path, SvgXml } from "react-native-svg";
import CreditCardIcon from "../../res/svgIcons/creditCard";
import { Color } from "../../../GlobalStyles";
import { VISA_LOGO_XML, MASTERCARD_LOGO_XML, DISCOVER_FLAT_XML } from "../../res/svgIcons/cardBrandLogos";

// Generic financial-institution glyph; used for any bank/ACH account (Chase, Schwab, credit unions, ...)
const BankMark = ({ size, fill }) => (
  <Svg width={size} height={size} viewBox="0 0 30 30" fill="none">
    <Path
      d="M15 3 3.75 9.75v2.25h22.5V9.75L15 3zM6 14.25v9h3v-9H6zm7.5 0v9h3v-9h-3zm7.5 0v9h3v-9h-3zM3.75 25.5V27h22.5v-1.5H3.75z"
      fill={fill}
    />
  </Svg>
);

// Resolves the official card-network mark (or bank glyph) from the payment method's own brand data
const PaymentBrandIcon = ({ type, brand, height = 22 }) => {
  if (type === "ach" || type === "bank") return <BankMark size={height + 4} fill={Color.colorMidnightblue} />;
  // Official artwork is 780x500; keep its aspect ratio at the requested height
  const width = Math.round(height * 1.56);
  const name = (brand || "").toLowerCase();
  if (name.includes("visa")) return <SvgXml xml={VISA_LOGO_XML} width={width} height={height} />;
  if (name.includes("master")) return <SvgXml xml={MASTERCARD_LOGO_XML} width={width} height={height} />;
  if (name.includes("discover")) return <SvgXml xml={DISCOVER_FLAT_XML} width={width} height={height} />;
  return <CreditCardIcon width={width} height={height} fill={Color.colorMidnightblue} />;
};

export default PaymentBrandIcon;
