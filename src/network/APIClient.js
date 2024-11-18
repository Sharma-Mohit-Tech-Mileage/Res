import { getUser } from "../redux/utils/LocalStorage";
import { Env } from "./apis/account/Constants";
import axios from "axios";
import { RefreshToken } from '../components/user/Session';
import { navigationRef } from '../navigations/UserNavigations';

const BASE_URL = Env.API_BASEURL.endsWith('/') ? Env.API_BASEURL : `${Env.API_BASEURL}/`;
const API_ACP_BASEURL = Env.API_ACP_BASEURL.endsWith('/') ? Env.API_ACP_BASEURL : `${API_ACP_BASEURL}/`;
const SUPPORT_URL = "https://support.sparklight.com/api/v2/help_center/";
const MODEM_BASE_URL = Env.MODEM_BASE_URL.endsWith('/') ? Env.MODEM_BASE_URL : `${Env.MODEM_BASE_URL}/`;

export let UserAuthorized = false;
let isRefreshing = false;
let failedQueue = [];

// Function to set user authorization status
export const isUserAuthorized = (authorize) => {
    UserAuthorized = authorize;
};

const handleFetchResponse = async (response, url, onSuccess, onError) => {
    try {
        const rawResponse = await response.text();
        console.log("Request URL:", url);
        console.log("Raw Response:", response.status);

        if (response.status === 204 || !rawResponse) {
            onSuccess({ message: 'No content', code: response.status });
            return;
        }

        try {
            const json = JSON.parse(rawResponse);
            if (response.ok) {
                onSuccess(json);
            } else {
                onError(`Response status ${response.status} (${response.statusText}): ${json.message}`);
            }
        } catch (jsonParseError) {
            console.error('JSON Parse error:', jsonParseError);
            onError(`Failed to parse response: ${jsonParseError.message}, code: ${response.status}`);
        }
    } catch (error) {
        onError(`Error processing response: ${error.message}`);
    }
};

const processQueue = (error, token = null) => {
    failedQueue.forEach(({ resolve, reject }, index) => {
        if (error) {
            console.error(`Queue item ${index} failed with error:`, error.message);
            reject(error);
        } else {
            console.log(`Queue item ${index} retrying with new token.`);
            resolve(token);
        }
    });
    failedQueue = [];
};


const fetchWithTokenRefresh = async (fetchFunction, endpoint, options, onSuccess, onError) => {
    try {
        console.log('Attempting API call:', endpoint);
        let response = await fetchFunction(endpoint, options);

        if (response.status === 401) {
            console.log('401 Unauthorized, queuing request and refreshing token...');
            
            // Add current request to queue and wait for token refresh
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
                
                if (!isRefreshing) {
                    isRefreshing = true;

                    RefreshToken()
                        .then(async () => {
                            const user = await getUser();
                            options.headers['Authorization'] = `Bearer ${user.token}`;
                            console.log('Token refreshed successfully');

                            processQueue(null, user.token); // Resolve queued requests
                        })
                        .catch((refreshError) => {
                            console.error('Token refresh failed:', refreshError);
                            processQueue(refreshError, null); // Reject queued requests
                            if (navigationRef.current) {
                                navigationRef.current.navigate('Splash');
                            }
                        })
                        .finally(() => {
                            isRefreshing = false;
                        });
                }
            }).then((token) => {
                options.headers['Authorization'] = `Bearer ${token}`;
                console.log('Retrying request with new token for:', endpoint);
                return fetchFunction(endpoint, options);
            });
        }

        return response; // Return success response directly if no 401
    } catch (error) {
        console.error('API call failed:', error.message);
        onError(error.message);
    }
};

const handleAuthResponse = async (response, idTokenGuid, refreshToken, onSuccess, onError) => {
    console.log('Handling authentication response...'); // Start log

    let json;
    try {
        json = await response.json();
        console.log('Parsed JSON:', json); // Log parsed JSON
    } catch (parseError) {
        console.error('Error parsing JSON response:', parseError); // Log JSON parse errors
        onError(`Failed to parse response: ${parseError.message}`);
        return;
    }

    if (response.ok) {
        if (idTokenGuid && refreshToken) {
            json.idTokenGuid = idTokenGuid;
            json.refreshToken = refreshToken;
        }
        console.log('Response OK, invoking onSuccess'); // Success log
        onSuccess(json);
    } else {
        const errorMsg = `Response status ${response.status} (${response.statusText}): ${json?.message || 'No error message provided'}`;
        console.error(errorMsg); // Log detailed error with fallback
        onError(errorMsg);
    }
};

export const PostAuthApiRequest = async (endpoint, body, onSuccess, onError) => {
    console.log(`Initiating POST request to ${endpoint}...`); // Start log
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

    console.log('Request options:', options); // Log request options

    fetch(`${BASE_URL}${endpoint}`, options)
        .then(response => handleAuthResponse(response, idTokenGuid, refreshToken, onSuccess, onError))
        .catch(exception => {
            const errorLog = `Fetch error: ${exception.message || 'Unknown error'}`;
            console.error(errorLog); // Log fetch error
            onError(errorLog);
        });
};

// Generic POST API request function
export const PostApiRequest = async (endpoint, body, onSuccess, onError) => {
    const user = await getUser();
    const baseUrl = await getBaseUrl(); // Dynamically get the base URL
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(body)
    };

    fetchWithTokenRefresh(fetch, `${baseUrl}${endpoint}`, options, onSuccess, onError)
        .then(response => handleFetchResponse(response, `${baseUrl}${endpoint}`, onSuccess, onError));
};

// Function to upload multipart data
export const UploadMultipartData = async (endpoint, data, onSuccess, onError) => {
    const user = await getUser();
    const baseUrl = await getBaseUrl(); // Dynamically get the base URL
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

    console.log('UploadMultipartData:', `${baseUrl}${endpoint}`);
    fetchWithTokenRefresh(fetchFunction, `${baseUrl}${endpoint}`, options, onSuccess, onError)
        .then(response => onSuccess(response.data))
        .catch(error => {
            console.error('UploadMultipartData error:', error.message);
            onError(error.message);
        });
};

// Function for PUT API requests
export const PutApiRequest = async (endpoint, body, onSuccess, onError) => {
    const user = await getUser();
    const baseUrl = await getBaseUrl(); // Dynamically get the base URL
    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(body)
    };

    fetchWithTokenRefresh(fetch, `${baseUrl}${endpoint}`, options, onSuccess, onError)
        .then(response => handleFetchResponse(response, `${baseUrl}${endpoint}`, onSuccess, onError));
};

// Function for GET API requests
export const GetApiRequest = async (endpoint, onSuccess, onError) => {
    const user = await getUser();
    const baseUrl = await getBaseUrl(); // Dynamically get the base URL
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
        }
    };

    console.log('GetApiRequest:', endpoint);
    console.log('request Token:', user.token);
    fetchWithTokenRefresh(fetch, `${baseUrl}${endpoint}`, options, onSuccess, onError)
        .then(response => {
            if (response.status === 204) {
                onError(response.status);
            } else {
                return handleFetchResponse(response, `${baseUrl}${endpoint}`, onSuccess, onError);
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

    fetchWithTokenRefresh(fetch, `${SUPPORT_URL}${endpoint}`, options, onSuccess, onError)
        .then(response => handleFetchResponse(response, `${SUPPORT_URL}${endpoint}`, onSuccess, onError));
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

// Helper method to decide the base URL based on user type
const getBaseUrl = async () => {
    try {
        const user = await getUser();
        console.log("[getBaseUrl] User:", user);
        // If user exists and is not a normal user, return ACP base URL
        if (user && user.isNormalUser === false) {
            console.log("[getBaseUrl] User is ACP user.");
            return API_ACP_BASEURL;
        }

        // Default case for normal user
        console.log("[getBaseUrl] User is normal user:", user?.isNormalUser);
        return BASE_URL;
    } catch (error) {
        // Log the error and return BASE_URL as a fallback
        console.error("[getBaseUrl] Error determining base URL:", error);
        return BASE_URL;
    }
};
