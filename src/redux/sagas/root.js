import { all } from 'redux-saga/effects';
import appSagas from './HomeSaga';

function* rootSaga() {
  yield all([
    appSagas(),
  ]);
}

export default rootSaga;