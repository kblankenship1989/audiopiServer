
import {readFileSync, writeFile} from 'fs';
import {join} from 'path';

const filePath = join(__dirname, '../../public/settings.json');
const encoding = 'utf8';

const settingsRaw = readFileSync(filePath, encoding);
export const settings = JSON.parse(settingsRaw);

export const updateSetting = (key, value, callback) => {
    var noop = function(){};
    const callbackToExecute = callback || noop;
    settings[key] = value;
    writeFile(filePath, JSON.stringify(settings), encoding, callbackToExecute);
}