import createSagaMiddleware from "@redux-saga/core";
import { configureStore } from "@reduxjs/toolkit";
import { combinedReducers } from "./reducers/MainReducer";
import rootSaga from "./sagas/root";
const sagaMiddleware = createSagaMiddleware();


const store = configureStore({
  reducer: {combinedReducers},
  middleware: [sagaMiddleware],
});
sagaMiddleware.run(rootSaga);

export default store;