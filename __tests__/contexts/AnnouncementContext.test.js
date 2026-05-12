import React from 'react';
import renderer, { act } from 'react-test-renderer';

let mockModalProps = null;

jest.mock('../../src/components/feature/AnnouncementModal', () => {
  const ReactLocal = require('react');
  return function MockAnnouncementModal(props) {
    mockModalProps = props;
    return ReactLocal.createElement(ReactLocal.Fragment, null);
  };
});

const mockMarkAsShown = jest.fn().mockResolvedValue(undefined);
const mockMarkAsCompleted = jest.fn().mockResolvedValue(undefined);
const mockMarkAsDismissed = jest.fn().mockResolvedValue(undefined);

jest.mock('../../src/manager/AnnouncementPersistence', () => ({
  markAsShown: (...args) => mockMarkAsShown(...args),
  markAsCompleted: (...args) => mockMarkAsCompleted(...args),
  markAsDismissed: (...args) => mockMarkAsDismissed(...args),
}));

const mockTrackImpression = jest.fn();
const mockTrackCompletion = jest.fn();
const mockTrackDismissal = jest.fn();
const mockNavigateToDestination = jest.fn();

jest.mock('../../src/utils/announcementHelpers', () => ({
  trackAnnouncementImpression: (...args) => mockTrackImpression(...args),
  trackAnnouncementCompletion: (...args) => mockTrackCompletion(...args),
  trackAnnouncementDismissal: (...args) => mockTrackDismissal(...args),
  navigateToDestination: (...args) => mockNavigateToDestination(...args),
}));

jest.mock('../../src/navigations/UserNavigations', () => ({
  navigationRef: { current: { navigate: jest.fn() } },
}));

import {
  AnnouncementProvider,
  useAnnouncementContext,
} from '../../src/contexts/AnnouncementContext';

function Consumer({ onValue }) {
  const value = useAnnouncementContext();
  onValue(value);
  return null;
}

describe('AnnouncementContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockModalProps = null;
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('throws when useAnnouncementContext used outside provider', () => {
    const Thrower = () => {
      useAnnouncementContext();
      return null;
    };

    expect(() => renderer.create(<Thrower />)).toThrow(
      'useAnnouncementContext must be used within AnnouncementProvider'
    );
  });

  it('shows announcement and marks impression', async () => {
    let ctx;
    renderer.create(
      <AnnouncementProvider>
        <Consumer onValue={value => (ctx = value)} />
      </AnnouncementProvider>
    );

    const campaign = {
      id: 'cmp-1',
      content: { steps: [{ id: 1 }, { id: 2 }] },
      navigation: { onComplete: { type: 'screen', destination: 'Support' } },
    };

    await act(async () => {
      await ctx.showAnnouncement(campaign, 'app_launch');
    });

    expect(mockMarkAsShown).toHaveBeenCalledWith('cmp-1');
    expect(mockTrackImpression).toHaveBeenCalledWith('cmp-1', 'app_launch');
    expect(mockModalProps.visible).toBe(true);
    expect(mockModalProps.campaign.id).toBe('cmp-1');
  });

  it('completes announcement and navigates on timer', async () => {
    let ctx;
    renderer.create(
      <AnnouncementProvider>
        <Consumer onValue={value => (ctx = value)} />
      </AnnouncementProvider>
    );

    const campaign = {
      id: 'cmp-2',
      content: { steps: [{ id: 1 }, { id: 2 }, { id: 3 }] },
      navigation: { onComplete: { type: 'screen', destination: 'Home' } },
    };

    await act(async () => {
      await ctx.showAnnouncement(campaign, 'screen_entry');
    });

    await act(async () => {
      await mockModalProps.onComplete(9);
    });

    expect(mockMarkAsCompleted).toHaveBeenCalledWith('cmp-2');
    expect(mockTrackCompletion).toHaveBeenCalledWith('cmp-2', 3, 9);

    act(() => {
      jest.advanceTimersByTime(350);
    });

    expect(mockNavigateToDestination).toHaveBeenCalledWith(
      campaign.navigation.onComplete,
      expect.any(Object)
    );
  });

  it('handles dismiss and learn-more callbacks', async () => {
    let ctx;
    renderer.create(
      <AnnouncementProvider>
        <Consumer onValue={value => (ctx = value)} />
      </AnnouncementProvider>
    );

    const campaign = {
      id: 'cmp-3',
      content: { steps: [{ id: 's1' }] },
    };

    await act(async () => {
      await ctx.showAnnouncement(campaign, 'manual');
    });

    await act(async () => {
      await mockModalProps.onDismiss(1);
    });
    expect(mockMarkAsDismissed).toHaveBeenCalledWith('cmp-3', 1);
    expect(mockTrackDismissal).toHaveBeenCalledWith('cmp-3', 1);

    await act(async () => {
      await ctx.showAnnouncement(campaign, 'manual');
      await mockModalProps.onLearnMoreNavigate({ type: 'external', destination: 'https://example.com' });
    });

    expect(mockMarkAsCompleted).toHaveBeenCalledWith('cmp-3');
    expect(mockTrackCompletion).toHaveBeenCalledWith('cmp-3', 1, 0);

    act(() => {
      jest.advanceTimersByTime(350);
    });

    expect(mockNavigateToDestination).toHaveBeenCalledWith(
      { type: 'external', destination: 'https://example.com' },
      expect.any(Object)
    );
  });
});
