import { GET_INTERNET_SPEED,UPDATE_INTERNET_SPEED } from '../constants';
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
