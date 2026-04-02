import * as types from '../constants/servicesTypes';

const initialState = {
  // Service Details State
  serviceData: null,
  serviceLoading: false,
  serviceError: null,

  // Outage Status State
  outageData: null,
  outageChecking: false,
  outageError: null,

  // Data Usage State
  currentUsage: null,
  currentUsageLoading: false,
  currentUsageError: null,

  monthlyUsage: null,
  monthlyUsageLoading: false,
  monthlyUsageError: null,

  dailyUsage: null,
  dailyUsageLoading: false,
  dailyUsageError: null,

  usagePeriods: null,
  usagePeriodsLoading: false,
  usagePeriodsError: null,
};

const servicesReducer = (state = initialState, action) => {
  switch (action.type) {
    // ========== Service Details ==========
    case types.FETCH_SERVICE_DETAILS_REQUEST:
      return {
        ...state,
        serviceLoading: true,
        serviceError: null
      };

    case types.FETCH_SERVICE_DETAILS_SUCCESS:
      return {
        ...state,
        serviceLoading: false,
        serviceData: action.payload.serviceData,
        serviceError: null
      };

    case types.FETCH_SERVICE_DETAILS_FAILURE:
      return {
        ...state,
        serviceLoading: false,
        serviceError: action.payload.error
      };

    case types.CHECK_OUTAGE_STATUS_REQUEST:
      return {
        ...state,
        outageData: null,
        outageChecking: true,
        outageError: null
      };

    case types.CHECK_OUTAGE_STATUS_SUCCESS:
      return {
        ...state,
        outageChecking: false,
        outageData: action.payload.outageData,
        outageError: null
      };

    case types.CHECK_OUTAGE_STATUS_FAILURE:
      return {
        ...state,
        outageChecking: false,
        outageError: action.payload.error
      };

    // ========== Data Usage: Current ==========
    case types.FETCH_CURRENT_USAGE_REQUEST:
      return {
        ...state,
        currentUsageLoading: true,
        currentUsageError: null,
      };

    case types.FETCH_CURRENT_USAGE_SUCCESS:
      return {
        ...state,
        currentUsageLoading: false,
        currentUsage: action.payload.data,
        currentUsageError: null,
      };

    case types.FETCH_CURRENT_USAGE_FAILURE:
      return {
        ...state,
        currentUsageLoading: false,
        currentUsageError: action.payload.error,
      };

    // ========== Data Usage: Monthly ==========
    case types.FETCH_MONTHLY_USAGE_REQUEST:
      return {
        ...state,
        monthlyUsageLoading: true,
        monthlyUsageError: null,
      };

    case types.FETCH_MONTHLY_USAGE_SUCCESS:
      return {
        ...state,
        monthlyUsageLoading: false,
        monthlyUsage: action.payload.data,
        monthlyUsageError: null,
      };

    case types.FETCH_MONTHLY_USAGE_FAILURE:
      return {
        ...state,
        monthlyUsageLoading: false,
        monthlyUsageError: action.payload.error,
      };

    // ========== Data Usage: Daily ==========
    case types.FETCH_DAILY_USAGE_REQUEST:
      return {
        ...state,
        dailyUsage: null,
        dailyUsageLoading: true,
        dailyUsageError: null,
      };

    case types.FETCH_DAILY_USAGE_SUCCESS:
      return {
        ...state,
        dailyUsageLoading: false,
        dailyUsage: action.payload.data,
        dailyUsageError: null,
      };

    case types.FETCH_DAILY_USAGE_FAILURE:
      return {
        ...state,
        dailyUsageLoading: false,
        dailyUsageError: action.payload.error,
      };

    // ========== Data Usage: Periods ==========
    case types.FETCH_USAGE_PERIODS_REQUEST:
      return {
        ...state,
        usagePeriodsLoading: true,
        usagePeriodsError: null,
      };

    case types.FETCH_USAGE_PERIODS_SUCCESS:
      return {
        ...state,
        usagePeriodsLoading: false,
        usagePeriods: action.payload.data,
        usagePeriodsError: null,
      };

    case types.FETCH_USAGE_PERIODS_FAILURE:
      return {
        ...state,
        usagePeriodsLoading: false,
        usagePeriodsError: action.payload.error,
      };

    // ========== Clear Actions ==========
    case types.CLEAR_OUTAGE_DATA:
      return {
        ...state,
        outageData: null,
        outageError: null
      };

    case types.CLEAR_SERVICES_ERROR:
      return {
        ...state,
        serviceError: null,
        outageError: null
      };

    case types.CLEAR_DATA_USAGE:
      return {
        ...state,
        currentUsage: null,
        currentUsageLoading: false,
        currentUsageError: null,
        monthlyUsage: null,
        monthlyUsageLoading: false,
        monthlyUsageError: null,
        dailyUsage: null,
        dailyUsageLoading: false,
        dailyUsageError: null,
        usagePeriods: null,
        usagePeriodsLoading: false,
        usagePeriodsError: null,
      };

    default:
      return state;
  }
};

export default servicesReducer;
