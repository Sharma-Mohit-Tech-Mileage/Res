import React, { useEffect } from 'react';
import axios from 'axios';
import { Env } from "./apis/account/Constants";
import { getUser, storeUser, cleanUserData } from "../redux/utils/LocalStorage";
import { RefreshToken } from '../components/user/Session';
import { useAuthInterceptor } from '../network/useAuthInterceptor';

const BASE_URL = Env.API_BASEURL;
const API_ACP_BASEURL = Env.API_ACP_BASEURL;

const _axios = axios.create({
    baseURL: BASE_URL, // Default base URL
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
        const interceptor = _axios.interceptors.request.use(
            async config => {
                // Dynamically switch the baseURL based on user type
                try {
                    const user = await getUser();
                    if (user && user.isNormalUser === false) {
                        config.baseURL = API_ACP_BASEURL; // Set ACP base URL for ACP users
                    } else {
                        config.baseURL = BASE_URL; // Set default base URL for normal users
                    }
                } catch (error) {
                    console.error("[Interceptor] Error determining baseURL:", error);
                    config.baseURL = BASE_URL; // Default to BASE_URL in case of any error
                }
                return config;
            },
            error => {
                return Promise.reject(error);
            }
        );

        const responseInterceptor = _axios.interceptors.response.use(
            response => response,
            async error => {
                const originalRequest = error.config;

                if (error.response && error.response.status === 401 && !originalRequest._retry) {
                    if (isRefreshing) {
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
                        const user = await getUser();
                        await storeUser(user);
                        _axios.defaults.headers.common['Authorization'] = 'Bearer ' + user.token;
                        originalRequest.headers['Authorization'] = 'Bearer ' + user.token;
                        processQueue(null, user.token);
                        isRefreshing = false;
                        return _axios(originalRequest);
                    } catch (tokenRefreshError) {
                        processQueue(tokenRefreshError, null);
                        isRefreshing = false;

                        if (!navigationPending) {
                            navigationPending = true;
                            setTimeout(async () => {
                                await redirectToLogin();
                                navigationPending = false;
                            }, 500);
                        }
                        return Promise.reject(tokenRefreshError);
                    }
                }

                return Promise.reject(error);
            }
        );

        return () => {
            _axios.interceptors.request.eject(interceptor);
            _axios.interceptors.response.eject(responseInterceptor);
        };
    }, [redirectToLogin]);

    return children;
};

export { AxiosInterceptorProvider, _axios };