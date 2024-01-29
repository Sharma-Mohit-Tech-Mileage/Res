import { call, put, takeLatest} from "redux-saga/effects";
import {ssoLoginApi} from "../../network/apis/account/LoginService";
import { SSO_LOGIN_REQUEST } from "../constants";
 import { saveUserInfo } from "../actions/UserAction";

// yield pauses and resume the generator functions
 function* ssoLogin(action) {
   try {
     const response = yield call(ssoLoginApi,action.payload)
     console.log("user ka response", response)
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