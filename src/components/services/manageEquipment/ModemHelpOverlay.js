import React from "react";
import { Alert, Linking, StyleSheet, View } from "react-native";
import BottomSheet from "../../common/customui/BottomSheet";
import { FieldTitle, FieldContent } from "../../common/customui/Typography";
import { theme } from "../../../styles/theme";

const openVideoGuide = async () => {
  try {
    await Linking.openURL(
      "https://support.sparklight.com/hc/en-us/articles/360006190413-Rebooting-Your-Internet-Modem-Video"
    );
  } catch {
    Alert.alert("Unable to open video", "Please try again in a moment.");
  }
};

const ModemHelpOverlay = ({ visible, onClose, onContactUs }) => (
  <BottomSheet
    visible={visible}
    title="Modem Help"
    onClose={onClose}
    sheetStyle={styles.sheet}
    headerStyle={styles.header}
    titleStyle={styles.title}
    contentContainerStyle={styles.content}
  >
    <View style={styles.section}>
      <FieldTitle style={styles.heading} accessibilityRole="header">
        Soft reboot
      </FieldTitle>
      <FieldContent style={styles.body}>
        Tap <FieldTitle>“Reboot Modem”</FieldTitle> in the app.
        Your internet will drop briefly and the lights will flash. Your modem is
        ready when the status light is solid — up to 10 minutes.
      </FieldContent>
    </View>
    <View style={styles.section}>
      <FieldTitle style={styles.heading} accessibilityRole="header">
        Manual reboot
      </FieldTitle>

      <FieldContent style={styles.body}>
        Unplug the power cord from the back of the modem, wait 30 seconds, then
        plug it back in. Your modem is ready when the status light is solid — up
        to 10 minutes.
      </FieldContent>
    </View>
    <View style={styles.section}>
      <FieldTitle style={styles.heading} accessibilityRole="header">
        Watch the video
      </FieldTitle>
      <FieldContent style={styles.body}>
        See our{" "}
        <FieldContent onPress={openVideoGuide} accessibilityRole="link" style={styles.link}>
          step-by-step video guide
        </FieldContent>.
      </FieldContent>
    </View>
    <View style={styles.footer}>
      <FieldContent style={styles.body}>
        Still need help?{" "}
        <FieldContent onPress={onContactUs} accessibilityRole="link" style={styles.link}>
          Contact Us
        </FieldContent>.
      </FieldContent>
    </View>
  </BottomSheet>
);

const styles = StyleSheet.create({
  sheet: {
    maxHeight: "90%",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  header: {
    paddingLeft: 28,
    marginTop: 12,
    marginBottom: 20,
  },
  title: { fontSize: 30 },
  content: { paddingHorizontal: 28, paddingBottom: 8 },
  section: { marginBottom: 28 },
  heading: {
    marginBottom: theme.spacing.md,
  },
  body: {
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.lineHeight.relaxed,
  },
  link: {
    fontSize: theme.typography.size.lg,
    color: theme.colors.primary,
    textDecorationLine: "underline",
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: 18,
  },
});

export default ModemHelpOverlay;
