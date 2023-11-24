import { call, put, takeLatest, takeEvery } from "redux-saga/effects";
import {delay} from 'redux-saga';
import {ssoLoginApi} from "../../network/apis/account/LoginService";
import { SSO_LOGIN_REQUEST } from "../constants";
 import { saveUserInfo } from "../actions/UserAction";

// yield pauses and resume the generator functions
 function* ssoLogin(action) {
   try {
     const response = yield call(ssoLoginApi,action.payload)
      yield put(saveUserInfo(response))
    } catch (error) {
      console.log("Server Error",error);
    } finally {
      //yield put(apiCalled());
    }
}
function* userSagas() { 
    yield takeLatest(SSO_LOGIN_REQUEST, ssoLogin);
}
export default userSagas;