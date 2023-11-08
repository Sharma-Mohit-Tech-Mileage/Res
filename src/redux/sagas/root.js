import { all } from 'redux-saga/effects';
import homeSaga from './HomeSaga';

function* rootSaga() {
  yield all([
    homeSaga(),
  ]);
}

export default rootSaga;