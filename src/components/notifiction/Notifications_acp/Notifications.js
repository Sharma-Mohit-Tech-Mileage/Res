import React, { useMemo } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import NotificationSection from './NotificationSection';
import ProfileSettingsHeader from '../../common/ProfileSettingsHeader';
import { Color, Padding } from '../../../../GlobalStyles';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { getPrimaryEmail } from '../../utility/constant';

const Notifications = () => {
  const navigation = useNavigation();

  const accountDetails = useSelector(
    (state) => state.combinedReducers.profile?.accountDetails
  );
  const paperlessStatusAcp = useSelector(
    (state) => state.combinedReducers.profile?.paperlessStatusAcp
  );

  // Memoize profile data extraction from Redux for ACP users.
  const profileData = useMemo(() => {
    return accountDetails
      ? {
          emailAddress: getPrimaryEmail(accountDetails),
          isAdmin: accountDetails.isAdmin || false,
          phoneNumber: accountDetails.phoneNumber || null,
        }
      : {};
  }, [accountDetails]);

  // Dynamically set email settings based on the extracted profile data.
  const emailSettings = useMemo(() => [
    {
      id: 'critical',
      type: 'Critical Notifications',
      status: profileData.emailAddress ? 'On' : 'Off',
    },
    {
      id: 'paperless',
      type: 'Paperless Billing',
      status: paperlessStatusAcp ? 'On' : 'Off',
    },
  ], [profileData.emailAddress, paperlessStatusAcp]);

  // Construct sections for notifications, memoized to prevent unnecessary recalculations.
  const sections = useMemo(() => [
    {
      id: 'text',
      title: 'Text Notifications',
      isComingSoon: true,
      infoMessage: profileData.phoneNumber
        ? 'Text notifications enabled'
        : 'No phone number provided',
    },
    {
      id: 'email',
      title: 'Email Notifications',
      settings: emailSettings,
      infoMessage: profileData.emailAddress
        ? `Emails are sent to ${profileData.emailAddress}`
        : 'No email configured',
    },
    {
      id: 'app',
      title: 'In-App Notifications',
      isComingSoon: true,
      infoMessage: '',
    },
  ], [profileData, emailSettings]);

  const handleEdit = (section) => {
    console.log(`Editing ${section}`);
    navigation.navigate('EmailNotifications');
  };

  const handleBackPress = () => navigation.navigate('Account');

  return (
    <View style={styles.container}>
      <ProfileSettingsHeader title="Notifications" onPressBack={handleBackPress} />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionsContainer}>
          {sections.map((section) => (
            <NotificationSection
              key={section.id}
              {...section}
              onEdit={() => handleEdit(section.id)}
              isAdmin={profileData.isAdmin}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.colorWhitesmoke_200,
  },
  content: {
    flex: 1,
  },
  sectionsContainer: {
    paddingHorizontal: Padding.p_base,
    paddingTop: Padding.p_5xl,
    paddingBottom: Padding.p_13xl,
  },
});

export default Notifications;