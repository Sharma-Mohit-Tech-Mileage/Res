import { StyleSheet } from "react-native";
import { Color, FontFamily, FontSize } from "./GlobalStyles";
import { card as cardStyle } from "./utilities";

const AppStyles = StyleSheet.create({
  card: cardStyle.base,
   cardHreader: {
    flexDirection: "row",
    backgroundColor: Color.colorWhitesmoke_100,
    width: "100%",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    padding: 10,
  },
  H1: {
    fontSize: FontSize.size_5xl,
    fontFamily: FontFamily.RadioCanadaBold,
    fontWeight: "700",
    color: Color.Black_100,
  },
  H2: {
    fontSize: FontSize.size_20,
    fontFamily: FontFamily.RadioCanadaBold,
    fontWeight: "700",
    color: Color.Black_100,
  },
  H3: {
    fontSize: FontSize.size_lg,
    fontFamily: FontFamily.RadioCanadaRegular,
    fontWeight: "400",
    color: Color.Black_100,
  },
  sectionTitle: {
    fontSize: FontSize.size_lg,
    fontFamily: FontFamily.RadioCanadaSemiBold,
    fontWeight: "600",
    color: Color.Black_100,
  },
  sectionContent: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.RadioCanadaRegular,
    fontWeight: "400",
    color: Color.Black_100,
  },
  fieldTitle: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.RadioCanadaSemiBold,
    fontWeight: "600",
    color: Color.Black_100,
  },
  fieldContent: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.RadioCanadaRegular,
    fontWeight: "400",
    color: Color.Black_100,
  },
  indicatorText: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.RadioCanadaRegular,
    fontWeight: "400",
    color: Color.Black_100,
  },
  bannerAlertText: {
    fontSize: FontSize.size_sm,
    fontFamily: FontFamily.RadioCanadaRegular,
    fontWeight: "400",
    color: Color.Black_100,
  },
  menuText: {
    fontSize: FontSize.size_lg,
    fontFamily: FontFamily.RadioCanadaSemiBold,
    fontWeight: "400",
    color: Color.sparklightGray1,
  },
  hintText: {
    fontSize: FontSize.size_sm,
    fontFamily: FontFamily.RadioCanadaRegular,
    fontWeight: "400",
    color: Color.sparklightGray1,
  },
  inlineHintText: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.RadioCanadaRegular,
    fontWeight: "400",
    color: Color.sparklightGray1,
  },
  pageTitle: {
    fontSize: FontSize.size_lg,
    fontFamily: FontFamily.RadioCanadaSemiBold,
    fontWeight: "600",
    color: Color.sparklightWhite,
  },hyperlink: {
    color: Color.sparklightPrimaryPurple,
    fontFamily: FontFamily.RadioCanadaBold,
    fontSize: FontSize.size_base,
    fontStyle: "normal",
    fontWeight: "700",
    textDecorationLine: "underline",
    textDecorationStyle: "solid",
    textDecorationColor: Color.sparklightPrimaryPurple,
  },
});

export default AppStyles;
