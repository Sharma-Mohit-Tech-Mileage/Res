import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ProfileSettingsHeader from "../../common/ProfileSettingsHeader";
import SurfaceCard from "../../common/customui/SurfaceCard";
import Touchable from "../../common/customui/Touchable";
import ModemHelpOverlay from "./ModemHelpOverlay";
import { SectionTitle, FieldTitle } from "../../common/customui/Typography";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { theme } from "../../../styles/theme";

const RebootModemLayout = ({ navigation, children }) => {
  const insets = useSafeAreaInsets();
  const [helpVisible, setHelpVisible] = useState(false);
  return (
    <View style={styles.screen}>
      <ProfileSettingsHeader
        title="Manage Equipment"
        onPressBack={() => navigation.goBack()}
      />
      <ScrollView
        contentContainerStyle={[
          { paddingBottom: theme.spacing.xl + insets.bottom },
        ]}
      >
        <SurfaceCard style={styles.card}>
          <SectionTitle accessibilityRole="header">
            Reboot Modem
          </SectionTitle>
          {children}
          <Touchable
            accessibilityLabel="Modem Help"
            onPress={() => setHelpVisible(true)}
            style={styles.help}
          >
            <View
              accessible={false}
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
            >
              <MaterialCommunityIcons name="help-circle-outline" size={20} color={theme.colors.text.secondary} />
            </View>
            <FieldTitle style={{color: theme.colors.text.secondary}}>Modem Help</FieldTitle>
          </Touchable>
        </SurfaceCard>
      </ScrollView>
      <ModemHelpOverlay visible={helpVisible} onClose={() => setHelpVisible(false)} onContactUs={() => {
        setHelpVisible(false);
        navigation.navigate("Support", { isContactUs: true });
      }} />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: theme.spacing.xl },
  card: {
    paddingHorizontal: theme.spacing.base,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.base,
    margin: 16,
  },
  title: {
    fontSize: theme.typography.size["2xl"],
    color: theme.colors.text.secondary,
  },
  confirmation: {
    marginTop: 44,
    marginBottom: 0,
    paddingVertical: theme.spacing.xl,
    borderColor: "#007AFF",
    borderRadius: theme.radius.sm,
  },
  message: { textAlign: "center", marginTop: theme.spacing.xl },
  prompt: {
    textAlign: "center",
    marginTop: theme.spacing.xl,
    color: theme.colors.primaryDark,
  },
  button: { paddingVertical: theme.spacing.md },
  reboot: { marginTop: 38 },
  cancel: { marginTop: theme.spacing.xl },
  help: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    paddingHorizontal: 0,
    marginTop: theme.spacing.xl,
  },
  helpTitle: { fontSize: theme.typography.size.xbl },
});

export default RebootModemLayout;
