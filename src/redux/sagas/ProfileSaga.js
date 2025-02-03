import { all, call, put, takeLatest } from "redux-saga/effects";
import { updateEmailList } from "../../components/utility/constant";
import { isPaperlessEnabled,getProfileDetails, fetchUserList, fetchSmsSubscription, fetchBillingStatus, postProfileInfo, postTextNotifictionInfo, fetchPaperLessDetails, postEmailNotification, putEmailNotification, postTermsAndConditions, postTermsAndConditionsv2, postPushNotifications, unsubscribPaperLess, fetchPushNotifications, handleSubmitFeedback, resendEmailVerification, logError, logInfo, addUserAction, removeUser, editUserAction, fetchSecurityQuestions, fetchAllSvEmails, addSVEmailNoFlags, deleteSVEmail, updateSVEmails, manageSVEmails, addSVEmailMktFlag } from "../../network/apis/account/profile.service";
import { FETCH_PROFILE_DETAILS, FETCH_USER_LIST, FETCH_SMS_SELECTION, UPDATE_PROFILE_REQUEST, UPDATE_PROFILE_SECURITY, UPDATE_TEXT_NOTIFICATION, FETCH_EMIAL_SELECTION, FETCH_PAPERLESS, UPDATE_EMAIL_NOTIFICATION, UPDATE_TERMS_AND_CONDITIONS, UPDATE_PUSH_NOTIFICATIONS, UNSUBSCRIBE_PAPERLESS, FETCH_PUSH_NOTIFICATIONS, UPDATE_PUSH_NOTIFICATIONS_V2, SAVE_USER_FEEDBACK, UPDATE_ENTRY_EMAIL_NOTIFICATION, UPDATE_EXISTING_EMAIL_NOTIFICATION, RESEND_EMAIL_VERIFICTION, LOG_ERROR, LOG_INFO, ADD_NEW_USER, DELETE_USER, EDIT_USER, GET_SECURITY_QUESTION, ALLSVEMAILASSOCIATED, ADD_SV_EMAIL_NO_FLAGS_REQUEST, DELETE_SV_EMAIL_REQUEST, UPDATE_SV_EMAILS_REQUEST, MANAGE_EMAIL_REQUEST, UPDATE_EMAIL_ASSOCIATIONS, SET_PAPERLESS_STATUS,GET_PAPERLESS_STATUS } from "../constants";
import { fetchProfileSuccess, fetchUserListSuccess, saveSMSSelection, saveEmailBillings, saveSvEmailAssociation, savePaperlessDetails, savePushNotifications, updatedSecurityQuestions,setPaperlessStatus } from "../actions/ProfileActionSuite";

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
        console.log('fetchProfileDetails API Success Response:', response);
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
            action.navigation.navigate('Notifications', { updateSuccess: true, updatedType: 'App' });
        }
    } catch (error) {
        if (action.navigation !== null) {
            action.navigation.navigate('InAppNotifications', { updateFailed: true, updatedType: 'App' });
        }
    }
}

function* resentVerifiction(action) {
    const { navigation } = action;
    console.log('resentVerifiction: action:', action);

    try {
        // Call the resend email verification function
        yield call(resendEmailVerification);

        const successMessage = 'Verification email resent successfully. Please check your inbox.';

        if (navigation) {
            console.log(`Navigating to Notifications screen with success message: ${successMessage}`);
            navigation.navigate('EmailNotifications', { updateSuccess: true, updatedType: 'Verification', successMessage });
        }
    } catch (error) {
        console.error('Error in resentVerifiction:', error);

        const failureMessage = 'Failed to resend verification email. Please try again later.';

        if (navigation) {
            console.log('Navigating back to Notifications with failure');
            navigation.navigate('EmailNotifications', { updateFailed: true, updatedType: 'Verification', failureMessage });
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
    }
}
function* fetchSvEmails(action) {
    console.log('fetchAllSvEmails API Success Response');
    try {
        const response = yield call(fetchAllSvEmails);
        yield put(saveSvEmailAssociation(response));
        console.log('fetchAllSvEmails API Success Response:', response);
    } catch (error) {
        console.error('fetchAllSvEmails API Error Response:', error, action.payload); // Log the error response
    }
}

function* handleAddSVEmailNoFlagsRequest(action) {
    try {
        const response = yield call(addSVEmailNoFlags, action.payload.email);
        if (action.navigation) action.navigation.navigate('SuccessScreen');
    } catch (error) {
        if (action.navigation) action.navigation.navigate('ErrorScreen');
    }
}
    
function* handleDeleteSVEmailRequest(action) {
    const { navigation } = action;
    const email = action.payload.email;
    const updatedList = updateEmailList([email], 'delete');
    try {
        yield call(manageSVEmails, updatedList);

        const successMessage = `Email address (${email}) was deleted successfully.`;

        if (navigation) {
            navigation.navigate('EmailNotifications', { updateSuccess: true, updatedType: 'Email', successMessage });
        }
    } catch (error) {
        const failureMessage = `Failed to delete email address (${email}).`;

        if (navigation) {
            navigation.navigate('EmailNotifications', { updateFailed: true, updatedType: 'Email', failureMessage });
        }
    }
}

function* handleUpdateSVEmailsRequest(action) {
    try {
        const response = yield call(updateSVEmails, action.payload.emailList);
        // Navigate on success, if needed
        if (action.navigation) action.navigation.navigate('SuccessScreen');
    } catch (error) {
        // Handle navigation on failure
        if (navigation) navigation.navigate('AddEmailNotification', { updateFailed: true, updatedType: 'Email' });
    }
}

function* handleManageEmailRequest(action) {
    const { email, isPaperless, isMarketing, newEmail } = action.payload;
    const { navigation } = action;
    console.log('handleManageEmailRequest: action.payload:', action.payload);
    console.log('handleManageEmailRequest: navigation:', navigation);
    try {
        let paperlessResponse = null;
        let marketingResponse = null;
        let successMessage = '';

        if (!isPaperless && !isMarketing) {
            console.log('Adding email with no flags:', email);
            const noFlagEmail = updateEmailList([email], null);
            const response = yield call(manageSVEmails, noFlagEmail);
            console.log('Email added with no flags successfully', response);
        } else if (isPaperless && isMarketing) {
            console.log('Adding email as paperless and updating for marketing:', email);
            const offMarketing = updateEmailList([email], 'add');
            [paperlessResponse, marketingResponse] = yield all([
                call(newEmail ? postEmailNotification : putEmailNotification, email),
                call(manageSVEmails, offMarketing)
            ]);
            console.log('Email added to paperless notifications and updated for marketing successfully');
        } else {
            if (isPaperless) {
                console.log('Adding email as paperless:', email);
                paperlessResponse = yield call(newEmail ? postEmailNotification : putEmailNotification, email);
                console.log('Email added to paperless notifications successfully', paperlessResponse);
            }

            if (isMarketing) {
                console.log('Updating email for marketing:', email);
                const offMarketing = updateEmailList([email], 'add');
                marketingResponse = yield call(manageSVEmails, offMarketing);
                console.log('Email updated for marketing successfully', marketingResponse);
            }
        }
        successMessage = `Email address (${email}) was added successfully.`;
        // Add the 24-hour reflection message specifically for paperless billing updates
        if (paperlessResponse) {
            successMessage += ' Please note that changes to paperless billing status may take up to 24 hours to reflect.';
        }

        if (paperlessResponse || marketingResponse) {
            console.log('Responses saved to store:', { paperlessResponse, marketingResponse });
        }

        if (navigation) {
            console.log(`Navigating to Notifications screen with success message: ${successMessage}`);
            navigation.navigate('EmailNotifications', {
                updateSuccess: true,
                updatedType: 'Email',
                successMessage
            });
        }
    } catch (error) {
        console.error('Error in handleManageEmailRequest:', error);
        if (navigation) {
            console.log('Navigating back to AddEmailNotification with failure');
            navigation.navigate('AddEmailNotification', { updateFailed: true, updatedType: 'Email' });
        }
    }
}

function* handleUpdateEmailAssociations(action) {
    const { paperlessEmail, marketingEmails } = action.payload;
    const { navigation } = action;
    console.log('handleUpdateEmailAssociations: action.payload:', action.payload);
    console.log('handleUpdateEmailAssociations: navigation:', navigation);
    const updatedList = updateEmailList(marketingEmails, 'Update');
    try {
        let paperlessResponse = null;
        let marketingResponse = null;
        let successMessage = '';

        if (paperlessEmail && marketingEmails && marketingEmails.length > 0) {
            console.log('Updating both paperless and marketing emails');
            [paperlessResponse, marketingResponse] = yield all([
                call(unsubscribPaperLess),
                call(manageSVEmails, updatedList)
            ]);
            successMessage = 'Email updated for both paperless billing and marketing. ';
            console.log('Both paperless and marketing emails updated successfully');
        } else {
            // If only paperlessEmail is present
            if (paperlessEmail) {
                console.log('Updating paperless email:', paperlessEmail);
                paperlessResponse = yield call(unsubscribPaperLess);
                successMessage = 'Your paperless email preferences have been successfully updated. ';
                console.log('Paperless email updated successfully');
            }

            // If only marketingEmails are present
            if (marketingEmails && marketingEmails.length > 0) {
                console.log('Updating marketing emails:', marketingEmails);
                marketingResponse = yield call(manageSVEmails, updatedList);
                successMessage += 'Your marketing email preferences have been successfully updated.';
                console.log('Marketing emails updated successfully');
            }
        }

        if (paperlessResponse) {
            // Add the 24-hour reflection message specifically for paperless billing updates
            successMessage += 'Please note that changes to paperless billing status may take up to 24 hours to reflect.';
        }

        if (paperlessResponse || marketingResponse) {
            // If either response is successful, save the responses and navigate to success screen
            console.log('Responses saved to store:', { paperlessResponse, marketingResponse });
            if (navigation) {
                console.log(`Navigating to Notifications screen with success message: ${successMessage}`);
                navigation.navigate('EmailNotifications', { updateSuccess: true, updatedType: 'Email', successMessage });
            }
        }
    } catch (error) {
        console.error('Error in handleUpdateEmailAssociations:', error);

        if (navigation) {
            console.log('Navigating back to EmailNotifications with failure');
            navigation.navigate('EmailNotifications', { updateFailed: true, updatedType: 'Email' });
        }
    }
}

function* checkPaperlessSaga(action) {
    const status = yield call(isPaperlessEnabled, action.payload.email);
    yield put(setPaperlessStatus(status));
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
    yield takeLatest(ALLSVEMAILASSOCIATED, fetchSvEmails);
    yield takeLatest(ADD_SV_EMAIL_NO_FLAGS_REQUEST, handleAddSVEmailNoFlagsRequest);
    yield takeLatest(DELETE_SV_EMAIL_REQUEST, handleDeleteSVEmailRequest);
    yield takeLatest(UPDATE_SV_EMAILS_REQUEST, handleUpdateSVEmailsRequest);
    yield takeLatest(MANAGE_EMAIL_REQUEST, handleManageEmailRequest);
    yield takeLatest(UPDATE_EMAIL_ASSOCIATIONS, handleUpdateEmailAssociations);
    yield takeLatest(GET_PAPERLESS_STATUS, checkPaperlessSaga);
}
export default ProfileSagas;