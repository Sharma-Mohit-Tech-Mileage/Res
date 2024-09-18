// notificationHelpers.js

import { AccessibilityInfo, Text } from 'react-native';
import { transformResponse, transformNotificationPreferences, isPrimaryAdmin, isAdminRole, extractAcknowledgementEmail } from '../../components/utility/constant';
import { fetchBillingPaper, fetchProfileDetails, fetchSMSSelection, fetchPushNotifications, fetchSvEmailAssociation } from '../../redux/actions/ProfileActionSuite';

export const fetchInitialData = (profile) => {
  const { smsSubscription = [], profileDetails = {}, paperLessInfo = {}, allSvEmailAssociated = [] } = profile;
  const transformedNotification = transformNotificationPreferences(profile.pushNotifications || {});
  const data = transformResponse(smsSubscription);
  const isEmailVerified = paperLessInfo.emailStatus === 'Verified';
  const isPrimary = isPrimaryAdmin(profileDetails.memberType);
  const isAdmin = isAdminRole(profileDetails.memberType);
  const acknowledgement = extractAcknowledgementEmail(paperLessInfo);
  const emailsWithOnSettings = [];

  let paperlessStatus = ((paperLessInfo.paperlessStatus === "Processing") || 
                      (paperLessInfo.emailStatus === "Pending")) &&
                      (acknowledgement && Object.values(acknowledgement).some(value => typeof value === 'string' && value.includes('@')));
  let emailAddress = '';
  let multipleEmailsOn = false;

  // Select email based on priority: invoice first, then marketing
  const invoiceEmail = allSvEmailAssociated.find(setting => setting.invoice)?.emailAddress;
  const marketingEmail = allSvEmailAssociated.find(setting => setting.marketing)?.emailAddress;
  emailAddress = invoiceEmail || marketingEmail || '';

  // Determine if multiple emails are associated with active settings
  allSvEmailAssociated.forEach(setting => {
    if (setting.invoice || setting.marketing || setting.iptv) {
      setting.emailAddress && emailsWithOnSettings.push(setting.emailAddress);
    }
  });
  multipleEmailsOn = emailsWithOnSettings.length > 1;

  // Prepare additional settings, conditionally add Sparklight TV
  const additionalSettings = [
    { type: 'Critical notifications', status: emailsWithOnSettings.length > 0 ? 'On' : 'Off', warn: false },
    { type: 'Paperless Billing', status: allSvEmailAssociated.some(setting => setting.invoice) ? 'On' : 'Off', warn: paperlessStatus },
    { type: 'Marketing Communications', status: allSvEmailAssociated.some(setting => setting.marketing) ? 'On' : 'Off', warn: false },
  ];

  if (allSvEmailAssociated.some(setting => setting.iptv)) {
    additionalSettings.push({ type: 'Sparklight TV', status: 'On', warn: false });
  }

  // Set notification and info text based on email status
  let notificationsTitle = '', infoText = '', isDisabled = false;
  if (paperlessStatus) {
    infoText = "There is a problem with an email address on this account.";
    isDisabled = false;
  } else if (multipleEmailsOn) {
    infoText = "Multiple emails associated with this account";
    isDisabled = false;
  } else if (emailAddress) {
    infoText = isEmailVerified ? <Text>Emails are sent to <Text style={{ fontWeight: 'bold' }}>{emailAddress}</Text></Text> : "";
    isDisabled = false;
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