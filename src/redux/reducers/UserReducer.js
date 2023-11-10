import { Action } from '../constants/index';

const initialState = {
  
    "accountId": "900254640",
    "userId": "900254640",
    "download_Kbps": 343892,
    "upload_Kbps": 295816,
    "ping_ms": 7.00,
    "jitter_ms": 1.00,
    "host": "phoenix1.cabospeed.com",
    "createdOn": "2023-10-13T15:58:11.43+00:00"

  
}

const userReducer = (state = initialState, action) => {
  switch (action) {
    case Action.GET_INTERNET_SPEED:
    console.log('login', action.payload)
      return {
        ...state,
        data: action.payload,
        
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