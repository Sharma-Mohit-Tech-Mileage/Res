import billingStatementReducer from '../../../src/redux/reducers/billingStatementReducer';
import * as types from '../../../src/redux/constants/billingStatementTypes';

describe('billingStatementReducer', () => {
  it('returns initial state', () => {
    const state = billingStatementReducer(undefined, { type: '@@INIT' });
    expect(state.loading).toBe(false);
    expect(state.statements).toEqual([]);
    expect(state.downloading).toBe(false);
    expect(state.sortDirection).toBe('desc');
  });

  it('handles fetch billing statements flow', () => {
    let state = billingStatementReducer(undefined, { type: types.FETCH_BILLING_STATEMENTS_REQUEST });
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();

    state = billingStatementReducer(state, {
      type: types.FETCH_BILLING_STATEMENTS_SUCCESS,
      payload: { statements: [{ id: 's1' }] },
    });
    expect(state.loading).toBe(false);
    expect(state.statements).toEqual([{ id: 's1' }]);

    state = billingStatementReducer(state, {
      type: types.FETCH_BILLING_STATEMENTS_FAILURE,
      payload: { error: 'failed' },
    });
    expect(state.error).toBe('failed');
  });

  it('handles download statement flow', () => {
    let state = billingStatementReducer(undefined, { type: types.DOWNLOAD_STATEMENT_REQUEST });
    expect(state.downloading).toBe(true);
    expect(state.downloadError).toBeNull();

    state = billingStatementReducer(state, {
      type: types.DOWNLOAD_STATEMENT_SUCCESS,
      payload: { statementData: { id: 's1' } },
    });
    expect(state.downloading).toBe(false);
    expect(state.downloadedStatement).toEqual({ id: 's1' });

    state = billingStatementReducer(state, {
      type: types.DOWNLOAD_STATEMENT_FAILURE,
      payload: { error: 'download-failed' },
    });
    expect(state.downloadError).toBe('download-failed');

    state = billingStatementReducer(state, { type: types.CLEAR_DOWNLOADED_STATEMENT });
    expect(state.downloadedStatement).toBeNull();
  });

  it('handles UI and clear actions', () => {
    let state = billingStatementReducer(undefined, {
      type: types.SET_SELECTED_YEAR,
      payload: { year: '2025' },
    });
    expect(state.selectedYear).toBe('2025');

    state = billingStatementReducer(state, {
      type: types.SET_SORT_DIRECTION,
      payload: { direction: 'asc' },
    });
    expect(state.sortDirection).toBe('asc');

    state = billingStatementReducer({ ...state, error: 'x', downloadError: 'y' }, { type: 'CLEAR_BILLING_ERROR' });
    expect(state.error).toBeNull();

    state = billingStatementReducer(state, { type: 'CLEAR_DOWNLOAD_ERROR' });
    expect(state.downloadError).toBeNull();
  });

  it('handles billing breakdown flow', () => {
    let state = billingStatementReducer(undefined, { type: types.FETCH_BILLING_BREAKDOWN_REQUEST });
    expect(state.loading).toBe(true);

    state = billingStatementReducer(state, {
      type: types.FETCH_BILLING_BREAKDOWN_SUCCESS,
      payload: { billingBreakdown: [{ amount: 10 }] },
    });
    expect(state.loading).toBe(false);
    expect(state.billingBreakdown).toEqual([{ amount: 10 }]);

    state = billingStatementReducer(state, {
      type: types.FETCH_BILLING_BREAKDOWN_FAILURE,
      payload: { error: 'bad-breakdown' },
    });
    expect(state.error).toBe('bad-breakdown');
  });
});
