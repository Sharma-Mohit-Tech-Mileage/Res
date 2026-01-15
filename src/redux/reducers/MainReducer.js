import { combineReducers } from 'redux';
import {LOGOUT} from '../constants/index';
import userReducer from './UserReducer';
import dashboardReducer from './DashboardReducer';
import profileReducer from './ProfileReducer';
import NotificationReducer from './NotificationReducer';
import billingStatementReducer from './billingStatementReducer'; 
import paymentHistoryReducer from './paymentHistoryReducer';
import billingBreakdown from './billingBreakdownReducer';
import servicesReducer from './servicesReducer'; 
const appReducer = combineReducers({
  user: userReducer,
  home: dashboardReducer,
  profile: profileReducer,
  notification: NotificationReducer,
  billingStatements: billingStatementReducer,
  paymentHistory: paymentHistoryReducer,
  billingBreakdown: billingBreakdown,
  services: servicesReducer,
});

const combinedReducers = (state, action) => {
  if (action.type === LOGOUT) {
    state = undefined;
  }
  return appReducer(state, action);
};

export { combinedReducers };
