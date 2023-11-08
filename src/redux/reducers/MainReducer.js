import { combineReducers } from 'redux';
import UserReducer from '../reducers/UserReducer';

export const combinedReducers = combineReducers({
  user: UserReducer,
});