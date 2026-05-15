import analytics from '@react-native-firebase/analytics';
import { Linking } from 'react-native';

export const compareVersions = (v1, v2) => {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);

  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const num1 = parts1[i] || 0;
    const num2 = parts2[i] || 0;

    if (num1 > num2) return 1;
    if (num1 < num2) return -1;
  }

  return 0;
};

export const isDateInRange = (startDate, endDate) => {
  if (!startDate && !endDate) return true;

  const now = new Date();

  if (startDate) {
    const start = new Date(startDate);
    if (now < start) {
      return false;
    }
  }

  if (endDate) {
    const end = new Date(endDate);
    if (now > end) {
      return false;
    }
  }

  return true;
};

export const isCampaignEligible = (campaign, userInfo = {}, currentVersion = '1.0.0') => {
  if (!campaign || !campaign.enabled) {
    return false;
  }

  const { targeting } = campaign;

  if (!targeting) {
    return true;
  }

  // Time window check
  if (!isDateInRange(targeting.startDate, targeting.endDate)) {
    return false;
  }

  // Version requirements
  if (targeting.minAppVersion) {
    if (compareVersions(currentVersion, targeting.minAppVersion) < 0) {
      return false;
    }
  }

  if (targeting.maxAppVersion) {
    if (compareVersions(currentVersion, targeting.maxAppVersion) > 0) {
      return false;
    }
  }

  if (targeting.platforms && targeting.platforms.length > 0) {
    const platform = require('react-native').Platform.OS;
    if (!targeting.platforms.includes(platform)) {
      return false;
    }
  }

  if (targeting.userSegments && targeting.userSegments.length > 0) {
    const userSegment = userInfo?.segment || 'default';
    if (!targeting.userSegments.includes(userSegment)) {
      return false;
    }
  }

  return true;
};

export const trackAnnouncementImpression = async (campaignId, triggerType) => {
  try {
    await analytics().logEvent('feature_announcement_impression', {
      campaign_id: campaignId,
      trigger_type: triggerType,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Analytics] Error tracking impression:', error);
  }
};

export const trackStepViewed = async (campaignId, stepNumber, stepTitle) => {
  try {
    await analytics().logEvent('feature_announcement_step_viewed', {
      campaign_id: campaignId,
      step_number: stepNumber,
      step_title: stepTitle,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Analytics] Error tracking step view:', error);
  }
};

export const trackAnnouncementCompletion = async (campaignId, totalSteps, timeSpentSeconds) => {
  try {
    await analytics().logEvent('feature_announcement_completed', {
      campaign_id: campaignId,
      total_steps: totalSteps,
      time_spent_seconds: timeSpentSeconds,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Analytics] Error tracking completion:', error);
  }
};

export const trackAnnouncementDismissal = async (campaignId, dismissedAtStep) => {
  try {
    await analytics().logEvent('feature_announcement_dismissed', {
      campaign_id: campaignId,
      dismissed_at_step: dismissedAtStep,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Analytics] Error tracking dismissal:', error);
  }
};

export const navigateToDestination = (navConfig, navigationRef) => {
  if (!navConfig || !navigationRef?.current) return;

  const { type, destination, params, childScreen } = navConfig;

  try {
    switch (type) {
      case 'tab':
        if (childScreen) {
          // First navigate to the tab to ensure the stack is mounted
          navigationRef.current.navigate('MyTab', {
            screen: destination,
          });
          // Then navigate to the child screen after the tab stack initializes
          setTimeout(() => {
            if (navigationRef?.current) {
              navigationRef.current.navigate('MyTab', {
                screen: destination,
                params: {
                  screen: childScreen,
                  ...(params && { params }),
                },
              });
            }
          }, 400);
        } else {
          navigationRef.current.navigate('MyTab', {
            screen: destination,
            ...(params && { params }),
          });
        }
        break;
      case 'screen':
        navigationRef.current.navigate(destination, params);
        break;
      case 'external':
      case 'deep_link':
        Linking.openURL(destination);
        break;
      default:
        console.warn(`[AnnouncementHelpers] Unknown navigation type: ${type}`);
    }
  } catch (error) {
    console.error('[AnnouncementHelpers] Navigation error:', error);
  }
};