import * as ActionTypes from './ActionTypes';
import { getDefaultRelays } from './states/relays';

export const Relays = (state = getDefaultRelays(), action) => {

    const actionMap = {
        [ActionTypes.ADD_RELAYS]: Relays({ 
            ...state,
            ...action.payload
        })
    };

    return Object.keys(actionMap).includes(action.type) ? actionMap[action.type] : state;
}
