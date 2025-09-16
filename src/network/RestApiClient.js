import React, { useEffect } from "react";
import axios from "axios";
import { Env } from "./apis/account/Constants";
import { getUser, storeUser } from "../redux/utils/LocalStorage";
import { RefreshToken } from "../components/user/Session";
import { useAuthInterceptor } from "../network/useAuthInterceptor";
const API_ACP_BASEURL = Env.API_ACP_BASEURL;

const _axios = axios.create({
  baseURL: API_ACP_BASEURL, // Default base URL
  withCredentials: false,
  crossDomain: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

let isRefreshing = false;
let failedQueue = [];
let navigationPending = false; // Flag to prevent multiple navigations

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

const AxiosInterceptorProvider = ({ children }) => {
  const { redirectToLogin } = useAuthInterceptor();

  useEffect(() => {
    const responseInterceptor = _axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (
          error.code === "ECONNABORTED" &&
          error.message &&
          error.message.includes("timeout") &&
          !originalRequest._timeoutRetry
        ) {
          originalRequest._timeoutRetry = true; // Mark as retried
          return _axios(originalRequest); // Retry the request
        }

        if (
          error.response &&
          error.response.status === 401 &&
          !originalRequest._retry
        ) {
          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            })
              .then((token) => {
                originalRequest.headers["Authorization"] = "Bearer " + token;
                return _axios(originalRequest);
              })
              .catch((err) => {
                return Promise.reject(err);
              });
          }

          originalRequest._retry = true;
          isRefreshing = true;

          try {
            const refreshedData = await RefreshToken();
            const user = await getUser();
            await storeUser(user);
            _axios.defaults.headers.common["Authorization"] =
              "Bearer " + user.token;
            originalRequest.headers["Authorization"] = "Bearer " + user.token;
            processQueue(null, user.token);
            isRefreshing = false;
            return _axios(originalRequest);
          } catch (tokenRefreshError) {
            processQueue(tokenRefreshError, null);
            isRefreshing = false;

            if (!navigationPending) {
              navigationPending = true;
              setTimeout(async () => {
                await redirectToLogin();
                navigationPending = false;
              }, 500);
            }
            return Promise.reject(tokenRefreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      _axios.interceptors.request.eject(interceptor);
      _axios.interceptors.response.eject(responseInterceptor);
    };
  }, [redirectToLogin]);

  return children;
};

export { AxiosInterceptorProvider, _axios };
