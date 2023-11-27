import { call, put, takeLatest, takeEvery } from "redux-saga/effects";
import {getCurrentSpeedInfo} from "../../network/apis/account/dashboard.service";
import { GET_INTERNET_SPEED } from "../constants";
import { updateCurrentSpeed } from "../actions/DashboardAction";
// yield pauses and resume the generator functions
function* getInternetSpeed(action) {
  console.log("getCurrentSpeed",action.payload);
   try {
     const response = yield call(getCurrentSpeedInfo,action.payload)
     yield put(updateCurrentSpeed(response));
     
    } catch (error) {
      console.log(error);
    } finally {
      //yield put(apiCalled());
    }
}
function* appSagas() { 
    yield takeLatest(GET_INTERNET_SPEED, getInternetSpeed);
}
export default appSagas;