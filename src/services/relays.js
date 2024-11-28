import {Relay} from '../classes/Relay';
import {getSettings, updateSetting} from './settings';

const secondFloor = new Relay(523, 521, 522);
const firstFloor = new Relay(537, 520, 519);

export const  updateRelays = (newState, callback) => {
    firstFloor.setRelays(newState.firstFloorRelayState);
    secondFloor.setRelays(newState.secondFloorRelayState);
    if (!newState.alarmOverride) {
        updateSetting('relays', newState, callback);
    } else {
        const relaySettings = getSettings().relays;
        relaySettings.alarmOverride = true;
        updateSetting('relays', relaySettings, callback);
    }
}

export const getRelayState = () => {
    return getSettings().relays;
}
