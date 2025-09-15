import { getUser } from "../redux/utils/LocalStorage";
import { Env } from "./apis/account/Constants";
import axios from "axios";
import { RefreshToken } from '../components/user/Session';
import { navigationRef } from '../navigations/UserNavigations';
const BASE_URL = Env.API_BASEURL.endsWith('/') ? Env.API_BASEURL : `${Env.API_BASEURL}/`;
const API_ACP_BASEURL = Env.API_ACP_BASEURL.endsWith('/') ? Env.API_ACP_BASEURL : `${API_ACP_BASEURL}/`;
const SUPPORT_URL = "https://support.sparklight.com/api/v2/help_center/";

export let UserAuthorized = false;
let isRefreshing = false;
let failedQueue = [];

// Function to set user authorization status
export const isUserAuthorized = (authorize) => {
    UserAuthorized = authorize;
};

const handleFetchResponse = async (response, url, onSuccess, onError) => {
    try {
        const rawResponse = await response.text(); // Read response as plain text

        if (response.status === 204 || !rawResponse) {
            onSuccess({ message: 'No content', code: response.status }); // Pass a success message for no content
            return;
        }

        // Try parsing the response as JSON if not empty
        try {
            const json = JSON.parse(rawResponse);
            if (response.ok) {
                onSuccess(json);
            } else {
                onError(`Response status ${response.status} (${response.statusText}): ${json.message}`);
            }
        } catch (jsonParseError) {
            onError(`Failed to parse response: ${jsonParseError.message}, code: ${response.status}`);
        }
    } catch (error) {
        onError(`Error processing response: ${error.message}`);
    }
};

// Function to process the queue of requests during token refresh
const processQueue = (error, token = null) => {
    failedQueue.forEach(({ resolve, reject }, index) => {
        if (error) {
            reject(error);
        } else {
            resolve(token);
        }
    });
    failedQueue = [];
};

// Function to handle API calls with token refresh logic
const fetchWithTokenRefresh = async (fetchFunction, endpoint, options, onSuccess, onError) => {
    try {
        
        let response = await fetchFunction(endpoint, options);
        if (response.status === 401) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            if (!isRefreshing) {
                isRefreshing = true;

                    RefreshToken()
                        .then(async () => {
                    const user = await getUser();
                    options.headers['Authorization'] = `Bearer ${user.token}`;
                    processQueue(null, user.token);
                        })
                        .catch((refreshError) => {
                    processQueue(refreshError, null);
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
                return fetchFunction(endpoint, options);
            });
        }
        return response;
    } catch (error) {
        onError(error.message);
    }
};
  
export const PostAuthApiRequest = async (endpoint, body, onSuccess, onError) => {
  const idTokenGuid = body?.idTokenGuid;
  const refreshToken = body?.refreshToken;
  
  try {
    const requestBody = { ...body };
    delete requestBody.idTokenGuid;
    delete requestBody.refreshToken;
    
    const res = await axios.post(`${BASE_URL}${endpoint}`, requestBody, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      timeout: 30000,
      validateStatus: (status) => status >= 200 && status < 300 && status !== 204  // Exclude 204
    });
    
    // Check for 204 No Content
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
    if (idTokenGuid) {
      responseData.idTokenGuid = idTokenGuid;
    }
    if (refreshToken) {
      responseData.refreshToken = refreshToken;
    }
    onSuccess(responseData);
    
  } catch (err) {
    const errorResponse = {
      err,
      status: err.response?.status,
      message: err.response?.data?.message || err.message || 'Request failed',
      endpoint,
      timestamp: new Date().toISOString()
    };
    
    onError(errorResponse);
  }
};


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

    fetchWithTokenRefresh(fetchFunction, `${baseUrl}${endpoint}`, options, onSuccess, onError)
        .then(response => onSuccess(response.data))
        .catch(error => {
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
    const baseUrl = await getBaseUrl(); 
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
        }
    };

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

    fetch(`${BASE_URL}${endpoint}`, options)
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
            onSuccess(json);
        })
        .catch((exception) => onError(exception.message));
};

// Helper method to decide the base URL based on user type
const getBaseUrl = async () => {
    return API_ACP_BASEURL;
};
