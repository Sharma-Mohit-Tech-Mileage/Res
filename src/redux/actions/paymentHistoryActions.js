import * as types from '../constants/paymentHistoryTypes';

// Fetch payment history
export const fetchPaymentHistory = () => ({
  type: types.FETCH_PAYMENT_HISTORY_REQUEST
});

export const fetchPaymentHistorySuccess = (payments) => ({
  type: types.FETCH_PAYMENT_HISTORY_SUCCESS,
  payload: { payments }
});

export const fetchPaymentHistoryFailure = (error) => ({
  type: types.FETCH_PAYMENT_HISTORY_FAILURE,
  payload: { error }
});

// Download payment receipt
export const downloadPaymentReceipt = (paymentId) => ({
  type: types.DOWNLOAD_PAYMENT_RECEIPT_REQUEST,
  payload: { paymentId }
});

export const downloadPaymentReceiptSuccess = (receiptData) => ({
  type: types.DOWNLOAD_PAYMENT_RECEIPT_SUCCESS,
  payload: { receiptData }
});

export const downloadPaymentReceiptFailure = (error) => ({
  type: types.DOWNLOAD_PAYMENT_RECEIPT_FAILURE,
  payload: { error }
});

export const clearDownloadedReceipt = () => ({
  type: types.CLEAR_DOWNLOADED_RECEIPT
});

// UI Actions
export const setSortDirection = (direction) => ({
  type: types.SET_SORT_DIRECTION_PAYMENT,
  payload: { direction }
});

export const setSearchQuery = (query) => ({
  type: types.SET_SEARCH_QUERY,
  payload: { query }
});

export const loadMorePayments = () => ({
  type: types.LOAD_MORE_PAYMENTS
});