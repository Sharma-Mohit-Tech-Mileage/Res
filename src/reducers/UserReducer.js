import { Types } from '../actions/LoginAction.js';

const initialState = {
  profile: {
    firstName: '',
    lastName: '',
    telephone: '',
    age: 28,
    email: '',
    state: '',
    country: '',
    address: 'Home',
    address1: '',
    address2: '',
    interests: [],
    profileImage: '',
    subscribenewsletter: false
  },
  formSubmitted: false
}

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.LOGIN:
    console.log('login', action.payload.user)
      return {
        ...state,
        profile: action.payload.user,
        formSubmitted: false // after update user formsubmition reset
      }
    case Types.ADD_USER:
      return {
        ...state,
        profile: action.payload.user,
        formSubmitted: false // after update user formsubmition reset
      }
    case Types.UPDATE_USER:
      return {
        ...state,
        profile: action.payload.user,
        formSubmitted: false // after update user formsubmition reset
      }
    
    default:
      return state;
  }
}

export default userReducer;