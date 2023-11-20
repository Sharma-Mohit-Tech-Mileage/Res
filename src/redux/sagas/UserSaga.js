import { call, put, takeLatest, takeEvery } from "redux-saga/effects";
import {ssoLoginApi} from "../../network/apis/account/LoginService";
import { Action } from "../constants";

// yield pauses and resume the generator functions
function* ssoLogin(action) {
   try {
     const response = yield call(ssoLoginApi,action.payload)
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
function* userSagas() { 
    yield takeLatest(Action.SSO_LOGIN_REQUEST, ssoLogin);
}
export default userSagas;