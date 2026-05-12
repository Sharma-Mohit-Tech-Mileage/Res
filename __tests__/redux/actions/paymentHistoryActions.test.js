import * as types from '../../../src/redux/constants/paymentHistoryTypes';
import * as actions from '../../../src/redux/actions/paymentHistoryActions';

describe('paymentHistoryActions', () => {
  it('creates fetch actions', () => {
    expect(actions.fetchPaymentHistory()).toEqual({ type: types.FETCH_PAYMENT_HISTORY_REQUEST });
    expect(actions.fetchPaymentHistorySuccess([{ id: 'p1' }])).toEqual({
      type: types.FETCH_PAYMENT_HISTORY_SUCCESS,
      payload: { payments: [{ id: 'p1' }] },
    });
    expect(actions.fetchPaymentHistoryFailure('err')).toEqual({
      type: types.FETCH_PAYMENT_HISTORY_FAILURE,
      payload: { error: 'err' },
    });
  });

  it('creates download receipt actions', () => {
    expect(actions.downloadPaymentReceipt('p2')).toEqual({
      type: types.DOWNLOAD_PAYMENT_RECEIPT_REQUEST,
      payload: { paymentId: 'p2' },
    });
    expect(actions.downloadPaymentReceiptSuccess({ id: 'r1' })).toEqual({
      type: types.DOWNLOAD_PAYMENT_RECEIPT_SUCCESS,
      payload: { receiptData: { id: 'r1' } },
    });
    expect(actions.downloadPaymentReceiptFailure('bad')).toEqual({
      type: types.DOWNLOAD_PAYMENT_RECEIPT_FAILURE,
      payload: { error: 'bad' },
    });
    expect(actions.clearDownloadedReceipt()).toEqual({ type: types.CLEAR_DOWNLOADED_RECEIPT });
  });

  it('creates ui actions', () => {
    expect(actions.setSortDirection('desc')).toEqual({
      type: types.SET_SORT_DIRECTION_PAYMENT,
      payload: { direction: 'desc' },
    });
    expect(actions.setSearchQuery('abc')).toEqual({
      type: types.SET_SEARCH_QUERY,
      payload: { query: 'abc' },
    });
    expect(actions.loadMorePayments()).toEqual({ type: types.LOAD_MORE_PAYMENTS });
  });
});
