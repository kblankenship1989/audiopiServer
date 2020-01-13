import { createStore, combineReducers, applyMiddleware } from 'redux';
import { pandora } from './reducers/pandora';
import { player } from './reducers/player';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { relays } from './reducers/relays';
import { settings } from './reducers/settings';
import { State } from './states/state';

export const ConfigureStore = () => {
    const combinedReducers = combineReducers({
      pandora: pandora,
      player: player,
      relays: relays,
      settings: settings
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