import { SSO_LOGIN_REQUEST,SAVE_USER_INFO,LOGOUT,LOG_ERROR,LOG_INFO } from '../constants';
export const ssoLoginAction = (request) => {
   return {
      type: SSO_LOGIN_REQUEST,
      payload:request
    };
};

export const saveUserInfo = (response) => {
   return {
      type: SAVE_USER_INFO,
      payload:response
    };
};

export const logoutApp = () => ({
   type: LOGOUT,
});
export const logInfo = infoData => ({
   type: LOG_INFO,
   payload: infoData,
 });
 
 export const logError = errorData => ({
   type: LOG_ERROR,
   payload: errorData,
 });