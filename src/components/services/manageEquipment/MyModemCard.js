import React from "react";
import { View, StyleSheet } from "react-native";
import { theme } from "../../../styles/theme";
import MenuRow from "../../common/customui/MenuRow";
import ModemIcon from "../../../res/svgIcons/ModemIcon";
import SurfaceCard from "../../common/customui/SurfaceCard";
import Touchable from "../../common/customui/Touchable";
import AppStyles from "../../../styles/AppStyles";
import {
  SectionTitle,
  FieldContent,
  Caption,
} from "../../common/customui/Typography";

const MyModemCard = ({
  loading = false,
  equipment,
  onReboot,
  showConnectionStatus = false,
}) => {
  console.log('equipment in my modem card', JSON.stringify(equipment));
   
return (

 
  <SurfaceCard style={styles.card}>
    <View style={styles.header}>
      <View
        style={styles.iconWrapper}
        accessible={false}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <ModemIcon />
      </View>
      <SectionTitle style={styles.title} accessibilityRole="header">
        {equipment?.name || "My Modem"}
      </SectionTitle>
    </View>

    {loading ? (
      <View style={styles.loading} accessibilityLiveRegion="polite">
        <FieldContent style={styles.text}>
          Loading modem details...
        </FieldContent>
      </View>
    ) : (
      <>
        <View style={styles.details}>
          <FieldContent style={styles.text}>
            <SectionTitle style={styles.text}>Model: </SectionTitle>
            {equipment?.model || "—"}
          </FieldContent>
          <FieldContent style={styles.text}>
            <SectionTitle style={styles.text}>Mac Id: </SectionTitle>
            {equipment?.identifierValue || "—"}
          </FieldContent>
        </View>
        {equipment && (
          <View style={styles.lease}>
            <Caption style={styles.badgeText}>{equipment.subscriber_owned==="R" ? "LEASED" : equipment.subscriber_owned==="P" ? "CUSTOMER OWNED" : "N/A"}</Caption>
          </View>
        )}
        {equipment && showConnectionStatus && (
          <View style={styles.statusRow}>
            <View style={styles.statusDot} accessible={false} />
            <FieldContent style={styles.text}>Connected</FieldContent>
          </View>
        )}
        {equipment && (
          <MenuRow
            label="Reboot Modem"
            onPress={onReboot}
            style={[
              styles.rebootCta,
              !showConnectionStatus && styles.rebootWithoutStatus,
            ]}
          />
        )}
      </>
    )}
  </SurfaceCard>
)
}

const styles = StyleSheet.create({
  card: {
    ...AppStyles.card,
    marginHorizontal: theme.spacing.base,
    marginBottom: theme.spacing.base,
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.xl,
  },
  iconWrapper: {
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
  details: { gap: theme.spacing.sm },
  text: {
    fontSize: theme.typography.size.base,
    lineHeight: theme.typography.lineHeight.normal,
    color: theme.colors.text.secondary,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: theme.colors.secondarySurface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.base,
    paddingVertical: theme.spacing["2xs"],
    paddingHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.md,
  },
  lease: {
    alignSelf: "flex-start",
    backgroundColor: theme.colors.surfaceVariant,
    borderWidth: 1,
    borderColor: theme.colors.grayMedium,
    borderRadius: theme.radius.base,
    paddingVertical: theme.spacing["2xs"],
    paddingHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.md,
  },
  badgeText: {
    fontSize: theme.typography.size.xs,
    fontFamily: theme.typography.family.semiBold,
    color: theme.colors.grayMedium,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  statusDot: {
    width: theme.spacing.md,
    height: theme.spacing.md,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.status.success,
  },
  rebootCta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 60,
    marginTop: theme.spacing.xl,
    marginHorizontal: -theme.spacing.lg,
    marginBottom: -theme.spacing.lg,
  },
  rebootWithoutStatus: { marginTop: theme.spacing.sm },
  rebootText: {
    flex: 1,
    marginRight: theme.spacing.base,
    fontSize: theme.typography.size.base,
    fontFamily: theme.typography.family.regular,
    color: theme.colors.text.primary,
  },
  loading: { paddingVertical: theme.spacing["2xl"], alignItems: "center" },
});

export default MyModemCard;
