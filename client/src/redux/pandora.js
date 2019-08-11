import * as ActionTypes from './ActionTypes';

const emptyState = {
    isLoading: true,
    currentSong: {
        isLoading: true,
        currentSong: {}
    },
    stationList: []
};

export const Pandora = (state = emptyState, action) => {

    const actionMap = {
        [ActionTypes.ADD_PANDORA]: { ...state, ...action.payload, isLoading: false }
    };

    return Object.keys(actionMap).includes(action.type) ? actionMap[action.type] : state;
}