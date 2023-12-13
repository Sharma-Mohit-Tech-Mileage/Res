import { combineReducers } from 'redux';
import userReducer from './UserReducer';
import dashboardReducer from './DashboardReducer';
import ProfileReducer from './ProfileReducer'

export const combinedReducers = combineReducers({
  user: userReducer,
  home: dashboardReducer,
  profile: ProfileReducer
});