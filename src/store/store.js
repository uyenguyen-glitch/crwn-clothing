import { compose, createStore, applyMiddleware } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { rootReducer } from "./root-reducer";
import logger from "redux-logger";
import createSagaMiddleWare from "redux-saga";
import { rootSaga } from "./root-saga";

// Redux-persist: to store value into local storage
// 1: creating persistConfig
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["cart"],
};

// 2: Creating persistedReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Tạo middleware
// Creating middleware Saga
const sagaMiddleware = createSagaMiddleWare();

const middleWares = [
  process.env.NODE_ENV === "development" && logger,
  sagaMiddleware,
].filter(Boolean);

const composeEnhancer =
  (process.env.NODE_ENV !== "production" &&
    window &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;

// apply middleware

const composeEnhancers = composeEnhancer(applyMiddleware(...middleWares));

// Create store
export const store = createStore(persistedReducer, undefined, composeEnhancers);

// Run saga after store instantiated
sagaMiddleware.run(rootSaga);

export const persistor = persistStore(store);
