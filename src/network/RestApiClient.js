import axios from 'axios';
import { Env } from "./apis/account/Constants";
import { getUser, storeUser } from "../redux/utils/LocalStorage";
import { RefreshToken } from '../components/user/Session'
const BASE_URL = Env.API_BASEURL

const _axios = axios.create({
    baseURL: BASE_URL,
    withCredentials: false,
    crossDomain: true,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',

    }
});

_axios.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        console.log('#############################################interceptors%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%');
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshedData = await RefreshToken();
                console.log('#############################################interceptorsDuplicate%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%');
                const user = await getUser();
                user.token = refreshedData.accessToken;
                user.refreshToken = refreshedData.refreshToken;
                await storeUser(user);
                console.log('interceptors:Updated Access Token:', refreshedData.accessToken);
                console.log('interceptors:Updated Refresh Token:', refreshedData.refreshToken);
                console.log('interceptors:User Info:', user);

                axios.defaults.headers.common['Authorization'] = 'Bearer ' + user.token;
                originalRequest.headers['Authorization'] = 'Bearer ' + user.token;

                return axios(originalRequest);
            } catch (tokenRefreshError) {
                return Promise.reject(tokenRefreshError);
            }
        }
        return Promise.reject(error);
    }
);

export { _axios };

