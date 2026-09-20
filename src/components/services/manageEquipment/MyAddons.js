import Touchable from "../../common/customui/Touchable";
import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import SurfaceCard from "../../common/customui/SurfaceCard";
import Icon from "../../common/Icon";
import {
  SectionTitle,
  FieldContent,
} from "../../common/customui/Typography";
import { theme } from "../../../styles/theme";
import AppStyles from "../../../styles/AppStyles";

// Static equipment examples matching the design reference.
const ADDONS = [
  { id: "addon-1", model: "eero7", macId: "00:1A:2B:3C:4D:5E" },
  { id: "addon-2", model: "eero7", macId: "00:1A:2B:3C:4D:5E" },
];

const MyAddons = ({ showConnectionStatus = false }) => {
 const [expanded, setExpanded] = useState(true);
 return (
  <SurfaceCard style={[styles.card, !showConnectionStatus && styles.cardWithoutStatus]}>
    <Touchable style={styles.header} onPress={() => setExpanded(value => !value)} accessibilityRole="button" accessibilityLabel="My Add-ons" accessibilityState={{ expanded }}>
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
        <View style={{transform: [{rotate: expanded ? "180deg" : "0deg"}]}}><Icon name="down-chevron" size={16} /></View>
      </View>
    </Touchable>
    {expanded && ADDONS.map((addon, index) => (
      <View key={addon.id} style={[styles.device, index > 0 && styles.divider]}>
        <FieldContent style={styles.text}>
          <SectionTitle style={styles.text}>Model: </SectionTitle>
          {addon.model}
        </FieldContent>
        <FieldContent style={styles.text}>
          <SectionTitle style={styles.text}>Mac Id: </SectionTitle>
          {addon.macId}
        </FieldContent>
        {showConnectionStatus && (
        <View style={styles.status}>
          <View style={styles.statusDot} accessible={false} />
          <FieldContent style={styles.text}>Connected</FieldContent>
        </View>
        )}
      </View>
    ))}
  </SurfaceCard>
);
};

const styles = StyleSheet.create({
  card: {
    ...AppStyles.card,
    marginHorizontal: theme.spacing.base,
    marginBottom: theme.spacing.base,
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing["2xl"],
  },
  cardWithoutStatus: { paddingBottom: theme.spacing.lg },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.xl,
  },
  iconBackground: {
    marginLeft: -(theme.iconSize.xl - 25) / 2,
    width: theme.iconSize.xl,
    height: theme.iconSize.xl,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.secondarySurface,
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
