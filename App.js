import React, { useEffect, useState } from "react";
import { Text } from "react-native";
import UserNavigations from "./src/navigations/UserNavigations";
import { Provider } from "react-redux";
import store from "./src/redux/configureStore.js";
import { TabBarVisibilityProvider } from './src/navigations/TabBarVisibilityContext';
import { NativeBaseProvider } from 'native-base';
import { AnalyticsContext } from './src/components/utility/AnalyticsContext';
import analytics from '@react-native-firebase/analytics';
// Set the maxFontSizeMultiplier for Text globally
Text.defaultProps = {
  ...Text.defaultProps,
  maxFontSizeMultiplier: 1.25,
};

const App = () => {
  return (
    <Provider store={store}>
      <NativeBaseProvider>
        <TabBarVisibilityProvider>
          {/* Wrap UserNavigations with AnalyticsContext.Provider */}
          <AnalyticsContext.Provider value={{ logEvent: (eventName, eventData) => analytics().logEvent(eventName, eventData) }}>
            <UserNavigations />
          </AnalyticsContext.Provider>
        </TabBarVisibilityProvider>
      </NativeBaseProvider>
    </Provider>
  );
};

export default App;
