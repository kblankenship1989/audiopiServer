
import {readFileSync, writeFile} from 'fs';
import {join} from 'path';
import { initializeAlarms } from './alarms';
import { setFirstFloor, setSecondFloor } from './relays';

/*global __dirname*/
const filePath = join(__dirname, '../../public/settings.json');

const settingsRaw = readFileSync(filePath) || {};
const settings = JSON.parse(settingsRaw);

initializeAlarms();
setFirstFloor(settings.firstFloorRelayState);
setSecondFloor(settings.secondFloorRelayState);

export const getSettings = () => settings;

export const updateSetting = (key, value, callback) => {
    var noop = function(){};
    const callbackToExecute = callback || noop;
    settings[key] = value;
    writeFile(filePath, JSON.stringify(settings, null, 4), callbackToExecute);
};
