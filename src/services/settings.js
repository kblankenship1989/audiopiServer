
import {readFileSync, writeFile} from 'fs';

const filePath = __dirname + "/public/settings.json";
const encoding = 'utf8';

const settingsRaw = readFileSync(filePath, encoding);
export const settings = JSON.parse(settingsRaw);

export const updateSetting = (key, value, callback) => {
    settings[key] = value;
    writeFile(filePath, JSON.stringify(settings), encoding, callback);
}