import { StyleSheet } from "react-native";
import { theme } from "../../../styles/theme";

export default StyleSheet.create({
  alert: { marginTop: 0, marginBottom: 0 },
  // Edit Username: 24px action wrapper + the button's standard 16px margin.
  primary: { marginTop: theme.spacing.base },
  secondary: { marginTop: theme.spacing.base },
  loading: {
    alignItems: "center",
    paddingVertical: theme.spacing.xl,
  },
});
