import { getUser } from "../redux/utils/LocalStorage";
import { Env } from "./apis/account/Constants";
import axios from "axios";
import { RefreshToken } from "../components/user/Session";
import { navigationRef } from "../navigations/UserNavigations";

const API_ACP_BASEURL = Env.API_ACP_BASEURL;
const SUPPORT_URL = "https://support.sparklight.com/api/v2/help_center/";

export let UserAuthorized = false;
let isRefreshing = false;
let failedQueue = [];

export const isUserAuthorized = (authorize) => {
  UserAuthorized = authorize;
};

const handleFetchResponse = async (response, url, onSuccess, onError) => {
  try {
    const rawResponse = await response.text();

    if (response.status === 204 || !rawResponse) {
      onSuccess({ message: "No content", code: response.status });
      return;
    }

    try {
      const json = JSON.parse(rawResponse);

      if (response.ok) {
        onSuccess(json);
      } else {
        onError({
          status: response.status,
          statusText: response.statusText,
          message: json.message || json.error || "Request failed",
          data: json,
          url: url,
        });
      }
    } catch (jsonParseError) {
      onError({
        status: response.status,
        statusText: response.statusText,
        message: `Failed to parse response: ${jsonParseError.message}`,
        url: url,
      });
    }
  } catch (error) {
    onError({
      status: 0,
      message: `Error processing response: ${error.message}`,
      url: url,
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

const fetchWithTokenRefresh = async (
  fetchFunction,
  endpoint,
  options,
  onSuccess,
  onError
) => {
  try {
    let response = await fetchFunction(endpoint, options);
    if (response.status === 401) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(async (token) => {
          options.headers["Authorization"] = `Bearer ${token}`;
          const retryResponse = await fetchFunction(endpoint, options);
          return retryResponse;
        });
      }

      isRefreshing = true;

      try {
        const newToken = await RefreshToken();
        const user = await getUser();
        options.headers["Authorization"] = `Bearer ${user.token}`;
        processQueue(null, user.token);
        isRefreshing = false;
        response = await fetchFunction(endpoint, options);
        return response;
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;

        console.log("[APIClient] Token refresh failed, redirecting to login");
        if (navigationRef.current) {
          navigationRef.current.reset({
            index: 0,
            routes: [{ name: "Splash" }],
          });
        }

        throw refreshError;
      }
    }

    return response;
  } catch (error) {
    console.error("[APIClient] Fetch error:", error);
    throw error;
  }
};

export const PostAuthApiRequest = async (
  endpoint,
  body,
  onSuccess,
  onError
) => {
  const idTokenGuid = body?.idTokenGuid;
  const refreshToken = body?.refreshToken;

  try {
    const requestBody = { ...body };
    delete requestBody.idTokenGuid;
    delete requestBody.refreshToken;

    const res = await axios.post(`${API_ACP_BASEURL}${endpoint}`, requestBody, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      timeout: 30000,
      validateStatus: (status) =>
        status >= 200 && status < 300 && status !== 204,
    });

    if (res.status === 204) {
      onError({
        status: 204,
        message: "No content received",
        endpoint,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const responseData = { ...res.data };
    if (idTokenGuid) responseData.idTokenGuid = idTokenGuid;
    if (refreshToken) responseData.refreshToken = refreshToken;

    onSuccess(responseData);
  } catch (err) {
    const errorResponse = {
      status: err.response?.status || 0,
      statusText: err.response?.statusText || "Unknown Error",
      message: err.response?.data?.message || err.message || "Request failed",
      data: err.response?.data,
      endpoint,
      timestamp: new Date().toISOString(),
    };

    onError(errorResponse);
  }
};

export const PostApiRequest = async (endpoint, body, onSuccess, onError) => {
  try {
    const user = await getUser();
    console.log("Bearer Token for API request:", user.token);
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(body),
    };

    const response = await fetchWithTokenRefresh(
      fetch,
      `${API_ACP_BASEURL}${endpoint}`,
      options,
      onSuccess,
      onError
    );

    await handleFetchResponse(
      response,
      `${API_ACP_BASEURL}${endpoint}`,
      onSuccess,
      onError
    );
  } catch (error) {
    console.error("[PostApiRequest] Error:", error);
    onError({
      status: 0,
      message: error.message || "Request failed",
      endpoint,
    });
  }
};

export const UploadMultipartData = async (
  endpoint,
  data,
  onSuccess,
  onError
) => {
  try {
    const user = await getUser();
    const formData = new FormData();
    formData.append("file", {
      name: data.name,
      type: data.type,
      uri: data.uri,
    });

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${user.token}`,
      },
      data: formData,
    };

    const fetchFunction = (url, opts) =>
      axios.post(url, opts.data, { headers: opts.headers });

    const response = await fetchWithTokenRefresh(
      fetchFunction,
      `${API_ACP_BASEURL}${endpoint}`,
      options,
      onSuccess,
      onError
    );

    onSuccess(response.data);
  } catch (error) {
    console.error("[UploadMultipartData] Error:", error);
    onError({
      status: error.response?.status || 0,
      message: error.message || "Upload failed",
      endpoint,
    });
  }
};

export const PutApiRequest = async (endpoint, body, onSuccess, onError) => {
  try {
    const user = await getUser();
    console.log("Bearer Token for API request:", user.token);
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(body),
    };

    const response = await fetchWithTokenRefresh(
      fetch,
      `${API_ACP_BASEURL}${endpoint}`,
      options,
      onSuccess,
      onError
    );

    await handleFetchResponse(
      response,
      `${API_ACP_BASEURL}${endpoint}`,
      onSuccess,
      onError
    );
  } catch (error) {
    console.error("[PutApiRequest] Error:", error);
    onError({
      status: 0,
      message: error.message || "Request failed",
      endpoint,
    });
  }
};

export const GetApiRequest = async (endpoint, onSuccess, onError) => {
  try {
    const user = await getUser();
    console.log("Bearer Token for API request:", user.token);
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    };

    const response = await fetchWithTokenRefresh(
      fetch,
      `${API_ACP_BASEURL}${endpoint}`,
      options,
      onSuccess,
      onError
    );

    if (response.status === 204) {
      onError({
        status: 204,
        message: "No content",
        endpoint,
      });
    } else {
      await handleFetchResponse(
        response,
        `${API_ACP_BASEURL}${endpoint}`,
        onSuccess,
        onError
      );
    }
  } catch (error) {
    console.error("[GetApiRequest] Error:", error);
    onError({
      status: 0,
      message: error.message || "Request failed",
      endpoint,
    });
  }
};

export const GetApiRequestSearch = async (endpoint, onSuccess, onError) => {
  try {
    const user = await getUser();
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    };

    const response = await fetchWithTokenRefresh(
      fetch,
      `${SUPPORT_URL}${endpoint}`,
      options,
      onSuccess,
      onError
    );

    await handleFetchResponse(
      response,
      `${SUPPORT_URL}${endpoint}`,
      onSuccess,
      onError
    );
  } catch (error) {
    console.error("[GetApiRequestSearch] Error:", error);
    onError({
      status: 0,
      message: error.message || "Request failed",
      endpoint,
    });
  }
};

export const GetModemStatusApiRequest = async (
  endpoint,
  onSuccess,
  onError
) => {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      client_id: "0224e1c5310a45f4a02a244a54e50350",
      client_secret: "1237E83e1676480B90BfEdB0aa73c91b",
    },
  };

  try {
    const response = await fetch(`${API_ACP_BASEURL}${endpoint}`, options);

    if (response.status >= 400 && response.status < 600) {
      onError({
        status: response.status,
        message: `Request failed with status ${response.status}`,
        endpoint,
      });
    } else {
      const json = await response.json();
      onSuccess(json);
    }
  } catch (error) {
    onError({
      status: 0,
      message: error.message || "Request failed",
      endpoint,
    });
  }
};
