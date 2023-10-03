import * as React from 'react';
import { ReactNativeKeycloakProvider } from '@react-keycloak/native';

import keycloak from './keycloak';
import UserNavigations from './src/navigations/UserNavigations.js';
import { Provider } from 'react-redux'
import store from './src/redux/configureStore.js'
import LoginScreen from './src/components/user/login';



const App = () => {
  return ( 
    <ReactNativeKeycloakProvider
    authClient={keycloak}
    isLoadingCheck={(keycloak) => !keycloak.authenticated}
    onEvent={(event, error) => {
      console.log("onKeycloakEvent", event, error);
    }}
    onTokens={(tokens) => console.log(tokens)}
    initOptions={{
    redirectUri: 'Sparklight://Homepage',
    onLoad: 'check-sso',
    useNonce: true,
    inAppBrowserOptions: { },
    }}
  >
   <LoginScreen/>
    
  </ReactNativeKeycloakProvider>
  
  )
  
};

export default App;
