import { getUser, storeUser } from "../redux/utils/LocalStorage";
import { Env } from "./apis/account/Constants";
import { RefreshToken } from '../components/user/Session'

const BASE_URL = Env.API_BASEURL;
const SUPPORT_URL = "https://support.sparklight.com/api/v2/help_center/";
const MODEM_BASE_URL = Env.MODEM_BASE_URL;

export let UserAuthorized = false;

export const isUserAuthorized = (authorize) => {
    UserAuthorized = authorize;
}

const handleFetchResponse = async (response, idTokenGuid, refreshToken, onSuccess, onError) => {
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

const fetchWithTokenRefresh = async (fetchFunction, endpoint, options, onSuccess, onError) => {
    try {
        const response = await fetchFunction(endpoint, options);
        if (response.status === 401) {
            const refreshedData = await RefreshToken();
            const user = await getUser();
            user.token = refreshedData.accessToken;
            user.refreshToken = refreshedData.refreshToken;
            await storeUser(user);
            options.headers['Authorization'] = `Bearer ${user.token}`;
            const retryResponse = await fetchFunction(endpoint, options);
            return retryResponse;
        }
        return response;
    } catch (error) {
        onError(error.message);
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
        .then(response => handleFetchResponse(response, idTokenGuid, refreshToken, onSuccess, onError))
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

    fetchWithTokenRefresh(fetch, `${BASE_URL}/${endpoint}`, options, onSuccess, onError)
        .then(response => handleFetchResponse(response, null, null, onSuccess, onError));
};

export const PutApiRequest = async (endpoint, body, onSuccess, onError) => {
    const user = await getUser();

    const options = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
        body: JSON.stringify(body)
    };

    fetchWithTokenRefresh(fetch, `${BASE_URL}${endpoint}`, options, onSuccess, onError)
        .then(response => handleFetchResponse(response, null, null, onSuccess, onError));
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

    fetchWithTokenRefresh(fetch, `${BASE_URL}/${endpoint}`, options, onSuccess, onError)
        .then(response => {
            if (response.status === 204) {
                onError(response.status);
            } else {
                return handleFetchResponse(response, null, null, onSuccess, onError);
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

    fetchWithTokenRefresh(fetch, `${SUPPORT_URL}/${endpoint}`, options, onSuccess, onError)
        .then(response => handleFetchResponse(response, null, null, onSuccess, onError));
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






