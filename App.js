import React, { useEffect, useState } from "react";
import UserNavigations from "./src/navigations/HomeDrawer";
import {Linking} from 'react-native'
import { Provider } from "react-redux";
import store from "./src/redux/configureStore.js";
import LoginScreen from "./src/components/user/SettingsScreen";
import jwt_decode from "jwt-decode";
import { authorize } from "react-native-app-auth";

const config = {
  issuer: "https://login.uat.cableone.net/auth/realms/external-sso-realm",
  clientId: "sparklight-customer-mobile-app",
  redirectUrl:
    "com.sparklight.customer.app.auth0://sparklight-customer.us.auth0.com/ios/com.sparklight.customer.app/callback",
  scopes: ['openid', 'profile', 'email', 'phone', 'address'],
  iosPrefersEphemeralSession:false,
  additionalParameters: {prompt: 'login'}
};
const App = () => {
  const [data, setData] = useState(undefined);
  const [url, setUrl] = useState(null);
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    const loginAuth = async () => {
      try {
        const result = await authorize(config);
        // result includes accessToken, accessTokenExpirationDate and refreshToken
        console.log("result", result);
        var decoded = jwt_decode(result.idToken);

        console.log('User Details',decoded);
        setData(result);
      } catch (error) {
        console.log(error);
      }
    };
    loginAuth();
  }, []);

  

  useEffect(() => {
    
  }, []);


  return (
    (data && data.accessToken)?
    <UserNavigations />: null
  )
};

export default App;
