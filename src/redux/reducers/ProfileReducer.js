import { 
    USER_PROFILE_DETAILS, SAVE_USER_LIST, 
    SAVE_SMS_SELECTION, SAVE_EMIAL_SELECTION, 
    SAVE_PAPERLESS_DETAILS, SAVE_PUSH_NOTIFICATIONS
} from '../constants/index';

const initialState = {
    isLoading: false,
    profileDetails: {},
    userList: [],
    smsSubscription: [],
    paperlessStatus: false,
    paperLessInfo: {},
    pushNotifications: {},
    erro: ""
}

const ProfileReducer = (state = initialState, action) => {
    switch (action.type) {
        case USER_PROFILE_DETAILS:
            return {
                ...state,
                isLoading: false,
                profileDetails: action.payload,
            };
        case SAVE_USER_LIST:
            return {
                ...state,
                isLoading: false,
                userList: action.payload,
            };
        case SAVE_SMS_SELECTION:
            return {
                ...state,
                isLoading: false,
                smsSubscription: action.payload,
            };
        case SAVE_EMIAL_SELECTION:
            return {
                ...state,
                isLoading: false,
                paperlessStatus: action.payload,
            };
        case SAVE_PAPERLESS_DETAILS:
            return {
                ...state,
                isLoading: false,
                paperLessInfo: action.payload,
            };
        case SAVE_PUSH_NOTIFICATIONS:
            return {
                ...state,
                pushNotifications: action.payload,
            };            
        default:
            return state;
    }
}


export default ProfileReducer;