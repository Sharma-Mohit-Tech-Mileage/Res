import { Action } from '../constants';
export const getCurrentSpeed= (accountId) => {
   
   return {
      type: Action.GET_INTERNET_SPEED,
      payload:accountId
    };
};
export const storeListData= (result) => {
   return {
      type: Action.LIST_FETCHED,
      data : result,
    };
};
export const apiCalled = () => {
   return {
      type: Action.API_CALLED,
    };
};