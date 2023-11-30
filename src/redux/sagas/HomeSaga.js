import { call, put, takeLatest, takeEvery } from "redux-saga/effects";
import {getCurrentSpeedInfo,getAccountInfo} from "../../network/apis/account/dashboard.service";
import { GET_ACCOUNT_INFO, GET_INTERNET_SPEED } from "../constants";
import { updateCurrentSpeed,updateAccountInfo } from "../actions/DashboardAction";
// yield pauses and resume the generator functions
function* getInternetSpeed(action) {
   try {
     const response = yield call(getCurrentSpeedInfo,action.payload)
     console.log('data',response)
     yield put(updateCurrentSpeed(response));
     
    } catch (error) {
      console.log(error);
    } finally {
      //yield put(apiCalled());
    }
}
function* getUserAccountInfo(action) {
  try {
    const response = yield call(getAccountInfo,action.payload)
    console.log('Account Info',response)
    yield put(updateAccountInfo(response));
    
   } catch (error) {
     console.log(error);
   } finally {
     //yield put(apiCalled());
   }
}

function* appSagas() { 
    yield takeLatest(GET_INTERNET_SPEED, getInternetSpeed);
    yield takeLatest(GET_ACCOUNT_INFO, getUserAccountInfo);
}
export default appSagas;