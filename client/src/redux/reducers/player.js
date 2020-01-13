import * as ActionTypes from '../ActionTypes';
import { getDefaultPlayer, Player } from '../states/player';

const updatePlayer = (state, payload) => Player({
    ...state,
    ...payload
});

export const player = (state = getDefaultPlayer(), action) => {

    const actionMap = {
        [ActionTypes.ADD_PLAYER]: updatePlayer
    };

    return Object.keys(actionMap).includes(action.type) ? actionMap[action.type](state, action.payload) : state;
}