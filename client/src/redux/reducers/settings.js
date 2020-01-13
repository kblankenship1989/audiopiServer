import * as ActionTypes from '../ActionTypes';
import { getDefaultSettings, Settings } from '../states/settings';

const updateSettings = (state, payload) => Settings({
    ...state,
    ...payload
});

export const settings = (state = getDefaultSettings(), action) => {

    const actionMap = {
        [ActionTypes.UPDATE_SETTINGS]: updateSettings
    };

    return Object.keys(actionMap).includes(action.type) ? actionMap[action.type](state, action.settings) : state;
}
