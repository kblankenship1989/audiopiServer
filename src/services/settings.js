
import {readFileSync, writeFile} from 'fs';
import {join} from 'path';

const filePath = join(__dirname, '../../public/settings.json');

let settings;

const initializeSettings = () => {
    const settingsRaw = readFileSync(filePath) || {};
    settings = JSON.parse(settingsRaw);
}

export const getSettings = () => {
    if (!settings) {
        initializeSettings();
    }

    return settings;
};

export const updateSetting = (key, value, callback) => {
    var noop = function(){};
    const callbackToExecute = callback || noop;
    settings[key] = value;
    writeFile(filePath, JSON.stringify(settings, null, 4), callbackToExecute);
};
