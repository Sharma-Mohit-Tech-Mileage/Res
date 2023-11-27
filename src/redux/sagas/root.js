import { all, fork } from 'redux-saga/effects';
import appSagas from './HomeSaga';
import userSagas from './UserSaga';

function* rootSaga() {
  yield all([
    fork (userSagas),
    fork (appSagas),
  ]);
}

export default rootSaga;