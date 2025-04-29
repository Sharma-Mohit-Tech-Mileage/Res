import { all, fork } from 'redux-saga/effects';
import appSagas from './HomeSaga';
import ProfileSagas from './ProfileSaga';
import NotificationSaga from './NotificationSaga';
import watchPaymentHistoryActions from './paymentHistorySaga';
import watchBillingStatementActions from './billingStatementSaga';
import watchBillingBreakdownActions from './billingBreakdownSaga';
function* rootSaga() {
  yield all([
    //fork (userSagas),
    fork (appSagas),
    fork(ProfileSagas),
    fork(NotificationSaga),
    fork(watchBillingStatementActions),
    fork(watchPaymentHistoryActions),
    fork(watchBillingBreakdownActions),
  ]);
}

export default rootSaga;