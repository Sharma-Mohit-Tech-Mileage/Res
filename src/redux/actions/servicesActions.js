import * as types from '../constants/servicesTypes';

// ========== Service Details Actions ==========
export const fetchServiceDetailsRequest = (accountNumber) => ({
  type: types.FETCH_SERVICE_DETAILS_REQUEST,
  payload: { accountNumber }
});

export const fetchServiceDetailsSuccess = (serviceData) => ({
  type: types.FETCH_SERVICE_DETAILS_SUCCESS,
  payload: { serviceData }
});

export const fetchServiceDetailsFailure = (error) => ({
  type: types.FETCH_SERVICE_DETAILS_FAILURE,
  payload: { error }
});

// ========== Outage Status Actions ==========
export const checkOutageStatusRequest = () => ({
  type: types.CHECK_OUTAGE_STATUS_REQUEST
});

export const checkOutageStatusSuccess = (outageData) => ({
  type: types.CHECK_OUTAGE_STATUS_SUCCESS,
  payload: { outageData }
});

export const checkOutageStatusFailure = (error) => ({
  type: types.CHECK_OUTAGE_STATUS_FAILURE,
  payload: { error }
});

// ========== Clear Actions ==========
export const clearOutageData = () => ({
  type: types.CLEAR_OUTAGE_DATA
});

export const clearServicesError = () => ({
  type: types.CLEAR_SERVICES_ERROR
});

// ========== Data Usage Actions ==========
export const fetchCurrentUsageRequest = () => ({
  type: types.FETCH_CURRENT_USAGE_REQUEST,
});

export const fetchCurrentUsageSuccess = (data) => ({
  type: types.FETCH_CURRENT_USAGE_SUCCESS,
  payload: { data },
});

export const fetchCurrentUsageFailure = (error) => ({
  type: types.FETCH_CURRENT_USAGE_FAILURE,
  payload: { error },
});

export const fetchMonthlyUsageRequest = () => ({
  type: types.FETCH_MONTHLY_USAGE_REQUEST,
});

export const fetchMonthlyUsageSuccess = (data) => ({
  type: types.FETCH_MONTHLY_USAGE_SUCCESS,
  payload: { data },
});

export const fetchMonthlyUsageFailure = (error) => ({
  type: types.FETCH_MONTHLY_USAGE_FAILURE,
  payload: { error },
});

export const fetchDailyUsageRequest = (startDate, endDate) => ({
  type: types.FETCH_DAILY_USAGE_REQUEST,
  payload: { startDate, endDate },
});

export const fetchDailyUsageSuccess = (data) => ({
  type: types.FETCH_DAILY_USAGE_SUCCESS,
  payload: { data },
});

export const fetchDailyUsageFailure = (error) => ({
  type: types.FETCH_DAILY_USAGE_FAILURE,
  payload: { error },
});

export const fetchUsagePeriodsRequest = () => ({
  type: types.FETCH_USAGE_PERIODS_REQUEST,
});

export const fetchUsagePeriodsSuccess = (data) => ({
  type: types.FETCH_USAGE_PERIODS_SUCCESS,
  payload: { data },
});

export const fetchUsagePeriodsFailure = (error) => ({
  type: types.FETCH_USAGE_PERIODS_FAILURE,
  payload: { error },
});

export const clearDataUsage = () => ({
  type: types.CLEAR_DATA_USAGE,
});