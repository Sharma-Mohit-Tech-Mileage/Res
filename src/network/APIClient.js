import { Platform } from "react-native";
import { getUser } from "../redux/utils/LocalStorage";
import { Env } from "./apis/account/Constants";
import axios from "axios";
import { RefreshToken } from '../components/user/Session';
const BASE_URL = Env.API_BASEURL;
const SUPPORT_URL = "https://support.sparklight.com/api/v2/help_center/";
const MODEM_BASE_URL = Env.MODEM_BASE_URL;

export let UserAuthorized = false;
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
        //onError(error.message);
        onError(`Response status ${response.status} (${response.statusText}): ${error.message}`);
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

    fetch(`${BASE_URL}${endpoint}`, options)
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
    fetchWithTokenRefresh(fetch, `${BASE_URL}${endpoint}`, options, onSuccess, onError)
        .then(response => handleFetchResponse(response, onSuccess, onError));
};


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

    const fetchFunction = (url, opts) => {
        return axios.post(url, opts.data, { headers: opts.headers });
    };

    fetchWithTokenRefresh(fetchFunction, `${BASE_URL}${endpoint}`, options, onSuccess, onError)
        .then(response => {
            onSuccess(response.data);
        })
        .catch(error => {
            onError(error.message);
        });
};

// export const UploadMultipartData = async (
//     endpoint,
//     data,
//     onSuccess,
//     onError
// ) => {
//   // Example POST request
// const user = await getUser();
//   const formData = new FormData();
//   formData.append("file", {
//     name: data.name,
//     type: data.type,
//     uri: data.uri,
//   });
  
//   await axios
//     .post(`${BASE_URL}/${endpoint}`, formData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//         Authorization: `Bearer ${user.token}`,
//       },
//     })
//     .then((res) => {
//       console.log(res.data);
//       onSuccess(res.data);
//     })
//     .catch((error) => {
//       console.log(error);
//       onError(error);
//     });

//     // console.log('API URL',BASE_URL+endpoint)
//     // console.log('form data',JSON.stringify(formData))
//     // fetch(`${BASE_URL}/${endpoint}`, {
//     //     method: 'POST',
//     //     headers: {
//     //         'Content-Type': 'multipart/form-data',
//     //         'Authorization': `Bearer ${user.token}`
//     //     },
//     //     body:formData
//     // })
//     //     .then(response => Promise.all([response, response.json()]))
//     //     .then(([response, json]) => {
//     //          console.log('response', response);
//     //         if (!response.ok || !response.status === 201) { // We should get a 201 (Created) status code if everything is fine/working
//     //             throw Error(`Respsonse status ${response.status} (${response.statusText}): ${json.message}`);
//     //         }
//     //         onSuccess(json)
//     //          console.log(json);
//     //         // Whatever you want to do next after the POST request - maybe dispatch something?
//     //     })
//     //     .catch(exception => {
//     //         onError(exception.message)
//     //     });
// };

export const PutApiRequest = async (endpoint, body, onSuccess, onError) => {
    const user = await getUser();

    const options = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
        body: JSON.stringify(body)
    };

    console.log('PutApiRequest:', endpoint+'body',body);
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
    fetchWithTokenRefresh(fetch, `${SUPPORT_URL}${endpoint}`, options, onSuccess, onError)
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

// export const GetEuroApiRequest = async (endpoint, onSuccess, onError) => {
//     const user = await getUser();

//     const options = {
//         method: 'GET',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${user.token}`
//         }
//     };

//     const fetchFunction = (url, opts) => {
//         return fetch(url, opts);
//     };

//     fetchWithTokenRefresh(fetchFunction, endpoint, options, onSuccess, onError)
//         .then(response => handleFetchResponse(response, onSuccess, onError))
//         .catch(error => onError(error.message));
// };


// export const GetEuroApiRequest = async (endpoint, onSuccess, onError) => {
//     const user = await getUser();
//     console.log(`endpoint=endpoint`, endpoint);
//     fetch(endpoint, {
//         method: 'GET',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${user.token}` // Not always needed with a GET request
//         }
//     })
//         .then(response => {
//             if (response.status === 401) {
//                 isUserAuthorized(false);
//                 throw Error(`Response status ${response.status} (${response.statusText})`);
//             } else if (response.status === 204) {
//                 onError(response.status)
//             } else {
//                 return response.json();
//             }
//         })
//         .then((json) => {
//             isUserAuthorized(true);
//             onSuccess(json);
//         })
//         .catch(exception => {
//             onError(exception.message)
//         });
// }

// Truck roll API 
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
            //Add Token Guid
            console.log(response);
            onSuccess(json);
        })
        .catch((exception) => {
            onError(exception);
        });
};
