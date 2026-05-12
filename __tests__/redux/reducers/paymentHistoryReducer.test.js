import paymentHistoryReducer from '../../../src/redux/reducers/paymentHistoryReducer';
import * as types from '../../../src/redux/constants/paymentHistoryTypes';

describe('paymentHistoryReducer', () => {
  const payments = [
    { pymtDate: '2024-01-10', extTransactionId: 'AAA-111' },
    { pymtDate: '2024-03-10', extTransactionId: 'BBB-222' },
    { pymtDate: '2024-02-10', extTransactionId: 'CCC-333' },
  ];

  it('returns initial state', () => {
    const state = paymentHistoryReducer(undefined, { type: '@@INIT' });
    expect(state.loading).toBe(false);
    expect(state.payments).toEqual([]);
    expect(state.sortDirection).toBe('desc');
    expect(state.pageSize).toBe(10);
  });

  it('handles fetch payment history success with sort/filter/pagination', () => {
    let state = paymentHistoryReducer(undefined, { type: types.FETCH_PAYMENT_HISTORY_REQUEST });
    expect(state.loading).toBe(true);

    state = paymentHistoryReducer(state, {
      type: types.FETCH_PAYMENT_HISTORY_SUCCESS,
      payload: { payments },
    });

    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.payments[0].extTransactionId).toBe('BBB-222');
    expect(state.filteredPayments).toHaveLength(3);
    expect(state.displayedPayments).toHaveLength(3);
    expect(state.currentPage).toBe(1);
    expect(state.hasMore).toBe(false);
  });

  it('handles fetch payment history failure', () => {
    const state = paymentHistoryReducer(undefined, {
      type: types.FETCH_PAYMENT_HISTORY_FAILURE,
      payload: { error: 'fetch-fail' },
    });
    expect(state.loading).toBe(false);
    expect(state.error).toBe('fetch-fail');
  });

  it('handles receipt download actions', () => {
    let state = paymentHistoryReducer(undefined, { type: types.DOWNLOAD_PAYMENT_RECEIPT_REQUEST });
    expect(state.downloading).toBe(true);

    state = paymentHistoryReducer(state, {
      type: types.DOWNLOAD_PAYMENT_RECEIPT_SUCCESS,
      payload: { receiptData: { id: 'r1' } },
    });
    expect(state.downloading).toBe(false);
    expect(state.downloadedReceipt).toEqual({ id: 'r1' });

    state = paymentHistoryReducer(state, {
      type: types.DOWNLOAD_PAYMENT_RECEIPT_FAILURE,
      payload: { error: 'download-fail' },
    });
    expect(state.downloadError).toBe('download-fail');

    state = paymentHistoryReducer(state, { type: types.CLEAR_DOWNLOADED_RECEIPT });
    expect(state.downloadedReceipt).toBeNull();
  });

  it('handles sort direction and search query', () => {
    const base = paymentHistoryReducer(undefined, {
      type: types.FETCH_PAYMENT_HISTORY_SUCCESS,
      payload: { payments },
    });

    const ascState = paymentHistoryReducer(base, {
      type: types.SET_SORT_DIRECTION_PAYMENT,
      payload: { direction: 'asc' },
    });
    expect(ascState.sortDirection).toBe('asc');
    expect(ascState.payments[0].extTransactionId).toBe('AAA-111');

    const searchState = paymentHistoryReducer(ascState, {
      type: types.SET_SEARCH_QUERY,
      payload: { query: 'bbb' },
    });
    expect(searchState.searchQuery).toBe('bbb');
    expect(searchState.filteredPayments).toHaveLength(1);
    expect(searchState.filteredPayments[0].extTransactionId).toBe('BBB-222');
  });

  it('handles load more and clear errors', () => {
    const seeded = {
      ...paymentHistoryReducer(undefined, { type: '@@INIT' }),
      pageSize: 2,
      filteredPayments: [
        { extTransactionId: '1' },
        { extTransactionId: '2' },
        { extTransactionId: '3' },
      ],
      currentPage: 1,
      displayedPayments: [{ extTransactionId: '1' }, { extTransactionId: '2' }],
      hasMore: true,
      error: 'x',
      downloadError: 'y',
    };

    const moreState = paymentHistoryReducer(seeded, { type: types.LOAD_MORE_PAYMENTS });
    expect(moreState.currentPage).toBe(2);
    expect(moreState.displayedPayments).toHaveLength(3);
    expect(moreState.hasMore).toBe(false);

    const clearedError = paymentHistoryReducer(moreState, { type: 'CLEAR_PAYMENT_HISTORY_ERROR' });
    expect(clearedError.error).toBeNull();

    const clearedDownloadError = paymentHistoryReducer(clearedError, { type: 'CLEAR_DOWNLOAD_ERROR' });
    expect(clearedDownloadError.downloadError).toBeNull();
  });
});
