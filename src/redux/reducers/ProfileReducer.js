import {
  LOGOUT,
  SET_LOADING,
  CLEAR_LOADING,
  SAVE_ACP_USER_ACCOUNT_DETAILS,
  INVALIDATE_ACCOUNT_CACHE,
  SAVEALLSVEMAILASSOCIATED,
  USER_PROFILE_DETAILS,
  SAVE_USER_LIST,
  SAVE_SMS_SELECTION,
  SAVE_EMAIL_SELECTION,
  SAVE_PAPERLESS_DETAILS,
  SAVE_PUSH_NOTIFICATIONS,
  SAVE_USER_ACCOUNT_SERVICE,
  SET_PAPERLESS_STATUS,
  GET_PAPERLESS_STATUS,
} from "../constants/index";

const initialState = {
  isLoading: false,
  isPaperLessStatusLoading: false,
  profileDetails: {},
  userList: [],
  smsSubscription: [],
  paperlessStatus: false,
  paperLessInfo: {},
  pushNotifications: [],
  allSvEmailAssociated: [],
  paperlessStatusAcp: undefined,
  accountDetails: {},
  accountDetailsFetchedAt: null,
  erro: "",
};

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
    case SAVE_USER_ACCOUNT_SERVICE:
      return {
        ...state,
        isLoading: false,
        services: action.payload,
      };
    case SAVE_EMAIL_SELECTION:
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
    case SAVEALLSVEMAILASSOCIATED:
      return {
        ...state,
        allSvEmailAssociated: action.payload,
      };
    case SET_LOADING:
      return {
        ...state,
        isPaperLessStatusLoading: true,
        paperlessStatusAcp: undefined,
      };

    case CLEAR_LOADING:
      return {
        ...state,
        isPaperLessStatusLoading: false,
        paperlessStatusAcp:
          state.paperlessStatusAcp === undefined ? false : state.paperlessStatusAcp,
      };

    case SET_PAPERLESS_STATUS:
      return {
        ...state,
        isPaperLessStatusLoading: false,
        paperlessStatusAcp: action.payload,
      };
    case SAVE_ACP_USER_ACCOUNT_DETAILS:
      return {
        ...state,
        isLoading: false,
        accountDetails: action.payload,
        accountDetailsFetchedAt: Date.now(),
      };
    case INVALIDATE_ACCOUNT_CACHE:
      return {
        ...state,
        accountDetailsFetchedAt: null,
      };
    case LOGOUT:
      return {
        initialState,
      };
    default:
      return state;
  }
};

export default ProfileReducer;
