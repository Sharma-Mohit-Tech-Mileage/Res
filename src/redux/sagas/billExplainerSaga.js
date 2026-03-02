import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from '../constants/billingBreakdownTypes';
import * as actions from '../actions/billingBreakdownActions';
import billingStatementApi from '../../network/apis/account/billingBreakdown.service';

function* fetchBillExplainerSaga(action) {
  try {
    console.log("Request Body for Bill Explainer:", action.payload);
    let {requestBody} = action.payload;
    const explainerData = yield call(billingStatementApi.fetchBillExplainer, requestBody);
    console.log('Fetched bill explainer:', explainerData);

    if(explainerData?.data.statusCode === 404) {
      yield put(actions.fetchBillExplainerFailure('No bill explainer data available ' + explainerData.data.statusCode));
    } else if(explainerData.status === 200) {
      yield put(actions.fetchBillExplainerSuccess(explainerData.data));
    } else {
      yield put(actions.fetchBillExplainerFailure('Failed to fetch bill explainer: ' + explainerData.status));
    }
  } catch (error) {
    console.error('Error in fetchBillExplainerSaga:', error);
    yield put(actions.fetchBillExplainerFailure(error.message || 'Failed to fetch bill explainer'));
  }
}

export function* watchBillExplainerActions() {
  yield takeLatest(types.FETCH_BILL_EXPLAINER_REQUEST, fetchBillExplainerSaga);
}


export default watchBillExplainerActions;