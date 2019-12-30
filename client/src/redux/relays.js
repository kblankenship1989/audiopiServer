import * as ActionTypes from './ActionTypes';

const emptyState = {
    firstFloor: '8001',
    secondFloor: '0000'
};

export const Relays = (state = emptyState, action) => {

    const actionMap = {
        [ActionTypes.ADD_RELAYS]: { 
            ...state,
            ...action.payload
        }
    };

    return Object.keys(actionMap).includes(action.type) ? actionMap[action.type] : state;
}