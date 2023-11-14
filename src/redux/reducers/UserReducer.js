import { Action } from '../constants/index';

const initialState ={
  isLoading:false,
  userInfo:{},
  jwtToken: ""
}

const userReducer = (state = initialState, action) => {
  switch (action) {
    case Action.SSO_LOGIN_RESPONSE:
      return {
        ...state,
        userInfo: action.payload,
        
      }
    
    default:
      return state;
  }
}

export default userReducer;