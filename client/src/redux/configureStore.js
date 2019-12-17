import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Pandora } from './pandora';
import { Player } from './player';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { Relays } from './relays';

export const ConfigureStore = () => {
    const store = createStore(
        combineReducers({
          pandora: Pandora,
          player: Player,
          relays: Relays
        }),
        applyMiddleware(thunk, logger)
    );

    return store;
}