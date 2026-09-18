import { StyleSheet } from "react-native";
import { theme } from "../../../styles/theme";
import { Color } from "../../../../GlobalStyles";
import AppStyles from "../../../styles/AppStyles";
export default StyleSheet.create({
  card: { ...AppStyles.card, padding: theme.spacing.lg },
  notice: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.secondarySurface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.base,
    marginHorizontal: theme.spacing.base,
    marginTop: theme.spacing.base,
  },
  noticeText: {
    flex: 1,
    fontSize: theme.typography.size.sm,
    lineHeight: theme.typography.lineHeight.tight,
  },
  statusContent: { marginHorizontal: theme.spacing.base, marginTop: theme.spacing.base, marginBottom: theme.spacing.xl, gap: theme.spacing.xl },
  statusNotice: { marginTop: 0, marginBottom: 0 },
  refreshHint: { flexDirection: "row", alignItems: "center", gap: theme.spacing.sm, backgroundColor: theme.colors.secondarySurface, padding: theme.spacing.sm, borderRadius: theme.radius.base },
  refreshHintText: { flex: 1, fontSize: theme.typography.size.sm },
  successNotice: { marginBottom: theme.spacing.sm },
  flatNotice: {
    paddingVertical: theme.spacing.sm,
    marginVertical: 0,
    borderWidth: 0,
    backgroundColor: Color.colorWhitesmoke_100,
    borderRadius: theme.radius.md,
  },
  success: { color: theme.colors.status.success },
  updated: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.lg,
    backgroundColor: Color.colorWhitesmoke_100,
    borderRadius: theme.radius.md,
    padding: theme.spacing.base,
    marginHorizontal: theme.spacing.base,
    marginBottom: theme.spacing.base,
  },
  updatedTitle: {
    fontSize: theme.typography.size.lg,
    color: theme.colors.text.secondary,
  },
  action: { marginTop: theme.spacing.xl },
  disabled: { backgroundColor: "#D9D9D9" },
  disabledText: { color: theme.colors.text.secondary },
});
