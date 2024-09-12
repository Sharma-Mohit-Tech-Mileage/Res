// notificationHelpers.js

import { AccessibilityInfo, Text } from 'react-native';
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
  const emailsWithOnSettings = [];
  let paperlessStatus = ((paperLessInfo.paperlessStatus === "Processing") || 
                      (paperLessInfo.emailStatus === "Pending")) &&
                      (acknowledgement && Object.values(acknowledgement).some(value => typeof value === 'string' && value.includes('@')));
  let anySettingOn = false;
  let multipleEmailsOn = false;
  let notificationsTitle = '', infoText = '', isDisabled = false;
  Array.isArray(allSvEmailAssociated) && allSvEmailAssociated.forEach(setting => {
    if (setting && (setting.invoice || setting.marketing || setting.iptv)) {
      anySettingOn = true;
      setting.emailAddress && emailsWithOnSettings.push(setting.emailAddress);
    }
  });

  multipleEmailsOn = emailsWithOnSettings.length > 1;

  // Additional settings array with conditional Sparklight TV
  const additionalSettings = [
    { type: 'Critical notifications', status: emailsWithOnSettings.length>0? 'On' : 'Off' ,warn :false},
    { type: 'Paperless Billing', status: allSvEmailAssociated?.some(setting => setting?.invoice) ? 'On' : 'Off' ,warn:paperlessStatus},
    { type: 'Marketing Communications', status: allSvEmailAssociated?.some(setting => setting?.marketing) ? 'On' : 'Off' ,warn:false},
  ];

  // Conditionally add Sparklight TV setting
  const sparklightTVStatus = allSvEmailAssociated?.some(setting => setting?.iptv);
  if (sparklightTVStatus) {
    additionalSettings.push({ type: 'Sparklight TV', status: 'On',warn:false });
  }

  if (paperlessStatus) {
    infoText = "There is a problem with an email address on this account.";
    isDisabled = true;
} else if (multipleEmailsOn) {
    isDisabled = true;
    notificationsTitle = "";
    infoText = "Multiple emails associated with this account";
} else if (emailAddress) {
    infoText = (isEmailVerified && emailAddress)
        ? <Text>Emails are sent to <Text style={{ fontWeight: 'bold' }}>{emailAddress}</Text></Text>
        : "";
    isDisabled = (isEmailVerified && emailAddress) ? false : true;
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