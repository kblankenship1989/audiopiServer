import {Relay} from '../../classes/Relay';
import {settings, updateSetting} from './settings';

const firstFloor = new Relay();
const secondFloor = new Relay();

setFirstFloor(settings.firstFloorRelayState);
setSecondFloor(settings.secondFloorRelayState);

export const setFirstFloor = (newState, callback) => {
    firstFloor.setRelays(newState);
    updateSetting('firstFloorRelayState', newState, callback);
}

export const setSecondFloor = (newState, callback) => {
    secondFloor.setRelays(newState);
    updateSetting('secondFloorRelayState', newState, callback);
}

export const getRelayStates = () => {
    return {
        firstFloor: settings.firstFloorRelayState,
        secondFloor: settings.secondFloorRelayState
    }
}