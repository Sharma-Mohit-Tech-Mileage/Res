import * as types from '../../../src/redux/constants/billingStatementTypes';
import * as actions from '../../../src/redux/actions/billingStatementActions';

describe('billingStatementActions', () => {
  it('creates fetch billing statements actions', () => {
    expect(actions.fetchBillingStatements()).toEqual({ type: types.FETCH_BILLING_STATEMENTS_REQUEST });
    expect(actions.fetchBillingStatementsSuccess([{ id: '1' }])).toEqual({
      type: types.FETCH_BILLING_STATEMENTS_SUCCESS,
      payload: { statements: [{ id: '1' }] },
    });
    expect(actions.fetchBillingStatementsFailure('err')).toEqual({
      type: types.FETCH_BILLING_STATEMENTS_FAILURE,
      payload: { error: 'err' },
    });
  });

  it('creates download statement actions', () => {
    expect(actions.downloadStatement('s1')).toEqual({
      type: types.DOWNLOAD_STATEMENT_REQUEST,
      payload: { statementId: 's1' },
    });
    expect(actions.downloadStatementSuccess({ id: 's1' })).toEqual({
      type: types.DOWNLOAD_STATEMENT_SUCCESS,
      payload: { statementData: { id: 's1' } },
    });
    expect(actions.downloadStatementFailure('oops')).toEqual({
      type: types.DOWNLOAD_STATEMENT_FAILURE,
      payload: { error: 'oops' },
    });
  });

  it('creates ui and clear actions', () => {
    expect(actions.setSelectedYear('2026')).toEqual({
      type: types.SET_SELECTED_YEAR,
      payload: { year: '2026' },
    });
    expect(actions.setSortDirection('asc')).toEqual({
      type: types.SET_SORT_DIRECTION,
      payload: { direction: 'asc' },
    });
    expect(actions.clearBillingError()).toEqual({ type: types.CLEAR_BILLING_ERROR });
    expect(actions.clearDownloadError()).toEqual({ type: types.CLEAR_DOWNLOAD_ERROR });
    expect(actions.clearDownloadedStatement()).toEqual({ type: types.CLEAR_DOWNLOADED_STATEMENT });
  });

  it('creates billing breakdown actions', () => {
    expect(actions.fetchBillingBreakdown()).toEqual({ type: types.FETCH_BILLING_BREAKDOWN_REQUEST });
    expect(actions.fetchBillingBreakdownSuccess({ total: 10 })).toEqual({
      type: types.FETCH_BILLING_BREAKDOWN_SUCCESS,
      payload: { billingBreakdown: { total: 10 } },
    });
    expect(actions.fetchBillingBreakdownFailure('bad')).toEqual({
      type: types.FETCH_BILLING_BREAKDOWN_FAILURE,
      payload: { error: 'bad' },
    });
  });
});
