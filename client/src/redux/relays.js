import * as ActionTypes from './ActionTypes';
import { getDefaultRelays } from './states/relays';

const updateRelays = (state, action) => {
    return Relays({ 
        ...state,
        ...action.payload
    })
};

export const Relays = (state = getDefaultRelays(), action) => {

    const actionMap = {
        [ActionTypes.ADD_RELAYS]: updateRelays
    };

    return Object.keys(actionMap).includes(action.type) ? actionMap[action.type](state, action) : state;
}
