import { theme } from "./theme";
import { card, iconBadge, typography, container } from "./utilities";

export const serviceCard = {
  container: {
    ...container.section,
  },

  card: {
    ...card.base,
  },
  serviceHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: theme.spacing.md,
  },

  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: `${theme.colors.primary}12`,
    alignItems: "center",
    justifyContent: "center",
  },

  serviceType: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.family.semiBold,
    fontWeight: "600",
    color: theme.colors.text.secondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bottomButton: {
    width: "100%",
    marginTop: theme.spacing.sm,
  },
  planName: {
    flex: 1,
    fontSize: 20,
    fontFamily: theme.typography.family.semiBold,
    fontWeight: "600",
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },

  actionButton: {
    padding: 4,
  },
};

export const internetSpeed = {
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: theme.spacing.sm,
  },

  speedItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: theme.radius.xs,
    padding: theme.spacing.sm,
    marginHorizontal: 4,
  },

  speedIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${theme.colors.primary}15`,
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing.xs,
  },

  speedArrow: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.primary,
  },

  speedInfo: {
    flex: 1,
  },

  speedLabel: {
    fontSize: theme.typography.size.xs,
    fontFamily: theme.typography.family.regular,
    color: theme.colors.text.secondary,
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },

  speedValueRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },

  speedValue: {
    fontSize: theme.typography.size.lg,
    fontFamily: theme.typography.family.semiBold,
    color: theme.colors.text.primary,
    fontWeight: "700",
  },

  speedUnit: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.family.regular,
    color: theme.colors.text.primary,
    marginLeft: 4,
  },
};

export const statusSection = {
  container: {
    marginBottom: theme.spacing["3xl"],
  },
  card: {
    ...card.base,
    ...theme.shadows.base,
    padding: theme.spacing.base,
    marginHorizontal: theme.spacing.base,
  },
  iconWrapper: {
    marginVertical: theme.spacing.xl,
    alignItems: "center",
  },
  iconBadge: iconBadge.circular(70, `${theme.colors.primary}12`),
  title: {
    fontSize: theme.typography.size.xbl,
    fontFamily: theme.typography.family.semiBold,
    fontWeight: "600",
    color: theme.colors.primary,
    textAlign: "center",
    marginBottom: theme.spacing["2xs"],
  },
  subtitle: {
    ...typography.body,
    textAlign: "center",
  },
};

export const header = {
  container: {
    paddingHorizontal: theme.spacing.base,
    paddingTop: theme.spacing.xl,
    alignItems: 'center',
  },
  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  iconBadge: {
    borderColor: theme.colors.border,
    borderWidth: 4,
    width: 72,
    height: 72,
    backgroundColor: theme.colors.primaryDark,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.h1,
    textAlign: 'center',
  },
};

export const skeletonLoader = {
  skeleton: {
    backgroundColor: theme.colors.border,
    borderRadius: theme.radius.sm,
  },
  skeletonHeader: {
    height: 16,
    width: "40%",
    marginBottom: theme.spacing.md,
  },
  skeletonTitle: {
    height: 20,
    width: "70%",
  },
  skeletonSpeedContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: theme.spacing.sm,
  },
  skeletonSpeed: {
    flex: 1,
    height: 60,
    marginHorizontal: 4,
  },
};

export const gradientHeader = {
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  height: 150,
};

export default {
  serviceCard,
  internetSpeed,
  statusSection,
  header,
  skeletonLoader,
  gradientHeader,
};
