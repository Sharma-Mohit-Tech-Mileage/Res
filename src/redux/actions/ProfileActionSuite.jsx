import {
    USER_PROFILE_DETAILS, SAVE_USER_LIST,
    FETCH_USER_LIST, FETCH_PROFILE_DETAILS,
    FETCH_SMS_SELECTION, SAVE_SMS_SELECTION,
    UPDATE_PROFILE_REQUEST, UPDATE_PROFILE_SECURITY,
    UPDATE_TEXT_NOTIFICATION, SAVE_EMAIL_SELECTION,
    FETCH_EMIAL_SELECTION, SAVE_PAPERLESS_DETAILS,
    FETCH_PAPERLESS, UPDATE_EMAIL_NOTIFICATION,
    UPDATE_TERMS_AND_CONDITIONS, UNSUBSCRIBE_PAPERLESS,
    UPDATE_PUSH_NOTIFICATIONS, FETCH_PUSH_NOTIFICATIONS,
    SAVE_PUSH_NOTIFICATIONS, UPDATE_PUSH_NOTIFICATIONS_V2,
    SAVE_USER_FEEDBACK
} from '../constants';
export const fetchProfileSuccess = (response) => {
    return {
        type: USER_PROFILE_DETAILS,
        payload: response
    };
};
export const fetchProfileDetails = () => {
    return {
        type: FETCH_PROFILE_DETAILS
    };
};
export const unsubscribePaperless = (navigation) => {
    return {
        type: UNSUBSCRIBE_PAPERLESS,
        navigation
    };
};
export const fetchUserListSuccess = (response) => {
    return {
        type: SAVE_USER_LIST,
        payload: response
    };
};
export const executeUserList = (accountId) => {
    return {
        type: FETCH_USER_LIST,
        payload: accountId
    };
};
// Action creator for fetching the SMS selection status
export const fetchSMSSelection = () => {
    return {
        type: FETCH_SMS_SELECTION
    };
};

// Action creator for fetching the SMS selection status
export const fetchBillingStatus = () => {
    return {
        type: FETCH_EMIAL_SELECTION
    };
};

// Action creator for fetching the SMS selection status
export const fetchBillingPaper = () => {
    return {
        type: FETCH_PAPERLESS
    };
};
// Action creator for fetching the SMS selection status
export const fetchPushNotifications = () => {
    return {
        type: FETCH_PUSH_NOTIFICATIONS
    };
};
export const savePushNotifications = (data) => {
    return {
        type: SAVE_PUSH_NOTIFICATIONS,
        payload: data
    };
};
// Action creator for saving the SMS selection
export const saveSMSSelection = (data) => {
    return {
        type: SAVE_SMS_SELECTION,
        payload: data
    };
};

// Action creator for saving the SMS selection
export const saveEmailBillings = (data) => {
    return {
        type: SAVE_EMAIL_SELECTION,
        payload: data
    };
};

export const savePaperlessDetails = (data) => {
    return {
        type: SAVE_PAPERLESS_DETAILS,
        payload: data
    };
};

// Action creator
export const updateProfileRequest = (data, smsPayload, navigation) => ({
    type: UPDATE_PROFILE_REQUEST,
    payload: data,
    smsPayload: smsPayload,
    navigation,
});

// Action creator
export const updateProfileSecurity = (data, navigation) => ({
    type: UPDATE_PROFILE_SECURITY,
    payload: data,
    navigation,
});

export const updateTextNotification = (data, navigation) => ({
    type: UPDATE_TEXT_NOTIFICATION,
    payload: data,
    navigation,
});

export const updateEmailNotification = (data, navigation) => ({
    type: UPDATE_EMAIL_NOTIFICATION,
    payload: data,
    navigation,
});

export const updateTermsAndConditions = (data, navigation) => ({
    type: UPDATE_TERMS_AND_CONDITIONS,
    payload: data,
    navigation,
});

export const updatePushNotifications = (data, navigation) => ({
    type: UPDATE_PUSH_NOTIFICATIONS,
    payload: data,
    navigation,
});
export const updatePushNotificationsv2 = (data, navigation) => ({
    type: UPDATE_PUSH_NOTIFICATIONS_V2,
    payload: data,
    navigation,
});
export const saveUserFeedback = (data, navigation) => ({
    type: SAVE_USER_FEEDBACK,
    payload: data,
    navigation,
});

