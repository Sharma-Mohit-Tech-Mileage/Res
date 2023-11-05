import { Action } from '../constants/index';

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
  switch (action) {
    case Action.FETCH_DATA:
    console.log('login', action.payload.user)
      return {
        ...state,
        profile: action.payload.user,
        formSubmitted: false // after update user formsubmition reset
      }
    case Action.LIST_FETCHED:
      return {
        ...state,
        profile: action.payload.user,
        formSubmitted: false // after update user formsubmition reset
      }
    case Action.API_CALLED:
      return {
        ...state,
        profile: action.payload.user,
        formSubmitted: false // after update user formsubmition reset
      }
    
    default:
      return state;
  }
}

// import { Action } from “../constants”;
// const initialState = {
//    isLoading: false,
//    productList: null
// };
// export const mainReducer = (state = initialState, action) => {
//     switch (action.type) {
//        case Action.FETCH_DATA : 
//          return {
//              ...state,
//              isLoading: true
//          };
//          break;
//        case Action.LIST_FETCHED : 
//          return {
//              ...state,
//              productList: action.data
//          };
//          break;
//        case Action.API_CALLED :  
//          return {
//              ...state,
//              isLoading: false
//          };
//          break;     
//        default : 
//         return state;
//     }
// };
export default userReducer;