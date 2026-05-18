const React = require('react');
const renderer = require('react-test-renderer');
const { act } = renderer;

const mockDispatch = jest.fn();
let mockState;

jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: (selector) => selector(mockState),
}));

const mockFetchCurrentUsageRequest = jest.fn(() => ({ type: 'FETCH_CURRENT_USAGE_REQUEST' }));
const mockFetchMonthlyUsageRequest = jest.fn(() => ({ type: 'FETCH_MONTHLY_USAGE_REQUEST' }));
const mockFetchDailyUsageRequest = jest.fn((startDate, endDate) => ({
  type: 'FETCH_DAILY_USAGE_REQUEST',
  payload: { startDate, endDate },
}));
const mockFetchUsagePeriodsRequest = jest.fn(() => ({ type: 'FETCH_USAGE_PERIODS_REQUEST' }));
const mockClearDataUsage = jest.fn(() => ({ type: 'CLEAR_DATA_USAGE' }));

jest.mock('../src/redux/actions/servicesActions', () => ({
  fetchCurrentUsageRequest: () => mockFetchCurrentUsageRequest(),
  fetchMonthlyUsageRequest: () => mockFetchMonthlyUsageRequest(),
  fetchDailyUsageRequest: (startDate, endDate) => mockFetchDailyUsageRequest(startDate, endDate),
  fetchUsagePeriodsRequest: () => mockFetchUsagePeriodsRequest(),
  clearDataUsage: () => mockClearDataUsage(),
}));

const { useDataUsage } = require('../src/components/services/hooks/useDataUsage');

const HookProbe = ({ onValue }) => {
  const value = useDataUsage();
  React.useEffect(() => {
    onValue(value);
  }, [value, onValue]);
  return null;
};

describe('useDataUsage hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockState = {
      services: {
        currentUsage: {
          usedDataGB: 34,
          dataPlanGB: 100,
          dataUsedPercent: 34,
        },
        currentUsageLoading: false,
        currentUsageError: null,
        monthlyUsage: [{ month: 'Jan', usedDataGB: 20 }],
        monthlyUsageLoading: false,
        dailyUsage: [{ day: 'Mon', usedDataGB: 3 }],
        dailyUsageLoading: false,
        usagePeriods: [
          {
            usageStartDate: '2026-01-01T00:00:00',
            usageEndDate: '2026-01-31T00:00:00',
          },
          {
            usageStartDate: '2026-02-01T00:00:00',
            usageEndDate: '2026-02-28T00:00:00',
          },
        ],
        usagePeriodsLoading: false,
      },
    };
  });

  it('dispatches initial usage requests and auto-fetches daily for latest period', async () => {
    const onValue = jest.fn();

    await act(async () => {
      renderer.create(<HookProbe onValue={onValue} />);
    });

    expect(mockFetchCurrentUsageRequest).toHaveBeenCalled();
    expect(mockFetchMonthlyUsageRequest).toHaveBeenCalled();
    expect(mockFetchUsagePeriodsRequest).toHaveBeenCalled();

    expect(mockFetchDailyUsageRequest).toHaveBeenCalledTimes(1);
    expect(mockFetchDailyUsageRequest).toHaveBeenCalledWith(
      '2026-02-01T00:00:00',
      '2026-02-28T00:00:00'
    );

    expect(mockDispatch).toHaveBeenCalledWith({ type: 'FETCH_CURRENT_USAGE_REQUEST' });
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'FETCH_MONTHLY_USAGE_REQUEST' });
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'FETCH_USAGE_PERIODS_REQUEST' });
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'FETCH_DAILY_USAGE_REQUEST',
      })
    );
  });

  it('builds period items and exposes dataPlan values', async () => {
    const onValue = jest.fn();

    await act(async () => {
      renderer.create(<HookProbe onValue={onValue} />);
    });

    const latest = onValue.mock.calls[onValue.mock.calls.length - 1][0];

    expect(latest.periodItems.length).toBe(2);
    expect(latest.periodItems[0]).toEqual(
      expect.objectContaining({
        label: 'Jan 1, 2026 - Jan 31, 2026',
        startDate: '2026-01-01T00:00:00',
        endDate: '2026-01-31T00:00:00',
      })
    );

    expect(latest.dataPlan).toEqual({
      usedGB: 34,
      totalGB: 100,
      percentageUsed: 34,
    });
  });

  it('fetchDailyForPeriod dispatches only for valid period items', async () => {
    const onValue = jest.fn();

    await act(async () => {
      renderer.create(<HookProbe onValue={onValue} />);
    });

    const latest = onValue.mock.calls[onValue.mock.calls.length - 1][0];

    act(() => {
      latest.fetchDailyForPeriod({
        startDate: '2026-03-01T00:00:00',
        endDate: '2026-03-31T00:00:00',
      });
      latest.fetchDailyForPeriod({ startDate: '2026-03-01T00:00:00' });
      latest.fetchDailyForPeriod(null);
    });

    expect(mockFetchDailyUsageRequest).toHaveBeenCalledWith(
      '2026-03-01T00:00:00',
      '2026-03-31T00:00:00'
    );
  });

  it('refetchAll and empty-state branches work as expected', async () => {
    mockState = {
      services: {
        currentUsage: null,
        currentUsageLoading: false,
        currentUsageError: null,
        monthlyUsage: null,
        monthlyUsageLoading: false,
        dailyUsage: null,
        dailyUsageLoading: false,
        usagePeriods: null,
        usagePeriodsLoading: false,
      },
    };

    const onValue = jest.fn();

    await act(async () => {
      renderer.create(<HookProbe onValue={onValue} />);
    });

    const latest = onValue.mock.calls[onValue.mock.calls.length - 1][0];

    expect(latest.periodItems).toEqual([]);
    expect(latest.dataPlan).toBeNull();

    act(() => {
      latest.refetchAll();
    });

    expect(mockFetchCurrentUsageRequest).toHaveBeenCalled();
    expect(mockFetchMonthlyUsageRequest).toHaveBeenCalled();
    expect(mockFetchUsagePeriodsRequest).toHaveBeenCalled();
  });
});
