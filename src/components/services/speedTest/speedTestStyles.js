import { StyleSheet } from "react-native";
import { theme } from "../../../styles/theme";
export default StyleSheet.create({
  card: { ...theme.shadows.none, padding: theme.spacing.lg, borderRadius: 0 },
  notice: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: theme.radius.md,
    padding: theme.spacing.sm,
  },
  noticeText: {
    flex: 1,
    fontSize: theme.typography.size.sm,
    lineHeight: theme.typography.lineHeight.tight,
  },
  flatNotice: {
    borderWidth: 0,
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: theme.radius.md,
  },
  success: { color: theme.colors.status.success },
  updated: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.lg,
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: theme.radius.md,
    padding: theme.spacing.base,
  },
  updatedTitle: {
    fontSize: theme.typography.size.lg,
    color: theme.colors.text.secondary,
  },
  action: { marginTop: theme.spacing.xl },
  disabled: { backgroundColor: theme.colors.border },
});
