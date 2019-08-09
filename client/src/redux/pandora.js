import * as ActionTypes from './ActionTypes';

const emptyState = {
    isLoading: true,
    errMess: null,
    currentSong: {
        isLoading: true,
        currentSong: {}
    },
    stationList: []
};

export const Pandora = (state = emptyState, action) => {

    const actionMap = {
        [ActionTypes.PANDORA_LOADING]: { ...state, ...emptyState },
        [ActionTypes.PANDORA_FAILED]: { ...state, ...emptyState, isLoading: false, errMess: action.payload },
        [ActionTypes.ADD_PANDORA]: { ...state, ...action.payload, errMess: null, isLoading: false },
        [ActionTypes.CURRENT_SONG_LOADING]: { ...state, currentSong: { ...emptyState.currentSong }, errMess: null },
        [ActionTypes.UPDATE_CURRENT_SONG]: { ...state, currentSong: { ...action.payload, isLoading: false }, errMess: null },
        [ActionTypes.UPDATE_SONG_RATING]: { ...state, currentSong: { ...state.currentSong, isLoading: false, rating: action.payload }, errMess: null },
        [ActionTypes.UPDATE_STATIONS]: {...state, stations: action.payload, errMess: null, isLoading: false}
    };

    return Object.keys(actionMap).includes(action.type) ? actionMap[action.type] : state;
}