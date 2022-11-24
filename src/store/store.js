import { compose, createStore, applyMiddleware } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { rootReducer } from "./root-reducer";
const loggerMiddleware = (store) => (next) => (action) => {
  if (!action.type) {
    return next(action);
  }

  console.log("type: ", action.type);
  console.log("payload: ", action.payload);
  console.log("currentState: ", store.getState());

  next(action);

  console.log("next state: ", store.getState());
};

// Redux-persist: to store value into local storage
// 1: creating persistConfig
const persistConfig = {
  key: "root",
  storage,
  blacklist: ["user"],
};

// 2: Creating persistedReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Tạo middleware

const middleWares = [loggerMiddleware];

// apply middleware

const composeEnhancers = compose(applyMiddleware(...middleWares));

// Create store
export const store = createStore(persistedReducer, undefined, composeEnhancers);

export const persistor = persistStore(store);
