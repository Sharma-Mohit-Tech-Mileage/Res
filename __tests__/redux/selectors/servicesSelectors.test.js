import {
  selectServiceData,
  selectServiceLoading,
  selectServiceError,
  selectInternetService,
  selectVideoService,
  selectPhoneService,
  selectOutageData,
  selectOutageChecking,
  selectOutageError,
  selectCurrentUsage,
  selectCurrentUsageLoading,
  selectCurrentUsageError,
  selectMonthlyUsage,
  selectMonthlyUsageLoading,
  selectDailyUsage,
  selectDailyUsageLoading,
  selectUsagePeriods,
  selectUsagePeriodsLoading,
} from '../../../src/redux/selectors/servicesSelectors';

describe('servicesSelectors', () => {
  const state = {
    services: {
      serviceData: {
        internet: { speed: '1G' },
        video: { package: 'premium' },
        phone: { enabled: true },
      },
      serviceLoading: false,
      serviceError: null,
      outageData: { status: 'ok' },
      outageChecking: false,
      outageError: null,
      currentUsage: { total: 12 },
      currentUsageLoading: false,
      currentUsageError: null,
      monthlyUsage: [{ month: 'Jan' }],
      monthlyUsageLoading: false,
      dailyUsage: [{ day: 'Mon' }],
      dailyUsageLoading: true,
      usagePeriods: [{ id: 'period-1' }],
      usagePeriodsLoading: false,
    },
  };

  it('returns all service selector values', () => {
    expect(selectServiceData(state)).toEqual(state.services.serviceData);
    expect(selectServiceLoading(state)).toBe(false);
    expect(selectServiceError(state)).toBeNull();
    expect(selectInternetService(state)).toEqual({ speed: '1G' });
    expect(selectVideoService(state)).toEqual({ package: 'premium' });
    expect(selectPhoneService(state)).toEqual({ enabled: true });
    expect(selectOutageData(state)).toEqual({ status: 'ok' });
    expect(selectOutageChecking(state)).toBe(false);
    expect(selectOutageError(state)).toBeNull();
    expect(selectCurrentUsage(state)).toEqual({ total: 12 });
    expect(selectCurrentUsageLoading(state)).toBe(false);
    expect(selectCurrentUsageError(state)).toBeNull();
    expect(selectMonthlyUsage(state)).toEqual([{ month: 'Jan' }]);
    expect(selectMonthlyUsageLoading(state)).toBe(false);
    expect(selectDailyUsage(state)).toEqual([{ day: 'Mon' }]);
    expect(selectDailyUsageLoading(state)).toBe(true);
    expect(selectUsagePeriods(state)).toEqual([{ id: 'period-1' }]);
    expect(selectUsagePeriodsLoading(state)).toBe(false);
  });
});
