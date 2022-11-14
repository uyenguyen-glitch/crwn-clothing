import { compose, createStore, applyMiddleware } from "redux";
import logger from "redux-logger";

import { rootReducer } from "./root-reducer";

// Tạo middleware

const middleWares = [logger];

// apply middleware

const composeEnhancers = compose(applyMiddleware(...middleWares));

// Create store
export const store = createStore(rootReducer, undefined, composeEnhancers);
