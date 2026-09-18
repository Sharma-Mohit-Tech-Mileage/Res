import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '../../../styles/theme';
import Icon from '../../common/Icon';
import ModemIcon from '../../../res/svgIcons/ModemIcon';
import SurfaceCard from '../../common/customui/SurfaceCard';
import Touchable from '../../common/customui/Touchable';
import AppStyles from '../../../styles/AppStyles';
import {
  SectionTitle,
  FieldContent,
  Caption,
} from '../../common/customui/Typography';

const MyModemCard = ({ loading = false, onReboot, showConnectionStatus = false }) => (
  <SurfaceCard style={styles.card}>
    <View style={styles.header}>
      <View style={styles.iconWrapper} accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <ModemIcon />
      </View>
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
            <SectionTitle style={styles.text}>Modem: </SectionTitle>Hitron CODA-57
          </FieldContent>
          <FieldContent style={styles.text}>
            <SectionTitle style={styles.text}>Mac Id: </SectionTitle>DA:12:34:56:78:90
          </FieldContent>
        </View>
        <View style={styles.badge}>
          <Caption style={styles.badgeText}>LEASED</Caption>
        </View>
        {showConnectionStatus && (
        <View style={styles.statusRow}>
          <View style={styles.statusDot} accessible={false} />
          <FieldContent style={styles.text}>Connected</FieldContent>
        </View>
        )}
        <Touchable onPress={onReboot} style={styles.rebootCta} accessibilityRole="button" accessibilityLabel="Reboot Modem">
          <FieldContent style={styles.rebootText}>Reboot Modem</FieldContent>
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
    ...AppStyles.card,
    marginHorizontal: theme.spacing.base,
    marginBottom: theme.spacing.base,
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,

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
    backgroundColor: theme.colors.secondarySurface,
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
    backgroundColor: theme.colors.secondarySurface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.base,
    paddingVertical: theme.spacing['2xs'],
    paddingHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.md,
  },
  badgeText: {
    fontSize: theme.typography.size.xs,
    fontFamily: theme.typography.family.semiBold,
    color: theme.colors.grayMedium,
  },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs },
  statusDot: {
    width: theme.spacing.md,
    height: theme.spacing.md,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.status.success,
  },
  rebootCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 60,
    marginTop: theme.spacing.xl,
    marginHorizontal: -theme.spacing.lg,
    marginBottom: -theme.spacing.lg,
    paddingHorizontal: theme.spacing.base,
    paddingVertical: theme.spacing.base,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  rebootText: {
    flex: 1,
    marginRight: theme.spacing.base,
    fontSize: theme.typography.size.base,
    fontFamily: theme.typography.family.regular,
    color: theme.colors.text.primary,
  },
  loading: { paddingVertical: theme.spacing['2xl'], alignItems: 'center' },
});

export default MyModemCard;
