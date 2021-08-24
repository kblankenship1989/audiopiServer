import * as ActionTypes from './ActionTypes';

export const updateRelays = (newRelays) => (dispatch) => {
    dispatch(addRelays(JSON.parse(newRelays)));
}

export const updateSettings = (newSettings) => (dispatch) => {
    dispatch(loadSettings(newSettings));
}

export const addRelays = (relays) => ({
    type: ActionTypes.ADD_RELAYS,
    payload: relays
});

export const loadSettings = (settings) => ({
    type: ActionTypes.UPDATE_SETTINGS,
    settings
});
