import * as ActionTypes from './ActionTypes';

const emptyState = {
    isLoading: true,
    errMess: null,
    isPaused: false,
    playerRunning: false
};

export const Player = (state = emptyState, action) => {

    const actionMap = {
        [ActionTypes.PLAYER_LOADING]: { ...state, ...emptyState },
        [ActionTypes.PLAYER_FAILED]: { ...state, ...emptyState, isLoading: false, errMess: action.payload },
        [ActionTypes.ADD_PLAYER]: { ...state, ...action.payload, errMess: null, isLoading: false },
        [ActionTypes.UPDATE_ISPAUSED]: { ...state, isPaused: action.payload, errMess: null },
        [ActionTypes.UPDATE_PLAYERRUNNING]: { ...state, playerRunning: action.payload, errMess: null }
    };

    return Object.keys(actionMap).includes(action.type) ? actionMap[action.type] : state;
}