import {
  Color,
  FontFamily,
  FontSize,
  Padding,
  Border,
} from "../../GlobalStyles";

export const theme = {
  colors: {
    primary: Color.sparklightPrimaryPurple,
    primaryLight: "#E6D5F5",
    primaryDark: Color.colorMidnightblue,
    white: Color.sparklightWhite,
    surface: Color.sparklightWhite,
    surfaceVariant: Color.gray50,
    background: Color.colorWhitesmoke_200,
    freedatabackground:Color.sparklight_blue,
    upload:Color.sparklight_blue,
    Black_100: Color.Black_100,

    // Text colors
    text: {
      primary: Color.colorGray_200,
      secondary: Color.sparklightGray1,
      tertiary: Color.sparklightDarkGray,
      onPrimary: Color.sparklightWhite,
    },

    // Border colors
    border: Color.colorWhitesmoke_200,
    borderLight: Color.colorWhitesmoke_300,

   skeleton: {
      base: '#E1E9EE',
      highlight: '#F2F8FC',
    },
    // Status colors
    status: {
      success: Color.sparklightGreen,
      error: Color.sparkLightRed,
      warning: Color.sparkLightInfo,
      info: Color.sparklightPrimaryPurple,
    },
  },

  // Spacing from GlobalStyles Padding
  spacing: {
    "3xs": Padding.p_11xs, // 2
    "2xs": Padding.p_9xs, // 4
    xs: Padding.p_7xs, // 6
    sm: Padding.p_5xs, // 8
    base: Padding.p_base, // 16
    md: Padding.p_xs, // 12
    lg: Padding.p_xl, // 20
    xl: Padding.p_5xl, // 24
    "2xl": Padding.p_13xl, // 32
    "3xl": Padding.p_37xl, // 56
  },

  // Typography from GlobalStyles
  typography: {
    family: {
      regular: FontFamily.RadioCanadaRegular,
      semiBold: FontFamily.RadioCanadaSemiBold,
      bold: FontFamily.RadioCanadaSemiBold, // Using semiBold for bold
    },
    size: {
      xs: FontSize.size_xs, // 12
      sm: FontSize.size_sm, // 14
      base: FontSize.size_base, // 16
      lg: FontSize.size_lg, // 18
      xl: FontSize.size_3xl, // 22
      xbl: FontSize.size_20, // 22
      "2xl": FontSize.size_5xl, // 24
      "3xl": FontSize.size_6xl, // 28
    },
    lineHeight: {
      tight: 20,
      normal: 24,
      relaxed: 28,
    },
  },

  // Border radius from GlobalStyles
  radius: {
    xs: Border.br_11xs, // 2
    sm: Border.br_7xs, // 6
    base: Border.br_5xs, // 8
    md: Border.br_xs, // 12
    lg: Border.br_base, // 16
    full: Border.br_81xl, // 100
  },

  // Shadows (standardized)
  shadows: {
    none: {
      shadowColor: "transparent",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    sm: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    base: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
    lg: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 4,
    },
  },

  // Icon sizes (standardized)
  iconSize: {
    sm: 16,
    base: 24,
    lg: 32,
    xl: 40,
  },

  // [51768] Large-screen geometry. Per-class maps are sparse — utils/responsive.js cascades a missing class down to the nearest smaller one.
  layout: {
    maxContentWidth: 640,
    modalMaxWidth: 480,
    // Extra horizontal breathing room once the window stops being phone-width; 0 keeps compact byte-identical to today.
    gutter: { compact: 0, medium: 24, expanded: 32 },
    columns: { compact: 1, medium: 1, expanded: 2 },
    // Clearance for the absolutely-positioned tab bar; screens currently hard-code 100/120/140/150 by hand.
    tabBarClearance: 140,
  },
};

// minTouch is the scanner-measured size (Android 48dp / iOS 44pt / WCAG 2.5.5); hitSlop adds Fitts's-law event hit-rect.
export const A11Y = {
  minTouch: 48,
  hitSlop: { top: 8, bottom: 8, left: 8, right: 8 },
};

export default theme;
