import * as notificationActions from '../src/redux/actions/NotificationActionSuite';
import * as servicesActions from '../src/redux/actions/servicesActions';
import * as paymentActions from '../src/redux/actions/paymentHistoryActions';
import * as breakdownActions from '../src/redux/actions/billingBreakdownActions';
import * as statementActions from '../src/redux/actions/billingStatementActions';
import * as userActions from '../src/redux/actions/UserAction';
import * as dashboardActions from '../src/redux/actions/DashboardAction';

import servicesReducer from '../src/redux/reducers/servicesReducer';
import paymentHistoryReducer from '../src/redux/reducers/paymentHistoryReducer';

describe('redux action creators coverage', () => {
  it('returns action objects for notification action suite', () => {
    const navigation = { navigate: jest.fn() };

    const actions = [
      notificationActions.setLoading(),
      notificationActions.clearLoading(),
      notificationActions.clearNotificationState(),
      notificationActions.getAllEmailsRequest(),
      notificationActions.getAllEmailsSuccess(['a@test.com']),
      notificationActions.getAllEmailsFailure('err'),
      notificationActions.getPaperlessStatusRequest('a@test.com'),
      notificationActions.getPaperlessStatusSuccess(true),
      notificationActions.getPaperlessStatusFailure('err'),
      notificationActions.enrollPaperlessRequest('a@test.com', navigation),
      notificationActions.enrollPaperlessSuccess({ ok: true }),
      notificationActions.enrollPaperlessFailure('err'),
      notificationActions.unenrollPaperlessRequest('a@test.com', navigation),
      notificationActions.unenrollPaperlessSuccess({ ok: true }),
      notificationActions.unenrollPaperlessFailure('err'),
      notificationActions.addPrimaryEmailRequest('new@test.com', 'old@test.com', navigation),
      notificationActions.addPrimaryEmailSuccess({ ok: true }),
      notificationActions.addPrimaryEmailFailure('err'),
      notificationActions.updatePrimaryEmailRequest('new@test.com', 'old@test.com', navigation),
      notificationActions.updatePrimaryEmailSuccess({ ok: true }),
      notificationActions.updatePrimaryEmailFailure('err'),
      notificationActions.updatePrimaryAndPaperlessRequest({ newEmail: 'x@test.com' }, navigation),
      notificationActions.updatePrimaryAndPaperlessSuccess({ ok: true }),
      notificationActions.updatePrimaryAndPaperlessFailure('err'),
    ];

    actions.forEach((action) => {
      expect(action).toBeTruthy();
      expect(action.type).toBeTruthy();
    });
  });

  it('returns action objects for services/payment/billing/user/dashboard actions', () => {
    const serviceActions = [
      servicesActions.fetchServiceDetailsRequest('123'),
      servicesActions.fetchServiceDetailsSuccess({ id: 1 }),
      servicesActions.fetchServiceDetailsFailure('err'),
      servicesActions.checkOutageStatusRequest('dashboard'),
      servicesActions.checkOutageStatusSuccess({ down: false }),
      servicesActions.checkOutageStatusFailure('err'),
      servicesActions.clearOutageData(),
      servicesActions.clearServicesError(),
      servicesActions.fetchCurrentUsageRequest(),
      servicesActions.fetchCurrentUsageSuccess({ gb: 10 }),
      servicesActions.fetchCurrentUsageFailure('err'),
      servicesActions.fetchMonthlyUsageRequest(),
      servicesActions.fetchMonthlyUsageSuccess({ months: [] }),
      servicesActions.fetchMonthlyUsageFailure('err'),
      servicesActions.fetchDailyUsageRequest('2026-01-01', '2026-01-31'),
      servicesActions.fetchDailyUsageSuccess({ days: [] }),
      servicesActions.fetchDailyUsageFailure('err'),
      servicesActions.fetchUsagePeriodsRequest(),
      servicesActions.fetchUsagePeriodsSuccess({ periods: [] }),
      servicesActions.fetchUsagePeriodsFailure('err'),
      servicesActions.clearDataUsage(),
    ];

    const payments = [
      paymentActions.fetchPaymentHistory(),
      paymentActions.fetchPaymentHistorySuccess([{ id: 1 }]),
      paymentActions.fetchPaymentHistoryFailure('err'),
      paymentActions.downloadPaymentReceipt('abc'),
      paymentActions.downloadPaymentReceiptSuccess({ id: 'abc' }),
      paymentActions.downloadPaymentReceiptFailure('err'),
      paymentActions.clearDownloadedReceipt(),
      paymentActions.setSortDirection('asc'),
      paymentActions.setSearchQuery('tx-1'),
      paymentActions.loadMorePayments(),
    ];

    const billingBreakdown = [
      breakdownActions.fetchBillExplainer({ account: '123' }),
      breakdownActions.fetchBillExplainerSuccess({ ok: true }),
      breakdownActions.fetchBillExplainerFailure('err'),
      breakdownActions.clearBillExplainerError(),
      breakdownActions.fetchBillingBreakdown(),
      breakdownActions.fetchBillingBreakdownSuccess({ totalDue: 10 }),
      breakdownActions.fetchBillingBreakdownFailure('err'),
      breakdownActions.resetTotalDue(),
      breakdownActions.clearBillingBreakdownError(),
    ];

    const billingStatements = [
      statementActions.fetchBillingStatements(),
      statementActions.fetchBillingStatementsSuccess([{ id: 1 }]),
      statementActions.fetchBillingStatementsFailure('err'),
      statementActions.downloadStatement('stmt-1'),
      statementActions.downloadStatementSuccess({ id: 'stmt-1' }),
      statementActions.downloadStatementFailure('err'),
      statementActions.setSelectedYear(2026),
      statementActions.setSortDirection('desc'),
      statementActions.clearBillingError(),
      statementActions.clearDownloadError(),
      statementActions.clearDownloadedStatement(),
    ];

    const user = [
      userActions.saveUserInfo({ name: 'Test' }),
      userActions.logoutApp(),
      userActions.logInfo({ info: true }),
      userActions.logError({ error: true }),
    ];

    const dashboard = [
      dashboardActions.getCurrentSpeed('123'),
      dashboardActions.postCurrentSpeed({ mbps: 500 }),
      dashboardActions.updateCurrentSpeed({ mbps: 450 }),
      dashboardActions.getAccountInfo('123'),
      dashboardActions.updateAccountInfo({ id: 'acct-1' }),
      dashboardActions.updateWalkThroughStep(2),
    ];

    [...serviceActions, ...payments, ...billingBreakdown, ...billingStatements, ...user, ...dashboard].forEach((action) => {
      expect(action).toBeTruthy();
      expect(action.type).toBeTruthy();
    });
  });
});

describe('redux reducers coverage', () => {
  it('handles major services reducer transitions', () => {
    let state = servicesReducer(undefined, { type: '@@INIT' });

    state = servicesReducer(state, {
      type: 'FETCH_SERVICE_DETAILS_REQUEST',
    });
    expect(state.serviceLoading).toBe(true);

    state = servicesReducer(state, {
      type: 'FETCH_SERVICE_DETAILS_SUCCESS',
      payload: { serviceData: { internet: true } },
    });
    expect(state.serviceLoading).toBe(false);
    expect(state.serviceData).toEqual({ internet: true });

    state = servicesReducer(state, {
      type: 'FETCH_SERVICE_DETAILS_FAILURE',
      payload: { error: 'svc error' },
    });
    expect(state.serviceError).toBe('svc error');

    state = servicesReducer(state, {
      type: 'CHECK_OUTAGE_STATUS_REQUEST',
      payload: { source: 'dashboard' },
    });
    expect(state.outageCheckingDashboard).toBe(true);

    state = servicesReducer(state, {
      type: 'CHECK_OUTAGE_STATUS_REQUEST',
      payload: { source: 'services' },
    });
    expect(state.outageCheckingServices).toBe(true);

    state = servicesReducer(state, {
      type: 'CHECK_OUTAGE_STATUS_SUCCESS',
      payload: { outageData: { active: false } },
    });
    expect(state.outageCheckingDashboard).toBe(false);

    state = servicesReducer(state, {
      type: 'CHECK_OUTAGE_STATUS_FAILURE',
      payload: { error: 'outage failed' },
    });
    expect(state.outageError).toBe('outage failed');

    state = servicesReducer(state, {
      type: 'FETCH_CURRENT_USAGE_REQUEST',
    });
    expect(state.currentUsageLoading).toBe(true);

    state = servicesReducer(state, {
      type: 'FETCH_CURRENT_USAGE_SUCCESS',
      payload: { data: { usedDataGB: 10 } },
    });
    expect(state.currentUsage.usedDataGB).toBe(10);

    state = servicesReducer(state, {
      type: 'FETCH_CURRENT_USAGE_FAILURE',
      payload: { error: 'current usage failed' },
    });
    expect(state.currentUsageError).toBe('current usage failed');

    state = servicesReducer(state, {
      type: 'FETCH_MONTHLY_USAGE_REQUEST',
    });
    expect(state.monthlyUsageLoading).toBe(true);

    state = servicesReducer(state, {
      type: 'FETCH_MONTHLY_USAGE_SUCCESS',
      payload: { data: [{ month: 'Jan' }] },
    });
    expect(state.monthlyUsage.length).toBe(1);

    state = servicesReducer(state, {
      type: 'FETCH_MONTHLY_USAGE_FAILURE',
      payload: { error: 'monthly usage failed' },
    });
    expect(state.monthlyUsageError).toBe('monthly usage failed');

    state = servicesReducer(state, {
      type: 'FETCH_DAILY_USAGE_REQUEST',
      payload: { startDate: '2026-01-01', endDate: '2026-01-02' },
    });
    expect(state.dailyUsageLoading).toBe(true);

    state = servicesReducer(state, {
      type: 'FETCH_DAILY_USAGE_SUCCESS',
      payload: { data: [{ day: 'Mon' }] },
    });
    expect(state.dailyUsage.length).toBe(1);

    state = servicesReducer(state, {
      type: 'FETCH_DAILY_USAGE_FAILURE',
      payload: { error: 'failed' },
    });
    expect(state.dailyUsageError).toBe('failed');

    state = servicesReducer(state, {
      type: 'FETCH_USAGE_PERIODS_REQUEST',
    });
    expect(state.usagePeriodsLoading).toBe(true);

    state = servicesReducer(state, {
      type: 'FETCH_USAGE_PERIODS_SUCCESS',
      payload: { data: [{ start: '2026-01-01', end: '2026-01-31' }] },
    });
    expect(state.usagePeriods.length).toBe(1);

    state = servicesReducer(state, {
      type: 'FETCH_USAGE_PERIODS_FAILURE',
      payload: { error: 'periods failed' },
    });
    expect(state.usagePeriodsError).toBe('periods failed');

    state = servicesReducer(state, {
      type: 'CLEAR_OUTAGE_DATA',
    });
    expect(state.outageData).toBeNull();

    state = servicesReducer(state, {
      type: 'CLEAR_SERVICES_ERROR',
    });
    expect(state.serviceError).toBeNull();
    expect(state.outageError).toBeNull();

    state = servicesReducer(state, {
      type: 'CLEAR_DATA_USAGE',
    });
    expect(state.currentUsage).toBeNull();
    expect(state.monthlyUsage).toBeNull();
    expect(state.dailyUsage).toBeNull();
  });

  it('handles payment history reducer sorting/search/pagination', () => {
    const sample = [
      { pymtDate: '2026-01-01', extTransactionId: 'AAA-1' },
      { pymtDate: '2026-01-05', extTransactionId: 'BBB-2' },
      { pymtDate: '2026-01-03', extTransactionId: 'CCC-3' },
    ];

    let state = paymentHistoryReducer(undefined, { type: '@@INIT' });

    state = paymentHistoryReducer(state, {
      type: 'FETCH_PAYMENT_HISTORY_REQUEST',
    });
    expect(state.loading).toBe(true);

    state = paymentHistoryReducer(state, {
      type: 'FETCH_PAYMENT_HISTORY_SUCCESS',
      payload: { payments: sample },
    });
    expect(state.loading).toBe(false);
    expect(state.payments.length).toBe(3);

    state = paymentHistoryReducer(state, {
      type: 'SET_SORT_DIRECTION_PAYMENT',
      payload: { direction: 'asc' },
    });
    expect(state.sortDirection).toBe('asc');

    state = paymentHistoryReducer(state, {
      type: 'SET_SEARCH_QUERY',
      payload: { query: 'bbb' },
    });
    expect(state.filteredPayments.length).toBe(1);

    state = paymentHistoryReducer(state, {
      type: 'LOAD_MORE_PAYMENTS',
    });
    expect(state.currentPage).toBeGreaterThan(1);

    state = paymentHistoryReducer(state, {
      type: 'FETCH_PAYMENT_HISTORY_FAILURE',
      payload: { error: 'history failed' },
    });
    expect(state.error).toBe('history failed');

    state = paymentHistoryReducer(state, {
      type: 'DOWNLOAD_PAYMENT_RECEIPT_REQUEST',
    });
    expect(state.downloading).toBe(true);

    state = paymentHistoryReducer(state, {
      type: 'DOWNLOAD_PAYMENT_RECEIPT_SUCCESS',
      payload: { receiptData: { id: 'r-1' } },
    });
    expect(state.downloadedReceipt).toEqual({ id: 'r-1' });

    state = paymentHistoryReducer(state, {
      type: 'DOWNLOAD_PAYMENT_RECEIPT_FAILURE',
      payload: { error: 'receipt failed' },
    });
    expect(state.downloadError).toBe('receipt failed');

    state = paymentHistoryReducer(state, {
      type: 'CLEAR_DOWNLOADED_RECEIPT',
    });
    expect(state.downloadedReceipt).toBeNull();

    state = paymentHistoryReducer(state, {
      type: 'CLEAR_PAYMENT_HISTORY_ERROR',
    });
    expect(state.error).toBeNull();

    state = paymentHistoryReducer(state, {
      type: 'CLEAR_DOWNLOAD_ERROR',
    });
    expect(state.downloadError).toBeNull();

    const unchanged = paymentHistoryReducer(state, { type: 'UNKNOWN_ACTION' });
    expect(unchanged).toBe(state);
  });
});
