import { ajax } from 'rxjs/ajax';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { combineEpics, createEpicMiddleware } from 'redux-observable';

import appReducer from './app/reducer';
import configReducer from './config/reducer';
import beersReducer from './beers/reducer';
import fetchBeersEpic from './beers/epic';
import { persistEpic, hydrateEpic } from './config/epic';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function configureStore(dependencies = {}) {
  const rootEpic = combineEpics(fetchBeersEpic, persistEpic, hydrateEpic);

  const epicMiddleware = createEpicMiddleware({
    dependencies: {
      getJSON: ajax.getJSON,
      document: document,
      ...dependencies,
    },
  });

  const rootReducer = combineReducers({
    app: appReducer,
    beers: beersReducer,
    config: configReducer,
  });

  const store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(epicMiddleware)),
  );

  epicMiddleware.run(rootEpic);

  return store;
}
