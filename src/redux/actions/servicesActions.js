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