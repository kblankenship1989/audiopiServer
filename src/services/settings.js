
import {readFileSync, writeFile} from 'fs';
import {join} from 'path';

/*global __dirname*/
const filePath = join(__dirname, '../../public/settings.json');

export const getSettings = () => {
    const settingsRaw = readFileSync(filePath) || {};
    return JSON.parse(settingsRaw);
}

export const updateSetting = (key, value, callback) => {
    const settings = getSettings();
    var noop = function(){};
    const callbackToExecute = callback || noop;
    settings[key] = value;
    writeFile(filePath, JSON.stringify(settings, null, 4), callbackToExecute);
};
