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
Text.defaultProps = { ...Text.defaultProps, maxFontSizeMultiplier: 1.25, };

const App = () => {
  const [appState, setAppState] = useState(AppState.currentState);
  const [majorUpdateVisible, setMajorUpdateVisible] = useState(false);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", nextAppState => {
      if (appState.match(/inactive|background/) && nextAppState === "active") {
        console.log("App has come to the foreground!");
        checkForUpdates();
      }
      setAppState(nextAppState);
    });
    checkForUpdates();

    return () => {
      subscription.remove();
    };
  }, [appState]);

  async function checkForUpdates() {
    console.log("Checking for updates...");

    const currentVersion = DeviceInfo.getVersion();
    const latestVersion = await VersionCheck.getLatestVersion();

    const currentParts = currentVersion.split('.');
    const latestParts = latestVersion.split('.');

    const currentMajor = parseInt(currentParts[0], 10);
    const latestMajor = parseInt(latestParts[0], 10);
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
