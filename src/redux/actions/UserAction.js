import { Action } from '../constants';
export const ssoLoginAction = (request) => {
   return {
      type: Action.SSO_LOGIN_REQUEST,
      payload:request
    };
};
