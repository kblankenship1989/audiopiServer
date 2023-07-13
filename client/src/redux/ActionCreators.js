import * as ActionTypes from './ActionTypes';

export const updateRelays = (newRelays) => (dispatch) => {
    dispatch(addRelays(JSON.parse(newRelays)));
}

const addRelays = (relays) => ({
    type: ActionTypes.ADD_RELAYS,
    payload: relays
});
