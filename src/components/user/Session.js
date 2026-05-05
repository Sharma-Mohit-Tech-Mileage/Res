import { getUser, storeUser } from "../../redux/utils/LocalStorage";
import { refresh } from "react-native-app-auth";
import store from "../../redux/configureStore";
import { saveUserInfo } from "../../redux/actions/UserAction";
import { PostAuthApiRequest } from "../../network/RestApiClient";
import { getEndpoint, ENDPOINTS } from "../../network/apis/endpoints/Endpoints";
import Config from "react-native-config";
import { Platform } from "react-native";

const TAG = "[Session]";

let _refreshPromise = null;

// Show first 8 + last 4 chars of a token for safe logging
const tokenPreview = (t) => {
  if (!t) return "(none)";
  const s = String(t);
  if (s.length <= 16) return s.substring(0, 4) + "…";
  return s.substring(0, 8) + "…" + s.substring(s.length - 4);
};

const config = {
  issuer: Config.SSO_LOGIN,
  clientId: Config.SSO_CLIENT_ID,
  redirectUrl: Platform.OS === "ios" ? Config.SSO_REDIRECT_URL_IOS : Config.SSO_REDIRECT_URL_ANDROID,
  scopes: ["openid", "profile", "email", "phone", "address"],
  iosPrefersEphemeralSession: true,
};

const onSuccess = async (res, idToken = null) => {
  if (!res) throw new Error("No token received from API");

  const { jwtToken: token, userInfo, idTokenGuid, refreshToken } = res;
  if (!token) throw new Error("API response missing jwtToken");

  const now = Date.now();
  const user = {
    userInfo,
    token,
    tokenGuid: idTokenGuid,
    refreshToken,
    idToken,
    jwtTimestamp: now,
    idTokenTimestamp: now,
  };

  console.log(
    `${TAG} onSuccess | ts=${new Date(now).toISOString()} | jwt=${tokenPreview(token)} | idToken=${tokenPreview(idToken)} | jwtTimestamp=${now} | idTokenTimestamp=${now} | account=${userInfo?.accountNumber || "?"}`
  );

  await storeUser(user);
  store.dispatch(saveUserInfo(user));
  return token;
};

const onError = (error) => {
  console.error(`${TAG} Session error:`, error.message || error);
  throw error;
};

const retryRequest = async (data, retries = 2) => {
  try {
    const endpointUrl = getEndpoint(ENDPOINTS.LOGIN_SSO_GETTOKEN);
    console.log(
      `${TAG} retryRequest | endpoint=${endpointUrl} | retriesLeft=${retries} | ts=${new Date().toISOString()}`
    );
    const result = await new Promise((resolve, reject) => {
      PostAuthApiRequest(endpointUrl, data, resolve, reject);
    });
    console.log(
      `${TAG} retryRequest OK | ts=${new Date().toISOString()} | hasJwt=${!!result?.jwtToken}`
    );
    return result;
  } catch (error) {
    console.error(
      `${TAG} retryRequest FAIL | retriesLeft=${retries} | error=${error.message} | status=${error?.status || "?"} | ts=${new Date().toISOString()}`
    );
    if (retries > 0) {
      return retryRequest(data, retries - 1);
    }
    console.error(`${TAG} Token refresh retries exhausted:`, error.message);
    throw error;
  }
};

export const RefreshToken = async () => {
  if (_refreshPromise) {
    console.log(
      `${TAG} RefreshToken | DEDUP — already in flight, awaiting existing promise | ts=${new Date().toISOString()}`
    );
    return _refreshPromise;
  }

  const refreshStartTs = Date.now();
  console.log(
    `${TAG} RefreshToken START | ts=${new Date(refreshStartTs).toISOString()}`
  );

  _refreshPromise = (async () => {
    try {
      const user = await getUser();
      if (!user?.refreshToken) throw new Error("No refresh token in storage");

      const jwtAge = user.jwtTimestamp ? Date.now() - user.jwtTimestamp : "?";
      const idTokenAge = user.idTokenTimestamp
        ? Date.now() - user.idTokenTimestamp
        : "?";
      console.log(
        `${TAG} RefreshToken | storedJwt=${tokenPreview(user.token)} | jwtAge=${jwtAge}ms | storedIdToken=${tokenPreview(user.idToken)} | idTokenAge=${idTokenAge}ms | hasRefreshToken=${!!user.refreshToken}`
      );

      const result = await refresh(config, { refreshToken: user.refreshToken });
      console.log(
        `${TAG} RefreshToken | SSO refresh OK | newIdToken=${tokenPreview(result.idToken)} | hasAccessToken=${!!result.accessToken} | hasNewRefreshToken=${!!result.refreshToken} | ts=${new Date().toISOString()}`
      );

      const data = {
        idToken: result.idToken,
        accessToken: result.accessToken,
        idTokenGuid: result.additionalParameters?.session_state || "",
        refreshToken: result.refreshToken,
      };

      const apiResponse = await retryRequest(data, 2);
      const token = await onSuccess(apiResponse, result.idToken);
      console.log(
        `${TAG} RefreshToken COMPLETE | duration=${Date.now() - refreshStartTs}ms | newJwt=${tokenPreview(token)} | ts=${new Date().toISOString()}`
      );
      return token;
    } catch (error) {
      console.error(
        `${TAG} RefreshToken FAILED | duration=${Date.now() - refreshStartTs}ms | error=${error.message} | ts=${new Date().toISOString()}`
      );
      return onError(error);
    }
  })();

  try {
    return await _refreshPromise;
  } finally {
    _refreshPromise = null;
  }
};
