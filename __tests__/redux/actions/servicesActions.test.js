import * as types from '../../../src/redux/constants/servicesTypes';
import * as actions from '../../../src/redux/actions/servicesActions';

describe('servicesActions', () => {
  it('creates service detail actions', () => {
    expect(actions.fetchServiceDetailsRequest('123')).toEqual({
      type: types.FETCH_SERVICE_DETAILS_REQUEST,
      payload: { accountNumber: '123' },
    });
    expect(actions.fetchServiceDetailsSuccess({ i: 1 })).toEqual({
      type: types.FETCH_SERVICE_DETAILS_SUCCESS,
      payload: { serviceData: { i: 1 } },
    });
    expect(actions.fetchServiceDetailsFailure('e')).toEqual({
      type: types.FETCH_SERVICE_DETAILS_FAILURE,
      payload: { error: 'e' },
    });
  });

  it('creates outage actions', () => {
    expect(actions.checkOutageStatusRequest()).toEqual({ type: types.CHECK_OUTAGE_STATUS_REQUEST });
    expect(actions.checkOutageStatusSuccess({ ok: true })).toEqual({
      type: types.CHECK_OUTAGE_STATUS_SUCCESS,
      payload: { outageData: { ok: true } },
    });
    expect(actions.checkOutageStatusFailure('e')).toEqual({
      type: types.CHECK_OUTAGE_STATUS_FAILURE,
      payload: { error: 'e' },
    });
    expect(actions.clearOutageData()).toEqual({ type: types.CLEAR_OUTAGE_DATA });
    expect(actions.clearServicesError()).toEqual({ type: types.CLEAR_SERVICES_ERROR });
  });

  it('creates data usage actions', () => {
    expect(actions.fetchCurrentUsageRequest()).toEqual({ type: types.FETCH_CURRENT_USAGE_REQUEST });
    expect(actions.fetchCurrentUsageSuccess({ a: 1 })).toEqual({
      type: types.FETCH_CURRENT_USAGE_SUCCESS,
      payload: { data: { a: 1 } },
    });
    expect(actions.fetchCurrentUsageFailure('x')).toEqual({
      type: types.FETCH_CURRENT_USAGE_FAILURE,
      payload: { error: 'x' },
    });

    expect(actions.fetchMonthlyUsageRequest()).toEqual({ type: types.FETCH_MONTHLY_USAGE_REQUEST });
    expect(actions.fetchMonthlyUsageSuccess([{ m: 1 }])).toEqual({
      type: types.FETCH_MONTHLY_USAGE_SUCCESS,
      payload: { data: [{ m: 1 }] },
    });
    expect(actions.fetchMonthlyUsageFailure('x')).toEqual({
      type: types.FETCH_MONTHLY_USAGE_FAILURE,
      payload: { error: 'x' },
    });

    expect(actions.fetchDailyUsageRequest('2026-01-01', '2026-01-31')).toEqual({
      type: types.FETCH_DAILY_USAGE_REQUEST,
      payload: { startDate: '2026-01-01', endDate: '2026-01-31' },
    });
    expect(actions.fetchDailyUsageSuccess([{ d: 1 }])).toEqual({
      type: types.FETCH_DAILY_USAGE_SUCCESS,
      payload: { data: [{ d: 1 }] },
    });
    expect(actions.fetchDailyUsageFailure('x')).toEqual({
      type: types.FETCH_DAILY_USAGE_FAILURE,
      payload: { error: 'x' },
    });

    expect(actions.fetchUsagePeriodsRequest()).toEqual({ type: types.FETCH_USAGE_PERIODS_REQUEST });
    expect(actions.fetchUsagePeriodsSuccess([{ p: 1 }])).toEqual({
      type: types.FETCH_USAGE_PERIODS_SUCCESS,
      payload: { data: [{ p: 1 }] },
    });
    expect(actions.fetchUsagePeriodsFailure('x')).toEqual({
      type: types.FETCH_USAGE_PERIODS_FAILURE,
      payload: { error: 'x' },
    });
    expect(actions.clearDataUsage()).toEqual({ type: types.CLEAR_DATA_USAGE });
  });
});
