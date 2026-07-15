import { StyleSheet } from "react-native";
import { Color, FontFamily, FontSize } from "../../GlobalStyles";

const AppStyles = StyleSheet.create({
  card: {
    backgroundColor: Color?.sparklightWhite || "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
   cardHreader: {
    flexDirection: "row",
    backgroundColor: "#F8F8F8",
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
    color: Color.sparklightBrightPurple,
    fontFamily: FontFamily.RadioCanadaBold,
    fontSize: FontSize.size_base,
    fontStyle: "normal",
    fontWeight: "600",
    textDecorationLine: "underline",
    textDecorationStyle: "solid",
    textDecorationColor: Color.sparklightBrightPurple,
  },
});

export default AppStyles;
