import { all, fork } from 'redux-saga/effects';
import appSagas from './HomeSaga';
//import userSagas from './UserSaga';
import ProfileSagas from './ProfileSaga';
import NotificationSaga from './NotificationSaga';
function* rootSaga() {
  yield all([
    //fork (userSagas),
    fork (appSagas),
    fork(ProfileSagas),
    fork(NotificationSaga)
  ]);
}

export default rootSaga;