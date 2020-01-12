import * as ActionTypes from './ActionTypes';

export const updatePlayer = (newPlayer) => (dispatch) => {
    dispatch(addPlayer(JSON.parse(newPlayer)));
};

export const updatePandora = (newPandora) => (dispatch) => {
    dispatch(addPandora(JSON.parse(newPandora)));
};

export const updateRelays = (newRelays) => (dispatch) => {
    dispatch(addRelays(JSON.parse(newRelays)));
}

export const updateSettings = (newSettings) => (dispatch) => {
    dispatch(loadSettings(newSettings));
}

export const addPlayer = (player) => ({
    type: ActionTypes.ADD_PLAYER,
    payload: player
});

export const addPandora = (pandora) => ({
    type: ActionTypes.ADD_PANDORA,
    payload: pandora
});

export const addRelays = (relays) => ({
    type: ActionTypes.ADD_RELAYS,
    payload: relays
});

export const loadSettings = (settings) => ({
    type: ActionTypes.UPDATE_SETTINGS,
    settings
});
