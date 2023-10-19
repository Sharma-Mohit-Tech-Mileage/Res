import React, { useEffect, useState } from "react";
import UserNavigations from "./src/navigations/UserNavigations";
import { Provider } from "react-redux";
import store from "./src/redux/configureStore.js";
import SplashScreen from "./src/components/user/SplashScreen";


const App = () => {
  return (
    <Provider store={store}>
      <UserNavigations />
    </Provider>
  );
};

export default App;
