/**
 * Utilities - Reusable Style Functions
 * Only includes utilities actually used in the codebase
 */

import { Color, FontFamily, FontSize } from "./GlobalStyles";
import { theme } from "./theme";

/**
 * Card Style Utilities
 */
export const card = {
  // The one card look (white, 8 radius, hairline border, one shadow); AppStyles.card points here.
  base: {
    backgroundColor: Color.sparklightWhite,
    borderRadius: theme.radius.base,
    borderWidth: 1,
    borderColor: Color.cardBorder,
    shadowColor: Color.colorblack_100,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
  },
  // Standard inner padding for content cards; list-style cards pad their rows instead.
  content: {
    padding: theme.spacing.base,
  },
};

// Required-field text style (form helper)
export const requiredField = {
  marginVertical: 5,
  fontFamily: FontFamily.RadioCanadaRegular,
  fontWeight: "400",
  fontSize: FontSize.size_sm,
  color: Color.sparklightGray1,
};

/**
 * Icon Badge Utilities
 */
export const iconBadge = {
  circular: (size = 48, bgColor = theme.colors.primaryLight) => ({
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: bgColor,
    alignItems: "center",
    justifyContent: "center",
  }),
};

/**
 * Typography Utilities
 */
export const typography = {
  h1: {
    fontSize: theme.typography.size.xl,
    fontFamily: theme.typography.family.regular,
    color: theme.colors.text.primary,
    lineHeight: theme.typography.lineHeight.relaxed,
  },

  h2: {
    fontSize: theme.typography.size.xl,
    fontFamily: theme.typography.family.semiBold,
    fontWeight: "600",
    color: theme.colors.text.primary,
    lineHeight: theme.typography.lineHeight.normal,
  },

  body: {
    fontSize: theme.typography.size.base,
    fontFamily: theme.typography.family.regular,
    color: theme.colors.text.primary,
    lineHeight: theme.typography.lineHeight.normal,
  },

  caption: {
    fontSize: theme.typography.size.xs,
    fontFamily: theme.typography.family.regular,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.lineHeight.tight,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  buttonText: {
    fontSize: theme.typography.size.lg,
    fontFamily: theme.typography.family.semiBold,
    fontWeight: "700",
    color: theme.colors.text.onPrimary,
  },
};

/**
 * Container Utilities
 */
export const container = {
  // App-wide frame: side inset and space above the first card (ScreenScroll `framed`, ScreenFrame).
  frame: {
    paddingHorizontal: theme.layout.cardInset,
    paddingTop: theme.layout.contentTop,
  },
  // Vertical list of cards: the one app-wide gap between cards.
  stack: {
    gap: theme.layout.cardGap,
  },
  page: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

};

// Shared press-down feedback for Pressable buttons. Apply via `pressed && interaction.pressed`.
export const interaction = {
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
};

export const button = {
  // Outlined button (transparent + border)
  smallOutlined: {
    backgroundColor: theme.colors.primary,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    paddingVertical: theme.spacing["2xs"],
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.radius.xs,
    minWidth: 70,
    alignItems: "center",
  },

  // Filled button (purple background)
  smallFilled: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing["2xs"],
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.radius.xs,
    minWidth: 70,
    alignItems: "center",
  },

  // Text for outlined button (purple text)
  smallButtonText: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.family.semiBold,
    fontWeight: "600",
    color: theme.colors.white,
  },

  // Text for filled button (white text)
  smallButtonTextLight: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.family.semiBold,
    fontWeight: "600",
    color: theme.colors.white,
  },
};
