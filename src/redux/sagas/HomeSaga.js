import { call, put, takeLatest, takeEvery } from "redux-saga/effects";
import {getCurrentSpeedInfo} from "../../network/apis/account/dashboard.service";
import { Action } from "../constants";
import { storeListData, apiCalled } from "../actions/DashboardAction";
// yield pauses and resume the generator functions
function* getInternetSpeed(action) {
  console.log("getCurrentSpeed",action.payload);
   try {
     const response = yield call(getCurrentSpeedInfo,action.payload)
     if (response.status == 200) {
      console.log('Response Data',response)
       // to fire another action, use put method
       // here I am storing the data by firing action LIST_FETCHED
       //yield put(storeListData(response.data));
       // for calling another generator funtion use call method
     } else {
        // handle other response code
     }
    } catch (error) {
      console.log(error);
    } finally {
      //yield put(apiCalled());
    }
}
function* appSagas() { 
    yield takeLatest(Action.GET_INTERNET_SPEED, getInternetSpeed);
}
export default appSagas;