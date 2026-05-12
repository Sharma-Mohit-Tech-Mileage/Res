const mockLogEvent = jest.fn().mockResolvedValue(undefined);

jest.mock('@react-native-firebase/analytics', () => {
  return () => ({
    logEvent: mockLogEvent,
  });
});

jest.mock('react-native', () => {
  return {
    Platform: {
      OS: 'ios',
    },
    AccessibilityInfo: {
      setAccessibilityFocus: jest.fn(),
      sendAccessibilityEvent: jest.fn(),
    },
    Linking: {
      openURL: jest.fn(),
    },
    findNodeHandle: jest.fn(),
  };
});

import { Linking } from 'react-native';
import {
  compareVersions,
  isDateInRange,
  isCampaignEligible,
  navigateToDestination,
  trackAnnouncementImpression,
} from '../../src/utils/announcementHelpers';

describe('announcementHelpers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers().setSystemTime(new Date('2026-04-27T00:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('compares versions correctly', () => {
    expect(compareVersions('1.2.0', '1.1.9')).toBe(1);
    expect(compareVersions('1.2.0', '1.2.0')).toBe(0);
    expect(compareVersions('1.2.0', '2.0.0')).toBe(-1);
  });

  it('validates date ranges', () => {
    expect(isDateInRange(null, null)).toBe(true);
    expect(isDateInRange('2026-04-01', '2026-05-01')).toBe(true);
    expect(isDateInRange('2026-05-01', null)).toBe(false);
    expect(isDateInRange(null, '2026-04-01')).toBe(false);
  });

  it('evaluates campaign eligibility', () => {
    expect(isCampaignEligible(null)).toBe(false);
    expect(isCampaignEligible({ enabled: false })).toBe(false);
    expect(isCampaignEligible({ enabled: true })).toBe(true);

    const campaign = {
      enabled: true,
      targeting: {
        startDate: '2026-04-01',
        endDate: '2026-05-01',
        minAppVersion: '1.0.0',
        maxAppVersion: '2.0.0',
        userSegments: ['premium'],
      },
    };

    expect(isCampaignEligible(campaign, { segment: 'premium' }, '1.5.0')).toBe(true);
    expect(isCampaignEligible(campaign, { segment: 'free' }, '1.5.0')).toBe(false);
    expect(isCampaignEligible(campaign, { segment: 'premium' }, '0.9.0')).toBe(false);
    expect(isCampaignEligible(campaign, { segment: 'premium' }, '3.0.0')).toBe(false);
  });

  it('tracks impression analytics', async () => {
    await trackAnnouncementImpression('cmp-1', 'app_open');
    expect(mockLogEvent).toHaveBeenCalledWith(
      'feature_announcement_impression',
      expect.objectContaining({
        campaign_id: 'cmp-1',
        trigger_type: 'app_open',
      })
    );
  });

  it('navigates to screen/tab/external destinations', () => {
    const navigate = jest.fn();
    const navigationRef = { current: { navigate } };

    navigateToDestination(
      { type: 'screen', destination: 'Profile', params: { a: 1 } },
      navigationRef
    );
    expect(navigate).toHaveBeenCalledWith('Profile', { a: 1 });

    navigate.mockClear();
    navigateToDestination(
      { type: 'tab', destination: 'HomeTab', params: { from: 'test' } },
      navigationRef
    );
    expect(navigate).toHaveBeenCalledWith('MyTab', {
      screen: 'HomeTab',
      params: { from: 'test' },
    });

    navigateToDestination(
      { type: 'external', destination: 'https://example.com' },
      navigationRef
    );
    expect(Linking.openURL).toHaveBeenCalledWith('https://example.com');
  });
});
