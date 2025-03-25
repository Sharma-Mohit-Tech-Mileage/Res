import { all, fork } from 'redux-saga/effects';
import appSagas from './HomeSaga';
import ProfileSagas from './ProfileSaga';
import NotificationSaga from './NotificationSaga';
import watchPaymentHistoryActions from './paymentHistorySaga';
import watchBillingStatementActions from './billingStatementSaga';
function* rootSaga() {
  yield all([
    //fork (userSagas),
    fork (appSagas),
    fork(ProfileSagas),
    fork(NotificationSaga),
    fork(watchBillingStatementActions),
    fork(watchPaymentHistoryActions),
  ]);
}

export default rootSaga;