import { getUser } from "../../redux/utils/LocalStorage";
import { refresh } from "react-native-app-auth";
import { storeUser } from "../../redux/utils/LocalStorage";
import store from '../../redux/configureStore';
import { PostAuthApiRequest } from "../../network/APIClient";
import { saveUserInfo } from "../../redux/actions/UserAction";
import { Env } from "../../network/apis/account/Constants";

const config = {
    issuer: Env.SSO_LOGIN,
    clientId: "sparklight-customer-mobile-app",
    redirectUrl: "com.sparklight.customer.app.auth0://sparklight-customer.us.auth0.com/ios/com.sparklight.customer.app/callback",
    scopes: ["openid", "profile", "email", "phone", "address"],
    iosPrefersEphemeralSession: true,
};

const onSuccess = async (res) => {
    console.log('onSuccess:', res);
    if (res) {
        let token = res.jwtToken;
        let userInfo = res.userInfo;
        let user = {
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
        console.log('User info saved in redux store:', user);
        return token; // Return the token here
    }
    throw new Error("No token received");
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
            refreshToken: result.refreshToken
        };
        console.log('Data prepared for PostAuthApiRequest:', data);

        return new Promise((resolve, reject) => {
            PostAuthApiRequest("/mobile/api/gettoken", data, resolve, reject);
        }).then(onSuccess);
    } catch (error) {
        console.error("Error fetching data", error);
        throw error;
    }
};
