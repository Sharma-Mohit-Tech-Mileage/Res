import { all, fork } from 'redux-saga/effects';
import appSagas from './HomeSaga';
//import userSagas from './UserSaga';
import ProfileSagas from './ProfileSaga';

function* rootSaga() {
  yield all([
    //fork (userSagas),
    fork (appSagas),
    fork(ProfileSagas),
  ]);
}

export default rootSaga;