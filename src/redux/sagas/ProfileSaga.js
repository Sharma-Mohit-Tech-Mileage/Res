import { call, put, takeLatest} from "redux-saga/effects";

import {
    getProfileDetails, fetchUserList,
    fetchSmsSubscription, fetchBillingStatus,
    postProfileInfo, postTextNotifictionInfo,
    fetchPaperLessDetails, postEmailNotification,
    putEmailNotification, postTermsAndConditions, postTermsAndConditionsv2,
    postPushNotifications, unsubscribPaperLess,
    fetchPushNotifications, handleSubmitFeedback, resendEmailVerification, logError, logInfo,addUserAction,removeUser,editUserAction
} from "../../network/apis/account/profile.service";
import {
    FETCH_PROFILE_DETAILS, FETCH_USER_LIST,
    FETCH_SMS_SELECTION, UPDATE_PROFILE_REQUEST,
    UPDATE_PROFILE_SECURITY, UPDATE_TEXT_NOTIFICATION,
    FETCH_EMIAL_SELECTION, FETCH_PAPERLESS,
    UPDATE_EMAIL_NOTIFICATION, UPDATE_TERMS_AND_CONDITIONS,
    UPDATE_PUSH_NOTIFICATIONS, UNSUBSCRIBE_PAPERLESS,
    FETCH_PUSH_NOTIFICATIONS, UPDATE_PUSH_NOTIFICATIONS_V2,
    SAVE_USER_FEEDBACK, UPDATE_ENTRY_EMAIL_NOTIFICATION,
    UPDATE_EXISTING_EMAIL_NOTIFICATION, RESEND_EMAIL_VERIFICTION, LOG_ERROR, LOG_INFO,ADD_NEW_USER,DELETE_USER,EDIT_USER
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

    }
}

function* updateNewEmail(action) {
    try {
        const response = yield call(postEmailNotification, action.payload);
        try {
            if (action.isEmailChanged === true) {
                yield call(postProfileInfo, action.ProfilePayLoad);
            }
        } catch (secondError) {
            if (action.navigation !== null) {
                action.navigation.navigate('EmailNotifications', { updateFailed: true, updatedType: 'Email' });
            }
        }
        if (action.navigation !== null) {
            action.navigation.navigate('Notifications', { updateSuccess: true, updatedType: 'Email' });
        }
    } catch (error) {
        if (action.navigation !== null) {
            action.navigation.navigate('EmailNotifications', { updateFailed: true, updatedType: 'Email' });
        }
    }
}


function* updateProfile(action) {
    try {
        console.log('updateProfile: ', JSON.stringify(action.payload));
        const response = yield call(postProfileInfo, action.payload);
        //console.log('action.smsPayload', action.smsPayload)
        // const textNotifiction = yield call(postTextNotifictionInfo, action.smsPayload);
        action.navigation.navigate('ProfileSettings', { updateSuccess: true });
    } catch (error) {
        action.navigation.navigate('ProfileSettingsEdit', { updateFailed: true });
        console.error('API Error Response:', error, action.payload); // Log the error response
    }
}

function* saveUserFeedBack(action) {
    try {
        const response = yield call(handleSubmitFeedback, action.payload);
        action.navigation.navigate('ThumbsUp', { updateSuccess: true });
    } catch (error) {
        action.navigation.navigate('Feedback', { updateFailed: true });
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
        const response = yield call(putEmailNotification, action.payload);
        try {
            if (action.isEmailChanged === true) {
                yield call(postProfileInfo, action.ProfilePayLoad);
            }
        } catch (secondError) {
            if (action.navigation !== null) {
                action.navigation.navigate('EmailNotifications', { updateFailed: true, updatedType: 'Email' });
            }
        }
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
        yield call(postTermsAndConditionsv2, action.payload);
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
function* updatePushNotificationsV2(action) {
    try {
        yield call(postPushNotifications, action.payload);
        if (action.navigation !== null) {
            action.navigation.navigate('Notifications', { updateSuccess: true, updatedType: 'In-app' });
        }
    } catch (error) {
        if (action.navigation !== null) {
            action.navigation.navigate('InAppNotifications', { updateFailed: true, updatedType: 'In-app' });
        }
    }
}

function* resentVerifiction(action) {

    try {
        // Call the resend email verification function
        yield call(resendEmailVerification);


        if (action.navigation !== null) {
            action.navigation.navigate('Notifications', { resentNotification: true, updatedType: true });
        }
    } catch (error) {


        if (action.navigation !== null) {
            action.navigation.navigate('Notifications', { resentNotification: true, updatedType: false });
        }
    }
}

function* updateEntryEmailNotification(action) {
    try {
        const profile = action.payload.profile;
        const updateEmail = action.payload.email;
        const oldEmail = action.payload.profile.svEmailAddress;

        if (updateEmail !== oldEmail) {
            profile.svEmailAddress = updateEmail;
            profile.email = oldEmail;
            yield call(postProfileInfo, profile);
        }

        yield call(postEmailNotification, updateEmail);
        action.navigation.navigate('MyTab');
    } catch (error) {
        action.navigation.navigate('EntryEmailNotifications', { updateFailed: true });
        console.error('API Error Response:', error, action.payload); // Log the error response
    }
}

function* logErrorSaga(action) {
    try {
        const response = yield call(logError, action.payload)
    } catch (error) {
        console.error('API Error Response:', error);
    }
}

function* logInfoSaga(action) {
    try {
        const response = yield call(logInfo, action.payload);

    } catch (error) {
        console.error('API Error Response:', error);
    }
}

// Add,Edit and delete User

function* addUser(action) {
    try {

        const response = yield call(addUserAction, action.payload);
        console.log('API Success Response:', response); // Log the success response
        if (response) {
            action.navigation(true, "")
            //action.navigation.navigate('UserManagement', { updateSuccess: true });
        }
    } catch (error) {
        if (error?.response) {
            action.navigation(false, error?.response.data)
        } else {
            action.navigation(false, "")
        }
        console.log('Error:', error)
        //action.navigation.navigate('PasswordSecurityEdit', { updateFailed: true });
        //console.error('API Error Response:', error, action.payload); // Log the error response
    }
}


function* editUser(action) {
    try {

        const response = yield call(editUserAction, action.payload);
        console.log('API Success Response:', response); // Log the success response
        action.navigation(true)
    } catch (error) {
        action.navigation(false)
        console.log('Error', error.response.data)
        //action.navigation.navigate('PasswordSecurityEdit', { updateFailed: true });
        //console.error('API Error Response:', error, action.payload); // Log the error response
    }
}

function* deleteUser(action) {
    try {

        const response = yield call(removeUser, action.payload);
        console.log('API Success Response:', response); // Log the success response
        //if(response){
        // action.navigation.reset({
        //     index: 0,
        //     routes: [{ name: "UserManagement" }],
        //   });
        //  }
        action.navigation(true)
    } catch (error) {
        action.navigation(false)
        console.error('API Error Response:', error, action.payload); // Log the error response


    




        // Navigate on success, if needed
        // Handle navigation on failure






        // Add the 24-hour reflection message specifically for paperless billing updates






        // If both paperlessEmail and marketingEmails are present, use `all` to make the API calls concurrently
            // If only paperlessEmail is present

            // If only marketingEmails are present

            // Add the 24-hour reflection message specifically for paperless billing updates

            // If either response is successful, save the responses and navigate to success screen

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
    yield takeLatest(UPDATE_PUSH_NOTIFICATIONS_V2, updatePushNotificationsV2);
    yield takeLatest(UNSUBSCRIBE_PAPERLESS, unsubscribPaperLessSaga);
    yield takeLatest(SAVE_USER_FEEDBACK, saveUserFeedBack);
    yield takeLatest(UPDATE_ENTRY_EMAIL_NOTIFICATION, updateEntryEmailNotification);
    yield takeLatest(UPDATE_EXISTING_EMAIL_NOTIFICATION, updateNewEmail);
    yield takeLatest(RESEND_EMAIL_VERIFICTION, resentVerifiction);
    yield takeLatest(ADD_NEW_USER, addUser)
    yield takeLatest(DELETE_USER, deleteUser)
    yield takeLatest(EDIT_USER, editUser)
    yield takeLatest(LOG_ERROR, logErrorSaga);
    yield takeLatest(LOG_INFO, logInfoSaga);
}
export default ProfileSagas;