import * as types from '../constants/paymentHistoryTypes';

const initialState = {
  payments: [],
  filteredPayments: [],
  displayedPayments: [],
  loading: false,
  error: null,
  downloading: false,
  downloadError: null,
  downloadedReceipt: null,
  sortDirection: 'desc', // Default sort direction
  searchQuery: '',
  pageSize: 10,
  currentPage: 1,
  hasMore: false
};

const paymentHistoryReducer = (state = initialState, action) => {
  switch (action.type) {
    // Fetch payment history
    case types.FETCH_PAYMENT_HISTORY_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case types.FETCH_PAYMENT_HISTORY_SUCCESS: {
      const sortedPayments = sortPayments(action.payload.payments, state.sortDirection);
      const filteredPayments = filterPaymentsBySearchQuery(sortedPayments, state.searchQuery);
      const displayedPayments = getDisplayedPayments(filteredPayments, state.pageSize, 1);
      
      return {
        ...state,
        loading: false,
        payments: sortedPayments,
        filteredPayments: filteredPayments,
        displayedPayments: displayedPayments,
        currentPage: 1,
        hasMore: filteredPayments.length > state.pageSize,
        error: null
      };
    }
    
    case types.FETCH_PAYMENT_HISTORY_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error
      };
    
    // Download receipt
    case types.DOWNLOAD_PAYMENT_RECEIPT_REQUEST:
      return {
        ...state,
        downloading: true,
        downloadError: null
      };
    
    case types.DOWNLOAD_PAYMENT_RECEIPT_SUCCESS:
      return {
        ...state,
        downloading: false,
        downloadedReceipt: action.payload.receiptData,
        downloadError: null
      };
    
    case types.DOWNLOAD_PAYMENT_RECEIPT_FAILURE:
      return {
        ...state,
        downloading: false,
        downloadError: action.payload.error
      };
    
    case types.CLEAR_DOWNLOADED_RECEIPT:
      return {
        ...state,
        downloadedReceipt: null
      };
    
    // UI state
    case types.SET_SORT_DIRECTION_PAYMENT: {
      const sortedPayments = sortPayments(state.payments, action.payload.direction);
      const filteredPayments = filterPaymentsBySearchQuery(sortedPayments, state.searchQuery);
      const displayedPayments = getDisplayedPayments(filteredPayments, state.pageSize, 1);
      
      return {
        ...state,
        sortDirection: action.payload.direction,
        payments: sortedPayments,
        filteredPayments: filteredPayments,
        displayedPayments: displayedPayments,
        currentPage: 1,
        hasMore: filteredPayments.length > state.pageSize
      };
    }
    
    case types.SET_SEARCH_QUERY: {
      const filteredPayments = filterPaymentsBySearchQuery(state.payments, action.payload.query);
      const displayedPayments = getDisplayedPayments(filteredPayments, state.pageSize, 1);
      
      return {
        ...state,
        searchQuery: action.payload.query,
        filteredPayments: filteredPayments,
        displayedPayments: displayedPayments,
        currentPage: 1,
        hasMore: filteredPayments.length > state.pageSize
      };
    }
    
    case types.LOAD_MORE_PAYMENTS: {
      const nextPage = state.currentPage + 1;
      const displayedPayments = getDisplayedPayments(state.filteredPayments, state.pageSize, nextPage);
      
      return {
        ...state,
        displayedPayments: displayedPayments,
        currentPage: nextPage,
        hasMore: state.filteredPayments.length > state.pageSize * nextPage
      };
    }
    
    // Clear errors
    case 'CLEAR_PAYMENT_HISTORY_ERROR':
      return {
        ...state,
        error: null
      };
    
    case 'CLEAR_DOWNLOAD_ERROR':
      return {
        ...state,
        downloadError: null
      };
    
    default:
      return state;
  }
};

// Helper functions for sorting, filtering, and pagination
const sortPayments = (payments, direction) => {
  return [...payments].sort((a, b) => {
    const dateA = new Date(a.pymtDate);
    const dateB = new Date(b.pymtDate);
    
    if (direction === 'asc') {
      return dateA - dateB;
    } else {
      return dateB - dateA;
    }
  });
};

const filterPaymentsBySearchQuery = (payments, query) => {
  if (!query) {
    return payments;
  }
  
  return payments.filter(payment => 
    payment.extTransactionId && 
    payment.extTransactionId.toLowerCase().includes(query.toLowerCase())
  );
};

const getDisplayedPayments = (payments, pageSize, page) => {
  const start = 0;
  const end = page * pageSize;
  return payments.slice(start, end);
};

export default paymentHistoryReducer;