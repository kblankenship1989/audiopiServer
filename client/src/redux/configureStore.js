import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Pandora } from './pandora';
import { Player } from './player';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

export const ConfigureStore = () => {
    const store = createStore(
        combineReducers({
          pandora: Pandora,
          player: Player
        }),
        applyMiddleware(thunk, logger)
    );

    return store;
}