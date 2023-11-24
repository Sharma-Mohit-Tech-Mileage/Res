import { combineReducers } from 'redux';
import userReducer from './UserReducer';
import dashboardReducer from './DashboardReducer';

export const combinedReducers = combineReducers({
  user: userReducer,
  home: dashboardReducer
});