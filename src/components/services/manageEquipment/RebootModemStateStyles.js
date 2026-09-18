import { StyleSheet } from "react-native";
import { theme } from "../../../styles/theme";

export default StyleSheet.create({
  alert: { marginTop: 0, marginBottom: 0 },
  // Edit Username: 24px action wrapper + the button's standard 16px margin.
  primary: { marginTop: theme.spacing.base },
  // Edit Username: 8px spacer + the standard 16px button margin.
  secondary: { marginTop: theme.spacing.xl },
  loading: {
    alignItems: "center",
    paddingVertical: theme.spacing.xl,
  },
});
