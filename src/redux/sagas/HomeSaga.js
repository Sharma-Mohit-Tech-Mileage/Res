import { call, put, takeLatest} from "redux-saga/effects";
import {getCurrentSpeedInfo, postCurrentSpeedInfo, getAccountInfo} from "../../network/apis/account/dashboard.service";
import { GET_ACCOUNT_INFO, GET_INTERNET_SPEED, POST_INTERNET_SPEED } from "../constants";
import { updateCurrentSpeed,updateAccountInfo } from "../actions/DashboardAction";
// yield pauses and resume the generator functions
function* getInternetSpeed(action) {
   try {
     const response = yield call(getCurrentSpeedInfo)
     yield put(updateCurrentSpeed(response));
     
    } catch (error) {
      console.log(error);
    } finally {
      //yield put(apiCalled());
    }
}

function* postInternetSpeed(action) {
  try {
    yield call(postCurrentSpeedInfo,action.payload);
    //Doing this because call fails on uat
    const getResults = yield call(getCurrentSpeedInfo);
    console.log('getResults:', getResults);
    yield put(updateCurrentSpeed(getResults));
   } catch (error) {
     console.log(error);
     //Doing this because call fails on uat
     const getResults = yield call(getCurrentSpeedInfo);
     console.log('getResults:', getResults);
     yield put(updateCurrentSpeed(getResults));

   } finally {
     //yield put(apiCalled());
   }
}

function* getUserAccountInfo(action) {
  try {
    const response = yield call(getAccountInfo,action.payload)
    yield put(updateAccountInfo(response));
    
   } catch (error) {
     console.log(error);
   } finally {
     //yield put(apiCalled());
   }
}

function* appSagas() { 
    yield takeLatest(GET_INTERNET_SPEED, getInternetSpeed);
    yield takeLatest(POST_INTERNET_SPEED, postInternetSpeed);
    yield takeLatest(GET_ACCOUNT_INFO, getUserAccountInfo);
}
export default appSagas;