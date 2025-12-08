import { configureStore, Store } from '@reduxjs/toolkit';
import { createInjectorsEnhancer } from 'redux-injectors';
import createSagaMiddleware from 'redux-saga';
import { createReducer } from './reducers';
import authReducer from '../app/slice/authSlice';
import onboardingReducer from '../app/slice/onboardingSlice';

export function configureAppStore(): Store {
  const reduxSagaOptions = {};
  const sagaMiddleware = createSagaMiddleware(reduxSagaOptions);
  const { run: runSaga } = sagaMiddleware;

  const middlewares = [sagaMiddleware];

  const enhancers = [
    createInjectorsEnhancer({
      createReducer,
      runSaga,
    }),
  ];

  const store = configureStore({
    reducer: createReducer({ auth: authReducer, onboarding: onboardingReducer }),
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
        thunk: false,
      }).concat(middlewares),
    devTools: process.env.NODE_ENV !== 'production',
    enhancers: (getDefaultEnhancers) => getDefaultEnhancers().concat(enhancers) as any,
  });

  return store;
}

export const store = configureAppStore();
