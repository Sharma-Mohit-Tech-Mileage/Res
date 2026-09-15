import React from "react";
import { StyleSheet } from "react-native";
import BottomSheet from "../../common/customui/BottomSheet";
import { Body, FieldTitle } from "../../common/customui/Typography";
import { theme } from "../../../styles/theme";

const ModemHelpOverlay = ({ visible, onClose, onContactUs }) => (
  <BottomSheet visible={visible} title="Modem Help" onClose={onClose}>
    <FieldTitle style={styles.heading} accessibilityRole="header">
      How to perform a soft reboot
    </FieldTitle>
    <Body style={styles.body}>
      You can reboot your modem by clicking{" "}
      <FieldTitle style={styles.bold}>“Reboot Modem”</FieldTitle> button through
      the app. During the reboot, your internet service will be temporarily
      unavailable, and the lights on the front of the modem will start flashing.
      Your modem is ready once the status symbol light on the front of the modem
      is solid. This can take up to 10 minutes. For further assistance please
      visit our{" "}
      <Body
        onPress={onContactUs}
        accessibilityRole="link"
        accessibilityLabel="Contact Us"
        style={[styles.link, styles.linkText]}
      >
        Contact Us
      </Body>{" "}
      page.
    </Body>
    <FieldTitle style={styles.heading} accessibilityRole="header">
      How to reboot manually
    </FieldTitle>
    <Body style={styles.body}>
      If you're still having issues, try a hard reboot of the modem by
      unplugging it from power, waiting 30 seconds, and then plugging it back
      in. Wait up to 10 minutes for your modem to come back online.
    </Body>
  </BottomSheet>
);
const styles = StyleSheet.create({
  heading: {
    fontSize: theme.typography.size.lg,
    marginTop: theme.spacing.base,
    marginBottom: theme.spacing.sm,
  },
  body: {
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.lineHeight.relaxed,
  },
  bold: { color: theme.colors.text.secondary },
  link: { paddingHorizontal: 0 },
  linkText: { color: theme.colors.primary, textDecorationLine: "underline" },
});
export default ModemHelpOverlay;
