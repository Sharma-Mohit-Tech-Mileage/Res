import React, { useEffect, useState } from "react";
import { Alert } from "react-native";
import UserNavigations from "./src/navigations/UserNavigations";
import { Provider } from "react-redux";
import store from "./src/redux/configureStore.js";
import { TabBarVisibilityProvider } from './src/navigations/TabBarVisibilityContext'
// import messaging from '@react-native-firebase/messaging';
// import {
//   getFcmToken,
//   requestUserPermission,
//   notificationListener,
// } from './src/firebase/FirebaseUtils';


const App = () => {
  const [generatedToken, setGeneratedToken] = useState();

  // useEffect(() => {
  //   const fetchToken = async () => {
  //     const token = await getFcmToken();
  //     if (token) {
  //       setGeneratedToken(token);
  //     }
  //   };
    
  //   void fetchToken();
  //   void requestUserPermission();
  //   void notificationListener();
  // }, []);

  // useEffect(() => {
  //   const unsubscribe = messaging().onMessage(async remoteMessage => {
  //     Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
  //   });

  //   return unsubscribe
  // })

  return (
    
    <Provider store={store}>
    <TabBarVisibilityProvider>
      <UserNavigations />
      </TabBarVisibilityProvider>
    </Provider>
  
  );
};

export default App;
