// notificationHelpers.js

import { AccessibilityInfo } from 'react-native';
import { transformResponse, transformNotificationPreferences, isPrimaryAdmin, isAdminRole, extractAcknowledgementEmail } from '../../components/utility/constant';
import { fetchBillingPaper, fetchProfileDetails, fetchSMSSelection, fetchPushNotifications, fetchSvEmailAssociation } from '../../redux/actions/ProfileActionSuite';

export const fetchInitialData = (profile) => {
  const smsSubscription = profile.smsSubscription || [];
  const profileDetails = profile.profileDetails || {};
  const paperLessInfo = profile.paperLessInfo || {};
  const transformedNotification = transformNotificationPreferences(profile.pushNotifications || {});
  const data = transformResponse(smsSubscription);
  const emailAddress = paperLessInfo.emailAddress || '';
  const isEmailVerified = paperLessInfo.emailStatus === 'Verified';
  const isPrimary = isPrimaryAdmin(profileDetails.memberType);
  const isAdmin = isAdminRole(profileDetails.memberType);
  const acknowledgement = extractAcknowledgementEmail(paperLessInfo);
  const allSvEmailAssociated = profile.allSvEmailAssociated || [];

  // Determine settings status
  let anySettingOn = false;
  let multipleEmailsOn = false;
  const emailsWithOnSettings = [];

  Array.isArray(allSvEmailAssociated) && allSvEmailAssociated.forEach(setting => {
    if (setting && (setting.invoice || setting.marketing || setting.collection || setting.iptv || setting.tiVo)) {
      anySettingOn = true;
      setting.emailAddress && emailsWithOnSettings.push(setting.emailAddress);
    }
  });

  multipleEmailsOn = emailsWithOnSettings.length > 1;

  // Additional settings array
  const additionalSettings = [
    { type: 'Critical notifications', status: !!profileDetails?.svEmailAddress ? 'On' : 'Off' },
    { type: 'Paperless Billing', status: allSvEmailAssociated?.some(setting => setting?.invoice) ? 'On' : 'Off' },
    { type: 'Sparklight Emails', status: allSvEmailAssociated?.some(setting => setting?.marketing) ? 'On' : 'Off' },
    { type: 'IPTV Notifications', status: allSvEmailAssociated?.some(setting => setting?.iptv) ? 'On' : 'Off' },
  ];

  // Notification title and info text
  let notificationsTitle = '', infoText = '', isDisabled = false;
  if (multipleEmailsOn) {
    isDisabled = true;
    notificationsTitle = "";
    infoText = "Multiple emails associated with this account";
  } else if (profileDetails.multipleEmails) {
    isDisabled = true;
    notificationsTitle = "Unable to retrieve email address.";
    infoText = "We are not able to retrieve the email address for your account. Please contact us for assistance.";
  } else if (!profileDetails.multipleEmails && (emailAddress || acknowledgement)) {
    notificationsTitle = isEmailVerified ? '' : 'Email verification pending';
    infoText = isEmailVerified ? `Emails are sent to ${emailAddress}` : `${acknowledgement} is awaiting confirmation.`;
  }

  return {
    transformedNotification,
    data,
    emailAddress,
    isEmailVerified,
    isPrimary,
    isAdmin,
    acknowledgement,
    additionalSettings,
    isDisabled,
    notificationsTitle,
    infoText,
    multipleEmailsOn,
  };
};

export const handleUpdateSuccess = (route, dispatch, navigation, setUpdatedSection, setSuccessMessage, setShowSuccessAlert) => {
  if (route.params?.updateSuccess) {
    const updatedType = route.params.updatedType || 'Notification';
    switch (updatedType) {
      case 'Email':
        dispatch(fetchBillingPaper());
        dispatch(fetchProfileDetails());
        dispatch(fetchSvEmailAssociation());
        break;
      case 'Text':
        dispatch(fetchSMSSelection());
        break;
      case 'App':
        dispatch(fetchPushNotifications());
        break;
      default:
        dispatch(fetchProfileDetails());
        dispatch(fetchBillingPaper());
        dispatch(fetchProfileDetails());
        dispatch(fetchPushNotifications());
        dispatch(fetchSvEmailAssociation());
    }
    setUpdatedSection(updatedType);
    setSuccessMessage(`${updatedType} settings have been updated successfully.`);
    setShowSuccessAlert(true);
    navigation.setParams({ updateSuccess: undefined, updatedType: undefined });
  }
};

export const handleResentNotification = (route, setUpdatedSection, setSuccessMessage, setShowSuccessAlert, navigation) => {
  if (route.params?.resentNotification) {
    const updatedType = route.params.updatedType;
    setUpdatedSection('Email');
    setSuccessMessage(updatedType ? 'Verification email resent' : 'Resend failed. Try again');
    setShowSuccessAlert(true);
    navigation.setParams({ resentNotification: undefined, updatedType: undefined });
  }
};

export const handleAccessibility = async (setScreenReaderEnabled) => {
  try {
    const accessibility = await AccessibilityInfo.isScreenReaderEnabled();
    setScreenReaderEnabled(accessibility);
  } catch (error) {
    console.log("AccessibilityInfo error: ", error.message);
    setScreenReaderEnabled(false);
  }
};