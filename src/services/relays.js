import {Relay} from '../classes/Relay';
import {settings, updateSetting} from './settings';

const secondFloor = new Relay(11, 9, 10);
const firstFloor = new Relay(25, 8, 7);

export const setFirstFloor = (newState, callback) => {
    firstFloor.setRelays(newState);
    updateSetting('firstFloorRelayState', newState, callback);
}

export const setSecondFloor = (newState, callback) => {
    secondFloor.setRelays(newState);
    updateSetting('secondFloorRelayState', newState, callback);
}

export const getRelayStates = () => {
    console.log('getting relay state');
    console.log(settings);
    return {
        firstFloor: settings.firstFloorRelayState,
        secondFloor: settings.secondFloorRelayState
    }
}

setFirstFloor(settings.firstFloorRelayState);
setSecondFloor(settings.secondFloorRelayState);
