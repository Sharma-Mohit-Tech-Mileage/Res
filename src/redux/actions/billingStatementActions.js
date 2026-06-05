import * as types from '../../redux/constants/billingStatementTypes';

// Fetch billing statements actions
export const fetchBillingStatements = () => ({
  type: types.FETCH_BILLING_STATEMENTS_REQUEST
});

export const fetchBillingStatementsSuccess = (statements) => ({
  type: types.FETCH_BILLING_STATEMENTS_SUCCESS,
  payload: { statements }
});

export const fetchBillingStatementsFailure = (error) => ({
  type: types.FETCH_BILLING_STATEMENTS_FAILURE,
  payload: { error }
});

// Download statement actions
export const downloadStatement = (statementId) => ({
  type: types.DOWNLOAD_STATEMENT_REQUEST,
  payload: { statementId }
});

export const downloadStatementSuccess = (statementData) => ({
  type: types.DOWNLOAD_STATEMENT_SUCCESS,
  payload: { statementData }
});

export const downloadStatementFailure = (error) => ({
  type: types.DOWNLOAD_STATEMENT_FAILURE,
  payload: { error }
});

// UI state actions
export const setSelectedYear = (year) => ({
  type: types.SET_SELECTED_YEAR,
  payload: { year }
});

export const setSortDirection = (direction) => ({
  type: types.SET_SORT_DIRECTION,
  payload: { direction }
});

// Add actions to clear errors
export const clearBillingError = () => ({
  type: types.CLEAR_BILLING_ERROR
});

export const clearDownloadError = () => ({
  type: types.CLEAR_DOWNLOAD_ERROR
});

// Add action to clear downloaded statement
export const clearDownloadedStatement = () => ({
  type: types.CLEAR_DOWNLOADED_STATEMENT
});