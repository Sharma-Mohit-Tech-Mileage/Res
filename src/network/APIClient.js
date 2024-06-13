import { getUser, storeUser } from "../redux/utils/LocalStorage";
import { Env } from "./apis/account/Constants";
import { RefreshToken } from '../components/user/Session';

const BASE_URL = Env.API_BASEURL;
const SUPPORT_URL = "https://support.sparklight.com/api/v2/help_center/";
const MODEM_BASE_URL = Env.MODEM_BASE_URL;

let UserAuthorized = false;
let isRefreshing = false;
let failedQueue = [];

export const isUserAuthorized = (authorize) => {
    UserAuthorized = authorize;
};

const handleFetchResponse = async (response, onSuccess, onError) => {
    try {
        const json = await response.json();
        if (response.ok) {
            onSuccess(json);
        } else {
            onError(`Response status ${response.status} (${response.statusText}): ${json.message}`);
        }
    } catch (error) {
        onError(error.message);
    }
};

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

const fetchWithTokenRefresh = async (fetchFunction, endpoint, options, onSuccess, onError) => {
    try {
        console.log('Attempting API call:', endpoint);
        let response = await fetchFunction(endpoint, options);
        if (response.status === 401) {
            console.log('401 Unauthorized, attempting to refresh token...');
            if (!isRefreshing) {
                isRefreshing = true;
                try {
                    const refreshedData = await RefreshToken();
                    const user = await getUser();
                    options.headers['Authorization'] = `Bearer ${user.token}`;
                    console.log('Token refreshed successfully');
                    processQueue(null, user.token);
                } catch (refreshError) {
                    console.log('Token refresh failed:', refreshError);
                    processQueue(refreshError, null);
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
        }

        return response;
    } catch (error) {
        console.log('API call failed:', error.message);
        onError(error.message);
    }
};

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

    fetch(`${BASE_URL}/${endpoint}`, options)
        .then(response => handleAuthResponse(response, idTokenGuid, refreshToken, onSuccess, onError))
        .catch(exception => onError(exception));
};

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
    fetchWithTokenRefresh(fetch, `${BASE_URL}/${endpoint}`, options, onSuccess, onError)
        .then(response => handleFetchResponse(response, onSuccess, onError));
};

export const PutApiRequest = async (endpoint, body, onSuccess, onError) => {
    const user = await getUser();

    const options = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
        body: JSON.stringify(body)
    };

    console.log('PutApiRequest:', endpoint);
    fetchWithTokenRefresh(fetch, `${BASE_URL}${endpoint}`, options, onSuccess, onError)
        .then(response => handleFetchResponse(response, onSuccess, onError));
};

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
    fetchWithTokenRefresh(fetch, `${BASE_URL}/${endpoint}`, options, onSuccess, onError)
        .then(response => {
            if (response.status === 204) {
                onError(response.status);
            } else {
                return handleFetchResponse(response, onSuccess, onError);
            }
        });
};

export const GetApiRequestSearch = async (endpoint, onSuccess, onError) => {
    const user = await getUser();

    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
        }
    };

    console.log('GetApiRequestSearch:', endpoint);
    fetchWithTokenRefresh(fetch, `${SUPPORT_URL}/${endpoint}`, options, onSuccess, onError)
        .then(response => handleFetchResponse(response, onSuccess, onError));
};

export const GetModemStatusApiRequest = async (endpoint, onSuccess, onError) => {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'client_id': '0224e1c5310a45f4a02a244a54e50350',
            'client_secret': '1237E83e1676480B90BfEdB0aa73c91b'
        }
    };

    console.log('GetModemStatusApiRequest:', endpoint);
    fetch(`${MODEM_BASE_URL}/${endpoint}`, options)
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
