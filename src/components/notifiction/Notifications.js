import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute } from "@react-navigation/native";
import { View, ScrollView, StyleSheet, Text } from "react-native";
import ProfileSettingsHeader from '../common/ProfileSettingsHeader';
import { 
  fetchInitialData, 
  handleResentNotification, 
  handleUpdateSuccess, 
  handleAccessibility 
} from './notificationHelpers';
import NotificationSection from "./NotificationSection";
import { 
  fetchProfileDetails, 
  fetchSMSSelection, 
  fetchPushNotifications, 
  fetchBillingPaper, 
  fetchSvEmailAssociation 
} from '../../redux/actions/ProfileActionSuite';
import { Padding, Color, FontFamily } from "../../../GlobalStyles";

const Notifications = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute();

  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [updatedSection, setUpdatedSection] = useState('');
  const [screenReaderEnabled, setScreenReaderEnabled] = useState(false);

  const profile = useSelector(state => state.combinedReducers.profile || {});
  const { transformedNotification, data, emailAddress, isEmailVerified, isPrimary, isAdmin, acknowledgement, additionalSettings, isDisabled, notificationsTitle, infoText } = fetchInitialData(profile);

  useEffect(() => {
    handleAccessibility(setScreenReaderEnabled);
    dispatch(fetchProfileDetails());
    dispatch(fetchSMSSelection());
    dispatch(fetchPushNotifications());
    dispatch(fetchBillingPaper());
    dispatch(fetchSvEmailAssociation());
  }, [dispatch]);

  useEffect(() => {
    handleUpdateSuccess(route, dispatch, navigation, setUpdatedSection, setSuccessMessage, setShowSuccessAlert);
  }, [route.params, navigation, dispatch]);

  useEffect(() => {
    handleResentNotification(route, setUpdatedSection, setSuccessMessage, setShowSuccessAlert, navigation);
  }, [route.params, navigation]);

  return (
    <View style={styles.notifications}>
      <ProfileSettingsHeader title="Notifications" onPressBack={() => navigation.goBack()} />
      <ScrollView>
        <View style={styles.notificationsInner}>
          <NotificationSection
            title="Text Notifications"
            successMessage={successMessage}
            showNotification={updatedSection === 'Text'}
            showSuccessAlert={showSuccessAlert}
            setShowSuccessAlert={setShowSuccessAlert}
            isDisabled={false}
            notificationsTitle="No mobile phone number on file"
            infoText={data.phoneNum ? (<Text>Text alerts are sent to <Text style={styles.boldText}>{data.phoneNum}</Text></Text>) : ''}
            transformedData={data}
            navigationTarget="TextNotifications"
            additionalSettings={data.subscriptionDetails}
            isAdmin={isAdmin}
            screenReaderEnabled={screenReaderEnabled}
            isEmailVerified={isEmailVerified}
            dispatch={dispatch}
            acknowledgement={acknowledgement}
            isPrimary={isPrimary}
          />

          <NotificationSection
            title="Email Notifications"
            successMessage={successMessage}
            showNotification={updatedSection === 'Email'}
            showSuccessAlert={showSuccessAlert}
            setShowSuccessAlert={setShowSuccessAlert}
            isDisabled={isDisabled}
            notificationsTitle={notificationsTitle}
            infoText={infoText}
            email={emailAddress}
            navigationTarget="EmailNotifications"
            transformedData={additionalSettings}  // Ensure this is passed correctly
            additionalSettings={additionalSettings}  // Ensure this is passed correctly
            isAdmin={isAdmin}
            screenReaderEnabled={screenReaderEnabled}
            isEmailVerified={isEmailVerified}
            dispatch={dispatch}
            acknowledgement={acknowledgement}
            isPrimary={isPrimary}
          />

          <NotificationSection
            title="In-App Notifications"
            successMessage={successMessage}
            showNotification={updatedSection === 'App'}
            showSuccessAlert={showSuccessAlert}
            setShowSuccessAlert={setShowSuccessAlert}
            isDisabled={false}
            notificationsTitle="Mobile No is missing"
            infoText="Notifications sent from your application."
            navigationTarget="InAppNotifications"
            transformedData={transformedNotification}
            additionalSettings={transformedNotification}
            isAdmin={false}
            screenReaderEnabled={screenReaderEnabled}
            isEmailVerified={isEmailVerified}
            dispatch={dispatch}
            acknowledgement={acknowledgement}
            isPrimary={isPrimary}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  notifications: {
    backgroundColor: Color.colorWhitesmoke_200,
  },
  notificationsInner: {
    paddingVertical: Padding.p_5xl,
    paddingHorizontal: Padding.p_base,
    marginBottom: 200
  },
  boldText: {
    fontWeight: '600',
    fontFamily: FontFamily.openSansRegular, // Assuming you have a bold version of the font
    color: Color.colorGray_100, // Match this to the surrounding text color if needed
  },
});

export default Notifications;