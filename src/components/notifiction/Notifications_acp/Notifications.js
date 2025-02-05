// Notifications.js
import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import NotificationSection from './NotificationSection';
import ProfileSettingsHeader from '../../common/ProfileSettingsHeader';
import { Color,Padding} from '../../../../GlobalStyles';
import { useNavigation } from "@react-navigation/native";
// Dummy data structure - Replace with API response later
const DUMMY_DATA = {
  profile: {
    emailAddress: 'Melissa@gmail.com',
    isAdmin: false,
    isEmailVerified: true,
    phoneNumber: null
  },
  emailSettings: [
    { id: 'critical', type: 'Critical Notifications', status: 'On' },
    { id: 'paperless', type: 'Paperless Billing', status: 'Off' }
  ]
};

const Notifications = () => {
  const navigation = useNavigation();
  const { emailAddress, isAdmin, phoneNumber } = DUMMY_DATA.profile;

  const handleEdit = (section) => {
    console.log(`Editing ${section}`);
   navigation.navigate('EmailNotifications');
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const sections = [
    {
      id: 'text',
      title: 'Text Notifications',
      isComingSoon: true,
      infoMessage: phoneNumber ? 
        `Text alerts are sent to ${phoneNumber}` : 
        'No mobile phone number on file'
    },
    {
      id: 'email',
      title: 'Email Notifications',
      settings: DUMMY_DATA.emailSettings,
      infoMessage: `Emails are sent to ${emailAddress}`
    },
    {
      id: 'app',
      title: 'In-App Notifications',
      isComingSoon: true,
      infoMessage: 'Notifications sent from your application'
    }
  ];

  return (
    <View style={styles.container}>
      <ProfileSettingsHeader 
        title="Notifications"
        onPressBack={handleBackPress}
      />
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionsContainer}>
          {sections.map(section => (
            <NotificationSection
              key={section.id}
              {...section}
              onEdit={() => handleEdit(section.id)}
              isAdmin={isAdmin}
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
    backgroundColor: Color.colorWhitesmoke_200
  },
  content: {
    flex: 1
  },
  sectionsContainer: {
    paddingHorizontal: Padding.p_base,
    paddingTop: Padding.p_5xl,
    paddingBottom: Padding.p_13xl
  }
});

export default Notifications;