import { USER_PROFILE_DETAILS, SAVE_USER_LIST, SAVE_SMS_SELECTION } from '../constants/index';

const initialState = {
    isLoading: false,
    profileDetails: {},
    userList: [],
    smsSubscription: [],
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
        default:
            return state;
    }
}

export default ProfileReducer;