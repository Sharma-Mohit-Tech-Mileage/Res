import React, { useCallback, useEffect, useMemo } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import NotificationSection from './NotificationSection';
import ProfileSettingsHeader from '../../common/ProfileSettingsHeader';
import { Color, Padding } from '../../../../GlobalStyles';
import { getPrimaryEmail } from '../../utility/constant';
import { fetchACPUserAccountDetails, getPaperlessStatus } from "../../../redux/actions/ProfileActionSuite";

const Notifications = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  const accountDetails = useSelector(
    (state) => state.combinedReducers.profile?.accountDetails
  );
  const paperlessStatusAcp = useSelector(
    (state) => state.combinedReducers.profile?.paperlessStatusAcp
  );

  const profileData = useMemo(() => {
    return accountDetails
      ? {
          emailAddress: getPrimaryEmail(accountDetails),
          isAdmin: accountDetails.isAdmin || false,
          phoneNumber: accountDetails.phoneNumber || null,
        }
      : {};
  }, [accountDetails]);

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

  const InAppSettings = useMemo(() => [
    {
      id: 'Appointment',
      type: 'Appointments',
      status: 'On' 
    },
    {
      id: 'outage',
      type: 'Outage',
      status:  'On' 
    },
    {
      id: 'billing',
      type: 'Billing',
      status:  'On' 
    },
  ], []);
  const sections = useMemo(() => [
    {
      id: 'text',
      title: 'Text Notifications',
      isComingSoon: true,
      infoMessage: '',
    },
    {
      id: 'email',
      title: 'Email Notifications',
      settings: emailSettings,
      infoMessage: profileData.emailAddress
        ? `Emails are sent to ${profileData.emailAddress}`
        : 'You have not enabled email notifications.',
    },
    {
      id: 'app',
      title: 'In-App Notifications',
      isComingSoon: false,
      settings:InAppSettings,
      infoMessage: 'Notifications sent from your application.',
    },
  ], [profileData, emailSettings]);

  const handleEdit = (section) => {
    console.log(`Editing ${section}`);
    if(section=='app'){
       navigation.navigate('InAppNotifications', { is_enrolled: profileData.emailAddress });
    }else{
       navigation.navigate('EmailNotifications', { is_enrolled: profileData.emailAddress });
    }
  };

  const handleBackPress = () => navigation.navigate('Account');

  // Existing effect: when accountDetails change, update the paperless status using the new email.
  useEffect(() => {
    if (accountDetails) {
      const updatedPrimaryEmail = getPrimaryEmail(accountDetails);
      dispatch(getPaperlessStatus(updatedPrimaryEmail));
    }
  }, [accountDetails, dispatch]);

  // On focus, trigger the Redux Saga to refresh account details.
  useFocusEffect(
    useCallback(() => {
      dispatch(fetchACPUserAccountDetails());
    }, [dispatch])
  );

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
  content: { flex: 1, },
  
  sectionsContainer: {
    paddingHorizontal: Padding.p_base,
    paddingTop: Padding.p_5xl,
    paddingBottom: Padding.p_13xl,
  },
});

export default Notifications;