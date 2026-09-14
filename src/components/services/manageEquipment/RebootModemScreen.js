import React, { useRef, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ProfileSettingsHeader from '../../common/ProfileSettingsHeader';
import SurfaceCard from '../../common/customui/SurfaceCard';
import NotificationAlert from '../../common/customui/NotificationAlert';
import PrimaryButton from '../../common/customui/PrimaryButton';
import LinkText from '../../common/customui/LinkText';
import { Body, SectionTitle, FieldTitle } from '../../common/customui/Typography';
import InfoIcon from '../../../../assets/svgs/InfoIcon';
import { theme } from '../../../styles/theme';

// Supply onReboot when the equipment reboot service is available.
const RebootModemScreen = ({ navigation, onReboot }) => {
  const insets = useSafeAreaInsets();
  const [submitting, setSubmitting] = useState(false);
  const pending = useRef(false);
  const handleReboot = async () => {
    if (pending.current) return;
    if (!onReboot) {
      Alert.alert('Reboot unavailable', 'Modem reboot is not available in the app yet. Please contact support for assistance.');
      return;
    }
    pending.current = true;
    setSubmitting(true);
    try {
      await onReboot();
      Alert.alert('Reboot requested', 'Your service will be briefly interrupted while your modem restarts.');
    } catch (error) {
      Alert.alert('Unable to reboot modem', 'Please try again or contact support for assistance.');
    } finally {
      pending.current = false;
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.screen}>
      <ProfileSettingsHeader title="Manage Equipment" onPressBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={[ { paddingBottom: theme.spacing.xl + insets.bottom }]}>
        <SurfaceCard style={styles.card}>
          <SectionTitle accessibilityRole="header" style={styles.title}>Reboot Modem</SectionTitle>
          <NotificationAlert
            type="info"
            layout="centered"
            showCloseIcon={false}
            iconSize={40}
            iconColor="#006AC3"
            containerStyle={styles.confirmation}
            title="You are about to reboot your modem."
          >
            <Body style={styles.message}>During this process, your service will be briefly interrupted.</Body>
            <Body style={styles.prompt}>Would you like to continue?</Body>
          </NotificationAlert>
          <PrimaryButton title={submitting ? 'Rebooting…' : 'Reboot Modem'} buttonType="submit" onPress={handleReboot} disabled={submitting} style={styles.button} containerStyle={styles.reboot} />
          <PrimaryButton title="Cancel" buttonType="outline" onPress={() => navigation.goBack()} disabled={submitting} style={styles.button} containerStyle={styles.cancel} />
          <LinkText accessibilityLabel="Modem Help" onPress={() => navigation.navigate('searchArticles')} style={styles.help}>
            <FieldTitle style={styles.helpTitle}>Modem Help</FieldTitle>
            <View accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
              <InfoIcon size={18} color={theme.colors.primaryDark} />
            </View>
          </LinkText>
        </SurfaceCard>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: theme.spacing.xl },
  card: { paddingHorizontal: theme.spacing.base, paddingTop: theme.spacing.xl, paddingBottom: theme.spacing['3xl'],margin:16 },
  title: { fontSize: theme.typography.size['2xl'], color: theme.colors.text.secondary },
  confirmation: { marginTop: 44, marginBottom: 0, paddingVertical: theme.spacing.xl, borderColor: '#007AFF', borderRadius: theme.radius.sm },
  message: { textAlign: 'center', marginTop: theme.spacing.xl },
  prompt: { textAlign: 'center', marginTop: theme.spacing.xl, color: theme.colors.primaryDark },
  button: { paddingVertical: theme.spacing.md },
  reboot: { marginTop: 38 },
  cancel: { marginTop: theme.spacing.xl },
  help: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm, paddingHorizontal: 0, marginTop: theme.spacing['3xl'] },
  helpTitle: { fontSize: theme.typography.size.xbl },
});

export default RebootModemScreen;
