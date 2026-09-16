import React from "react";
import { View, StyleSheet } from "react-native";
import SurfaceCard from "../../common/customui/SurfaceCard";
import Icon from "../../common/Icon";
import {
  SectionTitle,
  FieldTitle,
  FieldContent,
} from "../../common/customui/Typography";
import { theme } from "../../../styles/theme";
import AppStyles from "../../../styles/AppStyles";

// Static equipment examples matching the design reference.
const ADDONS = [
  { id: "addon-1", model: "eero7", macId: "00:1A:2B:3C:4D:5E" },
  { id: "addon-2", model: "eero7", macId: "00:1A:2B:3C:4D:5E" },
];

const MyAddons = () => (
  <SurfaceCard style={styles.card}>
    <View style={styles.header}>
      <View
        style={styles.iconBackground}
        accessible={false}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <Icon name="wifi" size={20} />
      </View>
      <SectionTitle style={styles.title} accessibilityRole="header">
        My Add-ons
      </SectionTitle>
      <View
        accessible={false}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <Icon name="down-chevron" size={16} />
      </View>
    </View>
    {ADDONS.map((addon, index) => (
      <View key={addon.id} style={[styles.device, index > 0 && styles.divider]}>
        <FieldContent style={styles.text}>
          <FieldTitle style={styles.text}>Model: </FieldTitle>
          {addon.model}
        </FieldContent>
        <FieldContent style={styles.text}>
          <FieldTitle style={styles.text}>Mac Id: </FieldTitle>
          {addon.macId}
        </FieldContent>
        <View style={styles.status}>
          <View style={styles.statusDot} accessible={false} />
          <FieldContent style={styles.text}>Connected</FieldContent>
        </View>
      </View>
    ))}
  </SurfaceCard>
);

const styles = StyleSheet.create({
  card: {
    ...AppStyles.card,
    marginHorizontal: theme.spacing.base,
    marginBottom: theme.spacing.base,
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing["2xl"],
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.xl,
  },
  iconBackground: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.full,
    backgroundColor: "#F8F7F7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing.md,
  },
  title: {
    flex: 1,
    fontSize: theme.typography.size.xbl,
    color: theme.colors.text.secondary,
  },
  device: { gap: theme.spacing.sm },
  text: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.size.base,
    lineHeight: 23,
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    marginTop: theme.spacing.base,
    paddingTop: theme.spacing.md,
  },
  status: { flexDirection: "row", alignItems: "center", gap: theme.spacing.xs },
  statusDot: {
    width: 13,
    height: 13,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.status.success,
  },
});

export default MyAddons;
