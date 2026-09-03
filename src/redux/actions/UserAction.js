import { SAVE_USER_INFO, LOGOUT } from '../constants';

export const saveUserInfo = (response) => {
   return {
      type: SAVE_USER_INFO,
      payload:response
    };
};

export const logoutApp = () => ({
   type: LOGOUT,
});
