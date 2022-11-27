import { compose, createStore, applyMiddleware } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { rootReducer } from "./root-reducer";
import logger from "redux-logger";
import thunk from "redux-thunk";
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

const middleWares = [
  process.env.NODE_ENV === "development" && logger,
  thunk,
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

export const persistor = persistStore(store);
