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
    backgroundColor: theme.colors.secondarySurface,
    alignItems: "center",
    justifyContent: "center",
  },

  serviceType: {
    fontSize: theme.typography.size.base,
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
    fontSize: 16,
    fontFamily: theme.typography.family.semiBold,
    fontWeight: "600",
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
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
  skeletonSpeedRight: {
    flex: 1,
    height: 60,
    marginRight: 4,
  },
   skeletonSpeedLeft: {
    flex: 1,
    height: 60,
    marginLeft: 4,
  },
};

// ==========================================
// SHARED CARD HEADER (reused by data usage components)
// ==========================================

export const cardHeader = {
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.secondarySurface,
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing.sm,
  },
  title: {
    fontSize: theme.typography.size.base,
    fontFamily: theme.typography.family.semiBold,
    fontWeight: "600",
    color: theme.colors.text.secondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
};

// ==========================================
// DATA USAGE COMPOSITIONS
// ==========================================

export const dataUsageTabs = {
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: theme.colors.secondarySurface,
    borderRadius: theme.radius.sm,
    padding: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
    alignItems: "center",
    borderRadius: theme.radius.xs,
    minHeight: 44, // Accessibility touch target
  },
  activeTab: {
    backgroundColor: theme.colors.white,
    ...theme.shadows.sm,
  },
  tabText: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.family.semiBold,
    fontWeight: "600",
    color: theme.colors.purpleBright,
  },
};


export default {
  serviceCard,
  statusSection,
  header,
  skeletonLoader,
  cardHeader,
  dataUsageTabs,
};