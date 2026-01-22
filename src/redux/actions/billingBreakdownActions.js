import * as types from '../constants/billingBreakdownTypes';

// Fetch billing breakdown actions
export const fetchBillingBreakdown = () => ({
  type: types.FETCH_BILLING_BREAKDOWN_REQUEST
});

export const fetchBillingBreakdownSuccess = (breakdownData) => ({
  type: types.FETCH_BILLING_BREAKDOWN_SUCCESS,
  payload: { breakdownData }
});

export const fetchBillingBreakdownFailure = (error) => ({
  type: types.FETCH_BILLING_BREAKDOWN_FAILURE,
  payload: { error }
});

// UI state actions
export const resetTotalDue = () => ({
  type: types.RESET_TOTAL_DUE
});

// Clear errors
export const clearBillingBreakdownError = () => ({
  type: types.CLEAR_BILLING_BREAKDOWN_ERROR
});