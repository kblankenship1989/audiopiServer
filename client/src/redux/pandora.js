import * as ActionTypes from './ActionTypes';

const emptyState = {
    isLoading: true,
    currentSong: {
        isLoading: true,
        currentSong: {}
    },
    stationList: [],
    songHistory: []
};

export const Pandora = (state = emptyState, action) => {

    const actionMap = {
        [ActionTypes.ADD_PANDORA]: { ...state, ...action.payload, currentSong: {...state.currentSong, ...(action.payload ? action.payload.currentSong : {}), isLoading: false}, isLoading: false }
    };

    return Object.keys(actionMap).includes(action.type) ? actionMap[action.type] : state;
}