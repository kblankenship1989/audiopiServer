import * as ActionTypes from './ActionTypes';

export const updatePlayer = (newPlayer) => (dispatch) => {
    dispatch(addPlayer(newPlayer));
};

export const updatePandora = (newPandora) => (dispatch) => {
    dispatch(addPandora(newPandora));
};

export const addPlayer = (player) => ({
    type: ActionTypes.ADD_PLAYER,
    payload: player
});

export const addPandora = (pandora) => ({
    type: ActionTypes.ADD_PANDORA,
    payload: pandora
});
