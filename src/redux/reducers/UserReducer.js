import { LOGOUT, SAVE_USER_INFO } from '../constants/index';

const initialState = {
  isLoading: false,
  userData: {},
  erro: ""
}

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SAVE_USER_INFO:
      return {
        isLoading: false,
        userData: action.payload,

      }
    case LOGOUT:
      return {
        initialState
      }; 
    default:
      return state;
  }
}

export default userReducer;