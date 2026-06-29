import React, { useEffect, useState } from "react";
import { AppState, Text, TextInput, Appearance } from 'react-native';
import UserNavigations from "./src/navigations/UserNavigations";
import { Provider } from "react-redux";
import store from "./src/redux/configureStore.js";
import { NativeBaseProvider, extendTheme } from "native-base";
import { AnalyticsContext } from "./src/context/AnalyticsContext";
import DeviceInfo from "react-native-device-info";
import VersionCheck from "react-native-version-check";
import AppUpdateAlert from "./src/components/utility/AppUpdateAlert";
import { initializeApp } from "./src/firebase/FirebaseUtils";
import analytics from "@react-native-firebase/analytics";
import Config from "react-native-config";
import { MaintenanceProvider } from "./src/components/maintenance/MaintenanceContext";
import { GlobalErrorModal } from "./src/components/common/GlobalErrorModal";
import RemoteConfigManager from "./src/config/Remoteconfigmanager";
import { FeatureFlagsProvider } from "./src/contexts/Featureflagscontext";
Text.defaultProps = { ...Text.defaultProps, maxFontSizeMultiplier: 1.25 };
TextInput.defaultProps = { ...TextInput.defaultProps, maxFontSizeMultiplier: 1.25 };

const App = () => {
  const [appState, setAppState] = useState(AppState.currentState);
  const [majorUpdateVisible, setMajorUpdateVisible] = useState(false);

  useEffect(() => {
    const enableAnalytics = async () => {
      await analytics().setAnalyticsCollectionEnabled(!__DEV__ && Config.ENV === 'production');
    };
    enableAnalytics();
    Appearance.setColorScheme('light');
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
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
      await RemoteConfigManager.initialize();
    }
    init();
  }, []);

  async function checkForUpdates() {
    console.log("Checking for updates...");

    const currentVersion = DeviceInfo.getVersion();
    const latestVersion = await VersionCheck.getLatestVersion();

    const currentParts = currentVersion.split(".");
    const latestParts = latestVersion.split(".");

    const currentMajor = parseInt(currentParts[0], 10);
    const latestMajor = parseInt(latestParts[0], 10);
    console.log("Checking for updates...", currentMajor, latestMajor);
    if (latestMajor > currentMajor) {
      console.log("Major update available.");
      setMajorUpdateVisible(true);
    }
  }

  const customTheme = extendTheme({
    colors: {
      // Add a new color
      custom: {
        500: "#8D3B90",
      },
    },
    components: {
      Radio: {
        baseStyle: {
          _icon: {
            color: "custom.500", // Default color for the icon
            _checked: {
              color: "#8D3B90", // Color when checked
            },
          },
        },

        defaultProps: {
          colorScheme: "custom", // Default color scheme for Radio
        },
      },
    },
  });

  return (
    <Provider store={store}>
      <NativeBaseProvider theme={customTheme}>
        <AnalyticsContext.Provider
          value={{
            logEvent: (eventName, eventData) =>
              analytics().logEvent(eventName, eventData),
          }}
        >
          <FeatureFlagsProvider>
            <MaintenanceProvider>
              <UserNavigations />
              <AppUpdateAlert
                visible={majorUpdateVisible}
                onClose={() => setMajorUpdateVisible(false)}
              />
              <GlobalErrorModal />
            </MaintenanceProvider>
          </FeatureFlagsProvider>
        </AnalyticsContext.Provider>
      </NativeBaseProvider>
    </Provider>
  );
};

export default App;
