import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import ProfileSettingsHeader from "../../common/ProfileSettingsHeader";
import PrimaryButton from "../../common/customui/PrimaryButton";
import { theme } from "../../../styles/theme";
import AppStyles from "../../../styles/AppStyles";

const SpeedTestLayout = ({
  navigation,
  title,
  children,
  action,
  refreshControl,
}) => (
  <View style={styles.screen}>
    <ProfileSettingsHeader
      title={title}
      onPressBack={() => navigation.goBack()}
    />
    <ScrollView
      contentContainerStyle={styles.content}
      refreshControl={refreshControl}
    >
      {children}
      {action}
      <PrimaryButton title="Cancel" onPress={() => navigation.goBack()} />
    </ScrollView>
  </View>
);
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.background },
  content: { margin:16 },
});
export default SpeedTestLayout;
