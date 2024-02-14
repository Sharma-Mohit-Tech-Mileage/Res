import { combineReducers } from 'redux';
import {LOGOUT} from '../constants/index';
import userReducer from './UserReducer';
import dashboardReducer from './DashboardReducer';
import profileReducer from './ProfileReducer';

// Use combineReducers to create a combined reducer
const appReducer = combineReducers({
  user: userReducer,
  home: dashboardReducer,
  profile: profileReducer,
});

// Wrap the combined reducer with a higher-order reducer to handle the LOGOUT action
const combinedReducers = (state, action) => {
  if (action.type === LOGOUT) {
    // Reset the state to undefined, causing each reducer to return their initial state
    state = undefined;
  }
  // Pass the state and action to the combined reducers
  return appReducer(state, action);
};

// Export the wrapper as combinedReducers
export { combinedReducers };
