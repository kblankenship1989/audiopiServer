import * as ActionTypes from '../ActionTypes';
import { getDefaultRelays, Relays } from '../states/relays';

const updateRelays = (state, payload) => {
    return Relays({ 
        ...state,
        ...payload
    })
};

export const relays = (state = getDefaultRelays(), action) => {

    const actionMap = {
        [ActionTypes.ADD_RELAYS]: updateRelays
    };

    return Object.keys(actionMap).includes(action.type) ? actionMap[action.type](state, action.payload) : state;
}
