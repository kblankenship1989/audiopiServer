import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { relays } from './reducers/relays';
import { settings } from './reducers/settings';

export const ConfigureStore = () => {
    const combinedReducers = combineReducers({
      relays: relays,
      settings: settings
    });

    const store = createStore(
        combinedReducers,
        applyMiddleware(thunk, logger)
    );

    return store;
}