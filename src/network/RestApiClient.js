import React, { useEffect } from 'react';
import axios from 'axios';
import Config from "react-native-config";
import { getUser, cleanUserData } from "../redux/utils/LocalStorage";
import { RefreshToken } from '../components/user/Session';
import { navigationRef } from '../navigations/UserNavigations';
import { clearAuthCookies } from '../components/utility/NativeCookieManager';

const API_ACP_BASEURL = Config.API_ACP_BASEURL;
const SUPPORT_URL = "https://support.sparklight.com/api/v2/help_center/";

const _axios = axios.create({
    baseURL: API_ACP_BASEURL,
    withCredentials: false,
    timeout: 15000,
    headers: { 'Content-Type': 'application/json' },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) prom.reject(error);
        else prom.resolve(token);
    });
    failedQueue = [];
};

const isRetryableError = (error) => {
    return (
        error.code === 'ECONNABORTED' ||
        error.message?.includes('timeout') ||
        error.message?.includes('Network Error') ||
        (error.response && error.response.status >= 500)
    );
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Recurses until success or 3 retries; preserves the last axios failure (code/status/message/url) on bail-out so callers can distinguish timeout/network/5xx vs "Max retries exceeded".
const retryRequest = async (axiosInstance, originalRequest, retryCount = 0, lastError = null) => {
    if (retryCount >= 3) {
        const url = originalRequest?.url || lastError?.config?.url || '?';
        const code = lastError?.code || '?';
        const status = lastError?.response?.status ?? 'no-response';
        const msg = lastError?.message || 'unknown';
        const enriched = new Error(`Max retries exceeded | url=${url} | code=${code} | status=${status} | message=${msg}`);
        enriched.lastError = lastError;
        enriched.code = code;
        enriched.status = status;
        throw enriched;
    }
    await delay(1000 * Math.pow(2, retryCount));
    try {
        return await axiosInstance(originalRequest);
    } catch (error) {
        const url = originalRequest?.url || '?';
        const code = error?.code || '?';
        const status = error?.response?.status ?? 'no-response';
        console.warn(`[RestApiClient] retry ${retryCount + 1}/3 failed | url=${url} | code=${code} | status=${status} | message=${error?.message}`);
        if (isRetryableError(error)) return retryRequest(axiosInstance, originalRequest, retryCount + 1, error);
        throw error;
    }
};

// ── Interceptor Provider (wraps app) ────────────────────────────────────────

const redirectToLogin = async () => {
    try {
        await clearAuthCookies();
        await cleanUserData();
        if (navigationRef.current) {
            navigationRef.current.reset({ index: 0, routes: [{ name: 'Splash' }] });
        }
    } catch (error) {
        console.warn('[RestApiClient] redirectToLogin error:', error);
    }
};

const AxiosInterceptorProvider = ({ children }) => {
    useEffect(() => {
        const requestInterceptor = _axios.interceptors.request.use(
            config => { config.baseURL = config.baseURL || API_ACP_BASEURL; return config; },
            error => Promise.reject(error)
        );

        const responseInterceptor = _axios.interceptors.response.use(
            response => response,
            async error => {
                const originalRequest = error.config;

                if (error.response?.status === 401 && !originalRequest._retry) {
                    console.warn(`[RestApiClient] 401 received | endpoint=${originalRequest.url} | isRefreshing=${isRefreshing} | queueLength=${failedQueue.length} | ts=${new Date().toISOString()}`);
                    if (isRefreshing) {
                        return new Promise((resolve, reject) => {
                            failedQueue.push({ resolve, reject });
                        }).then(token => {
                            originalRequest.headers['Authorization'] = 'Bearer ' + token;
                            return _axios(originalRequest);
                        });
                    }

                    originalRequest._retry = true;
                    isRefreshing = true;

                    try {
                        await RefreshToken();
                        const user = await getUser();
                        console.warn(`[RestApiClient] 401 | refresh OK, retrying | endpoint=${originalRequest.url} | queuedRequests=${failedQueue.length} | ts=${new Date().toISOString()}`);
                        _axios.defaults.headers.common['Authorization'] = 'Bearer ' + user.token;
                        originalRequest.headers['Authorization'] = 'Bearer ' + user.token;
                        processQueue(null, user.token);
                        isRefreshing = false;
                        return _axios(originalRequest);
                    } catch (refreshError) {
                        processQueue(refreshError, null);
                        isRefreshing = false;
                        console.warn(`[RestApiClient] 401 | token refresh FAILED, redirecting to login | error=${refreshError.message} | ts=${new Date().toISOString()}`);
                        await redirectToLogin();
                        return Promise.reject(refreshError);
                    }
                }

                if (isRetryableError(error) && !originalRequest._retryAttempted) {
                    originalRequest._retryAttempted = true;
                    try { return await retryRequest(_axios, originalRequest); }
                    catch (retryError) { return Promise.reject(retryError); }
                }

                return Promise.reject(error);
            }
        );

        return () => {
            _axios.interceptors.request.eject(requestInterceptor);
            _axios.interceptors.response.eject(responseInterceptor);
        };
    }, []);

    return children;
};


const handleResponse = (res, onSuccess, onError, endpoint) => {
    if (res.status === 204 || !res.data) {
        onSuccess({ message: 'No content', code: 204 });
        return;
    }
    onSuccess(res.data);
};

const handleError = (err, onError, endpoint) => {
    const status = err.response?.status || 0;
    const statusText = err.response?.statusText || 'Unknown Error';
    const message = err.response?.data?.message || err.message || 'Request failed';
    console.warn(`[RestApiClient] API ERROR | endpoint=${endpoint} | status=${status} | statusText=${statusText} | message=${message} | code=${err.code || '?'} | ts=${new Date().toISOString()}`);
    onError({
        status,
        statusText,
        message,
        data: err.response?.data,
        endpoint,
    });
};

const PostAuthApiRequest = async (endpoint, body, onSuccess, onError) => {
    const idTokenGuid = body?.idTokenGuid;
    const refreshToken = body?.refreshToken;
    try {
        const requestBody = { ...body };
        delete requestBody.idTokenGuid;
        delete requestBody.refreshToken;

        const res = await _axios.post(endpoint, requestBody, {
            headers: { 'Content-Type': 'application/json' },
            timeout: 30000,
            transformRequest: [(data, headers) => { delete headers['Authorization']; return JSON.stringify(data); }],
        });

        if (res.status === 204) {
            onError({ status: 204, message: 'No content received', endpoint });
            return;
        }

        const responseData = { ...res.data };
        if (idTokenGuid) responseData.idTokenGuid = idTokenGuid;
        if (refreshToken) responseData.refreshToken = refreshToken;
        onSuccess(responseData);
    } catch (err) {
        handleError(err, onError, endpoint);
    }
};

const PostApiRequest = async (endpoint, body, onSuccess, onError) => {
    try {
        const user = await getUser();
        const res = await _axios.post(endpoint, body, {
            headers: { Authorization: `Bearer ${user.token}` },
        });
        handleResponse(res, onSuccess, onError, endpoint);
    } catch (err) {
        handleError(err, onError, endpoint);
    }
};

const PutApiRequest = async (endpoint, body, onSuccess, onError) => {
    try {
        const user = await getUser();
        const res = await _axios.put(endpoint, body, {
            headers: { Authorization: `Bearer ${user.token}` },
        });
        handleResponse(res, onSuccess, onError, endpoint);
    } catch (err) {
        handleError(err, onError, endpoint);
    }
};

const GetApiRequest = async (endpoint, onSuccess, onError) => {
    try {
        const user = await getUser();
        const res = await _axios.get(endpoint, {
            headers: { Authorization: `Bearer ${user.token}` },
        });
        handleResponse(res, onSuccess, onError, endpoint);
    } catch (err) {
        handleError(err, onError, endpoint);
    }
};

const GetApiRequestSearch = async (endpoint, onSuccess, onError) => {
    try {
        const user = await getUser();
        const res = await _axios.get(endpoint, {
            baseURL: SUPPORT_URL,
            headers: { Authorization: `Bearer ${user.token}` },
        });
        handleResponse(res, onSuccess, onError, endpoint);
    } catch (err) {
        handleError(err, onError, endpoint);
    }
};

const UploadMultipartData = async (endpoint, data, onSuccess, onError) => {
    try {
        const user = await getUser();
        const formData = new FormData();
        formData.append('file', { name: data.name, type: data.type, uri: data.uri });
        const res = await _axios.post(endpoint, formData, {
            headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${user.token}` },
        });
        onSuccess(res.data);
    } catch (err) {
        handleError(err, onError, endpoint);
    }
};

const PostApiReqZendeskToken = async (endpoint, body, onSuccess, onError) => {
    try {
        const user = await getUser();
        const res = await _axios.post(endpoint, body, {
            //baseURL: 'https://customer.uat.cableone.net/apiWrapper/',
            headers: { Authorization: `Bearer ${user.token}` },
        });
        handleResponse(res, onSuccess, onError, endpoint);
    } catch (err) {
        handleError(err, onError, endpoint);
    }
};

export {
    AxiosInterceptorProvider,
    _axios,
    PostAuthApiRequest,
    PostApiRequest,
    PostApiReqZendeskToken,
    PutApiRequest,
    GetApiRequest,
    GetApiRequestSearch,
    UploadMultipartData,
};
