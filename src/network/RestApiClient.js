import React, { useEffect } from 'react';
import axios from 'axios';
import { Env } from "./apis/account/Constants";
import { getUser, storeUser } from "../redux/utils/LocalStorage";
import { RefreshToken } from '../components/user/Session';
import { useAuthInterceptor } from '../network/useAuthInterceptor';
const API_ACP_BASEURL = Env.API_ACP_BASEURL;

const _axios = axios.create({
    baseURL: API_ACP_BASEURL,
    withCredentials: false,
    crossDomain: true,
    timeout: 15000, 
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
    }
});

let isRefreshing = false;
let failedQueue = [];
let navigationPending = false;

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

const isRetryableError = (error) => {
    return (
        error.code === 'ECONNABORTED' ||
        error.message.includes('timeout') ||
        error.message.includes('Network Error') ||
        (error.response && error.response.status >= 500)
    );
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const retryRequest = async (axiosInstance, originalRequest, retryCount = 0) => {
    const maxRetries = 3;
    const baseDelay = 1000; // 1 second base delay
    
    if (retryCount >= maxRetries) {
        throw new Error('Max retries exceeded');
    }
    
    const delayMs = baseDelay * Math.pow(2, retryCount); // Exponential backoff
    await delay(delayMs);
    
    try {
        return await axiosInstance(originalRequest);
    } catch (error) {
        if (isRetryableError(error)) {
            return retryRequest(axiosInstance, originalRequest, retryCount + 1);
        }
        throw error;
    }
};

const AxiosInterceptorProvider = ({ children }) => {
    const { redirectToLogin } = useAuthInterceptor();

    useEffect(() => {
        const interceptor = _axios.interceptors.request.use(
            async config => {
                try {
                    config.baseURL = API_ACP_BASEURL;
                } catch (error) {
                    console.error("[Interceptor] Error determining baseURL:", error);
                    config.baseURL = BASE_URL;
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

                // Handle 401 errors (existing token refresh logic)
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

                if (isRetryableError(error) && !originalRequest._retryAttempted) {
                    originalRequest._retryAttempted = true;
                    try {
                        return await retryRequest(_axios, originalRequest);
                    } catch (retryError) {
                        return Promise.reject(retryError);
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