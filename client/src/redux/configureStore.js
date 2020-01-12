import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Pandora } from './pandora';
import { Player } from './player';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { Relays } from './relays';
import { Settings } from './settings';
import { State } from './states/state';

export const ConfigureStore = () => {
    const combinedReducers = combineReducers({
      pandora: Pandora,
      player: Player,
      relays: Relays,
      settings: Settings
    });

    const tcombStore = (store, action) => {
      const newStore = combinedReducers(
        {
          ...store
        },
        action
      );

      return State(newStore);
    };

    const configuredStore = tcombStore.bind(this);

    const store = createStore(
        configuredStore,
        applyMiddleware(thunk, logger)
    );

    return store;
}