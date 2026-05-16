const mockLogEvent = jest.fn();
const mockOpenURL = jest.fn();

jest.mock('@react-native-firebase/analytics', () => {
  return () => ({
    logEvent: mockLogEvent,
  });
});

jest.mock('react-native', () => ({
  Linking: {
    openURL: mockOpenURL,
  },
  Platform: {
    OS: 'ios',
  },
}));

import { Linking } from 'react-native';
import {
  compareVersions,
  isDateInRange,
  isCampaignEligible,
  trackAnnouncementImpression,
  trackStepViewed,
  trackAnnouncementCompletion,
  trackAnnouncementDismissal,
  navigateToDestination,
} from '../src/utils/announcementHelpers';

describe('announcementHelpers', () => {
  beforeEach(() => {
    Linking.openURL = mockOpenURL;
    mockLogEvent.mockReset();
    mockOpenURL.mockReset();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('compares semantic versions correctly', () => {
    expect(compareVersions('1.2.0', '1.2.0')).toBe(0);
    expect(compareVersions('1.2.1', '1.2.0')).toBe(1);
    expect(compareVersions('1.1.9', '1.2.0')).toBe(-1);
    expect(compareVersions('1.2', '1.2.0')).toBe(0);
  });

  it('checks date ranges correctly', () => {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    expect(isDateInRange(null, null)).toBe(true);
    expect(isDateInRange(new Date(now + oneDay).toISOString(), null)).toBe(false);
    expect(isDateInRange(null, new Date(now - oneDay).toISOString())).toBe(false);
    expect(
      isDateInRange(
        new Date(now - oneDay).toISOString(),
        new Date(now + oneDay).toISOString(),
      ),
    ).toBe(true);
  });

  it('evaluates campaign eligibility with targeting rules', () => {
    const fixedNow = new Date('2026-01-01T12:00:00.000Z');
    jest.useFakeTimers();
    jest.setSystemTime(fixedNow);

    expect(isCampaignEligible(null)).toBe(false);
    expect(isCampaignEligible({ enabled: false })).toBe(false);
    expect(isCampaignEligible({ enabled: true })).toBe(true);

    const baseCampaign = {
      enabled: true,
      targeting: {
        startDate: new Date(Date.now() - 1000).toISOString(),
        endDate: new Date(Date.now() + 1000).toISOString(),
        minAppVersion: '1.0.0',
        maxAppVersion: '2.0.0',
        platforms: ['ios'],
        userSegments: ['premium'],
      },
    };

    expect(isCampaignEligible(baseCampaign, { segment: 'basic' }, '1.5.0')).toBe(false);
    expect(isCampaignEligible(baseCampaign, { segment: 'premium' }, '0.9.0')).toBe(false);
    expect(isCampaignEligible(baseCampaign, { segment: 'premium' }, '2.1.0')).toBe(false);
    expect(isCampaignEligible(baseCampaign, { segment: 'premium' }, '1.5.0')).toBe(true);

    const wrongPlatformCampaign = {
      ...baseCampaign,
      targeting: {
        ...baseCampaign.targeting,
        platforms: ['android'],
      },
    };
    expect(isCampaignEligible(wrongPlatformCampaign, { segment: 'premium' }, '1.5.0')).toBe(false);

    const outOfDateRangeCampaign = {
      ...baseCampaign,
      targeting: {
        ...baseCampaign.targeting,
        startDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      },
    };
    expect(isCampaignEligible(outOfDateRangeCampaign, { segment: 'premium' }, '1.5.0')).toBe(false);

    jest.useRealTimers();
  });

  it('tracks announcement impression analytics event', async () => {
    await trackAnnouncementImpression('camp-1', 'launch');

    expect(mockLogEvent).toHaveBeenCalledTimes(1);
    expect(mockLogEvent).toHaveBeenCalledWith(
      'feature_announcement_impression',
      expect.objectContaining({
        campaign_id: 'camp-1',
        trigger_type: 'launch',
      }),
    );
  });

  it('tracks viewed/completed/dismissed events and handles analytics errors', async () => {
    await trackStepViewed('camp-1', 2, 'Step 2');
    await trackAnnouncementCompletion('camp-1', 4, 35);
    await trackAnnouncementDismissal('camp-1', 3);

    expect(mockLogEvent).toHaveBeenCalledWith(
      'feature_announcement_step_viewed',
      expect.objectContaining({ campaign_id: 'camp-1', step_number: 2, step_title: 'Step 2' }),
    );
    expect(mockLogEvent).toHaveBeenCalledWith(
      'feature_announcement_completed',
      expect.objectContaining({ campaign_id: 'camp-1', total_steps: 4, time_spent_seconds: 35 }),
    );
    expect(mockLogEvent).toHaveBeenCalledWith(
      'feature_announcement_dismissed',
      expect.objectContaining({ campaign_id: 'camp-1', dismissed_at_step: 3 }),
    );

    mockLogEvent.mockRejectedValueOnce(new Error('analytics unavailable'));
    await expect(trackAnnouncementImpression('camp-2', 'launch')).resolves.toBeUndefined();
  });

  it('returns early when nav config or ref is missing', () => {
    const navigationRef = { current: { navigate: jest.fn() } };
    navigateToDestination(null, navigationRef);
    navigateToDestination({ type: 'screen', destination: 'Home' }, null);
    expect(navigationRef.current.navigate).not.toHaveBeenCalled();
  });

  it('navigates to external destination', () => {
    const navigationRef = { current: { navigate: jest.fn() } };

    navigateToDestination(
      {
        type: 'external',
        destination: 'https://example.com',
      },
      navigationRef,
    );

    expect(mockOpenURL).toHaveBeenCalledWith('https://example.com');
    expect(navigationRef.current.navigate).not.toHaveBeenCalled();
  });

  it('navigates to deep links and screen destinations', () => {
    const navigationRef = { current: { navigate: jest.fn() } };

    navigateToDestination(
      {
        type: 'deep_link',
        destination: 'myapp://billing',
      },
      navigationRef,
    );

    navigateToDestination(
      {
        type: 'screen',
        destination: 'ProfileDetails',
        params: { accountId: '123' },
      },
      navigationRef,
    );

    expect(mockOpenURL).toHaveBeenCalledWith('myapp://billing');
    expect(navigationRef.current.navigate).toHaveBeenCalledWith('ProfileDetails', { accountId: '123' });
  });

  it('navigates to tab without child screen', () => {
    const navigate = jest.fn();
    const navigationRef = { current: { navigate } };

    navigateToDestination(
      {
        type: 'tab',
        destination: 'ServicesTab',
        params: { entry: 'banner' },
      },
      navigationRef,
    );

    expect(navigate).toHaveBeenCalledWith('MyTab', {
      screen: 'ServicesTab',
      params: { entry: 'banner' },
    });

    navigate.mockClear();
    navigateToDestination(
      {
        type: 'tab',
        destination: 'ServicesTab',
      },
      navigationRef,
    );
    expect(navigate).toHaveBeenCalledWith('MyTab', {
      screen: 'ServicesTab',
    });
  });

  it('navigates tab then child screen when childScreen is provided', () => {
    jest.useFakeTimers();

    const navigate = jest.fn();
    const navigationRef = { current: { navigate } };

    navigateToDestination(
      {
        type: 'tab',
        destination: 'BillingTab',
        childScreen: 'AutoPay',
        params: { from: 'announcement' },
      },
      navigationRef,
    );

    expect(navigate).toHaveBeenCalledWith('MyTab', {
      screen: 'BillingTab',
    });

    jest.runAllTimers();

    expect(navigate).toHaveBeenNthCalledWith(2, 'MyTab', {
      screen: 'BillingTab',
      params: {
        screen: 'AutoPay',
        params: { from: 'announcement' },
      },
    });

    navigate.mockClear();
    navigateToDestination(
      {
        type: 'tab',
        destination: 'BillingTab',
        childScreen: 'UsageDetails',
      },
      navigationRef,
    );
    jest.runAllTimers();
    expect(navigate).toHaveBeenNthCalledWith(2, 'MyTab', {
      screen: 'BillingTab',
      params: {
        screen: 'UsageDetails',
      },
    });

    const droppedRef = { current: { navigate: jest.fn() } };
    navigateToDestination(
      {
        type: 'tab',
        destination: 'BillingTab',
        childScreen: 'InternetUsage',
      },
      droppedRef,
    );
    droppedRef.current = null;
    jest.runAllTimers();

    jest.useRealTimers();
  });

  it('handles unknown type and navigation errors', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const throwingNavigationRef = {
      current: {
        navigate: jest.fn(() => {
          throw new Error('boom');
        }),
      },
    };

    navigateToDestination({ type: 'unknown', destination: 'X' }, { current: { navigate: jest.fn() } });
    navigateToDestination({ type: 'screen', destination: 'Any' }, throwingNavigationRef);

    expect(warnSpy).toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalled();

    warnSpy.mockRestore();
    errorSpy.mockRestore();
  });
});
