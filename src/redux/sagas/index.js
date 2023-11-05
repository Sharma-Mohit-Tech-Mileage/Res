import { call, put, takeLatest, takeEvery } from "redux-saga/effects";
import { Action } from "../constants";
import { storeListData, apiCalled } from "../actions/LoginAction";
// yield pauses and resume the generator functions
function* getProductList() {
   try {
     const response = yield axios.get(url,{ headers: {} });
     if (response.status == 200) {
       // to fire another action, use put method
       // here I am storing the data by firing action LIST_FETCHED
       yield put(storeListData(response.data));
       // for calling another generator funtion use call method
     } else {
        // handle other response code
     }
    } catch (error) {
      console.log(error);
    } finally {
      yield put(apiCalled());
    }
}
function* appSagas() { 
    yield takeLatest(Action.FETCH_DATA, getProductList);
}
export default appSagas;