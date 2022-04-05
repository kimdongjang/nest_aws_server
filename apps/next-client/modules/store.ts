import { createStore, applyMiddleware, compose, Middleware, StoreEnhancer } from "redux";
import { createWrapper, MakeStore } from "next-redux-wrapper";
import { createLogger } from "redux-logger";
import { composeWithDevTools } from "redux-devtools-extension";
import createSagaMiddleware from "redux-saga";
import rootSaga from "./sagas";
import productsSlice from "./reducers/productReducer"


// 미들웨어 끼리 묶음
const bindMiddleware = (middlewares: Middleware[]): StoreEnhancer => {
  const logger = createLogger();

  if (process.env.NODE_ENV !== "production") {
    const { composeWithDevTools } = require("redux-devtools-extension");
    return composeWithDevTools(
      applyMiddleware(...middlewares),
      applyMiddleware(logger)
    );
  }
  return compose(applyMiddleware(...middlewares), applyMiddleware(logger));
};

// Next Redux Wrapper 리듀서와 rootSaga를 묶음
export const makeStore = () => {
  const sagaMiddleware = createSagaMiddleware();

  const store = createStore(productsSlice.reducer, bindMiddleware([sagaMiddleware]));

  sagaMiddleware.run(rootSaga);

  return store;
};

export const wrapper = createWrapper(makeStore, { debug: true });

