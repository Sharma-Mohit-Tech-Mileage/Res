import createSagaMiddleware from "@redux-saga/core";
import { configureStore } from "@reduxjs/toolkit";
import { combinedReducers } from "./reducers/MainReducer";
const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: {combinedReducers},
  middleware: [sagaMiddleware],
});

export default store;