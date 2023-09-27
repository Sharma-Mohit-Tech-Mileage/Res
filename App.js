import * as React from 'react';
import UserNavigations from './src/navigations/UserNavigations.js';
import { Provider } from 'react-redux'
import store from './src/redux/configureStore.js'
const App = () => {
  return (
  <Provider store={store}>
    <UserNavigations/>
  </Provider>
  )
  
};

export default App;
