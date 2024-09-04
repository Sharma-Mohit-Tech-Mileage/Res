import { getUser } from "../redux/utils/LocalStorage";
import { Env } from "./apis/account/Constants";
import axios from "axios";
import { RefreshToken } from '../components/user/Session';
import { navigationRef } from '../navigations/UserNavigations';

// Base URLs with ensured trailing slashes
const BASE_URL = Env.API_BASEURL.endsWith('/') ? Env.API_BASEURL : `${Env.API_BASEURL}/`;
const SUPPORT_URL = "https://support.sparklight.com/api/v2/help_center/";
const MODEM_BASE_URL = Env.MODEM_BASE_URL.endsWith('/') ? Env.MODEM_BASE_URL : `${Env.MODEM_BASE_URL}/`;

export let UserAuthorized = false;
let isRefreshing = false;
let failedQueue = [];

// Function to set user authorization status
export const isUserAuthorized = (authorize) => {
    UserAuthorized = authorize;
};

// Helper to handle response processing
const handleFetchResponse = async (response, onSuccess, onError) => {
    try {
        
        const json = await response.json();
        
        if (response.ok) {
            onSuccess(json);
        } else {
            onError(`Response status ${response.status} (${response.statusText}): ${json.message}`);
        }
    } catch (error) {
        onError(`Error processing response: ${error.message}`);
    }
};

// Function to process the queue of requests during token refresh
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

// Function to handle API calls with token refresh logic
const fetchWithTokenRefresh = async (fetchFunction, endpoint, options, onSuccess, onError) => {
    try {
        console.log('Attempting API call:', endpoint);
        let response = await fetchFunction(endpoint, options);
        if (response.status === 401) {
            console.log('401 Unauthorized, attempting to refresh token...');
            if (!isRefreshing) {
                isRefreshing = true;
                try {
                    await RefreshToken();
                    const user = await getUser();
                    options.headers['Authorization'] = `Bearer ${user.token}`;
                    console.log('Token refreshed successfully');
                    processQueue(null, user.token);
                } catch (refreshError) {
                    console.error('Token refresh failed:', refreshError);
                    processQueue(refreshError, null);
                    if (navigationRef.current) {
                        navigationRef.current.navigate('Splash');
                    }
                } finally {
                    isRefreshing = false;
                }
            }

            return new Promise((resolve, reject) => {
                console.log('Adding request to queue');
                failedQueue.push({ resolve, reject });
            }).then(token => {
                console.log('Retrying request with new token:', token);
                options.headers['Authorization'] = `Bearer ${token}`;
                return fetchFunction(endpoint, options);
            });
        }else if(response.status === 204){
            onError(response.status)
        }
        return response;
    } catch (error) {
        console.error('API call failed:', error.message);
        onError(error.message);
    }
};

// Function to handle authentication responses
const handleAuthResponse = async (response, idTokenGuid, refreshToken, onSuccess, onError) => {
    const json = await response.json();
    if (response.ok) {
        if (idTokenGuid && refreshToken) {
            json.idTokenGuid = idTokenGuid;
            json.refreshToken = refreshToken;
        }
        onSuccess(json);
    } else {
        onError(`Response status ${response.status} (${response.statusText}): ${json.message}`);
    }
};

// Post request with authentication for specific endpoints
export const PostAuthApiRequest = (endpoint, body, onSuccess, onError) => {
    const idTokenGuid = body.idTokenGuid;
    const refreshToken = body.refreshToken;

    delete body.idTokenGuid;
    delete body.refreshToken;

    const options = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    };

    fetch(`${BASE_URL}${endpoint}`, options)
        .then(response => handleAuthResponse(response, idTokenGuid, refreshToken, onSuccess, onError))
        .catch(exception => onError(exception.message));
};

// Generic POST API request function
export const PostApiRequest = async (endpoint, body, onSuccess, onError) => {
    const user = await getUser();

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(body)
    };

    console.log('PostApiRequest:', endpoint);
    fetchWithTokenRefresh(fetch, `${BASE_URL}${endpoint}`, options, onSuccess, onError)
        .then(response => handleFetchResponse(response, onSuccess, onError));
};

// Function to upload multipart data
export const UploadMultipartData = async (endpoint, data, onSuccess, onError) => {
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

    console.log('UploadMultipartData:', `${BASE_URL}${endpoint}`);
    fetchWithTokenRefresh(fetchFunction, `${BASE_URL}${endpoint}`, options, onSuccess, onError)
        .then(response => onSuccess(response.data))
        .catch(error => {
            console.error('UploadMultipartData error:', error.message);
            onError(error.message);
        });
};

// Function for PUT API requests
export const PutApiRequest = async (endpoint, body, onSuccess, onError) => {
    const user = await getUser();

    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(body)
    };

    console.log('PutApiRequest:', endpoint, 'body:', body);
    fetchWithTokenRefresh(fetch, `${BASE_URL}${endpoint}`, options, onSuccess, onError)
        .then(response => handleFetchResponse(response, onSuccess, onError));
};

// Function for GET API requests
export const GetApiRequest = async (endpoint, onSuccess, onError) => {
    const user = await getUser();

    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
        }
    };

    console.log('GetApiRequest:', endpoint);
    console.log('request Token:', user.token);
    fetchWithTokenRefresh(fetch, `${BASE_URL}${endpoint}`, options, onSuccess, onError)
        .then(response => {
            if (response.status === 204) {
                onError(response.status);
            } else {
                return handleFetchResponse(response, onSuccess, onError);
            }
        });
};

// Function to search API requests using support URL
export const GetApiRequestSearch = async (endpoint, onSuccess, onError) => {
    const user = await getUser();

    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
        }
    };

    console.log('GetApiRequestSearch:', `${SUPPORT_URL}${endpoint}`);
    fetchWithTokenRefresh(fetch, `${SUPPORT_URL}${endpoint}`, options, onSuccess, onError)
        .then(response => handleFetchResponse(response, onSuccess, onError));
};

// Function for modem status API requests
export const GetModemStatusApiRequest = async (endpoint, onSuccess, onError) => {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'client_id': '0224e1c5310a45f4a02a244a54e50350',
            'client_secret': '1237E83e1676480B90BfEdB0aa73c91b'
        }
    };

    console.log('GetModemStatusApiRequest:', `${MODEM_BASE_URL}${endpoint}`);
    fetch(`${MODEM_BASE_URL}${endpoint}`, options)
        .then(response => {
            if (response.status >= 400 && response.status < 600) {
                onError(response.status);
            } else {
                return response.json();
            }
        })
        .then(json => onSuccess(json))
        .catch(exception => onError(exception.message));
};

// Truck roll API request function
export const PostruckRollApi = (endpoint, body, onSuccess, onError) => {
    console.log(`endpoint=endpoint`, JSON.stringify(body));
    fetch(Env.TRUCK_ROLL_BASE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'Authorization': "Bearer dapie2a2368f30bbec7fd55a0cadbce8d388"
        },
        body: JSON.stringify(body),
    })
        .then((response) => Promise.all([response, response.json()]))
        .then(([response, json]) => {
            console.log(response);
            onSuccess(json);
        })
        .catch((exception) => onError(exception.message));
};
