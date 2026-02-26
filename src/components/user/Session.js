import { getUser, storeUser } from "../../redux/utils/LocalStorage";
import { refresh } from "react-native-app-auth";
import store from "../../redux/configureStore";
import { saveUserInfo } from "../../redux/actions/UserAction";
import { PostAuthApiRequest } from "../../network/APIClient";
import { getEndpoint,ENDPOINTS } from "../../network/apis/endpoints/Endpoints";
//import { Env } from "../../network/apis/account/Constants";
import Config from "react-native-config";

const config = {
  issuer: Config.SSO_LOGIN,
  clientId: "sparklight-customer-mobile-app",
  redirectUrl:
    "com.sparklight.customer.app.auth0://sparklight-customer.us.auth0.com/ios/com.sparklight.customer.app/callback",
  scopes: ["openid", "profile", "email", "phone", "address"],
  iosPrefersEphemeralSession: true,
};

const onSuccess = async (res) => {
  try {
    if (!res) throw new Error("No token received");

    const { jwtToken: token, userInfo, idTokenGuid, refreshToken } = res;
    const user = {
      userInfo,
      token,
      tokenGuid: idTokenGuid,
      refreshToken,
    };

    if (token) {
      await storeUser(user);
    }

    store.dispatch(saveUserInfo(user));
    return token;
  } catch (error) {
    console.error("Error in onSuccess:", error);
    throw error;
  }
};

const onError = (error) => {
  console.error("Session onError:", error);
  throw error;
};

const retryRequest = async (data, retries = 1) => {
  try {
    return await new Promise((resolve, reject) => {
      const endpointUrl = getEndpoint(ENDPOINTS.LOGIN_SSO_GETTOKEN);
      PostAuthApiRequest(endpointUrl, data, resolve, reject);
    });
  } catch (error) {
    if (retries > 0) {
      console.log("Retrying request, attempts left:", retries);
      return retryRequest(data, retries - 1);
    }
    console.error("Retry request failed after retries:", error);
    throw error;
  }
};

export const RefreshToken = async () => {
  try {
    console.log("RefreshToken called");
    const user = await getUser();

    if (!user || !user.refreshToken) {
      throw new Error("No user or refresh token found");
    }

    const result = await refresh(config, {
      refreshToken: user.refreshToken,
    });

    const data = {
      idToken: result.idToken,
      accessToken: result.accessToken,
      idTokenGuid: result.additionalParameters?.session_state || "",
      refreshToken: result.refreshToken,
    };

    const apiResponse = await retryRequest(data, 2);
    return onSuccess(apiResponse);
  } catch (error) {
    return onError(error);
  }
};
