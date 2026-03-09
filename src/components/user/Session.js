import { getUser, storeUser } from "../../redux/utils/LocalStorage";
import { refresh } from "react-native-app-auth";
import store from "../../redux/configureStore";
import { saveUserInfo } from "../../redux/actions/UserAction";
import { PostAuthApiRequest } from "../../network/APIClient";
import { Env } from "../../network/apis/account/Constants";

const TAG = '[Session]';

// ── Refresh lock to prevent concurrent refresh calls (race condition) ──
let _refreshLock = false;

const config = {
    issuer: Env.SSO_LOGIN,
    clientId: "sparklight-customer-mobile-app",
    redirectUrl: "com.sparklight.customer.app.auth0://sparklight-customer.us.auth0.com/ios/com.sparklight.customer.app/callback",
    scopes: ["openid", "profile", "email", "phone", "address"],
    iosPrefersEphemeralSession: true,
};

const onSuccess = async (res, idToken = null) => {
    try {
        if (!res) throw new Error("No token received from API");

        const { jwtToken: token, userInfo, idTokenGuid, refreshToken } = res;
        if (!token) throw new Error("API response missing jwtToken");

        const user = { userInfo, token, tokenGuid: idTokenGuid, refreshToken, idToken };

        await storeUser(user);
        console.log(`${TAG} User stored | Account: ${userInfo?.accountNumber || 'N/A'} | hasIdToken: ${!!idToken}`);

        store.dispatch(saveUserInfo(user));
        console.log(`${TAG} Redux store updated`);
        return token;
    } catch (error) {
        console.error(`${TAG} onSuccess failed:`, error.message);
        throw error;
    }
};

const onError = (error) => {
    console.error(`${TAG} Session error:`, error.message || error);
    throw error;
};

const retryRequest = async (data, retries = 2) => {
    const attempt = 3 - retries;
    try {
        console.log(`${TAG} [gettoken] Attempt ${attempt} → POST api/mobile/gettoken`);
        const start = Date.now();
        const result = await new Promise((resolve, reject) => {
            PostAuthApiRequest("api/mobile/gettoken", data, resolve, reject);
        });
        console.log(`${TAG} [gettoken] Success in ${Date.now() - start}ms`);
        return result;
    } catch (error) {
        if (retries > 0) {
            console.warn(`${TAG} [gettoken] Attempt ${attempt} failed, retrying (${retries} left) | ${error.message}`);
            return retryRequest(data, retries - 1);
        }
        console.error(`${TAG} [gettoken] All retries exhausted | ${error.message}`);
        throw error;
    }
};

export const RefreshToken = async () => {
    if (_refreshLock) {
        console.warn(`${TAG} ── RefreshToken SKIPPED (another refresh in progress) ──`);
        return null;
    }
    _refreshLock = true;
    console.log(`${TAG} ── RefreshToken START ──`);
    try {
        const user = await getUser();
        if (!user?.refreshToken) throw new Error("No refresh token in storage");

        console.log(`${TAG} [SSO] Calling refresh...`);
        const ssoStart = Date.now();
        const result = await refresh(config, { refreshToken: user.refreshToken });
        console.log(`${TAG} [SSO] Done in ${Date.now() - ssoStart}ms | hasIdToken: ${!!result.idToken} | hasAccessToken: ${!!result.accessToken} | tokenRotated: ${result.refreshToken !== user.refreshToken}`);

        const data = {
            idToken: result.idToken,
            accessToken: result.accessToken,
            idTokenGuid: result.additionalParameters?.session_state || "",
            refreshToken: result.refreshToken,
        };

        const apiResponse = await retryRequest(data, 2);
        const token = await onSuccess(apiResponse, result.idToken);
        console.log(`${TAG} ── RefreshToken COMPLETE ──`);
        return token;
    } catch (error) {
        console.error(`${TAG} ── RefreshToken FAILED ──`, error.message);
        return onError(error);
    } finally {
        _refreshLock = false;
    }
};

export const RefreshIdTokenOnly = async () => {
    if (_refreshLock) {
        console.warn(`${TAG} ── RefreshIdTokenOnly SKIPPED (another refresh in progress) ──`);
        return null;
    }
    _refreshLock = true;
    console.log(`${TAG} ── RefreshIdTokenOnly START ──`);
    try {
        const user = await getUser();
        if (!user?.refreshToken) throw new Error("No refresh token in storage");

        console.log(`${TAG} [SSO] Calling refresh (IdToken only)...`);
        const ssoStart = Date.now();
        const result = await refresh(config, { refreshToken: user.refreshToken });
        const elapsed = Date.now() - ssoStart;
        console.log(`${TAG} [SSO] Done in ${elapsed}ms | hasIdToken: ${!!result.idToken} | tokenRotated: ${result.refreshToken !== user.refreshToken}`);

        if (result.refreshToken && result.refreshToken !== user.refreshToken) {
            await storeUser({ ...user, idToken: result.idToken, refreshToken: result.refreshToken });
            console.log(`${TAG} Rotated refresh token + fresh idToken persisted`);
        } else {
            await storeUser({ ...user, idToken: result.idToken });
            console.log(`${TAG} Fresh idToken persisted`);
        }

        console.log(`${TAG} ── RefreshIdTokenOnly COMPLETE (${elapsed}ms) ──`);
        return result.idToken;
    } catch (error) {
        console.error(`${TAG} ── RefreshIdTokenOnly FAILED ──`, error.message);
        throw error;
    } finally {
        _refreshLock = false;
    }
};