import { Linking } from 'react-native';
import analytics from '@react-native-firebase/analytics';
import DeviceInfo from 'react-native-device-info';

export const compareVersions = (version1, version2) => {
  const v1Parts = version1.split('.').map(Number);
  const v2Parts = version2.split('.').map(Number);

  for (let i = 0; i < 3; i++) {
    const v1 = v1Parts[i] || 0;
    const v2 = v2Parts[i] || 0;

    if (v1 > v2) return 1;
    if (v1 < v2) return -1;
  }

  return 0;
};

export const isVersionInRange = (currentVersion, minVersion, maxVersion) => {
  const isAboveMin = compareVersions(currentVersion, minVersion) >= 0;
  const isBelowMax = compareVersions(currentVersion, maxVersion) <= 0;
  return isAboveMin && isBelowMax;
};

export const checkUserStatusEligibility = (userStatus, allowedStatuses) => {
  if (!allowedStatuses || allowedStatuses.length === 0) {
    return true;
  }
  return allowedStatuses.includes(userStatus);
};

export const isWithinTimeWindow = (startDate, windowDays) => {
  if (!startDate || !windowDays) {
    return true;
  }

  try {
    const now = new Date();
    const start = new Date(startDate);
    const daysSinceStart = (now - start) / (1000 * 60 * 60 * 24);
    return daysSinceStart >= 0 && daysSinceStart <= windowDays;
  } catch (error) {
    console.error('[announcementHelpers] Error checking time window:', error);
    return false;
  }
};

export const isCampaignEligible = (campaign, userInfo, currentVersion) => {
  if (!campaign.enabled) {
    return false;
  }

  if (campaign.targeting?.minAppVersion && campaign.targeting?.maxAppVersion) {
    if (!isVersionInRange(
      currentVersion,
      campaign.targeting.minAppVersion,
      campaign.targeting.maxAppVersion
    )) {
      return false;
    }
  }

  if (campaign.targeting?.userStatus) {
    const userStatus = userInfo?.acctStatus || userInfo?.accountStatus;
    if (!checkUserStatusEligibility(userStatus, campaign.targeting.userStatus)) {
      return false;
    }
  }

  if (campaign.targeting?.campaignStartDate && campaign.targeting?.showOnlyOnceWindowDays) {
    if (!isWithinTimeWindow(
      campaign.targeting.campaignStartDate,
      campaign.targeting.showOnlyOnceWindowDays
    )) {
      return false;
    }
  }

  return true;
};

export const navigateToDestination = (navigationConfig, navigationRef) => {
  if (!navigationConfig) return;

  const { type, destination, params } = navigationConfig;

  try {
    switch (type) {
      case 'tab':
        navigationRef.current?.navigate('MyTab', {
          screen: destination,
          params,
        });
        console.log(`[announcementHelpers] Navigating to tab: ${destination}`);
        break;

      case 'screen':
        navigationRef.current?.navigate(destination, params);
        console.log(`[announcementHelpers] Navigating to screen: ${destination}`);
        break;

      case 'deep_link':
        Linking.openURL(destination);
        console.log(`[announcementHelpers] Opening deep link: ${destination}`);
        break;

      case 'external':
        Linking.openURL(destination);
        console.log(`[announcementHelpers] Opening external URL: ${destination}`);
        break;

      case 'none':
      default:
        console.log('[announcementHelpers] No navigation configured');
        break;
    }
  } catch (error) {
    console.error('[announcementHelpers] Navigation error:', error);
  }
};

export const trackAnnouncementEvent = async (eventName, data) => {
  try {
    await analytics().logEvent(eventName, {
      timestamp: new Date().toISOString(),
      app_version: DeviceInfo.getVersion(),
      ...data,
    });
    console.log(`[Analytics] ${eventName}:`, data);
  } catch (error) {
    console.error('[announcementHelpers] Analytics error:', error);
  }
};

export const trackAnnouncementImpression = (campaignId, triggerType) => {
  trackAnnouncementEvent('feature_announcement_viewed', {
    campaign_id: campaignId,
    trigger_type: triggerType,
  });
};

export const trackStepViewed = (campaignId, stepNumber, stepTitle) => {
  trackAnnouncementEvent('feature_announcement_step_viewed', {
    campaign_id: campaignId,
    step_number: stepNumber,
    step_title: stepTitle,
  });
};

export const trackAnnouncementCompletion = (campaignId, totalSteps, timeSpentSeconds) => {
  trackAnnouncementEvent('feature_announcement_completed', {
    campaign_id: campaignId,
    total_steps: totalSteps,
    time_spent_seconds: timeSpentSeconds,
  });
};

export const trackAnnouncementDismissal = (campaignId, dismissedAtStep) => {
  trackAnnouncementEvent('feature_announcement_dismissed', {
    campaign_id: campaignId,
    dismissed_at_step: dismissedAtStep + 1,
  });
};

export const formatDate = (isoDate) => {
  try {
    const date = new Date(isoDate);
    return date.toLocaleDateString();
  } catch (error) {
    return '';
  }
};

export const getDaysSince = (isoDate) => {
  try {
    const date = new Date(isoDate);
    const now = new Date();
    return Math.floor((now - date) / (1000 * 60 * 60 * 24));
  } catch (error) {
    return 0;
  }
};