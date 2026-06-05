import { getUser, storeUser } from "../../redux/utils/LocalStorage";
import { refresh } from "react-native-app-auth";
import store from "../../redux/configureStore";
import { saveUserInfo } from "../../redux/actions/UserAction";
import { PostAuthApiRequest } from "../../network/RestApiClient";
import { getEndpoint, ENDPOINTS } from "../../network/apis/endpoints/Endpoints";
import { INVALIDATE_ACCOUNT_CACHE } from "../../redux/constants/index";
import Config from "react-native-config";
import { Platform } from "react-native";

const TAG = "[Session]";

let _refreshPromise = null;

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

  await storeUser(user);
  store.dispatch(saveUserInfo(user));
  return token;
};

const onError = (error) => {
  console.warn(`${TAG} Session error:`, error.message || error);
  throw error;
};

const retryRequest = async (data, retries = 2) => {
  try {
    const endpointUrl = getEndpoint(ENDPOINTS.LOGIN_SSO_GETTOKEN);
    return await new Promise((resolve, reject) => {
      PostAuthApiRequest(endpointUrl, data, resolve, reject);
    });
  } catch (error) {
    if (retries > 0) {
      return retryRequest(data, retries - 1);
    }
    console.warn(`${TAG} Token refresh retries exhausted:`, error.message);
    throw error;
  }
};

export const RefreshToken = async () => {
  if (_refreshPromise) return _refreshPromise;

  const refreshStartTs = Date.now();

  _refreshPromise = (async () => {
    try {
      const user = await getUser();
      if (!user?.refreshToken) throw new Error("No refresh token in storage");

      const result = await refresh(config, { refreshToken: user.refreshToken });

      const data = {
        idToken: result.idToken,
        accessToken: result.accessToken,
        idTokenGuid: result.additionalParameters?.session_state || "",
        refreshToken: result.refreshToken,
      };

      const apiResponse = await retryRequest(data, 2);
      const token = await onSuccess(apiResponse, result.idToken);
      store.dispatch({ type: INVALIDATE_ACCOUNT_CACHE });
      return token;
    } catch (error) {
      console.warn(
        `${TAG} RefreshToken FAILED | duration=${Date.now() - refreshStartTs}ms | error=${error.message}`
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
