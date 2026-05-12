import servicesReducer from '../../../src/redux/reducers/servicesReducer';
import * as types from '../../../src/redux/constants/servicesTypes';

describe('servicesReducer', () => {
  it('returns initial state', () => {
    const state = servicesReducer(undefined, { type: '@@INIT' });
    expect(state.serviceData).toBeNull();
    expect(state.serviceLoading).toBe(false);
  });

  it('handles service details actions', () => {
    let state = servicesReducer(undefined, { type: types.FETCH_SERVICE_DETAILS_REQUEST });
    expect(state.serviceLoading).toBe(true);

    state = servicesReducer(state, {
      type: types.FETCH_SERVICE_DETAILS_SUCCESS,
      payload: { serviceData: { internet: { speed: '1G' } } },
    });
    expect(state.serviceLoading).toBe(false);
    expect(state.serviceData).toEqual({ internet: { speed: '1G' } });

    state = servicesReducer(state, {
      type: types.FETCH_SERVICE_DETAILS_FAILURE,
      payload: { error: 'failed' },
    });
    expect(state.serviceError).toBe('failed');
  });

  it('handles outage actions', () => {
    let state = servicesReducer(undefined, { type: types.CHECK_OUTAGE_STATUS_REQUEST });
    expect(state.outageChecking).toBe(true);

    state = servicesReducer(state, {
      type: types.CHECK_OUTAGE_STATUS_SUCCESS,
      payload: { outageData: { status: 'ok' } },
    });
    expect(state.outageChecking).toBe(false);
    expect(state.outageData).toEqual({ status: 'ok' });

    state = servicesReducer(state, {
      type: types.CHECK_OUTAGE_STATUS_FAILURE,
      payload: { error: 'oops' },
    });
    expect(state.outageError).toBe('oops');
  });

  it('handles data usage and clear actions', () => {
    let state = servicesReducer(undefined, {
      type: types.FETCH_CURRENT_USAGE_REQUEST,
    });
    expect(state.currentUsageLoading).toBe(true);
    expect(state.currentUsageError).toBeNull();

    state = servicesReducer(state, {
      type: types.FETCH_CURRENT_USAGE_SUCCESS,
      payload: { data: { total: 100 } },
    });
    expect(state.currentUsageLoading).toBe(false);
    expect(state.currentUsage).toEqual({ total: 100 });

    state = servicesReducer(state, {
      type: types.FETCH_CURRENT_USAGE_FAILURE,
      payload: { error: 'current-failure' },
    });
    expect(state.currentUsageLoading).toBe(false);
    expect(state.currentUsageError).toBe('current-failure');

    state = servicesReducer(state, {
      type: types.FETCH_MONTHLY_USAGE_REQUEST,
    });
    expect(state.monthlyUsageLoading).toBe(true);
    expect(state.monthlyUsageError).toBeNull();

    state = servicesReducer(state, {
      type: types.FETCH_MONTHLY_USAGE_SUCCESS,
      payload: { data: [{ month: 'Jan' }] },
    });
    expect(state.monthlyUsageLoading).toBe(false);
    expect(state.monthlyUsage).toEqual([{ month: 'Jan' }]);

    state = servicesReducer(state, {
      type: types.FETCH_MONTHLY_USAGE_FAILURE,
      payload: { error: 'monthly-failure' },
    });
    expect(state.monthlyUsageLoading).toBe(false);
    expect(state.monthlyUsageError).toBe('monthly-failure');

    state = servicesReducer(state, {
      type: types.FETCH_DAILY_USAGE_REQUEST,
    });
    expect(state.dailyUsage).toBeNull();
    expect(state.dailyUsageLoading).toBe(true);
    expect(state.dailyUsageError).toBeNull();

    state = servicesReducer(state, {
      type: types.FETCH_DAILY_USAGE_SUCCESS,
      payload: { data: [{ day: 'Mon' }] },
    });
    expect(state.dailyUsageLoading).toBe(false);
    expect(state.dailyUsage).toEqual([{ day: 'Mon' }]);

    state = servicesReducer(state, {
      type: types.FETCH_DAILY_USAGE_FAILURE,
      payload: { error: 'daily-failure' },
    });
    expect(state.dailyUsageLoading).toBe(false);
    expect(state.dailyUsageError).toBe('daily-failure');

    state = servicesReducer(state, {
      type: types.FETCH_USAGE_PERIODS_REQUEST,
    });
    expect(state.usagePeriodsLoading).toBe(true);
    expect(state.usagePeriodsError).toBeNull();

    state = servicesReducer(state, {
      type: types.FETCH_USAGE_PERIODS_SUCCESS,
      payload: { data: [{ id: 1 }] },
    });
    expect(state.usagePeriodsLoading).toBe(false);
    expect(state.usagePeriods).toEqual([{ id: 1 }]);

    state = servicesReducer(state, {
      type: types.FETCH_USAGE_PERIODS_FAILURE,
      payload: { error: 'periods-failure' },
    });
    expect(state.usagePeriodsLoading).toBe(false);
    expect(state.usagePeriodsError).toBe('periods-failure');

    state = servicesReducer(state, { type: types.CLEAR_OUTAGE_DATA });
    expect(state.outageData).toBeNull();

    state = servicesReducer(state, { type: types.CLEAR_SERVICES_ERROR });
    expect(state.serviceError).toBeNull();

    state = servicesReducer(state, { type: types.CLEAR_DATA_USAGE });
    expect(state.currentUsage).toBeNull();
    expect(state.monthlyUsage).toBeNull();
    expect(state.dailyUsage).toBeNull();
    expect(state.usagePeriods).toBeNull();
    expect(state.currentUsageLoading).toBe(false);
    expect(state.monthlyUsageLoading).toBe(false);
    expect(state.dailyUsageLoading).toBe(false);
    expect(state.usagePeriodsLoading).toBe(false);
    expect(state.currentUsageError).toBeNull();
    expect(state.monthlyUsageError).toBeNull();
    expect(state.dailyUsageError).toBeNull();
    expect(state.usagePeriodsError).toBeNull();
  });
});
