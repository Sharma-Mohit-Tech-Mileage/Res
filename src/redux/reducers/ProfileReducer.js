import { 
    USER_PROFILE_DETAILS, SAVE_USER_LIST, 
    SAVE_SMS_SELECTION, SAVE_EMIAL_SELECTION, 
    SAVE_PAPERLESS_DETAILS 
} from '../constants/index';

const initialState = {
    isLoading: false,
    profileDetails: {},
    userList: [],
    smsSubscription: [],
    paperlessStatus: false,
    paperLessDetails: {},
    erro: ""
}

const ProfileReducer = (state = initialState, action) => {
    switch (action.type) {
        case USER_PROFILE_DETAILS:
            return {
                isLoading: false,
                profileDetails: action.payload,
            }
        case SAVE_USER_LIST:
            return {
                isLoading: false,
                userList: action.payload,
            }
        case SAVE_SMS_SELECTION:
            return {
                isLoading: false,
                smsSubscription: action.payload,
            }
        case SAVE_EMIAL_SELECTION:
            return {
                isLoading: false,
                paperlessStatus: action.payload,
            }
        case SAVE_PAPERLESS_DETAILS:
            return {
                isLoading: false,
                paperLessDetails: action.payload,
            }
        default:
            return state;
    }
}

export default ProfileReducer;