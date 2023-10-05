import React, { useEffect, useState } from "react";
import UserNavigations from "./src/navigations/HomeDrawer";
import { Provider } from "react-redux";
import store from "./src/redux/configureStore.js";
import LoginScreen from "./src/components/user/SettingsScreen";
import { authorize } from "react-native-app-auth";

const config = {
  issuer: "https://login.uat.cableone.net/auth/realms/external-sso-realm",
  clientId: "sparklight-customer-mobile-app",
  redirectUrl:
    "com.sparklight.customer.app.auth0://sparklight-customer.us.auth0.com/ios/com.sparklight.customer.app/callback",
  scopes: ["openid", "profile", 'email'],
  iosPrefersEphemeralSession:false,
  additionalParameters: {prompt: 'login'}
};
const App = () => {
  const [data, setData] = useState(undefined);
  useEffect(() => {
    const loginAuth = async () => {
      try {
        const result = await authorize(config);
        // result includes accessToken, accessTokenExpirationDate and refreshToken
        console.log("result", result);
        setData(result);
      } catch (error) {
        console.log(error);
      }
    };
    loginAuth();
  }, []);

  return (
    (data && data.accessToken)?
    <UserNavigations />: null
  )
};

export default App;
