import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Pandora } from './pandora';
import { Player } from './player';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { Relays } from './relays';
import { Settings } from './settings';

export const ConfigureStore = () => {
    const store = createStore(
        combineReducers({
          pandora: Pandora,
          player: Player,
          relays: Relays,
          settings: Settings
        }),
        applyMiddleware(thunk, logger)
    );

    return store;
}