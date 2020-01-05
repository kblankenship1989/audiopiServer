import * as ActionTypes from './ActionTypes';

const emptyState = {
    timeoutInMinutes: 0,
    closeTimeoutInMinutes: 0,
    defaultVolume: 0,
    songHistoryLength: 0
};

export const Settings = (state = emptyState, action) => {

    const actionMap = {
        [ActionTypes.UPDATE_SETTINGS]: {
            ...state,
            ...action.settings
        }
    };

    return Object.keys(actionMap).includes(action.type) ? actionMap[action.type] : state;
}
