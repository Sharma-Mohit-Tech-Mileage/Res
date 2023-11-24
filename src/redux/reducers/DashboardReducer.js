import { GET_INTERNET_SPEED,UPDATE_INTERNET_SPEED } from '../constants/index';

const initialState ={
  isLoading:false,
  speed:{},
  erro: ""
}

const dashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_INTERNET_SPEED:
      return{
        ...state,
        isLoading:true
      }
    case UPDATE_INTERNET_SPEED:
      return {
        isLoading:false,
        speed: action.payload,
        
      }
    
    default:
      return state;
  }
}

export default dashboardReducer;