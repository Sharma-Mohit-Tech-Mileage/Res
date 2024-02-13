import { LOGOUT, SAVE_USER_INFO, SSO_LOGIN_REQUEST } from '../constants/index';

const initialState = {
  isLoading: false,
  userData: {},
  erro: ""
}

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SSO_LOGIN_REQUEST:
      return {
        ...state,
        isLoading: true
      }
    case SAVE_USER_INFO:
      return {
        isLoading: false,
        userData: action.payload,

      }
    case LOGOUT:
      return initialState;  // Reset state on logout
    default:
      return state;
  }
}

export default userReducer;