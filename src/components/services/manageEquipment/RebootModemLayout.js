import AppStyles from "../../../styles/AppStyles";
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ProfileSettingsHeader from "../../common/ProfileSettingsHeader";
import SurfaceCard from "../../common/customui/SurfaceCard";
import Touchable from "../../common/customui/Touchable";
import ModemHelpOverlay from "./ModemHelpOverlay";
import { SectionTitle } from "../../common/customui/Typography";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { theme } from "../../../styles/theme";
import { Color } from "../../../styles/GlobalStyles";

const RebootModemLayout = ({ navigation, children, actions }) => {
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
          styles.content,
          { paddingBottom: theme.spacing.xl + insets.bottom },
        ]}
      >
        <SurfaceCard style={styles.card}>
          <SectionTitle accessibilityRole="header">Reboot Modem</SectionTitle>
          <View style={styles.state}>{children}</View>
          <View style={styles.actions}>{actions}</View>
          <View style={styles.separator} />
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
              <MaterialCommunityIcons
                name="help-circle-outline"
                size={20}
                color={theme.colors.text.secondary}
              />
            </View>
            <SectionTitle style={{ color: theme.colors.text.secondary }}>
              Modem Help
            </SectionTitle>
          </Touchable>
        </SurfaceCard>
      </ScrollView>
      <ModemHelpOverlay
        visible={helpVisible}
        onClose={() => setHelpVisible(false)}
        onContactUs={() => {
          setHelpVisible(false);
          navigation.navigate("Support", { isContactUs: true });
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.background },
  content: {
    ...AppStyles.headerCardSpacing,
    paddingHorizontal: theme.spacing.base,
  },
  state: { marginTop: theme.spacing.base },
  actions: { marginTop: theme.spacing.xl },
  separator: {
    height: 1,
    width: "auto",
    backgroundColor: Color.sparklightGray,
    marginTop: theme.spacing.sm,
  },
  card: {
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.base,
    paddingBottom: theme.spacing.base,
  },
  help: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    paddingHorizontal: 0,
    marginTop: theme.spacing.base,
  },
  helpTitle: { fontSize: theme.typography.size.xbl },
});

export default RebootModemLayout;
