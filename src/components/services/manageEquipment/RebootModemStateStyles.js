import { StyleSheet } from "react-native";
import { theme } from "../../../styles/theme";

export default StyleSheet.create({
  alert: {
    marginTop: theme.spacing["3xl"],
    marginBottom: 0,
    paddingVertical: theme.spacing.xl,
    borderRadius: theme.radius.sm,
  },
  message: {
    textAlign: "center",
    marginTop: theme.spacing.xl,
    lineHeight: theme.typography.lineHeight.normal,
  },
  button: { paddingVertical: theme.spacing.md },
  primary: { marginTop: 38 },
  secondary: { marginTop: theme.spacing.xl },
  loading: {
    alignItems: "center",
    paddingTop: theme.spacing["3xl"],
    paddingBottom: theme.spacing.md,
  },
  loadingTitle: { textAlign: "center", marginTop: theme.spacing.xl },
});
