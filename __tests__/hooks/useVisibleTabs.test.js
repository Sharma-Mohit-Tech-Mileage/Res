import React from 'react';
import renderer from 'react-test-renderer';

const mockUseSelector = jest.fn();

jest.mock('react-redux', () => ({
  useSelector: (...args) => mockUseSelector(...args),
}));

const mockGetVisibleTabs = jest.fn();

jest.mock('../../src/config/TabConfiguration', () => ({
  getVisibleTabs: (...args) => mockGetVisibleTabs(...args),
}));

import { useFeatureFlags, useVisibleTabs } from '../../src/hooks/useVisibleTabs';

function HookHarness({ onValue }) {
  const tabs = useVisibleTabs();
  const flags = useFeatureFlags();
  onValue({ tabs, flags });
  return null;
}

describe('useVisibleTabs hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSelector.mockImplementation(selector =>
      selector({ user: { userData: { userInfo: { id: 'u1' } } } })
    );
    mockGetVisibleTabs.mockReturnValue([
      { id: 'home', screenName: 'Home' },
      { id: 'billing', screenName: 'BillingTab' },
    ]);
  });

  it('returns indexed visible tabs and default feature flags', () => {
    const onValue = jest.fn();
    renderer.create(<HookHarness onValue={onValue} />);

    expect(mockGetVisibleTabs).toHaveBeenCalledWith(
      { id: 'u1' },
      { enableServices: false, disableBilling: false }
    );

    const value = onValue.mock.calls[0][0];
    expect(value.tabs).toEqual([
      { id: 'home', screenName: 'Home', index: 0 },
      { id: 'billing', screenName: 'BillingTab', index: 1 },
    ]);
    expect(value.flags).toEqual({ enableServices: false, disableBilling: false });
  });
});
