import * as ActionTypes from './ActionTypes';

const emptyState = {
    isPaused: false,
    minutesRemaining: 0,
    playerRunning: true,
    playerTimedOut: false
};

export const Player = (state = emptyState, action) => {

    const actionMap = {
        [ActionTypes.ADD_PLAYER]: { ...state, ...action.payload }
    };

    return Object.keys(actionMap).includes(action.type) ? actionMap[action.type] : state;
}