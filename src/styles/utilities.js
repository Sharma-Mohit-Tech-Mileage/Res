/**
 * Utilities - Reusable Style Functions
 * Only includes utilities actually used in the codebase
 */

import { theme } from "./theme";

/**
 * Card Style Utilities
 */
export const card = {
  base: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xs,
    padding: theme.spacing.base,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    shadowColor: '#000',
  },
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
  page: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  section: {
    marginBottom: theme.spacing.base,
    marginHorizontal: theme.spacing.base,
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
