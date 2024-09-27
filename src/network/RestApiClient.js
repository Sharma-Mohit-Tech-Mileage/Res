import React, { useEffect } from 'react';
import axios from 'axios';
import { Env } from "./apis/account/Constants";
import { getUser, storeUser, cleanUserData } from "../redux/utils/LocalStorage";
import { RefreshToken } from '../components/user/Session';
import { useAuthInterceptor } from '../network/useAuthInterceptor';

const BASE_URL = Env.API_BASEURL;

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

let isRefreshing = false;
let failedQueue = [];
let navigationPending = false; // Flag to prevent multiple navigations

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

const AxiosInterceptorProvider = ({ children }) => {
    const { redirectToLogin } = useAuthInterceptor();

    useEffect(() => {
        const interceptor = _axios.interceptors.response.use(
            response => response,
            async error => {
                const originalRequest = error.config;

                console.log("Interceptor caught an error:", error);

                if (error.response && error.response.status === 401 && !originalRequest._retry) {
                    console.log("401 error and not a retry:", originalRequest.url);

                    if (isRefreshing) {
                        console.log("Token is currently being refreshed, adding request to queue.");
                        return new Promise((resolve, reject) => {
                            failedQueue.push({ resolve, reject });
                        }).then(token => {
                            originalRequest.headers['Authorization'] = 'Bearer ' + token;
                            return _axios(originalRequest);
                        }).catch(err => {
                            return Promise.reject(err);
                        });
                    }

                    originalRequest._retry = true;
                    isRefreshing = true;

                    try {
                        const refreshedData = await RefreshToken();
                        console.log("Token refreshed successfully:", refreshedData);
                        const user = await getUser();
                        console.log("Retrieved user for token refresh:", user);
                        await storeUser(user);
                        _axios.defaults.headers.common['Authorization'] = 'Bearer ' + user.token;
                        originalRequest.headers['Authorization'] = 'Bearer ' + user.token;
                        processQueue(null, user.token);
                        isRefreshing = false;
                        return _axios(originalRequest);
                    } catch (tokenRefreshError) {
                        console.error("Refresh token error:", tokenRefreshError);
                        processQueue(tokenRefreshError, null);
                        isRefreshing = false;

                        if (!navigationPending) {
                            console.log("Redirecting to login due to token refresh error.");
                            navigationPending = true; // Set flag to prevent further navigations
                            setTimeout(async () => {
                                await redirectToLogin();
                                navigationPending = false; // Reset flag after navigation
                            }, 500); // Delay to ensure error handling completes
                        }
                        return Promise.reject(tokenRefreshError);
                    }
                }

                return Promise.reject(error);
            }
        );

        return () => {
            _axios.interceptors.response.eject(interceptor);
        };
    }, [redirectToLogin]);

    return children;
};

export { AxiosInterceptorProvider, _axios };