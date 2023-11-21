import { call, put, takeLatest, takeEvery } from "redux-saga/effects";
import {ssoLoginApi} from "../../network/apis/account/LoginService";
import { SSO_LOGIN_REQUEST } from "../constants";
 import { saveUserInfo } from "../actions/UserAction";

// yield pauses and resume the generator functions
 function* ssoLogin(action) {
   try {
     const response = yield call(ssoLoginApi,action.payload)
     console.log('Response Data1',response.data)
     yield put(saveUserInfo(response.data))
     if (response.status == 200) {
      if(response.data){
       //put(saveUserInfo(response.data))
      }
       
     } else {
        // handle other response code
     }
    } catch (error) {
      console.log("Server Error");
    } finally {
      //yield put(apiCalled());
    }
}
function* userSagas() { 
    yield takeLatest(SSO_LOGIN_REQUEST, ssoLogin);
}
export default userSagas;