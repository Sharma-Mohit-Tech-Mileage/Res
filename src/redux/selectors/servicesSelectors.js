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

// ========== Data Usage Selectors ==========
export const selectCurrentUsage = createSelector(
  [getServicesState],
  (servicesState) => servicesState.currentUsage
);

export const selectCurrentUsageLoading = createSelector(
  [getServicesState],
  (servicesState) => servicesState.currentUsageLoading
);

export const selectCurrentUsageError = createSelector(
  [getServicesState],
  (servicesState) => servicesState.currentUsageError
);

export const selectMonthlyUsage = createSelector(
  [getServicesState],
  (servicesState) => servicesState.monthlyUsage
);

export const selectMonthlyUsageLoading = createSelector(
  [getServicesState],
  (servicesState) => servicesState.monthlyUsageLoading
);

export const selectDailyUsage = createSelector(
  [getServicesState],
  (servicesState) => servicesState.dailyUsage
);

export const selectDailyUsageLoading = createSelector(
  [getServicesState],
  (servicesState) => servicesState.dailyUsageLoading
);

export const selectUsagePeriods = createSelector(
  [getServicesState],
  (servicesState) => servicesState.usagePeriods
);

export const selectUsagePeriodsLoading = createSelector(
  [getServicesState],
  (servicesState) => servicesState.usagePeriodsLoading
);
