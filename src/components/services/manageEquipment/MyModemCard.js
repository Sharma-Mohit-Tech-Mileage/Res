import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '../../../styles/theme';
import Icon from '../../common/Icon';
import SurfaceCard from '../../common/customui/SurfaceCard';
import Touchable from '../../common/customui/Touchable';
import {
  SectionTitle,
  FieldTitle,
  FieldContent,
  Caption,
} from '../../common/customui/Typography';

const MyModemCard = ({ loading = false, onReboot }) => (
  <SurfaceCard style={styles.card}>
    <View style={styles.header}>
     
      <SectionTitle style={styles.title} accessibilityRole="header">My Modem</SectionTitle>
      
    </View>

    {loading ? (
      <View style={styles.loading} accessibilityLiveRegion="polite">
        <FieldContent style={styles.text}>Loading modem details...</FieldContent>
      </View>
    ) : (
      <>
        <View style={styles.details}>
          <FieldContent style={styles.text}>
            <FieldTitle style={styles.text}>Modem: </FieldTitle>Hitron CODA-57
          </FieldContent>
          <FieldContent style={styles.text}>
            <FieldTitle style={styles.text}>Mac Id: </FieldTitle>DA:12:34:56:78:90
          </FieldContent>
        </View>
        <View style={styles.badge}>
          <Caption style={styles.badgeText}>LEASED</Caption>
        </View>
        <View style={styles.statusRow}>
          <View style={styles.statusDot} accessible={false} />
          <FieldContent style={styles.text}>Connected</FieldContent>
        </View>
        <View style={styles.separator} />
        <Touchable onPress={onReboot} style={styles.rebootCta} accessibilityRole="button" accessibilityLabel="Reboot modem">
          <FieldTitle style={styles.rebootText}>Reboot modem</FieldTitle>
          <View accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
            <Icon name="right-chevron" size={theme.iconSize.sm} />
          </View>
        </Touchable>
      </>
    )}
  </SurfaceCard>
);

const styles = StyleSheet.create({
  card: {
    ...theme.shadows.none,
    marginHorizontal: theme.spacing.base,
    marginBottom: theme.spacing.base,
    padding: theme.spacing.lg,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.xs,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  iconWrapper: {
    width: theme.iconSize.xl,
    height: theme.iconSize.xl,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surfaceVariant,
    alignItems: 'center',
    justifyContent: 'center',
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
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.surfaceVariant,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.base,
    padding: theme.spacing['2xs'],
    marginVertical: theme.spacing.md,
  },
  badgeText: {
    fontSize: theme.typography.size.xs,
    fontFamily: theme.typography.family.semiBold,
    color: theme.colors.text.secondary,
  },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs },
  statusDot: {
    width: theme.spacing.md,
    height: theme.spacing.md,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.status.success,
  },
  separator: { height: 1, backgroundColor: theme.colors.border, marginTop: theme.spacing.base },
  rebootCta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: theme.spacing.sm },
  rebootText: { fontSize: theme.typography.size.base, color: theme.colors.primary },
  loading: { paddingVertical: theme.spacing['2xl'], alignItems: 'center' },
});

export default MyModemCard;
