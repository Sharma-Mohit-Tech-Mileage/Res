import React, { useEffect, useState } from "react";
import UserNavigations from "./src/navigations/UserNavigations";
import { Provider } from "react-redux";
import store from "./src/redux/configureStore.js";
import { TabBarVisibilityProvider } from './src/navigations/TabBarVisibilityContext'

const App = () => {
  return (
    <Provider store={store}>
    <TabBarVisibilityProvider>
      <UserNavigations />
      </TabBarVisibilityProvider>
    </Provider>
  );
};

export default App;
