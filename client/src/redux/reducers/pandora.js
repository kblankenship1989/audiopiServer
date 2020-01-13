import * as ActionTypes from '../ActionTypes';
import { getDefaultPandora, Pandora } from '../states/pandora';
import { Song } from '../states/song';

const updatePandoraState = (state, payload) => Pandora({
    ...state,
    ...payload,
    currentSong: Song({
        ...state.currentSong,
        ...(payload ? 
            payload.currentSong : 
            {})
    })
});

export const pandora = (state = getDefaultPandora(), action) => {

    const actionMap = {
        [ActionTypes.ADD_PANDORA]: updatePandoraState
    };

    return Object.keys(actionMap).includes(action.type) ? actionMap[action.type](state, action.payload) : state;
}