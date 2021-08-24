import * as ActionTypes from '../ActionTypes';

const updateRelays = (state, payload) => {
    return { 
        ...state,
        ...payload
    }
};

export const getDefaultRelays = () => ({
    firstFloorRelayState: '0000',
    secondFloorRelayState: '0000',
    alarmOverride: false
});

export const relays = (state = getDefaultRelays(), action) => {

    const actionMap = {
        [ActionTypes.ADD_RELAYS]: updateRelays
    };

    return Object.keys(actionMap).includes(action.type) ? actionMap[action.type](state, action.payload) : state;
}
