import { getUser, storeUser } from "../../redux/utils/LocalStorage";
import { refresh } from "react-native-app-auth";
import store from "../../redux/configureStore";
import { saveUserInfo } from "../../redux/actions/UserAction";
import { PostAuthApiRequest } from "../../network/RestApiClient";
import { Env } from "../../network/apis/account/Constants";

const TAG = '[Session]';

let _refreshPromise = null;

const config = {
    issuer: Env.SSO_LOGIN,
    clientId: "sparklight-customer-mobile-app",
    redirectUrl: "com.sparklight.customer.app.auth0://sparklight-customer.us.auth0.com/ios/com.sparklight.customer.app/callback",
    scopes: ["openid", "profile", "email", "phone", "address"],
    iosPrefersEphemeralSession: true,
};

const onSuccess = async (res, idToken = null) => {
    if (!res) throw new Error("No token received from API");

    const { jwtToken: token, userInfo, idTokenGuid, refreshToken } = res;
    if (!token) throw new Error("API response missing jwtToken");

    const now = Date.now();
    const user = { userInfo, token, tokenGuid: idTokenGuid, refreshToken, idToken, jwtTimestamp: now, idTokenTimestamp: now };

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
        const result = await new Promise((resolve, reject) => {
            PostAuthApiRequest("api/mobile/gettoken", data, resolve, reject);
        });
        return result;
    } catch (error) {
        if (retries > 0) {
            return retryRequest(data, retries - 1);
        }
        console.error(`${TAG} Token refresh retries exhausted:`, error.message);
        throw error;
    }
};

export const RefreshToken = async () => {
    if (_refreshPromise) {
        return _refreshPromise;
    }

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
            return await onSuccess(apiResponse, result.idToken);
        } catch (error) {
            console.error(`${TAG} RefreshToken failed:`, error.message);
            return onError(error);
        }
    })();

    try {
        return await _refreshPromise;
    } finally {
        _refreshPromise = null;
    }
};
