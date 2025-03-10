export const FontFamily = {
    openSansSemiBold: "OpenSans-SemiBold",
    textXsSemibold: "Inter-SemiBold",
    openSansRegular: 'OpenSans-Regular',
    interBold: "Inter-Bold",
    textXsMedium: "Inter-Medium",
};

/* font sizes */
export const FontSize = {
    textXsSemibold_size: 14,
    size_base: 16,
    size_lg: 18,
    size_sm: 14,
    size_3xl: 22,
    size_xs: 12,
    size_smi: 13,
    size_5xl: 24,
    size_6xl: 28,
};

/* Colors */
export const Color = {
    gray50: "#f9fafb",
    colorWhitesmoke_100: "#f8f8f8",
    colorWhitesmoke_200: "#ebeef1",
    colorWhitesmoke_300: "#eaecf0",
    sparklightWhite: "#fff",
    colorGainsboro_200: "#d9d9d9",
    colorMidnightblue: "#353091",
    colorGray_200: "#001321",
    sparklightGreen: "#2ba948",
    sparklightGray: "#e1e1e1",
    sparklightDarkGray: "#767676",
    sparklightaddGray:"#666666",
    colorGray_100: "#101828",
    sparklightGray1: "#4C5458",
    sparklightBrightPurple: "#8D3B90",
    success50: "#ecfdf3",
    colorAquamarine: "#abefc6",
    success700: "#067647",
    gray600: "#475467",
    sparkLightRed: "#EF4E3E",
    sparkLightInfo:'#F88700',
    Gray300: '#EAEAEA',
    colorlightRed: '#EF4E3E33',
    backgroundBlur: "#F8F8F8",
    sparklight_yellow:'#FFCE51',
};

export const Padding = {
    p_5xs: 8,
    p_5xl: 24,
    p_base: 16,
    p_7xs: 6,
    p_11xs: 2,
    p_xs: 12,
    p_3xs: 10,
    p_9xs: 4,
    p_13xl: 32,
    p_48:48,
    p_37xl: 56,
    p_6xl: 25,
    p_8xs: 5,
    p_xl: 20,
};

/* border radiuses */
export const Border = {
    br_81xl: 100,
    br_181xl: 200,
    br_11xs: 2,
    br_5xs: 8,
    br_xs: 12,
    br_base: 16,
    br_7xs: 6,
    br_381xl: 400,
};

// Helper spacing utilities
export const Spacing = {
    // Margin helpers
    m_2xs: { margin: Padding.p_7xs },
    m_xs: { margin: Padding.p_5xs },
    m_sm: { margin: Padding.p_xs },
    m_md: { margin: Padding.p_base },
    m_lg: { margin: Padding.p_5xl },
    m_xl: { margin: Padding.p_13xl },
    
    // Vertical margin helpers
    my_2xs: { marginVertical: Padding.p_7xs },
    my_xs: { marginVertical: Padding.p_5xs },
    my_sm: { marginVertical: Padding.p_xs },
    my_md: { marginVertical: Padding.p_base },
    my_lg: { marginVertical: Padding.p_5xl },
    my_xl: { marginVertical: Padding.p_13xl },
    
    // Horizontal margin helpers
    mx_2xs: { marginHorizontal: Padding.p_7xs },
    mx_xs: { marginHorizontal: Padding.p_5xs },
    mx_sm: { marginHorizontal: Padding.p_xs },
    mx_md: { marginHorizontal: Padding.p_base },
    mx_lg: { marginHorizontal: Padding.p_5xl },
    mx_xl: { marginHorizontal: Padding.p_13xl },
    
    // Padding helpers
    p_2xs: { padding: Padding.p_7xs },
    p_xs: { padding: Padding.p_5xs },
    p_sm: { padding: Padding.p_xs },
    p_md: { padding: Padding.p_base },
    p_lg: { padding: Padding.p_5xl },
    p_xl: { padding: Padding.p_13xl },
    
    // Vertical padding helpers
    py_2xs: { paddingVertical: Padding.p_7xs },
    py_xs: { paddingVertical: Padding.p_5xs },
    py_sm: { paddingVertical: Padding.p_xs },
    py_md: { paddingVertical: Padding.p_base },
    py_lg: { paddingVertical: Padding.p_5xl },
    py_xl: { paddingVertical: Padding.p_13xl },
    
    // Horizontal padding helpers
    px_2xs: { paddingHorizontal: Padding.p_7xs },
    px_xs: { paddingHorizontal: Padding.p_5xs },
    px_sm: { paddingHorizontal: Padding.p_xs },
    px_md: { paddingHorizontal: Padding.p_base },
    px_lg: { paddingHorizontal: Padding.p_5xl },
    px_xl: { paddingHorizontal: Padding.p_13xl },
};

// Typography styles
export const Typography = {
    // Headings
    h1: {
        fontFamily: FontFamily.openSansSemiBold,
        fontSize: FontSize.size_6xl,
        color: Color.colorGray_200,
    },
    h2: {
        fontFamily: FontFamily.openSansSemiBold,
        fontSize: FontSize.size_5xl,
        color: Color.colorGray_200,
    },
    h3: {
        fontFamily: FontFamily.openSansSemiBold,
        fontSize: FontSize.size_3xl,
        color: Color.colorGray_200,
    },
    
    // Body text
    bodyLarge: {
        fontFamily: FontFamily.openSansRegular,
        fontSize: FontSize.size_lg,
        color: Color.colorGray_100,
    },
    bodyMedium: {
        fontFamily: FontFamily.openSansRegular,
        fontSize: FontSize.size_base,
        color: Color.colorGray_100,
    },
    bodySmall: {
        fontFamily: FontFamily.openSansRegular,
        fontSize: FontSize.size_sm,
        color: Color.colorGray_100,
    },
    
    // Labels
    labelLarge: {
        fontFamily: FontFamily.openSansSemiBold,
        fontSize: FontSize.size_base,
        color: Color.colorGray_100,
    },
    labelMedium: {
        fontFamily: FontFamily.openSansSemiBold,
        fontSize: FontSize.size_sm,
        color: Color.colorGray_100,
    },
    labelSmall: {
        fontFamily: FontFamily.openSansSemiBold,
        fontSize: FontSize.size_xs,
        color: Color.colorGray_100,
    },
};

// Layout helpers
export const Layout = {
    row: {
        flexDirection: 'row',
    },
    rowCenter: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    column: {
        flexDirection: 'column',
    },
    columnCenter: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    center: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    fill: {
        flex: 1,
    },
};