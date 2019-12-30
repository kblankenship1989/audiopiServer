
import {readFileSync, writeFile} from 'fs';
import {join} from 'path';

const filePath = join(__dirname, '../../public/settings.json');

const settingsRaw = readFileSync(filePath);
export const settings = JSON.parse(settingsRaw);

export const updateSetting = (key, value, callback) => {
    var noop = function(){};
    const callbackToExecute = callback || noop;
    settings[key] = value;
    console.log(JSON.stringify(settings));
    console.log(filePath);
    writeFile(filePath, JSON.stringify(settings), callbackToExecute);
}