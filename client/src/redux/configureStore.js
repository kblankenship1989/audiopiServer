import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { relays } from './reducers/relays';

export const ConfigureStore = () => {
    const combinedReducers = combineReducers({
      relays
    });

    const store = createStore(
        combinedReducers,
        applyMiddleware(thunk, logger)
    );

    return store;
}