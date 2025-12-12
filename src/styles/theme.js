import { Color, FontFamily, FontSize, Padding, Border } from '../../GlobalStyles';

export const theme = {
  colors: {
    primary: Color.sparklightBrightPurple,
    primaryLight: '#E6D5F5', 
    primaryDark: Color.colorMidnightblue,
    white: Color.sparklightWhite,
    surface: Color.sparklightWhite,
    surfaceVariant: Color.gray50,
    background: Color.backgroundBlur,
    
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
    
    // Status colors
    status: {
      success: Color.sparklightGreen,
      error: Color.sparkLightRed,
      warning: Color.sparkLightInfo,
      info: Color.sparklightBrightPurple,
    },
  },

  // Spacing from GlobalStyles Padding
  spacing: {
    '3xs': Padding.p_11xs,  // 2
    '2xs': Padding.p_9xs,   // 4
    xs: Padding.p_7xs,      // 6
    sm: Padding.p_5xs,      // 8
    base: Padding.p_base,   // 16
    md: Padding.p_xs,       // 12
    lg: Padding.p_xl,       // 20
    xl: Padding.p_5xl,      // 24
    '2xl': Padding.p_13xl,  // 32
    '3xl': Padding.p_37xl,  // 56
  },

  // Typography from GlobalStyles
  typography: {
    family: {
      regular: FontFamily.openSansRegular,
      semiBold: FontFamily.openSansSemiBold,
      bold: FontFamily.openSansSemiBold, // Using semiBold for bold
    },
    size: {
      xs: FontSize.size_xs,       // 12
      sm: FontSize.size_sm,       // 14
      base: FontSize.size_base,   // 16
      lg: FontSize.size_lg,       // 18
      xl: FontSize.size_3xl,      // 22
      xbl: FontSize.size_20,      // 22
      '2xl': FontSize.size_5xl,   // 24
      '3xl': FontSize.size_6xl,   // 28
    },
    lineHeight: {
      tight: 20,
      normal: 24,
      relaxed: 28,
    },
  },

  // Border radius from GlobalStyles
  radius: {
    xs: Border.br_11xs,   // 2
    sm: Border.br_7xs,    // 6
    base: Border.br_5xs,  // 8
    md: Border.br_xs,     // 12
    lg: Border.br_base,   // 16
    full: Border.br_81xl, // 100
  },

  // Shadows (standardized)
  shadows: {
    none: {
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    base: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
    lg: {
      shadowColor: '#000',
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
};

export default theme;