import { createSelector } from 'reselect';

// Basic selectors
const getPaymentHistoryState = state => state.paymentHistory;

// Select all payments
export const selectAllPayments = createSelector(
  [getPaymentHistoryState],
  (paymentHistoryState) => paymentHistoryState.payments
);

// Select displayed payments (paginated)
export const selectDisplayedPayments = createSelector(
  [getPaymentHistoryState],
  (paymentHistoryState) => paymentHistoryState.displayedPayments
);

// Select filtered payments
export const selectFilteredPayments = createSelector(
  [getPaymentHistoryState],
  (paymentHistoryState) => paymentHistoryState.filteredPayments
);

// Select loading state
export const selectLoading = createSelector(
  [getPaymentHistoryState],
  (paymentHistoryState) => paymentHistoryState.loading
);

// Select error state
export const selectError = createSelector(
  [getPaymentHistoryState],
  (paymentHistoryState) => paymentHistoryState.error
);

// Select downloading state
export const selectDownloading = createSelector(
  [getPaymentHistoryState],
  (paymentHistoryState) => paymentHistoryState.downloading
);

// Select download error
export const selectDownloadError = createSelector(
  [getPaymentHistoryState],
  (paymentHistoryState) => paymentHistoryState.downloadError
);

// Select downloaded receipt
export const selectDownloadedReceipt = createSelector(
  [getPaymentHistoryState],
  (paymentHistoryState) => paymentHistoryState.downloadedReceipt
);

// Select sort direction
export const selectSortDirection = createSelector(
  [getPaymentHistoryState],
  (paymentHistoryState) => paymentHistoryState.sortDirection
);

// Select search query
export const selectSearchQuery = createSelector(
  [getPaymentHistoryState],
  (paymentHistoryState) => paymentHistoryState.searchQuery
);

// Select has more records state
export const selectHasMore = createSelector(
  [getPaymentHistoryState],
  (paymentHistoryState) => paymentHistoryState.hasMore
);