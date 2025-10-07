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
    UPDATE_PRIMARY_AND_PAPERLESS_SUCCESS
} from '../constants/notificationConstants';

const initialState = {
    loading: false,
    allEmails: [],
    paperlessStatus: false,
    error: null,
    successMessage: '',
    lastUpdated: null,
    emailOperationStatus: {
        loading: false,
        error: null,
        success: false,
        message: ''
    },
    primaryEmailStatus: {
        loading: false,
        error: null,
        success: false,
        message: ''
    }
};

const NotificationReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_LOADING:
            return {
                ...state,
                loading: true
            };

        case CLEAR_LOADING:
            return {
                ...state,
                loading: false
            };

        case CLEAR_NOTIFICATION_STATE:
            return initialState;

        // Get All Emails
        case GET_ALL_EMAILS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };

        case GET_ALL_EMAILS_SUCCESS:
            return {
                ...state,
                loading: false,
                allEmails: action.payload,
                error: null,
                lastUpdated: new Date().toISOString()
            };

        case GET_ALL_EMAILS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
                lastUpdated: new Date().toISOString()
            };

        // Get Paperless Status
        case GET_PAPERLESS_STATUS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };

        case GET_PAPERLESS_STATUS_SUCCESS:
            return {
                ...state,
                loading: false,
                paperlessStatus: action.payload,
                error: null,
                lastUpdated: new Date().toISOString()
            };

        case GET_PAPERLESS_STATUS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
                lastUpdated: new Date().toISOString()
            };

        // Enroll Paperless
        case ENROLL_PAPERLESS_REQUEST:
            return {
                ...state,
                emailOperationStatus: {
                    loading: true,
                    error: null,
                    success: false,
                    message: ''
                }
            };

        case ENROLL_PAPERLESS_SUCCESS:
            return {
                ...state,
                emailOperationStatus: {
                    loading: false,
                    error: null,
                    success: true,
                    message: 'Successfully enrolled in paperless billing'
                },
                paperlessStatus: true,
                lastUpdated: new Date().toISOString()
            };

        case ENROLL_PAPERLESS_FAILURE:
            return {
                ...state,
                emailOperationStatus: {
                    loading: false,
                    error: action.payload,
                    success: false,
                    message: 'Failed to enroll in paperless billing'
                },
                lastUpdated: new Date().toISOString()
            };

        // Unenroll Paperless
        case UNENROLL_PAPERLESS_REQUEST:
            return {
                ...state,
                emailOperationStatus: {
                    loading: true,
                    error: null,
                    success: false,
                    message: ''
                }
            };

        case UNENROLL_PAPERLESS_SUCCESS:
            return {
                ...state,
                emailOperationStatus: {
                    loading: false,
                    error: null,
                    success: true,
                    message: 'Successfully unenrolled from paperless billing'
                },
                paperlessStatus: false,
                lastUpdated: new Date().toISOString()
            };

        case UNENROLL_PAPERLESS_FAILURE:
            return {
                ...state,
                emailOperationStatus: {
                    loading: false,
                    error: action.payload,
                    success: false,
                    message: 'Failed to unenroll from paperless billing'
                },
                lastUpdated: new Date().toISOString()
            };

        // Add Primary Email
        case ADD_PRIMARY_EMAIL_REQUEST:
            return {
                ...state,
                primaryEmailStatus: {
                    loading: true,
                    error: null,
                    success: false,
                    message: ''
                }
            };

        case ADD_PRIMARY_EMAIL_SUCCESS:
            return {
                ...state,
                primaryEmailStatus: {
                    loading: false,
                    error: null,
                    success: true,
                    message: 'Primary email added successfully'
                },
                lastUpdated: new Date().toISOString()
            };

        case ADD_PRIMARY_EMAIL_FAILURE:
            return {
                ...state,
                primaryEmailStatus: {
                    loading: false,
                    error: action.payload,
                    success: false,
                    message: 'Failed to add primary email'
                },
                lastUpdated: new Date().toISOString()
            };

        // Update Primary Email
        case UPDATE_PRIMARY_EMAIL_REQUEST:
            return {
                ...state,
                primaryEmailStatus: {
                    loading: true,
                    error: null,
                    success: false,
                    message: ''
                }
            };

        case UPDATE_PRIMARY_EMAIL_SUCCESS :
            return {
                ...state,
                primaryEmailStatus: {
                    loading: false,
                    error: null,
                    success: true,
                    message: 'Primary email updated successfully'
                },
                lastUpdated: new Date().toISOString()
            };

        case UPDATE_PRIMARY_AND_PAPERLESS_SUCCESS:
            return {
                ...state,
                primaryEmailStatus: {
                    loading: false,
                    error: null,
                    success: true,
                    message: 'Primary email and paperless status updated successfully'
                },
                lastUpdated: new Date().toISOString()
            };    

        case UPDATE_PRIMARY_EMAIL_FAILURE:
            return {
                ...state,
                primaryEmailStatus: {
                    loading: false,
                    error: action.payload,
                    success: false,
                    message: 'Failed to update primary email'
                },
                lastUpdated: new Date().toISOString()
            };

        default:
            return state;
    }
};

export default NotificationReducer;