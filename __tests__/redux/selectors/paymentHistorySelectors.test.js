import {
  selectAllPayments,
  selectDisplayedPayments,
  selectFilteredPayments,
  selectLoading,
  selectError,
  selectDownloading,
  selectDownloadError,
  selectDownloadedReceipt,
  selectSortDirection,
  selectSearchQuery,
  selectHasMore,
} from '../../../src/redux/selectors/paymentHistorySelectors';

describe('paymentHistorySelectors', () => {
  const state = {
    paymentHistory: {
      payments: [{ id: 'p1' }],
      displayedPayments: [{ id: 'p2' }],
      filteredPayments: [{ id: 'p3' }],
      loading: false,
      error: null,
      downloading: true,
      downloadError: 'download-error',
      downloadedReceipt: { id: 'r1' },
      sortDirection: 'desc',
      searchQuery: 'abc',
      hasMore: true,
    },
  };

  it('returns all payment history selector values', () => {
    expect(selectAllPayments(state)).toEqual([{ id: 'p1' }]);
    expect(selectDisplayedPayments(state)).toEqual([{ id: 'p2' }]);
    expect(selectFilteredPayments(state)).toEqual([{ id: 'p3' }]);
    expect(selectLoading(state)).toBe(false);
    expect(selectError(state)).toBeNull();
    expect(selectDownloading(state)).toBe(true);
    expect(selectDownloadError(state)).toBe('download-error');
    expect(selectDownloadedReceipt(state)).toEqual({ id: 'r1' });
    expect(selectSortDirection(state)).toBe('desc');
    expect(selectSearchQuery(state)).toBe('abc');
    expect(selectHasMore(state)).toBe(true);
  });
});
