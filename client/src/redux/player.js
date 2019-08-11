import * as ActionTypes from './ActionTypes';

const emptyState = {
    isLoading: true,
    isPaused: false,
    playerRunning: false
};

export const Player = (state = emptyState, action) => {

    const actionMap = {
        [ActionTypes.ADD_PLAYER]: { ...state, ...action.payload, isLoading: false }
    };

    return Object.keys(actionMap).includes(action.type) ? actionMap[action.type] : state;
}