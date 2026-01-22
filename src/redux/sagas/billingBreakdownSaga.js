import { call, put, takeLatest } from 'redux-saga/effects';
import * as types from '../constants/billingBreakdownTypes';
import * as actions from '../actions/billingBreakdownActions';
import billingStatementApi from '../../network/apis/account/billingBreakdown.service';

function* fetchBillingBreakdownSaga() {
  try {
    // Call API (currently using mock data)
    const breakdownData = yield call(billingStatementApi.fetchBillingBreakdown);
    console.log('Fetched billing breakdown:', breakdownData);

    // Dispatch success action with data
    if(breakdownData?.data.statusCode==404){
      yield put(actions.fetchBillingBreakdownFailure('No billing breakdown data available '+breakdownData.data.statusCode));

    }else{
    if(breakdownData.status==200){
    yield put(actions.fetchBillingBreakdownSuccess(breakdownData.data));
    }else{
      yield put(actions.fetchBillingBreakdownFailure('Failed to fetch billing breakdown: ' + breakdownData.status));
    }
  }
  } catch (error) {
    console.error('Error in fetchBillingBreakdownSaga:', error);
    // Dispatch error action
    yield put(actions.fetchBillingBreakdownFailure(error.message || 'Failed to fetch billing breakdown'));
  }
}

// Watcher Saga: Watch for billing breakdown actions
export function* watchBillingBreakdownActions() {
  yield takeLatest(types.FETCH_BILLING_BREAKDOWN_REQUEST, fetchBillingBreakdownSaga);
}

export default watchBillingBreakdownActions;