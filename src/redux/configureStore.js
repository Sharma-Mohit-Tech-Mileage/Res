import {combineReducers,  } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import profile from './reducers/UserReducer.js';
const rootReducer = combineReducers({
  user: profile
});

const store=configureStore({reducer:rootReducer})


export default store;