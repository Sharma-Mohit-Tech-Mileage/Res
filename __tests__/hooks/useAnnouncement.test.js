import React from 'react';
import renderer, { act } from 'react-test-renderer';

const mockUseSelector = jest.fn();
const mockShowAnnouncement = jest.fn().mockResolvedValue(undefined);

const mockGetEligibleCampaign = jest.fn();
const mockGetCampaignById = jest.fn();
const mockResetCampaign = jest.fn().mockResolvedValue(undefined);
const mockResetAllCampaigns = jest.fn().mockResolvedValue(undefined);

jest.mock('react-redux', () => ({
  useSelector: (...args) => mockUseSelector(...args),
}));

jest.mock('../../src/contexts/AnnouncementContext', () => ({
  useAnnouncementContext: () => ({
    showAnnouncement: (...args) => mockShowAnnouncement(...args),
  }),
}));

jest.mock('../../src/manager/AnnouncementManager', () => ({
  getEligibleCampaign: (...args) => mockGetEligibleCampaign(...args),
  getCampaignById: (...args) => mockGetCampaignById(...args),
  resetCampaign: (...args) => mockResetCampaign(...args),
  resetAllCampaigns: (...args) => mockResetAllCampaigns(...args),
}));

import useAnnouncement from '../../src/hooks/useAnnouncement';

function HookHarness({ onReady }) {
  const api = useAnnouncement();
  onReady(api);
  return null;
}

describe('useAnnouncement', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSelector.mockImplementation(selector =>
      selector({ user: { userData: { userInfo: { id: 'u1' } } } })
    );
  });

  it('triggers screen entry announcement when eligible campaign exists', async () => {
    const campaign = { id: 'cmp-screen' };
    mockGetEligibleCampaign.mockResolvedValueOnce(campaign);

    let api;
    renderer.create(<HookHarness onReady={value => (api = value)} />);

    await act(async () => {
      await api.triggerOnScreenEntry('Home');
    });

    expect(mockGetEligibleCampaign).toHaveBeenCalledWith('screen_entry', 'Home', { id: 'u1' });
    expect(mockShowAnnouncement).toHaveBeenCalledWith(campaign, 'screen_entry');
  });

  it('triggers app launch announcement and manual campaign path', async () => {
    const appLaunchCampaign = { id: 'cmp-app' };
    const manualCampaign = { id: 'cmp-manual' };
    mockGetEligibleCampaign.mockResolvedValueOnce(appLaunchCampaign);
    mockGetCampaignById.mockReturnValueOnce(manualCampaign);

    let api;
    renderer.create(<HookHarness onReady={value => (api = value)} />);

    await act(async () => {
      await api.triggerOnAppLaunch();
      await api.triggerCampaign('cmp-manual');
    });

    expect(mockGetEligibleCampaign).toHaveBeenCalledWith('app_launch', null, { id: 'u1' });
    expect(mockShowAnnouncement).toHaveBeenCalledWith(appLaunchCampaign, 'app_launch');
    expect(mockGetCampaignById).toHaveBeenCalledWith('cmp-manual');
    expect(mockShowAnnouncement).toHaveBeenCalledWith(manualCampaign, 'manual');
  });

  it('handles missing campaigns and reset actions', async () => {
    mockGetEligibleCampaign.mockResolvedValueOnce(null);
    mockGetCampaignById.mockReturnValueOnce(null);

    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    let api;
    renderer.create(<HookHarness onReady={value => (api = value)} />);

    await act(async () => {
      await api.triggerOnScreenEntry('BillingTab');
      await api.triggerCampaign('missing-id');
      await api.resetCampaign('cmp-reset');
      await api.resetAllCampaigns();
    });

    expect(mockShowAnnouncement).not.toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalled();
    expect(mockResetCampaign).toHaveBeenCalledWith('cmp-reset');
    expect(mockResetAllCampaigns).toHaveBeenCalled();

    warnSpy.mockRestore();
  });

  it('swallows errors and logs for trigger methods', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockGetEligibleCampaign.mockRejectedValueOnce(new Error('screen-fail'));

    let api;
    renderer.create(<HookHarness onReady={value => (api = value)} />);

    await act(async () => {
      await api.triggerOnScreenEntry('Support');
    });

    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});
