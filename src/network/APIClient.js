import { getUser } from "../redux/utils/LocalStorage";
import { Env } from "./apis/account/Constants";
import axios from "axios";
import { RefreshToken } from '../components/user/Session';
import { navigationRef } from '../navigations/UserNavigations';

const API_ACP_BASEURL = Env.API_ACP_BASEURL;
const SUPPORT_URL = "https://support.sparklight.com/api/v2/help_center/";

export let UserAuthorized = false;
let isRefreshing = false;
let failedQueue = [];

export const isUserAuthorized = (authorize) => {
    UserAuthorized = authorize;
};

// ✅ FIXED: Return structured error object
const handleFetchResponse = async (response, url, onSuccess, onError) => {
    try {
        const rawResponse = await response.text(); 

        // ✅ Handle 204 No Content
        if (response.status === 204 || !rawResponse) {
            onSuccess({ message: 'No content', code: response.status });
            return;
        }

        try {
            const json = JSON.parse(rawResponse);
            
            if (response.ok) {
                onSuccess(json);
            } else {
                // ✅ FIXED: Return structured error object, not string
                onError({
                    status: response.status,
                    statusText: response.statusText,
                    message: json.message || json.error || 'Request failed',
                    data: json,
                    url: url
                });
            }
        } catch (jsonParseError) {
            // ✅ FIXED: Return structured error object
            onError({
                status: response.status,
                statusText: response.statusText,
                message: `Failed to parse response: ${jsonParseError.message}`,
                url: url
            });
        }
    } catch (error) {
        // ✅ FIXED: Return structured error object
        onError({
            status: 0,
            message: `Error processing response: ${error.message}`,
            url: url
        });
    }
};

const processQueue = (error, token = null) => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) {
            reject(error);
        } else {
            resolve(token);
        }
    });
    failedQueue = [];
};

// ✅ FIXED: Proper async/await flow for token refresh
const fetchWithTokenRefresh = async (fetchFunction, endpoint, options, onSuccess, onError) => {
    try {
        let response = await fetchFunction(endpoint, options);
        
        // ✅ ONLY handle 401 errors for token refresh
        if (response.status === 401) {
            
            // ✅ If already refreshing, wait for it
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                .then(async (token) => {
                    // ✅ Update headers with new token
                    options.headers['Authorization'] = `Bearer ${token}`;
                    // ✅ Retry request
                    const retryResponse = await fetchFunction(endpoint, options);
                    return retryResponse;
                });
            }

            // ✅ Start refresh process
            isRefreshing = true;

            try {
                // ✅ Refresh token
                const newToken = await RefreshToken();
                const user = await getUser();
                
                // ✅ Update options with new token
                options.headers['Authorization'] = `Bearer ${user.token}`;
                
                // ✅ Process all queued requests
                processQueue(null, user.token);
                isRefreshing = false;
                
                // ✅ Retry original request
                response = await fetchFunction(endpoint, options);
                return response;
                
            } catch (refreshError) {
                // ✅ Refresh failed
                processQueue(refreshError, null);
                isRefreshing = false;
                
                console.log('[APIClient] Token refresh failed, redirecting to login');
                if (navigationRef.current) {
                    navigationRef.current.reset({
                        index: 0,
                        routes: [{ name: 'Splash' }]
                    });
                }
                
                throw refreshError;
            }
        }
        
        // ✅ Return response for all other status codes
        return response;
        
    } catch (error) {
        console.error('[APIClient] Fetch error:', error);
        throw error;
    }
};
  
// ✅ ENHANCED: Better error handling
export const PostAuthApiRequest = async (endpoint, body, onSuccess, onError) => {
    const idTokenGuid = body?.idTokenGuid;
    const refreshToken = body?.refreshToken;
    
    try {
        const requestBody = { ...body };
        delete requestBody.idTokenGuid;
        delete requestBody.refreshToken;
        
        const res = await axios.post(`${API_ACP_BASEURL}${endpoint}`, requestBody, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            timeout: 30000,
            validateStatus: (status) => status >= 200 && status < 300 && status !== 204
        });
        
        // ✅ Check for 204 No Content
        if (res.status === 204) {
            onError({
                status: 204,
                message: 'No content received',
                endpoint,
                timestamp: new Date().toISOString()
            });
            return;
        }
        
        const responseData = { ...res.data };
        if (idTokenGuid) responseData.idTokenGuid = idTokenGuid;
        if (refreshToken) responseData.refreshToken = refreshToken;
        
        onSuccess(responseData);
        
    } catch (err) {
        // ✅ Structured error object
        const errorResponse = {
            status: err.response?.status || 0,
            statusText: err.response?.statusText || 'Unknown Error',
            message: err.response?.data?.message || err.message || 'Request failed',
            data: err.response?.data,
            endpoint,
            timestamp: new Date().toISOString()
        };
        
        onError(errorResponse);
    }
};

// ✅ ENHANCED: Proper error handling with try-catch
export const PostApiRequest = async (endpoint, body, onSuccess, onError) => {
    try {
        const user = await getUser();
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify(body)
        };

        const response = await fetchWithTokenRefresh(
            fetch, 
            `${API_ACP_BASEURL}${endpoint}`, 
            options, 
            onSuccess, 
            onError
        );
        
        // ✅ Handle response
        await handleFetchResponse(response, `${API_ACP_BASEURL}${endpoint}`, onSuccess, onError);
        
    } catch (error) {
        console.error('[PostApiRequest] Error:', error);
        onError({
            status: 0,
            message: error.message || 'Request failed',
            endpoint
        });
    }
};

// ✅ ENHANCED: Better error handling
export const UploadMultipartData = async (endpoint, data, onSuccess, onError) => {
    try {
        const user = await getUser();
        const formData = new FormData();
        formData.append("file", {
            name: data.name,
            type: data.type,
            uri: data.uri,
        });

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${user.token}`
            },
            data: formData
        };

        const fetchFunction = (url, opts) => axios.post(url, opts.data, { headers: opts.headers });

        const response = await fetchWithTokenRefresh(
            fetchFunction, 
            `${API_ACP_BASEURL}${endpoint}`, 
            options, 
            onSuccess, 
            onError
        );
        
        onSuccess(response.data);
        
    } catch (error) {
        console.error('[UploadMultipartData] Error:', error);
        onError({
            status: error.response?.status || 0,
            message: error.message || 'Upload failed',
            endpoint
        });
    }
};

// ✅ ENHANCED: Proper error handling
export const PutApiRequest = async (endpoint, body, onSuccess, onError) => {
    try {
        const user = await getUser();
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify(body)
        };

        const response = await fetchWithTokenRefresh(
            fetch, 
            `${API_ACP_BASEURL}${endpoint}`, 
            options, 
            onSuccess, 
            onError
        );
        
        await handleFetchResponse(response, `${API_ACP_BASEURL}${endpoint}`, onSuccess, onError);
        
    } catch (error) {
        console.error('[PutApiRequest] Error:', error);
        onError({
            status: 0,
            message: error.message || 'Request failed',
            endpoint
        });
    }
};

// ✅ ENHANCED: Proper error handling
export const GetApiRequest = async (endpoint, onSuccess, onError) => {
    try {
        const user = await getUser();
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        };

        const response = await fetchWithTokenRefresh(
            fetch, 
            `${API_ACP_BASEURL}${endpoint}`, 
            options, 
            onSuccess, 
            onError
        );
        
        // ✅ Handle 204 properly
        if (response.status === 204) {
            onError({
                status: 204,
                message: 'No content',
                endpoint
            });
        } else {
            await handleFetchResponse(response, `${API_ACP_BASEURL}${endpoint}`, onSuccess, onError);
        }
        
    } catch (error) {
        console.error('[GetApiRequest] Error:', error);
        onError({
            status: 0,
            message: error.message || 'Request failed',
            endpoint
        });
    }
};

// ✅ ENHANCED: Proper error handling
export const GetApiRequestSearch = async (endpoint, onSuccess, onError) => {
    try {
        const user = await getUser();
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        };

        const response = await fetchWithTokenRefresh(
            fetch, 
            `${SUPPORT_URL}${endpoint}`, 
            options, 
            onSuccess, 
            onError
        );
        
        await handleFetchResponse(response, `${SUPPORT_URL}${endpoint}`, onSuccess, onError);
        
    } catch (error) {
        console.error('[GetApiRequestSearch] Error:', error);
        onError({
            status: 0,
            message: error.message || 'Request failed',
            endpoint
        });
    }
};

// ✅ No changes needed - already good
export const GetModemStatusApiRequest = async (endpoint, onSuccess, onError) => {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'client_id': '0224e1c5310a45f4a02a244a54e50350',
            'client_secret': '1237E83e1676480B90BfEdB0aa73c91b'
        }
    };

    try {
        const response = await fetch(`${API_ACP_BASEURL}${endpoint}`, options);
        
        if (response.status >= 400 && response.status < 600) {
            onError({
                status: response.status,
                message: `Request failed with status ${response.status}`,
                endpoint
            });
        } else {
            const json = await response.json();
            onSuccess(json);
        }
    } catch (error) {
        onError({
            status: 0,
            message: error.message || 'Request failed',
            endpoint
        });
    }
};