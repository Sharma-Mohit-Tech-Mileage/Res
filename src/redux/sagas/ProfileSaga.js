import { call, put, takeLatest, takeEvery } from "redux-saga/effects";
import { getProfileDetails, fetchUserList, fetchSmsSubscription } from "../../network/apis/account/profile.service";
import { FETCH_PROFILE_DETAILS, FETCH_USER_LIST,FETCH_SMS_SELECTION } from "../constants";
import { fetchProfileSuccess, fetchUserListSuccess , saveSMSSelection} from "../actions/ProfileActionSuite";

function* getProfileUsers(action) {
    try {
        const response = yield call(fetchUserList)
        yield put(fetchUserListSuccess(response));

    } catch (error) {
        console.log(error);
    } finally {
        //yield put(apiCalled());
    }
}

function* fetchProfileDetails(action) {
    try {
        const response = yield call(getProfileDetails)
        //console.log("getProfileDetails API Called", response);
        yield put(fetchProfileSuccess(response));

    } catch (error) {
        console.log(error);
    } finally {
        //yield put(apiCalled());
    }
}

function* fetchSMSSubs(action) {
    try {
        const response = yield call(fetchSmsSubscription)
        //console.log("fetchSmsSubscription API Called", response);
        yield put(saveSMSSelection(response));

    } catch (error) {
        console.log(error);
    } finally {
        //yield put(apiCalled());
    }
}

function* ProfileSagas() {
    yield takeLatest(FETCH_PROFILE_DETAILS, fetchProfileDetails);
    yield takeLatest(FETCH_USER_LIST, getProfileUsers);
    yield takeLatest(FETCH_SMS_SELECTION, fetchSMSSubs);
}
export default ProfileSagas;