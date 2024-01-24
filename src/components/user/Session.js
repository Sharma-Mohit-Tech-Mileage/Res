import React, { useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../../redux/utils/LocalStorage";
import { refresh } from "react-native-app-auth";
import { storeUser } from "../../redux/utils/LocalStorage";
import { PostAuthApiRequest } from "../../network/APIClient";
import { saveUserInfo } from "../../redux/actions/UserAction";
import { Env } from "../../network/apis/account/Constants";

// import { getUser } from "../redux/utils/LocalStorage";

//const [refresh, setRefresh] = useState();

const config = {
    issuer: Env.SSO_LOGIN,
    clientId: "sparklight-customer-mobile-app",
    redirectUrl:
        "com.sparklight.customer.app.auth0://sparklight-customer.us.auth0.com/ios/com.sparklight.customer.app/callback",
    scopes: ["openid", "profile", "email", "phone", "address"],
    iosPrefersEphemeralSession: false,
    additionalParameters: { prompt: "login" },
};

let loop;
let loopContinue;

let timer = 0;

const renewToken = async () => {
    loop = setTimeout(async () => {
        await RefreshToken();
    }, 900000);
}

const onSuccess = async (res) => {
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
            storeUser(user);
        }

        saveUserInfo(user);

        console.log('setTimeout: ', timer);
        timer = timer + 900000;
        if (loopContinue) {
            renewToken();
        }        
    }
};

const onError = (error) => {
    console.log("PostAuthApiRequest error", error);
};

export const SetRenewTokenTimer = () => {
    loopContinue = true;
    renewToken();
}

export const SetClearTimer = () => {
    loopContinue = false;
    clearTimeout(loop);
}

export const RefreshToken = async () => {
    try {
        const user = await getUser();
        const result = await refresh(config, {
            refreshToken: user.refreshToken,
        });
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
}
    
