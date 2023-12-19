import React, { useEffect, useState } from "react";
import { Alert } from "react-native";
import UserNavigations from "./src/navigations/UserNavigations";
import { Provider } from "react-redux";
import store from "./src/redux/configureStore.js";
import { TabBarVisibilityProvider } from './src/navigations/TabBarVisibilityContext';
import { NativeBaseProvider } from 'native-base'; // Import NativeBaseProvider
import { CopilotProvider } from "react-native-copilot";
// import messaging from '@react-native-firebase/messaging';
// import {
//   getFcmToken,
//   requestUserPermission,
//   notificationListener,
// } from './src/firebase/FirebaseUtils';


const App = () => {
  const [generatedToken, setGeneratedToken] = useState();

  return (
    <Provider store={store}>
      <NativeBaseProvider>
        <TabBarVisibilityProvider>
          <CopilotProvider stopOnOutsideClick androidStatusBarVisible>
            <UserNavigations />
          </CopilotProvider>
        </TabBarVisibilityProvider>
      </NativeBaseProvider>
    </Provider>
  );
};

export default App;
