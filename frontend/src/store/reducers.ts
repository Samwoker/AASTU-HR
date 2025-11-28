import { combineReducers, Reducer } from '@reduxjs/toolkit';

/**
 * Merges the main reducer with the router state and dynamically injected reducers
 */
export function createReducer(injectedReducers: Record<string, Reducer> = {}): Reducer {
  if (Object.keys(injectedReducers).length === 0) {
    return (state: any) => state;
  } else {
    return combineReducers({
      ...injectedReducers,
    });
  }
}
