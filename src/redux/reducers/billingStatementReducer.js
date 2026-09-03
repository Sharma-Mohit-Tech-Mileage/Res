import * as types from '../constants/billingStatementTypes';

const initialState = {
  statements: [],
  loading: false,
  error: null,
  downloading: false,
  downloadError: null,
  downloadedStatement: null,
  selectedYear: new Date().getFullYear().toString(), // Default to current year
  sortDirection: 'desc' // Default sort direction
};

const billingStatementReducer = (state = initialState, action) => {
  switch (action.type) {
    // Fetch billing statements
    case types.FETCH_BILLING_STATEMENTS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case types.FETCH_BILLING_STATEMENTS_SUCCESS:
      return {
        ...state,
        loading: false,
        statements: action.payload.statements,
        error: null
      };
    
    case types.FETCH_BILLING_STATEMENTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error
      };
    
    // Download statement
    case types.DOWNLOAD_STATEMENT_REQUEST:
      return {
        ...state,
        downloading: true,
        downloadError: null
      };
    
    case types.DOWNLOAD_STATEMENT_SUCCESS:
      return {
        ...state,
        downloading: false,
        downloadedStatement: action.payload.statementData,
        downloadError: null
      };
    
    case types.DOWNLOAD_STATEMENT_FAILURE:
      return {
        ...state,
        downloading: false,
        downloadError: action.payload.error
      };
    
    // UI state
    case types.SET_SELECTED_YEAR:
      return {
        ...state,
        selectedYear: action.payload.year
      };
    
    case types.SET_SORT_DIRECTION:
      return {
        ...state,
        sortDirection: action.payload.direction
      };
    
    // Add cases to clear errors
    case 'CLEAR_BILLING_ERROR':
      return {
        ...state,
        error: null
      };
    
    case 'CLEAR_DOWNLOAD_ERROR':
      return {
        ...state,
        downloadError: null
      };
    
    // Add case to clear downloaded statement
    case types.CLEAR_DOWNLOADED_STATEMENT:
      return {
        ...state,
        downloadedStatement: null
      };
    
    default:
      return state;
  }
};

export default billingStatementReducer;