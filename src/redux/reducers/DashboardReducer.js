import { 
  GET_INTERNET_SPEED, 
  POST_INTERNET_SPEED, 
  UPDATE_INTERNET_SPEED, 
  GET_ACCOUNT_INFO, 
  UPDATE_ACCOUNT_INFO
} from '../constants/index';

const initialState ={
  isLoading:false,
  speed:{},
  accountInfo:{},
  erro: ""
}

const dashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_INTERNET_SPEED:
      return{
        ...state,
        isLoading:true
      }
    case POST_INTERNET_SPEED:
      return {
        isLoading: false,
        speed: action.payload,
      }      
    case UPDATE_INTERNET_SPEED:
      return {
        isLoading: false,
        speed: action.payload,
      }
    case GET_ACCOUNT_INFO:
      return{
        ...state,
        isLoading: true
      }
    case UPDATE_ACCOUNT_INFO:
        return {
          isLoading: false,
          accountInfo: action.payload,
          
        }
    
    default:
      return state;
  }
}

export default dashboardReducer;