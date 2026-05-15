import * as types from '../constants/billingBreakdownTypes';

const initialState = {
  breakdownData: [],
  explainerData: null,
  loading: false,
  error: null,
  totalDue: 0
};

const billingBreakdownReducer = (state = initialState, action) => {
  switch (action.type) {
    // Fetch billing breakdown
    case types.FETCH_BILLING_BREAKDOWN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case types.FETCH_BILLING_BREAKDOWN_SUCCESS:

  console.log("Billing Data:-------------------------------------", action);
      return {
        ...state,
        loading: false,
        breakdownData: action.payload.breakdownData,
        error: null
      };
    
    case types.FETCH_BILLING_BREAKDOWN_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error
      };
    
    // UI state
    case types.RESET_TOTAL_DUE:
      return {
        ...state,
        totalDue: 0
      };
    
    // Clear errors
    case types.CLEAR_BILLING_BREAKDOWN_ERROR:
      return {
        ...state,
        error: null
      };
    case types.FETCH_BILL_EXPLAINER_REQUEST:
      return {
      ...state,
      loading: true,
      error: null
      };
    
    case types.FETCH_BILL_EXPLAINER_SUCCESS:
      return {
      ...state,
      loading: false,
      explainerData: action.payload.explainerData,
      error: null
      };
    
    case types.FETCH_BILL_EXPLAINER_FAILURE:
      return {
      ...state,
      loading: false,
      error: null //action.payload.error
      };
    
    case types.CLEAR_BILL_EXPLAINER_ERROR:
      return {
      ...state,
      error: null
      };
    default:
      return state;
  }
};

export default billingBreakdownReducer;