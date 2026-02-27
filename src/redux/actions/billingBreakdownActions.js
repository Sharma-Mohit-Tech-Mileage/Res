import * as types from '../constants/billingBreakdownTypes';

// Bill Explainer actions
export const fetchBillExplainer = () => ({
  type: types.FETCH_BILL_EXPLAINER_REQUEST
});

export const fetchBillExplainerSuccess = (explainerData) => ({
  type: types.FETCH_BILL_EXPLAINER_SUCCESS,
  payload: { explainerData }
});

export const fetchBillExplainerFailure = (error) => ({
  type: types.FETCH_BILL_EXPLAINER_FAILURE,
  payload: { error }
});

export const clearBillExplainerError = () => ({
  type: types.CLEAR_BILL_EXPLAINER_ERROR
});

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