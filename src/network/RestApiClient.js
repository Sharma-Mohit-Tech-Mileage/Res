import React, { useEffect } from 'react';
import axios from 'axios';
//import { Env } from "./apis/account/Constants";
import Config from "react-native-config";
import { getUser } from "../redux/utils/LocalStorage";
import { RefreshToken } from '../components/user/Session';
import { useAuthInterceptor } from '../network/useAuthInterceptor';

const API_ACP_BASEURL = Config.API_ACP_BASEURL;

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
    const baseDelay = 1000;
    
    if (retryCount >= maxRetries) {
        throw new Error('Max retries exceeded');
    }
    
    const delayMs = baseDelay * Math.pow(2, retryCount);
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
        const requestInterceptor = _axios.interceptors.request.use(
            async config => {
                try {
                    config.baseURL = API_ACP_BASEURL;
                } catch (error) {
                    console.error("[Interceptor] Error determining baseURL:", error);
                    config.baseURL = API_ACP_BASEURL;
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

                // ✅ ONLY handle 401 errors for token refresh
                if (error.response && error.response.status === 401 && !originalRequest._retry) {
                    
                    // ✅ If already refreshing, queue this request
                    if (isRefreshing) {
                        return new Promise((resolve, reject) => {
                            failedQueue.push({ resolve, reject });
                        })
                        .then(token => {
                            originalRequest.headers['Authorization'] = 'Bearer ' + token;
                            return _axios(originalRequest);
                        })
                        .catch(err => {
                            return Promise.reject(err);
                        });
                    }

                    originalRequest._retry = true;
                    isRefreshing = true;

                    try {
                        // ✅ Refresh token
                        const newToken = await RefreshToken();
                        
                        // ✅ Get updated user (RefreshToken already stored it)
                        const user = await getUser();
                        
                        // ✅ Update axios default headers
                        _axios.defaults.headers.common['Authorization'] = 'Bearer ' + user.token;
                        originalRequest.headers['Authorization'] = 'Bearer ' + user.token;
                        
                        // ✅ Process all queued requests
                        processQueue(null, user.token);
                        isRefreshing = false;
                        
                        // ✅ Retry original request
                        return _axios(originalRequest);
                        
                    } catch (tokenRefreshError) {
                        // ✅ Refresh failed - reject all queued requests
                        processQueue(tokenRefreshError, null);
                        isRefreshing = false;
                        
                        // ✅ Clean redirect to login
                        console.log('[Interceptor] Token refresh failed, redirecting to login');
                        await redirectToLogin();
                        
                        return Promise.reject(tokenRefreshError);
                    }
                }

                // ✅ Handle retryable errors (timeout, network, 5xx)
                if (isRetryableError(error) && !originalRequest._retryAttempted) {
                    originalRequest._retryAttempted = true;
                    try {
                        return await retryRequest(_axios, originalRequest);
                    } catch (retryError) {
                        console.error('[Interceptor] Retry failed:', retryError);
                        return Promise.reject(retryError);
                    }
                }

                // ✅ For all other errors (404, 403, 400, etc.), just reject
                return Promise.reject(error);
            }
        );

        return () => {
            _axios.interceptors.request.eject(requestInterceptor);
            _axios.interceptors.response.eject(responseInterceptor);
        };
    }, [redirectToLogin]);

    return children;
};

export { AxiosInterceptorProvider, _axios };