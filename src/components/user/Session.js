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

        const uniqueIdentifier = res.idTokenGuid;

        console.log(`Unique Identifier: ${uniqueIdentifier}`);
        console.log('User Info:', userInfo);
        console.log('JWT Token:', token);
        console.log('Token GUID:', res.idTokenGuid);
        console.log('Refresh Token:', res.refreshToken);

        if (token) {
            storeUser(user);
        }
        store.dispatch(saveUserInfo(user));
    }
};

const onError = (error) => {
    console.log("PostAuthApiRequest error", error);
};

export const RefreshToken = async () => {
    try {
        console.log('RefreshToken called');
        const user = await getUser();
        if (!user || !user.refreshToken) {
            throw new Error("No user or refresh token found");
        }
        const result = await refresh(config, {
            refreshToken: user.refreshToken,
        });
        console.log('RefreshToken result:', result);
        const data = {
            idToken: result.idToken,
            accessToken: result.accessToken,
            idTokenGuid: result.additionalParameters.session_state,
            refreshToken: result.refreshToken
        };
        PostAuthApiRequest("/mobile/api/gettoken", data, onSuccess, onError);
    } catch (error) {
        console.error("Error fetching data", error);
    }
};
