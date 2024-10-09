import React, { useEffect, useState } from "react";
import { AppState, Text } from 'react-native';
import UserNavigations from "./src/navigations/UserNavigations";
import { Provider } from "react-redux";
import store from "./src/redux/configureStore.js";
import { TabBarVisibilityProvider } from './src/navigations/TabBarVisibilityContext';
import { NativeBaseProvider } from 'native-base';
import { AnalyticsContext } from './src/components/utility/AnalyticsContext';
import DeviceInfo from 'react-native-device-info';
import VersionCheck from 'react-native-version-check';
import AppUpdateAlert from "./src/components/utility/AppUpdateAlert";
import { initializeApp } from "./src/firebase/FirebaseUtils";
import analytics from '@react-native-firebase/analytics';
import { ISUAT } from "./src/network/apis/account/Constants";

Text.defaultProps = { ...Text.defaultProps, maxFontSizeMultiplier: 1.25, };

const App = () => {

  const [appState, setAppState] = useState(AppState.currentState);
  const [majorUpdateVisible, setMajorUpdateVisible] = useState(false);

  useEffect(() => {
    const enableAnalytics = async () => {
      await analytics().setAnalyticsCollectionEnabled(!__DEV__ && !ISUAT);
    };
    enableAnalytics();
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", nextAppState => {
      if (appState.match(/inactive|background/) && nextAppState === "active") {
        checkForUpdates();
      }
      setAppState(nextAppState);
    });
    checkForUpdates();

    return () => {
      subscription.remove();
    };
  }, [appState]);

  useEffect(() => {
    async function init() {
      await initializeApp();
      }
    init();
  }, []);

  async function checkForUpdates() {
    console.log("Checking for updates...");

    const currentVersion = DeviceInfo.getVersion();
    const latestVersion = await VersionCheck.getLatestVersion();

    const currentParts = currentVersion.split('.');
    const latestParts = latestVersion.split('.');

    const currentMajor = parseInt(currentParts[0], 10);
    const latestMajor = parseInt(latestParts[0], 10);
    console.log("Checking for updates...", currentMajor, latestMajor);
    if (latestMajor > currentMajor) {
      console.log("Major update available.");
      setMajorUpdateVisible(true);
    }
  }

  return (
    <Provider store={store}>
      <NativeBaseProvider>
        <TabBarVisibilityProvider>
          <AnalyticsContext.Provider value={{ logEvent: (eventName, eventData) => analytics().logEvent(eventName, eventData) }}>
            <UserNavigations />
            <AppUpdateAlert
              visible={majorUpdateVisible}
              onClose={() => setMajorUpdateVisible(false)}
            />
          </AnalyticsContext.Provider>
        </TabBarVisibilityProvider>
      </NativeBaseProvider>
    </Provider>
  );
};

export default App;
