import { USER_PROFILE_DETAILS, SAVE_USER_LIST, FETCH_USER_LIST, FETCH_PROFILE_DETAILS,FETCH_SMS_SELECTION,SAVE_SMS_SELECTION } from '../constants';
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

// Action creator for saving the SMS selection
export const saveSMSSelection = (smsSelection) => {
    return {
        type: SAVE_SMS_SELECTION,
        payload: smsSelection
    };
};
