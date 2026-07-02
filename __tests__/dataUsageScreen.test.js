const React = require('react');
const renderer = require('react-test-renderer');
const { act } = renderer;
const { RefreshControl, Pressable, Text, View } = require('react-native');
const DataUsageScreen = require('../src/components/services/dataUsage/DataUsageScreen').default;
const { useDataUsage } = require('../src/components/services/hooks/useDataUsage');

const fetchDailyForPeriodMock = jest.fn();
const refetchAllMock = jest.fn();

jest.mock('../src/components/services/hooks/useDataUsage', () => ({
  useDataUsage: jest.fn(),
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }) => children,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('../src/components/common/ProfileSettingsHeader', () => {
  const React = require('react');
  const { Pressable, Text } = require('react-native');

  return function MockProfileSettingsHeader(props) {
    return (
      <Pressable testID="data-usage-back" onPress={props.onPressBack}>
        <Text>{props.title}</Text>
      </Pressable>
    );
  };
});
jest.mock('../src/components/services/dataUsage/components/UsageSummaryCard', () => 'UsageSummaryCard');
jest.mock('../src/components/services/dataUsage/components/EeroPromoCard', () => 'EeroPromoCard');

jest.mock('../src/components/services/dataUsage/components/UsageChart', () => {
  const React = require('react');
  const { View, Pressable, Text } = require('react-native');

  return function MockUsageChart(props) {
    return (
      <View testID="usage-chart">
        <Text testID="active-tab">{props.activeTab}</Text>
        <Text testID="loading-state">{String(props.loading)}</Text>
        <Text testID="selected-period-label">{props.selectedPeriodLabel}</Text>
        <Text testID="data-length">{String((props.data || []).length)}</Text>
        <Text testID="selected-bar">{props.selectedBar ? JSON.stringify(props.selectedBar) : 'none'}</Text>
        <Pressable testID="switch-monthly" onPress={() => props.onTabChange('monthly')}>
          <Text>Monthly</Text>
        </Pressable>
        <Pressable testID="select-bar" onPress={() => props.onBarPress({ label: 'Mon', y: 10 })}>
          <Text>Select Bar</Text>
        </Pressable>
        <Pressable testID="pick-period" onPress={() => props.onPeriodChange('Feb 2026')}>
          <Text>Pick Period</Text>
        </Pressable>
        <Pressable testID="pick-invalid-period" onPress={() => props.onPeriodChange('Unknown')}>
          <Text>Pick Invalid Period</Text>
        </Pressable>
      </View>
    );
  };
});

describe('DataUsageScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useDataUsage.mockReturnValue({
      currentUsage: { used: 50, total: 100 },
      currentUsageLoading: false,
      monthlyUsage: [{ x: 'Jan', y: 100 }],
      monthlyUsageLoading: false,
      dailyUsage: [{ x: 'Mon', y: 10 }],
      dailyUsageLoading: false,
      periodItems: [
        { label: 'Jan 2026', from: '2026-01-01', to: '2026-01-31' },
        { label: 'Feb 2026', from: '2026-02-01', to: '2026-02-28' },
      ],
      usagePeriodsLoading: false,
      fetchDailyForPeriod: fetchDailyForPeriodMock,
      refetchAll: refetchAllMock,
    });
  });

  it('renders with daily tab by default and can switch to monthly', () => {
    const tree = renderer.create(
      <DataUsageScreen navigation={{ goBack: jest.fn() }} route={{}} />
    );

    const activeTabTextBefore = tree.root.findByProps({ testID: 'active-tab' });
    expect(activeTabTextBefore.props.children).toBe('daily');

    const switchMonthly = tree.root.findByProps({ testID: 'switch-monthly' });
    act(() => {
      switchMonthly.props.onPress();
    });

    const activeTabTextAfter = tree.root.findByProps({ testID: 'active-tab' });
    expect(activeTabTextAfter.props.children).toBe('monthly');
  });

  it('navigates back when the header back action is pressed', () => {
    const goBack = jest.fn();
    const tree = renderer.create(
      <DataUsageScreen navigation={{ goBack }} route={{}} />
    );

    const backButton = tree.root.findByProps({ testID: 'data-usage-back' });
    act(() => {
      backButton.props.onPress();
    });

    expect(goBack).toHaveBeenCalled();
  });

  it('updates the selected bar when a bar is pressed', () => {
    const tree = renderer.create(
      <DataUsageScreen navigation={{ goBack: jest.fn() }} route={{}} />
    );

    const selectBar = tree.root.findByProps({ testID: 'select-bar' });
    act(() => {
      selectBar.props.onPress();
    });

    const selectedBar = tree.root.findByProps({ testID: 'selected-bar' });
    expect(selectedBar.props.children).toContain('Mon');
  });

  it('requests daily usage for selected period', () => {
    const tree = renderer.create(
      <DataUsageScreen navigation={{ goBack: jest.fn() }} route={{}} />
    );

    const pickPeriod = tree.root.findByProps({ testID: 'pick-period' });
    act(() => {
      pickPeriod.props.onPress();
    });

    expect(fetchDailyForPeriodMock).toHaveBeenCalledWith({
      label: 'Feb 2026',
      from: '2026-02-01',
      to: '2026-02-28',
    });
  });

  it('does not request daily usage for invalid period label', () => {
    const tree = renderer.create(
      <DataUsageScreen navigation={{ goBack: jest.fn() }} route={{}} />
    );

    const pickInvalid = tree.root.findByProps({ testID: 'pick-invalid-period' });
    act(() => {
      pickInvalid.props.onPress();
    });

    expect(fetchDailyForPeriodMock).not.toHaveBeenCalled();
  });

  it('uses monthly loading state when monthly tab is active', () => {
    useDataUsage.mockReturnValue({
      currentUsage: { used: 50, total: 100 },
      currentUsageLoading: false,
      monthlyUsage: [{ x: 'Jan', y: 100 }],
      monthlyUsageLoading: true,
      dailyUsage: [{ x: 'Mon', y: 10 }],
      dailyUsageLoading: false,
      periodItems: [
        { label: 'Jan 2026', from: '2026-01-01', to: '2026-01-31' },
      ],
      usagePeriodsLoading: false,
      fetchDailyForPeriod: fetchDailyForPeriodMock,
      refetchAll: refetchAllMock,
    });

    const tree = renderer.create(
      <DataUsageScreen navigation={{ goBack: jest.fn() }} route={{}} />
    );

    const switchMonthly = tree.root.findByProps({ testID: 'switch-monthly' });
    act(() => {
      switchMonthly.props.onPress();
    });

    const loadingState = tree.root.findByProps({ testID: 'loading-state' });
    expect(loadingState.props.children).toBe('true');
  });

  it('falls back to empty monthly data when monthly usage is missing', () => {
    useDataUsage.mockReturnValue({
      currentUsage: { used: 50, total: 100 },
      currentUsageLoading: false,
      monthlyUsage: null,
      monthlyUsageLoading: false,
      dailyUsage: [{ x: 'Mon', y: 10 }],
      dailyUsageLoading: false,
      periodItems: [
        { label: 'Jan 2026', from: '2026-01-01', to: '2026-01-31' },
      ],
      usagePeriodsLoading: false,
      fetchDailyForPeriod: fetchDailyForPeriodMock,
      refetchAll: refetchAllMock,
    });

    const tree = renderer.create(
      <DataUsageScreen navigation={{ goBack: jest.fn() }} route={{}} />
    );

    const switchMonthly = tree.root.findByProps({ testID: 'switch-monthly' });
    act(() => {
      switchMonthly.props.onPress();
    });

    const dataLength = tree.root.findByProps({ testID: 'data-length' });
    expect(dataLength.props.children).toBe('0');
  });

  it('falls back to empty label/data when period list and usage data are missing', () => {
    useDataUsage.mockReturnValue({
      currentUsage: null,
      currentUsageLoading: false,
      monthlyUsage: null,
      monthlyUsageLoading: false,
      dailyUsage: null,
      dailyUsageLoading: false,
      periodItems: [],
      usagePeriodsLoading: false,
      fetchDailyForPeriod: fetchDailyForPeriodMock,
      refetchAll: refetchAllMock,
    });

    const tree = renderer.create(
      <DataUsageScreen navigation={{ goBack: jest.fn() }} route={{}} />
    );

    const periodLabel = tree.root.findByProps({ testID: 'selected-period-label' });
    const dataLength = tree.root.findByProps({ testID: 'data-length' });
    const pickPeriod = tree.root.findByProps({ testID: 'pick-period' });

    expect(periodLabel.props.children).toBe('');
    expect(dataLength.props.children).toBe('0');

    act(() => {
      pickPeriod.props.onPress();
    });

    expect(fetchDailyForPeriodMock).not.toHaveBeenCalled();
  });

  it('refetches data and clears the refreshing state on pull-to-refresh', async () => {
    jest.useFakeTimers();

    try {
      const tree = renderer.create(
        <DataUsageScreen navigation={{ goBack: jest.fn() }} route={{}} />
      );

      const refreshControl = tree.root.findByType(RefreshControl);

      await act(async () => {
        const refreshPromise = refreshControl.props.onRefresh();
        expect(refetchAllMock).toHaveBeenCalled();
        jest.advanceTimersByTime(1500);
        await refreshPromise;
      });

      expect(tree.root.findByType(RefreshControl).props.refreshing).toBe(false);
    } finally {
      jest.useRealTimers();
    }
  });
});
