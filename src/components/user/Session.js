import { getUser, storeUser } from "../../redux/utils/LocalStorage";
import { refresh } from "react-native-app-auth";
import store from '../../redux/configureStore';
import { saveUserInfo } from "../../redux/actions/UserAction";
import { PostAuthApiRequest } from "../../network/APIClient";
import { Env } from "../../network/apis/account/Constants";
import { navigationRef } from '../../navigations/UserNavigations';

const config = {
    issuer: Env.SSO_LOGIN,
    clientId: "sparklight-customer-mobile-app",
    redirectUrl: "com.sparklight.customer.app.auth0://sparklight-customer.us.auth0.com/ios/com.sparklight.customer.app/callback",
    scopes: ["openid", "profile", "email", "phone", "address"],
    iosPrefersEphemeralSession: true,
};

const onSuccess = async (res) => {
    console.log('Session onSuccess:', res);
    if (res) {
        const token = res.jwtToken;
        const userInfo = res.userInfo;
        const user = {
            userInfo: userInfo,
            token: token,
            tokenGuid: res.idTokenGuid,
            refreshToken: res.refreshToken
        };
        if (token) {
            await storeUser(user);
            console.log('User stored in local storage:', user);
        }
        store.dispatch(saveUserInfo(user));
        console.log('User info saved in Redux store:', user);
        return token;
    }
    throw new Error("No token received");
};

const onError = (error) => {
    console.error('Session onError:', error);
    if (navigationRef.current) {
        navigationRef.current.navigate('Splash');  // Ensure this route name matches your actual Splash screen route
    }
    throw error;  // Re-throw the error if needed
};

const retryRequest = async (data, retries = 1) => {
    try {
        return await new Promise((resolve, reject) => {
            PostAuthApiRequest("/mobile/api/gettoken", data, resolve, reject);
        });
    } catch (error) {
        if (retries > 0) {
            console.log('Retrying request, attempts left:', retries);
            return retryRequest(data, retries - 1);
        }
        throw error;
    }
};

export const RefreshToken = async () => {
    try {
        console.log('RefreshToken called');
        const user = await getUser();
        console.log('User retrieved from local storage:', user);

        const result = await refresh(config, {
            refreshToken: user.refreshToken,
        });
        console.log('Token refresh result:', result);

        const data = {
            idToken: result.idToken,
            accessToken: result.accessToken,
            idTokenGuid: result.additionalParameters.session_state,
            refreshToken: result.refreshToken + 1,
        };
        console.log('Data prepared for PostAuthApiRequest:', data);

        const apiResponse = await retryRequest(data, 2);
        return onSuccess(apiResponse);
    } catch (error) {
        return onError(error);  // Handle the error and navigate to Splash
    }
};
