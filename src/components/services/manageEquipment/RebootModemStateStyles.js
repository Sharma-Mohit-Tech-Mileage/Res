import { StyleSheet } from "react-native";
import { theme } from "../../../styles/theme";

export default StyleSheet.create({
  alert: {
    marginTop: theme.spacing.base,
    marginBottom: 0,
  },
  message: {
    textAlign: "left",
    marginTop: theme.spacing["3xs"],
    marginBottom: theme.spacing.sm,
    lineHeight: theme.typography.lineHeight.normal,
  },
  button: { paddingVertical: theme.spacing.md },
  primary: { marginTop: theme.spacing.xl },
  secondary: { marginTop: theme.spacing.md },
  loading: {
    alignItems: "center",
    paddingTop: theme.spacing["3xl"],
    paddingBottom: theme.spacing.md,
  },
  loadingTitle: { textAlign: "center", marginTop: theme.spacing.xl },
});
