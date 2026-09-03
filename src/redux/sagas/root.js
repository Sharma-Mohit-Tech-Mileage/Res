import { all, fork } from 'redux-saga/effects';
import appSagas from './HomeSaga';
import ProfileSagas from './ProfileSaga';
import NotificationSaga from './NotificationSaga';
import watchPaymentHistoryActions from './paymentHistorySaga';
import watchBillingStatementActions from './billingStatementSaga';
import watchBillingBreakdownActions from './billingBreakdownSaga';
import watchBillExplainerActions from './billExplainerSaga';
import { watchServicesActions } from './servicesSaga';
function* rootSaga() {
  yield all([
    //fork (userSagas),
    fork (appSagas),
    fork(ProfileSagas),
    fork(NotificationSaga),
    fork(watchBillingStatementActions),
    fork(watchPaymentHistoryActions),
    fork(watchBillingBreakdownActions),
    fork(watchBillExplainerActions),
    fork(watchServicesActions),
  ]);
}

export default rootSaga;