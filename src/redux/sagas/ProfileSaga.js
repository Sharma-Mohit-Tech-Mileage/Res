import { call, put, takeLatest, takeEvery } from "redux-saga/effects";
import {
    getProfileDetails, fetchUserList,
    fetchSmsSubscription, fetchBillingStatus,
    postProfileInfo, postTextNotifictionInfo,
    fetchPaperLessDetails, postEmailNotification,
    postTermsAndConditions, postPushNotifications,
    unsubscribPaperLess, fetchPushNotifications
} from "../../network/apis/account/profile.service";
import {
    FETCH_PROFILE_DETAILS, FETCH_USER_LIST,
    FETCH_SMS_SELECTION, UPDATE_PROFILE_REQUEST,
    UPDATE_PROFILE_SECURITY, UPDATE_TEXT_NOTIFICATION,
    FETCH_EMIAL_SELECTION, FETCH_PAPERLESS,
    UPDATE_EMAIL_NOTIFICATION, UPDATE_TERMS_AND_CONDITIONS,
    UPDATE_PUSH_NOTIFICATIONS, UNSUBSCRIBE_PAPERLESS,
    FETCH_PUSH_NOTIFICATIONS
} from "../constants";
import {
    fetchProfileSuccess, fetchUserListSuccess,
    saveSMSSelection, saveEmailBillings,
    savePaperlessDetails, savePushNotifications
} from "../actions/ProfileActionSuite";

function* getProfileUsers(action) {
    try {
        const response = yield call(fetchUserList)
        yield put(fetchUserListSuccess(response));
    } catch (error) {
        console.error('API Error Response:', error);
    }
}

function* fetchProfileDetails(action) {
    try {
        const response = yield call(getProfileDetails)
        yield put(fetchProfileSuccess(response));
    } catch (error) {
        console.error('API Error Response:', error);
    }
}

function* fetchSMSSubs(action) {
    try {
        const response = yield call(fetchSmsSubscription)
        yield put(saveSMSSelection(response));
    } catch (error) {
        console.error('API Error Response:', error);
    }
}

function* fetchPaperlessBills(action) {
    try {
        const billingStatusResponse = yield call(fetchBillingStatus);
        yield put(saveEmailBillings(billingStatusResponse));
    } catch (error) {
        console.error('Fetch Billing Status API Error:', error);
        // Optionally, dispatch an action to handle this error state
    }
}

function* fetchPaperlessDetails(action) {
    try {
        const paperlessDetailsResponse = yield call(fetchPaperLessDetails);
        yield put(savePaperlessDetails(paperlessDetailsResponse));
    } catch (error) {
        console.error('Fetch Paperless Details API Error:', error);
        // Optionally, dispatch an action to handle this error state
    }
}

function* getPushNotifications(action) {
    try {
        const response = yield call(fetchPushNotifications, action.payload);
        yield put(savePushNotifications(response));
    } catch (error) {
        console.error('Fetch Paperless Details API Error:', error);
        // Optionally, dispatch an action to handle this error state
    }
}

function* updateProfile(action) {
    try {
        const response = yield call(postProfileInfo, action.payload);
        console.log('action.smsPayload', action.smsPayload)
        const textNotifiction = yield call(postTextNotifictionInfo, action.smsPayload);
        action.navigation.navigate('ProfileSettings', { updateSuccess: true });
    } catch (error) {
        action.navigation.navigate('ProfileSettingsEdit', { updateFailed: true });
        console.error('API Error Response:', error, action.payload); // Log the error response
    }
}

function* updateProfileSecurity(action) {
    try {

        const response = yield call(postProfileInfo, action.payload);
        console.log('API Success Response:', response); // Log the success response
        action.navigation.navigate('PasswordSecurity', { updateSuccess: true });
    } catch (error) {
        action.navigation.navigate('PasswordSecurityEdit', { updateFailed: true });
        console.error('API Error Response:', error, action.payload); // Log the error response
    }
}

function* updateTextNotification(action) {
    try {
        const response = yield call(postTextNotifictionInfo, action.payload);
        if (action.navigation !== null) {
            action.navigation.navigate('Notifications', { updateSuccess: true, updatedType: 'Text' });
        }
    } catch (error) {
        if (action.navigation !== null) {
            action.navigation.navigate('TextNotifications', { updateFailed: true });
        }
    }
}

function* updateEmailNotification(action) {
    try {
        const response = yield call(postEmailNotification, action.payload);
        if (action.navigation !== null) {
            action.navigation.navigate('Notifications', { updateSuccess: true, updatedType: 'Email' });
        }
    } catch (error) {
        if (action.navigation !== null) {
            action.navigation.navigate('EmailNotifications', { updateFailed: true, updatedType: 'Email' });
        }
    }
}

function* updateTermsAndConditions(action) {
    console.log('updateTermsAndConditions: ', action);
    try {
        yield call(postTermsAndConditions, action.payload);
        if (action.navigation !== null) {
            action.navigation.navigate('EntryPushNotifications');
        }
    } catch (error) {
        if (action.navigation !== null) {
            action.navigation.navigate('Terms', { updateFailed: true });
        }
    }
}

function* unsubscribPaperLessSaga(action) {
    try {
        const response = yield call(unsubscribPaperLess, action.payload);
        action.navigation.navigate('Notifications', { updateSuccess: true, updatedType: 'Email' });
    } catch (error) {
        action.navigation.navigate('EmailNotifications', { updateFailed: true, updatedType: 'Email' });
    }
}

function* updatePushNotifications(action) {
    console.log('updatePushNotification: ', action);
    try {
        yield call(postPushNotifications, action.payload);
        if (action.navigation !== null) {
            action.navigation.navigate('EntryTextNotifications');
        }
    } catch (error) {
        if (action.navigation !== null) {
            action.navigation.navigate('EntryPushNotifications', { updateFailed: true });
        }
    }
}

function* ProfileSagas() {
    yield takeLatest(FETCH_PROFILE_DETAILS, fetchProfileDetails);
    yield takeLatest(FETCH_USER_LIST, getProfileUsers);
    yield takeLatest(FETCH_SMS_SELECTION, fetchSMSSubs);
    yield takeLatest(FETCH_EMIAL_SELECTION, fetchPaperlessBills);
    yield takeLatest(FETCH_PAPERLESS, fetchPaperlessDetails);
    yield takeLatest(FETCH_PUSH_NOTIFICATIONS, getPushNotifications);
    yield takeLatest(UPDATE_PROFILE_REQUEST, updateProfile);
    yield takeLatest(UPDATE_PROFILE_SECURITY, updateProfileSecurity);
    yield takeLatest(UPDATE_TEXT_NOTIFICATION, updateTextNotification);
    yield takeLatest(UPDATE_EMAIL_NOTIFICATION, updateEmailNotification);
    yield takeLatest(UPDATE_TERMS_AND_CONDITIONS, updateTermsAndConditions);
    yield takeLatest(UPDATE_PUSH_NOTIFICATIONS, updatePushNotifications);
    yield takeLatest(UNSUBSCRIBE_PAPERLESS, unsubscribPaperLessSaga);
}
export default ProfileSagas;