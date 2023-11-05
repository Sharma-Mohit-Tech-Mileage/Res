import { Action } from '../constants';
export const fetchList= () => {
   return {
      type: Action.FETCH_DATA,
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