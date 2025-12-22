import * as types from '../constants/servicesTypes';

const initialState = {
  // Service Details State
  serviceData: null,
  serviceLoading: false,
  serviceError: null,
  
  // Outage Status State
  outageData: null,
  outageChecking: false,
  outageError: null,
};

const servicesReducer = (state = initialState, action) => {
  switch (action.type) {
    // ========== Service Details ==========
    case types.FETCH_SERVICE_DETAILS_REQUEST:
      return {
        ...state,
        serviceLoading: true,
        serviceError: null
      };
    
    case types.FETCH_SERVICE_DETAILS_SUCCESS:
      return {
        ...state,
        serviceLoading: false,
        serviceData: action.payload.serviceData,
        serviceError: null
      };
    
    case types.FETCH_SERVICE_DETAILS_FAILURE:
      return {
        ...state,
        serviceLoading: false,
        serviceError: action.payload.error
      };
    
    case types.CHECK_OUTAGE_STATUS_REQUEST:
      return {
        ...state,
        outageData: null,  
        outageChecking: true,
        outageError: null
      };
    
    case types.CHECK_OUTAGE_STATUS_SUCCESS:
      return {
        ...state,
        outageChecking: false,
        outageData: action.payload.outageData,
        outageError: null
      };
    
    case types.CHECK_OUTAGE_STATUS_FAILURE:
      return {
        ...state,
        outageChecking: false,
        outageError: action.payload.error
      };
    
    // ========== Clear Actions ==========
    case types.CLEAR_OUTAGE_DATA:
      return {
        ...state,
        outageData: null,
        outageError: null
      };
    
    case types.CLEAR_SERVICES_ERROR:
      return {
        ...state,
        serviceError: null,
        outageError: null
      };
    
    default:
      return state;
  }
};

export default servicesReducer;