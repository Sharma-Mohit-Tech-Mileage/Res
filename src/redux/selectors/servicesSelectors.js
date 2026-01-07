import { createSelector } from 'reselect';

// Base selector
const getServicesState = state => state.services;

// ========== Service Details Selectors ==========
export const selectServiceData = createSelector(
  [getServicesState],
  (servicesState) => servicesState.serviceData
);

export const selectServiceLoading = createSelector(
  [getServicesState],
  (servicesState) => servicesState.serviceLoading
);

export const selectServiceError = createSelector(
  [getServicesState],
  (servicesState) => servicesState.serviceError
);

export const selectInternetService = createSelector(
  [selectServiceData],
  (serviceData) => serviceData?.internet
);

export const selectVideoService = createSelector(
  [selectServiceData],
  (serviceData) => serviceData?.video
);

export const selectPhoneService = createSelector(
  [selectServiceData],
  (serviceData) => serviceData?.phone
);

// ========== Outage Status Selectors ==========
export const selectOutageData = createSelector(
  [getServicesState],
  (servicesState) => servicesState.outageData
);

export const selectOutageChecking = createSelector(
  [getServicesState],
  (servicesState) => servicesState.outageChecking
);

export const selectOutageError = createSelector(
  [getServicesState],
  (servicesState) => servicesState.outageError
);