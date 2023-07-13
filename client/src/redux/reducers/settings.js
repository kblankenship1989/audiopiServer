import * as ActionTypes from '../ActionTypes';
import { getDefaultRelays } from './relays';

const updateSettings = (state, payload) => ({
    ...state,
    ...payload
});

export const getDefaultSettings = () => ({
    relays: getDefaultRelays(),
    timeoutInMinutes: 120,
    closeTimeoutInMinutes: 15,
    defaultVolume: 83,
    songHistoryLength: 5,
    alarms: []
});

export const settings = (state = getDefaultSettings(), action) => {

    const actionMap = {
        [ActionTypes.UPDATE_SETTINGS]: updateSettings
    };

    return Object.keys(actionMap).includes(action.type) ? actionMap[action.type](state, action.settings) : state;
}
