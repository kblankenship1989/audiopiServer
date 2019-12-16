import {Relay} from '../../classes/Relay';

const firstFloor = new Relay();
const secondFloor = new Relay();

export const setFirstFloor = (newState) => {
    firstFloor.setRelays(newState);
}

export const setSecondFloor = (newState) => {
    secondFloor.setRelays(newState);
}