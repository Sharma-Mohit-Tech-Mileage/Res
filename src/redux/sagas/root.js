import { all } from 'redux-saga/effects';
import appSagas from './HomeSaga';
import userSagas from './UserSaga';

function* rootSaga() {
  yield all([
    userSagas(),
    appSagas(),
  ]);
}

export default rootSaga;