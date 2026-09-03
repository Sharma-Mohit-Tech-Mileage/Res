import {
    SET_LOADING,
    CLEAR_LOADING,
    CLEAR_NOTIFICATION_STATE,
    GET_ALL_EMAILS_REQUEST,
    GET_ALL_EMAILS_SUCCESS,
    GET_ALL_EMAILS_FAILURE,
    GET_PAPERLESS_STATUS_REQUEST,
    GET_PAPERLESS_STATUS_SUCCESS,
    GET_PAPERLESS_STATUS_FAILURE,
    ENROLL_PAPERLESS_REQUEST,
    ENROLL_PAPERLESS_SUCCESS,
    ENROLL_PAPERLESS_FAILURE,
    UNENROLL_PAPERLESS_REQUEST,
    UNENROLL_PAPERLESS_SUCCESS,
    UNENROLL_PAPERLESS_FAILURE,
    ADD_PRIMARY_EMAIL_REQUEST,
    ADD_PRIMARY_EMAIL_SUCCESS,
    ADD_PRIMARY_EMAIL_FAILURE,
    UPDATE_PRIMARY_EMAIL_REQUEST,
    UPDATE_PRIMARY_EMAIL_SUCCESS,
    UPDATE_PRIMARY_EMAIL_FAILURE,
    UPDATE_PRIMARY_AND_PAPERLESS_REQUEST,
    UPDATE_PRIMARY_AND_PAPERLESS_SUCCESS,
    UPDATE_PRIMARY_AND_PAPERLESS_FAILURE,
  } from '../constants/notificationConstants';
  
  // Loading actions
  export const setLoading = () => ({
    type: SET_LOADING,
  });
  
  export const clearLoading = () => ({
    type: CLEAR_LOADING,
  });
  
  export const clearNotificationState = () => ({
    type: CLEAR_NOTIFICATION_STATE,
  });
  
  // Get All Emails Actions
  export const getAllEmailsRequest = () => ({
    type: GET_ALL_EMAILS_REQUEST,
  });
  
  export const getAllEmailsSuccess = (emails) => ({
    type: GET_ALL_EMAILS_SUCCESS,
    payload: emails,
  });
  
  export const getAllEmailsFailure = (error) => ({
    type: GET_ALL_EMAILS_FAILURE,
    payload: error,
  });
  
  // Get Paperless Status Actions
  export const getPaperlessStatusRequest = (email) => ({
    type: GET_PAPERLESS_STATUS_REQUEST,
    payload: { email },
  });
  
  export const getPaperlessStatusSuccess = (status) => ({
    type: GET_PAPERLESS_STATUS_SUCCESS,
    payload: status,
  });
  
  export const getPaperlessStatusFailure = (error) => ({
    type: GET_PAPERLESS_STATUS_FAILURE,
    payload: error,
  });
  
  // Enroll Paperless Actions
  export const enrollPaperlessRequest = (emailAddress, navigation) => ({
    type: ENROLL_PAPERLESS_REQUEST,
    payload: { emailAddress },
    navigation,
  });
  
  export const enrollPaperlessSuccess = (response) => ({
    type: ENROLL_PAPERLESS_SUCCESS,
    payload: response,
  });
  
  export const enrollPaperlessFailure = (error) => ({
    type: ENROLL_PAPERLESS_FAILURE,
    payload: error,
  });
  
  // Unenroll Paperless Actions
  export const unenrollPaperlessRequest = (emailAddress, navigation) => ({
    type: UNENROLL_PAPERLESS_REQUEST,
    payload: { emailAddress },
    navigation,
  });
  
  export const unenrollPaperlessSuccess = (response) => ({
    type: UNENROLL_PAPERLESS_SUCCESS,
    payload: response,
  });
  
  export const unenrollPaperlessFailure = (error) => ({
    type: UNENROLL_PAPERLESS_FAILURE,
    payload: error,
  });
  
  // Add Primary Email Actions
  export const addPrimaryEmailRequest = (newEmail, oldEmail, navigation) => ({
    type: ADD_PRIMARY_EMAIL_REQUEST,
    payload: { newEmail, oldEmail },
    navigation,
  });
  
  export const addPrimaryEmailSuccess = (response) => ({
    type: ADD_PRIMARY_EMAIL_SUCCESS,
    payload: response,
  });
  
  export const addPrimaryEmailFailure = (error) => ({
    type: ADD_PRIMARY_EMAIL_FAILURE,
    payload: error,
  });
  
  // Update Primary Email Actions
  export const updatePrimaryEmailRequest = (newEmail, oldEmail, navigation) => ({
    type: UPDATE_PRIMARY_EMAIL_REQUEST,
    payload: { newEmail, oldEmail },
    navigation,
  });
  
  export const updatePrimaryEmailSuccess = (response) => ({
    type: UPDATE_PRIMARY_EMAIL_SUCCESS,
    payload: response,
  });
  
  export const updatePrimaryEmailFailure = (error) => ({
    type: UPDATE_PRIMARY_EMAIL_FAILURE,
    payload: error,
  });
  
  // Combined Primary & Paperless Actions
  export const updatePrimaryAndPaperlessRequest = (payload, navigation) => ({
    type: UPDATE_PRIMARY_AND_PAPERLESS_REQUEST,
    payload, // payload: { newEmail, oldEmail, paperlessBilling, account }
    navigation,
  });
  
  export const updatePrimaryAndPaperlessSuccess = (response) => ({
    type: UPDATE_PRIMARY_AND_PAPERLESS_SUCCESS,
    payload: response,
  });
  
  export const updatePrimaryAndPaperlessFailure = (error) => ({
    type: UPDATE_PRIMARY_AND_PAPERLESS_FAILURE,
    payload: error,
  });