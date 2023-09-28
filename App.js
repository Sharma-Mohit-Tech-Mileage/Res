import * as React from 'react';
import { ReactNativeKeycloakProvider } from '@react-keycloak/native';

import keycloak from './keycloak';
import UserNavigations from './src/navigations/UserNavigations.js';
import { Provider } from 'react-redux'
import store from './src/redux/configureStore.js'
import Login from './src/components/user/login'
const App = () => {
  return ( 
    <ReactNativeKeycloakProvider
    authClient={keycloak}
    initOptions={{
      redirectUri: 'Sparklight://Homepage',
      // if you need to customize "react-native-inappbrowser-reborn" View you can use the following attribute
      inAppBrowserOptions: {
        // For iOS check: https://github.com/proyecto26/react-native-inappbrowser#ios-options
        // For Android check: https://github.com/proyecto26/react-native-inappbrowser#android-options
      },
    }}
  >
   
    <Provider store={store}>
    <UserNavigations/>
  </Provider>
  </ReactNativeKeycloakProvider>
  
  )
  
};

export default App;
