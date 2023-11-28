import { GET_INTERNET_SPEED,UPDATE_INTERNET_SPEED,GET_ACCOUNT_INFO,UPDATE_ACCOUNT_INFO } from '../constants';
export const getCurrentSpeed= (accountId) => {
   
   return {
      type: GET_INTERNET_SPEED,
      payload:accountId
    };
};
export const updateCurrentSpeed= (result) => {
   return {
      type: UPDATE_INTERNET_SPEED,
      payload : result,
    };
};

export const getAccountInfo= (accountId) => {
   
   return {
      type: GET_ACCOUNT_INFO,
      payload:accountId
    };
};

export const updateAccountInfo= (result) => {
   
   return {
      type: UPDATE_ACCOUNT_INFO,
      payload:result
    };
};
