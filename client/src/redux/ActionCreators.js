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
    paylaod: relays
}) 